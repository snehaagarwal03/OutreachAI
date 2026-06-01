export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { getProspectById, updateProspect } from "@/features/prospects/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function EditProspectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prospect = await getProspectById(id)

  if (!prospect) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const notes = formData.get("notes") as string
    const rawContent = formData.get("rawContent") as string
    const aiSummary = formData.get("aiSummary") as string

    await updateProspect(id, {
      name,
      email,
      title,
      company,
      notes,
      rawContent,
      aiSummary,
    })

    redirect("/prospects")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Prospect</h1>

      <Card>
        <CardHeader>
          <CardTitle>Prospect Details</CardTitle>
          <CardDescription>Edit prospect information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                name="name"
                defaultValue={prospect.name}
                required
                className="w-full px-3 py-2 border rounded-md"
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
                  defaultValue={prospect.email || ""}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={prospect.title || ""}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Company
              </label>
              <input
                name="company"
                defaultValue={prospect.company || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes</label>
              <textarea
                name="notes"
                defaultValue={prospect.notes || ""}
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Raw Content
              </label>
              <textarea
                name="rawContent"
                defaultValue={prospect.rawContent || ""}
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
                defaultValue={prospect.aiSummary || ""}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Update Prospect</Button>
              <a href="/prospects">
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
