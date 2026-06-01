"use client"

import { useState, useTransition } from "react"
import { generateMessage, rateMessage, toggleFavorite } from "@/features/messages/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sparkles, ThumbsUp, ThumbsDown, Star, Copy, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Offering = { id: string; name: string; description: string | null; aiSummary: string | null; manualContent: string | null }
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
  const [isPending, startTransition] = useTransition()
  const [generatedMessage, setGeneratedMessage] = useState<{ id: string; content: string } | null>(null)
  const [error, setError] = useState("")

  function handleGenerate() {
    if (!selectedOffering || !selectedPrompt || !selectedProspect) return
    setError("")
    setGeneratedMessage(null)

    startTransition(async () => {
      try {
        const result = await generateMessage({
          offeringId: selectedOffering,
          promptId: selectedPrompt,
          prospectId: selectedProspect,
        })
        setGeneratedMessage({ id: result.id, content: result.content })
        toast.success("Message generated!")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate message")
        toast.error("Failed to generate message")
      }
    })
  }

  function handleRate(rating: "liked" | "disliked" | "none") {
    if (!generatedMessage) return
    startTransition(async () => {
      try {
        await rateMessage(generatedMessage.id, rating)
        toast.success(rating === "liked" ? "Marked as liked" : rating === "disliked" ? "Marked as disliked" : "Rating removed")
      } catch {
        toast.error("Failed to rate message")
      }
    })
  }

  function handleFavorite() {
    if (!generatedMessage) return
    startTransition(async () => {
      try {
        await toggleFavorite(generatedMessage.id)
        toast.success("Toggled favorite")
      } catch {
        toast.error("Failed to toggle favorite")
      }
    })
  }

  async function handleCopy() {
    if (!generatedMessage) return
    await navigator.clipboard.writeText(generatedMessage.content)
    toast.success("Copied to clipboard")
  }

  if (offerings.length === 0 || prompts.length === 0 || prospects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generate Message</h1>
          <p className="text-muted-foreground mt-1">Create a personalized outreach message.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Set up required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              You need at least one offering, one prompt, and one prospect to generate a message.
            </p>
            <div className="flex gap-3 mt-4">
              {offerings.length === 0 && (
                <a href="/offerings/new"><Button variant="outline" size="sm">Create Offering</Button></a>
              )}
              {prompts.length === 0 && (
                <a href="/prompts/new"><Button variant="outline" size="sm">Create Prompt</Button></a>
              )}
              {prospects.length === 0 && (
                <a href="/prospects/new"><Button variant="outline" size="sm">Add Prospect</Button></a>
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
        <h1 className="text-2xl font-bold tracking-tight">Generate Message</h1>
        <p className="text-muted-foreground mt-1">Combine an offering, prompt, and prospect to create a personalized message.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="offering">Offering</Label>
              <select
                id="offering"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedOffering}
                onChange={(e) => setSelectedOffering(e.target.value)}
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white border-0"
              onClick={handleGenerate}
              disabled={!selectedOffering || !selectedPrompt || !selectedProspect || isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isPending ? "Generating..." : "Generate Message"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/50">
            <CardContent className="py-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {generatedMessage && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Generated Message</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFavorite}>
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleGenerate} disabled={isPending}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/50 rounded-lg p-4">
                {generatedMessage.content}
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-muted-foreground">Rate:</span>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRate("liked")}>
                  <ThumbsUp className="h-3 w-3 mr-1" /> Like
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleRate("disliked")}>
                  <ThumbsDown className="h-3 w-3 mr-1" /> Dislike
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}