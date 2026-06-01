export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { getPromptById, updatePrompt } from "@/features/prompts/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function EditPromptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prompt = await getPromptById(id)

  if (!prompt) {
    notFound()
  }

  async function handleSubmit(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const systemPrompt = formData.get("systemPrompt") as string
    const description = formData.get("description") as string
    const isDefault = formData.get("isDefault") === "on"

    await updatePrompt(id, {
      name,
      systemPrompt,
      description,
      isDefault,
    })

    redirect("/prompts")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Prompt</h1>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>Edit your prompt template</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                name="name"
                defaultValue={prompt.name}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <input
                name="description"
                defaultValue={prompt.description || ""}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                System Prompt
              </label>
              <textarea
                name="systemPrompt"
                defaultValue={prompt.systemPrompt}
                required
                rows={8}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                name="isDefault"
                type="checkbox"
                id="isDefault"
                defaultChecked={prompt.isDefault}
                className="rounded"
              />
              <label htmlFor="isDefault" className="text-sm font-medium">
                Set as default prompt
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Update Prompt</Button>
              <a href="/prompts">
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
