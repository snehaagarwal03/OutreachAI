import { redirect } from "next/navigation"
import { createOffering, scrapeOfferingUrl } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewOfferingPage() {
  async function handleSubmit(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const manualContent = formData.get("manualContent") as string

    let rawContent = manualContent
    let aiSummary = ""

    if (url) {
      const scrapeResult = await scrapeOfferingUrl(url)
      if (scrapeResult.success) {
        rawContent = scrapeResult.rawContent || rawContent
        aiSummary = scrapeResult.aiSummary || ""
      }
    }

    await createOffering({
      name,
      description,
      url,
      rawContent,
      aiSummary,
      manualContent,
    })

    redirect("/offerings")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create Offering
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Offering Details</CardTitle>
          <CardDescription>
            Add your product or service information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                name="name"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Product or service name"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Brief description"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Website URL (optional)
              </label>
              <input
                name="url"
                type="url"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We will scrape and summarize this URL
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Manual Content (optional)
              </label>
              <textarea
                name="manualContent"
                rows={6}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Paste or type your offering content here..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Create Offering</Button>
              <a href="/offerings">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
