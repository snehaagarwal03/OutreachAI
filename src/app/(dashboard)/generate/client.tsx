"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

type Offering = { id: string; name: string; description: string | null }
type Prompt = { id: string; name: string; systemPrompt: string }
type Prospect = { id: string; name: string; email: string | null; title: string | null; company: string | null }

export default function GeneratePageClient({
  offerings,
  prompts,
  prospects,
}: {
  offerings: Offering[]
  prompts: Prompt[]
  prospects: Prospect[]
}) {
  const [selectedOffering, setSelectedOffering] = useState("")
  const [selectedPrompt, setSelectedPrompt] = useState("")
  const [selectedProspect, setSelectedProspect] = useState("")
  const [generating, setGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")

  async function handleGenerate() {
    if (!selectedOffering || !selectedPrompt || !selectedProspect) return
    setGenerating(true)
    setGeneratedMessage("")

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offeringId: selectedOffering,
          promptId: selectedPrompt,
          prospectId: selectedProspect,
        }),
      })
      const data = await res.json()
      if (data.content) {
        setGeneratedMessage(data.content)
      }
    } catch {
      setGeneratedMessage("Failed to generate message. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  if (offerings.length === 0 || prompts.length === 0 || prospects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Generate Message</h1>
          <p className="text-muted-foreground mt-1">
            Create a personalized outreach message.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Set up required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need at least one offering, one prompt, and one prospect to generate a message.
            </p>
            <div className="flex gap-3 mt-4">
              {offerings.length === 0 && (
                <a href="/offerings/new">
                  <Button variant="outline" size="sm">Create Offering</Button>
                </a>
              )}
              {prompts.length === 0 && (
                <a href="/prompts/new">
                  <Button variant="outline" size="sm">Create Prompt</Button>
                </a>
              )}
              {prospects.length === 0 && (
                <a href="/prospects/new">
                  <Button variant="outline" size="sm">Add Prospect</Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Message</h1>
        <p className="text-muted-foreground mt-1">
          Combine an offering, prompt, and prospect to create a personalized message.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offering">Offering</Label>
              <select
                id="offering"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedOffering}
                onChange={(e) => setSelectedOffering(e.target.value)}
              >
                <option value="">Select an offering</option>
                {offerings.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <select
                id="prompt"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
              >
                <option value="">Select a prompt</option>
                {prompts.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prospect">Prospect</Label>
              <select
                id="prospect"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedProspect}
                onChange={(e) => setSelectedProspect(e.target.value)}
              >
                <option value="">Select a prospect</option>
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.company ? ` at ${p.company}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!selectedOffering || !selectedPrompt || !selectedProspect || generating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {generating ? "Generating..." : "Generate Message"}
            </Button>
          </CardContent>
        </Card>

        {generatedMessage && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm">{generatedMessage}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}