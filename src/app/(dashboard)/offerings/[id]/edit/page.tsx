export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { getOfferingById, updateOffering, scrapeOfferingUrl } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default async function EditOfferingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const offering = await getOfferingById(id)
  if (!offering) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Offering</h1>
        <p className="text-muted-foreground mt-1">Update your offering details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Offering Details</CardTitle>
          <CardDescription className="text-xs">Edit what users will see and how the AI understands your offering.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData: FormData) => {
            "use server"
            const name = formData.get("name") as string
            const description = formData.get("description") as string
            const url = formData.get("url") as string
            const manualContent = formData.get("manualContent") as string

            let aiSummary = offering.aiSummary || ""
            let rawContent = offering.rawContent || ""

            const refreshAI = formData.get("refreshAI") === "true"
            if (refreshAI && url) {
              const result = await scrapeOfferingUrl(url)
              if (result.success) {
                aiSummary = result.aiSummary || ""
                rawContent = result.rawContent || ""
              }
            }

            await updateOffering(id, {
              name,
              description,
              url,
              manualContent,
              aiSummary,
              rawContent,
            })
            redirect("/offerings")
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" defaultValue={offering.name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={offering.description || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input id="url" name="url" type="url" defaultValue={offering.url || ""} placeholder="https://example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualContent">Additional Context</Label>
              <Textarea id="manualContent" name="manualContent" rows={4} defaultValue={offering.manualContent || ""} placeholder="Any extra details the AI should know..." />
            </div>

            {offering.aiSummary && (
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Current AI Understanding</p>
                <p className="text-sm text-muted-foreground line-clamp-3">{offering.aiSummary}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 flex-wrap">
              <Button type="submit">Save Changes</Button>
              <Button type="submit" name="refreshAI" value="true" variant="outline">Refresh AI Analysis</Button>
              <a href="/offerings">
                <Button variant="ghost" type="button">Cancel</Button>
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}