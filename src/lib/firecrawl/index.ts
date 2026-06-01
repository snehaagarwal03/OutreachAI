import FirecrawlApp from "@mendable/firecrawl-js"
import { env } from "@/lib/utils/env"

const firecrawl = new FirecrawlApp({ apiKey: env.FIRECRAWL_API_KEY })

export async function scrapeWebsite(url: string): Promise<{
  success: boolean
  content?: string
  markdown?: string
  title?: string
  description?: string
  error?: string
}> {
  try {
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"],
      onlyMainContent: true,
    })

    console.log("Firecrawl result keys:", Object.keys(result))
    console.log("Firecrawl markdown:", result.markdown?.substring(0, 200))

    return {
      success: true,
      markdown: result.markdown || "",
      content: result.markdown || "",
      title: (result as any).metadata?.title || "",
      description: (result as any).metadata?.description || "",
    }
  } catch (error) {
    console.error("Firecrawl error:", error)
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
      return { url, content: result.content, error: result.error }
    })
  )
  return results
}