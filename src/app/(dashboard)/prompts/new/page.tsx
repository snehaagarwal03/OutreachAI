import { redirect } from "next/navigation"
import { createPrompt } from "@/features/prompts/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewPromptPage() {
  async function handleSubmit(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const systemPrompt = formData.get("systemPrompt") as string
    const description = formData.get("description") as string
    const isDefault = formData.get("isDefault") === "on"

    await createPrompt({
      name,
      systemPrompt,
      description,
      isDefault,
    })

    redirect("/prompts")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create Prompt</h1>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>
            Create a template for AI message generation
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
                placeholder="e.g., Friendly Sales Outreach"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <input
                name="description"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Brief description of when to use this prompt"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                System Prompt
              </label>
              <textarea
                name="systemPrompt"
                required
                rows={8}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                placeholder="You are a helpful sales assistant..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is the instruction given to the AI before generating the
                message
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                name="isDefault"
                type="checkbox"
                id="isDefault"
                className="rounded"
              />
              <label htmlFor="isDefault" className="text-sm font-medium">
                Set as default prompt
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">Create Prompt</Button>
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
