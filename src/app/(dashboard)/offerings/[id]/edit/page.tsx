export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { getOfferingById, updateOffering } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function EditOfferingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const offering = await getOfferingById(id)

  if (!offering) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const rawContent = formData.get("rawContent") as string
    const aiSummary = formData.get("aiSummary") as string
    const manualContent = formData.get("manualContent") as string

    await updateOffering(id, {
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
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Offering</h1>

      <Card>
        <CardHeader>
          <CardTitle>Offering Details</CardTitle>
          <CardDescription>Edit your offering information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                name="name"
                defaultValue={offering.name}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={offering.description || ""}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <input
                name="url"
                type="url"
                defaultValue={offering.url || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Raw Content
              </label>
              <textarea
                name="rawContent"
                defaultValue={offering.rawContent || ""}
                rows={6}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                AI Summary
              </label>
              <textarea
                name="aiSummary"
                defaultValue={offering.aiSummary || ""}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
                readOnly
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Manual Content
              </label>
              <textarea
                name="manualContent"
                defaultValue={offering.manualContent || ""}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Update Offering</Button>
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
