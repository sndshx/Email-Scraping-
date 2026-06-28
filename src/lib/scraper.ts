const ACTOR_MAP: Record<string, string> = {
  google_maps: "compass~crawler-google-places",
  linkedin: "harvestapi~linkedin-company-search",
  apollo: "epctex~apollo-scraper",
}

export async function scrapeCompanies(keyword: string, location: string = "United States") {
  try {
    // Default to google maps for WhatsApp requests
    const scraper = "google_maps"
    const actorId = ACTOR_MAP[scraper]
    const apifyToken = process.env.APIFY_TOKEN

    const input = {
      searchStringsArray: [keyword],
      locationQuery: location,
      maxCrawledPlacesPerSearch: 10,
      scrapeContacts: true,
      language: "en",
    }

    console.log(`Scraping: ${keyword} in ${location}`)

    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    )

    if (!apifyRes.ok) {
      throw new Error("Apify request failed")
    }

    const places = await apifyRes.json()
    return places

  } catch (error: any) {
    console.error('Scraping error:', error.message)
    return []
  }
}