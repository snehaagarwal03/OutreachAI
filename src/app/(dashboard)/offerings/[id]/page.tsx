export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { getOfferingById } from "@/features/offerings/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Target, Zap, CheckCircle, ArrowLeft, ExternalLink, Sparkles } from "lucide-react"

export default async function OfferingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const offering = await getOfferingById(id)
  if (!offering) notFound()

  const sections = parseAiSummary(offering.aiSummary || "")

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/offerings">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <Link href={`/offerings/${id}/edit`}>
          <Button variant="outline" size="sm">Edit</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{offering.name}</h1>
        {offering.description && (
          <p className="text-muted-foreground mt-1">{offering.description}</p>
        )}
      </div>

      {offering.url && (
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <a href={offering.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 truncate">
              {offering.url} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </CardContent>
        </Card>
      )}

      {sections.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" /> AI Understanding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-center gap-2 mb-2">
                  {section.key.includes("Target") || section.key.includes("Audience") ? (
                    <Target className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  ) : section.key.includes("Problem") || section.key.includes("Solved") ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  ) : section.key.includes("Differentiator") || section.key.includes("Benefit") ? (
                    <Zap className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  ) : (
                    <Globe className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">{section.key}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-7">{section.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No AI analysis yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              {offering.url ? "Scrape the website to generate one" : "Add a website URL and scrape to generate one"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function parseAiSummary(text: string): { key: string; value: string }[] {
  if (!text) return []
  const lines = text.split("\n").filter(Boolean)
  const sections: { key: string; value: string }[] = []
  let currentKey = "Overview"

  for (const line of lines) {
    const match = line.match(/^(?:[-•*]\s*)?(?:\*\*)?(.+?)(?:\*\*)?:\s*(.+)$/)
    if (match) {
      currentKey = match[1].trim()
      sections.push({ key: currentKey, value: match[2].trim() })
    } else if (line.match(/^#+\s+(.+)/)) {
      currentKey = line.replace(/^#+\s+/, "").trim()
    } else if (sections.length > 0) {
      sections[sections.length - 1].value += " " + line.trim()
    } else {
      sections.push({ key: currentKey, value: line.trim() })
    }
  }
  return sections.length > 0 ? sections : [{ key: "AI Summary", value: text }]
}