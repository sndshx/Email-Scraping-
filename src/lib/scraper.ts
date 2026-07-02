const ACTOR_MAP: Record<string, string> = {
  google_maps: "compass~crawler-google-places",
  linkedin: "harvestapi~linkedin-company-search",
  apollo: "epctex~apollo-scraper",
}

function detectScraper(keyword: string): "google_maps" | "linkedin" | "apollo" {
  const lower = keyword.toLowerCase()
  if (lower.includes("linkedin")) return "linkedin"
  if (lower.includes("apollo")) return "apollo"
  return "google_maps"
}

function cleanKeyword(keyword: string): string {
  return keyword
    .replace(/linkedin/gi, "")
    .replace(/apollo/gi, "")
    .replace(/\s+/g, " ")
    .trim()
}

// Single shared Apify token used for all scraper platforms
function getApifyToken(): string | undefined {
  return process.env.APIFY_TOKEN
}

export async function scrapeCompanies(keyword: string, location: string = "United States") {
  try {
    const scraper = detectScraper(keyword)
    const cleanedKeyword = cleanKeyword(keyword)
    const actorId = ACTOR_MAP[scraper]
    const apifyToken = getApifyToken()

    if (!apifyToken) {
      console.error(`❌ No Apify token found. Check APIFY_TOKEN in your .env file.`)
      return []
    }

    let input: any = {}

    if (scraper === "google_maps") {
      input = {
        searchStringsArray: [cleanedKeyword],
        locationQuery: location,
        maxCrawledPlacesPerSearch: 10,
        scrapeContacts: true,
        language: "en",
      }
    } else if (scraper === "linkedin") {
      input = {
        scraperMode: "full",
        searchQuery: cleanedKeyword,
        locations: location ? [location] : [],
        maxItems: 10,
      }
    } else if (scraper === "apollo") {
      input = {
        searchQuery: cleanedKeyword,
        location: location || "",
        maxResults: 10,
      }
    }

    console.log(`Scraping via ${scraper}: "${cleanedKeyword}" in ${location}`)
    console.log(`Token present: ${apifyToken ? "YES" : "NO - MISSING!"}`)

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    )

    console.log(`Apify response status: ${apifyRes.status}`)

    if (!apifyRes.ok) {
      const errorBody = await apifyRes.text()
      console.error(`❌ Apify error response: ${errorBody}`)
      throw new Error(`Apify request failed: ${apifyRes.status} - ${errorBody}`)
    }

    const places = await apifyRes.json()
    console.log(`✅ Got ${places.length} raw results from Apify`)

    const normalized = places.map((place: any) => {
      if (scraper === "google_maps") {
        return place
      } else if (scraper === "linkedin") {
        return {
          title: place.name || place.companyName || "Unknown",
          website: place.website,
          email: place.email,
          address: place.location,
        }
      } else if (scraper === "apollo") {
        return {
          title: place.name || place.companyName || place.organization_name || "Unknown",
          website: place.website || place.websiteUrl,
          email: place.email || place.emailAddress,
          address: place.location || place.city,
        }
      }
      return place
    })

    return normalized

  } catch (error: any) {
    console.error('Scraping error:', error.message)
    return []
  }
}