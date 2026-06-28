import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACTOR_MAP: Record<string, string> = {
  google_maps: "compass~crawler-google-places",
  linkedin: "harvestapi~linkedin-company-search",
  apollo: "epctex~apollo-scraper",
};

// Safely convert any value to a plain string (handles objects, numbers, etc.)
function toSafeString(value: any): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export async function POST(request: NextRequest) {
  try {
    const { scraper, keyword, industry, location, companySize, maxResults } =
      await request.json();

    const actorId = ACTOR_MAP[scraper];
    if (!actorId) {
      return NextResponse.json(
        { error: "This scraper isn't connected yet" },
        { status: 400 }
      );
    }

    const job = await prisma.scrapeJob.create({
      data: {
        keyword: keyword,
        status: "RUNNING",
      },
    });

    let input: any = {};

    if (scraper === "google_maps") {
      input = {
        searchStringsArray: [keyword],
        locationQuery: location || "United States",
        maxCrawledPlacesPerSearch: maxResults || 50,
        scrapeContacts: true,
        language: "en",
      };
    } else if (scraper === "linkedin") {
      input = {
        scraperMode: "full",
        searchQuery: keyword,
        locations: location ? [location] : [],
        maxItems: maxResults || 50,
      };
    } else if (scraper === "apollo") {
      input = {
        searchQuery: keyword,
        location: location || "",
        maxResults: maxResults || 50,
      };
    }

    // Use specific token for apollo scraper, otherwise use default
    const apifyToken = scraper === "apollo" ? process.env.APIFY_TOKEN_APOLLO : process.env.APIFY_TOKEN;

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );

    if (!apifyRes.ok) {
      await prisma.scrapeJob.update({
        where: { id: job.id },
        data: { status: "failed" },
      });
      throw new Error("Apify request failed");
    }

    const places = await apifyRes.json();

    // Debug: log the raw shape of the first result so we can fix field mapping if needed
    console.log(
      `Raw ${scraper} response sample:`,
      JSON.stringify(places[0], null, 2)
    );

    const companiesData = places
      .map((place: any) => {
        if (scraper === "google_maps") {
          return {
            name: toSafeString(place.title) || "Unknown",
            website: toSafeString(place.website),
            email: toSafeString(place.email),
            location: toSafeString(place.address) || location || null,
            source: "Google Maps",
            scrapeJobId: job.id,
          };
        } else if (scraper === "linkedin") {
          return {
            name: toSafeString(place.name || place.companyName) || "Unknown",
            website: toSafeString(place.website),
            email: toSafeString(place.email),
            location: toSafeString(place.location) || location || null,
            industry: toSafeString(place.industry),
            companySize: toSafeString(place.companySize),
            source: "LinkedIn",
            scrapeJobId: job.id,
          };
        } else if (scraper === "apollo") {
          return {
            name: toSafeString(place.name || place.companyName || place.organization_name) || "Unknown",
            website: toSafeString(place.website || place.websiteUrl),
            email: toSafeString(place.email || place.emailAddress),
            location: toSafeString(place.location || place.city) || location || null,
            industry: toSafeString(place.industry),
            companySize: toSafeString(place.companySize || place.employees),
            source: "Apollo.io",
            scrapeJobId: job.id,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (companiesData.length > 0) {
      await prisma.company.createMany({ data: companiesData });
    }

    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: { status: "SUCCESS", resultsCount: companiesData.length },
    });

    return NextResponse.json({ count: companiesData.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Scraping failed" }, { status: 500 });
  }
}