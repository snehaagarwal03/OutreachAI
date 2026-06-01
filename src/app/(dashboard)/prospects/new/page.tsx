"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProspect, scrapeProspectSource } from "@/features/prospects/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewProspectPage() {
  const router = useRouter()
  const [sources, setSources] = useState<
    Array<{ type: string; url: string; id: number }>
  >([{ type: "website", url: "", id: 0 }])
  const [scraping, setScraping] = useState(false)
  const [rawContent, setRawContent] = useState("")
  const [aiSummary, setAiSummary] = useState("")

  const addSource = () => {
    setSources([
      ...sources,
      { type: "website", url: "", id: sources.length },
    ])
  }

  const updateSource = (
    id: number,
    field: "type" | "url",
    value: string
  ) => {
    setSources(
      sources.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const removeSource = (id: number) => {
    setSources(sources.filter((s) => s.id !== id))
  }

  async function handleScrape() {
    setScraping(true)
    let combinedRaw = ""
    let combinedSummary = ""

    for (const source of sources) {
      if (!source.url) continue
      const result = await scrapeProspectSource(source.type, source.url)
      if (result.success) {
        combinedRaw += `\n\n[${source.type.toUpperCase()}: ${source.url}]\n${result.rawContent}`
        if (result.aiSummary) {
          combinedSummary += `\n\n[${source.type.toUpperCase()}]\n${result.aiSummary}`
        }
      }
    }

    setRawContent(combinedRaw.trim())
    setAiSummary(combinedSummary.trim())
    setScraping(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const prospectSources = sources
      .filter((s) => s.url)
      .map((s) => ({
        type: s.type as
          | "github"
          | "website"
          | "company_website"
          | "screenshot"
          | "linkedin_screenshot"
          | "custom",
        url: s.url,
        content: rawContent,
      }))

    await createProspect({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      notes: formData.get("notes") as string,
      rawContent,
      aiSummary,
      sources: prospectSources,
    })

    router.push("/prospects")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Create Prospect
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Prospect contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                name="name"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Title
                </label>
                <input
                  name="title"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Job title"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Company
              </label>
              <input
                name="company"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Additional notes..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>
              Add URLs to scrape for prospect context
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sources.map((source, index) => (
              <div key={source.id} className="flex gap-2 items-start">
                <select
                  value={source.type}
                  onChange={(e) =>
                    updateSource(source.id, "type", e.target.value)
                  }
                  className="px-3 py-2 border rounded-md w-40"
                >
                  <option value="website">Website</option>
                  <option value="github">GitHub</option>
                  <option value="company_website">Company Website</option>
                  <option value="custom">Custom URL</option>
                </select>
                <input
                  value={source.url}
                  onChange={(e) =>
                    updateSource(source.id, "url", e.target.value)
                  }
                  type="url"
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="https://..."
                />
                {sources.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSource(source.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={addSource}>
                Add Source
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleScrape}
                disabled={scraping}
              >
                {scraping ? "Scraping..." : "Scrape Sources"}
              </Button>
            </div>

            {rawContent && (
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scraped Content
                  </label>
                  <textarea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    AI Summary
                  </label>
                  <textarea
                    value={aiSummary}
                    onChange={(e) => setAiSummary(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit">Create Prospect</Button>
          <a href="/prospects">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </a>
        </div>
      </form>
    </div>
  )
}
