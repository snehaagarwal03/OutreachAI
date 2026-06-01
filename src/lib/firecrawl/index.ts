import FirecrawlApp from "@mendable/firecrawl-js"
import { env } from "@/lib/utils/env"

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY })

export async function scrapeWebsite(url: string): Promise<{
  success: boolean
  content?: string
  error?: string
}> {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
    })

    const res = result as unknown as {
      success?: boolean
      error?: string
      data?: { markdown?: string }
      markdown?: string
    }

    if (!res.success) {
      return {
        success: false,
        error: res.error || "Failed to scrape website",
      }
    }

    return {
      success: true,
      content: res.markdown || res.data?.markdown || "",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function scrapeMultipleUrls(
  urls: string[]
): Promise<Array<{ url: string; content?: string; error?: string }>> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const result = await scrapeWebsite(url)
      return {
        url,
        content: result.content,
        error: result.error,
      }
    })
  )
  return results
}
