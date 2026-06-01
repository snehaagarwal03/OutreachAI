"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOffering, scrapeOfferingUrl } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Globe, Edit3, Layers, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

type Tab = "website" | "manual" | "combined"

export default function NewOfferingPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("website")
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [scraping, setScraping] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [scraped, setScraped] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleScrape() {
    if (!url) return
    setScraping(true)
    setScraped(false)
    setAiSummary("")
    try {
      const result = await scrapeOfferingUrl(url)
      if (!result.success) {
        toast.error(result.error || "Scrape failed")
        return
      }
      setAiSummary(result.aiSummary || "")
      setScraped(true)
      toast.success("Website analyzed")
    } catch {
      toast.error("Failed to analyze website")
    } finally {
      setScraping(false)
    }
  }

  async function handleSave() {
    if (!name) { toast.error("Name is required"); return }
    setSaving(true)
    try {
      let rawContent = ""
      let contentAiSummary = ""

      if (tab === "website" || tab === "combined") {
        if (scraped && aiSummary) {
          contentAiSummary = aiSummary
        }
      }
      if (tab === "manual") {
        rawContent = description
      }
      if (tab === "combined") {
        rawContent = additionalContext
      }

      await createOffering({
        name,
        description: tab === "manual" ? description.substring(0, 200) : "",
        url: tab === "website" || tab === "combined" ? url : undefined,
        rawContent,
        aiSummary: contentAiSummary,
        manualContent: tab === "manual" ? description : tab === "combined" ? additionalContext : "",
      })

      toast.success("Offering created")
      router.push("/offerings")
      router.refresh()
    } catch {
      toast.error("Failed to create offering")
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Globe; desc: string }[] = [
    { id: "website", label: "Website", icon: Globe, desc: "Scrape a website to auto-define your offering" },
    { id: "manual", label: "Manual", icon: Edit3, desc: "Write your offering description yourself" },
    { id: "combined", label: "Combined", icon: Layers, desc: "Scrape + add your own context on top" },
  ]

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Offering</h1>
        <p className="text-muted-foreground mt-1">Define what you sell and who you sell it to.</p>
      </div>

      <Card className="border-violet-500/20 bg-violet-500/5">
        <CardContent className="py-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm mb-1">What is an Offering?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your offering is the core value you bring to a prospect. It can include what you do, who you help, problems you solve, differentiators, and social proof. <strong>The better your offering is defined, the better every generated message will be.</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2 grid-cols-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setScraped(false); setAiSummary("") }}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all ${
              tab === t.id ? "border-violet-500/50 bg-violet-500/10 text-violet-300" : "border-border/50 bg-card hover:bg-accent/50 text-muted-foreground"
            }`}
          >
            <t.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {tab === "website" ? "Scrape a Website" : tab === "manual" ? "Describe Your Offering" : "Scrape + Add Context"}
          </CardTitle>
          <CardDescription className="text-xs">{tabs.find(t => t.id === tab)?.desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Offering Name *</Label>
            <Input
              id="name"
              placeholder="e.g. HyperReach AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {(tab === "website" || tab === "combined") && (
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://linear.app"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleScrape}
                  disabled={!url || scraping}
                  className="flex-shrink-0"
                >
                  {scraping ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                  {scraping ? "Analyzing..." : "Scrape & Analyze"}
                </Button>
              </div>
            </div>
          )}

          {tab === "manual" && (
            <div className="space-y-2">
              <Label htmlFor="desc">Define your offering</Label>
              <Textarea
                id="desc"
                rows={8}
                placeholder="We help SaaS founders improve customer onboarding by..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {tab === "combined" && (
            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                rows={5}
                placeholder="Add any extra context, key differentiators, or proof points that the website may not cover..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>
          )}

          {scraped && aiSummary && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Website Analyzed</span>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{aiSummary}</div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "Creating..." : "Create Offering"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/offerings")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}