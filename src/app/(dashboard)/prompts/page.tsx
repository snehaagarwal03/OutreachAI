import Link from "next/link"
import { getPrompts, deletePrompt, setDefaultPrompt } from "@/features/prompts/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function PromptsPage() {
  const promptsList = await getPrompts()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI prompt templates
          </p>
        </div>
        <Link href="/prompts/new">
          <Button>Create Prompt</Button>
        </Link>
      </div>

      <Card className="mb-6 bg-muted/50">
        <CardContent className="py-4">
          <h3 className="font-semibold mb-2">What is a prompt?</h3>
          <p className="text-sm text-muted-foreground">
            A prompt is a set of instructions given to the AI to guide how it
            generates your outreach messages. You can create different prompts
            for different tones, styles, or campaign objectives. The default
            prompt will be pre-selected when generating messages.
          </p>
        </CardContent>
      </Card>

      {promptsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No prompts yet</p>
            <Link href="/prompts/new" className="mt-4 inline-block">
              <Button variant="outline">Create your first prompt</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promptsList.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{prompt.name}</CardTitle>
                  {prompt.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <CardDescription className="line-clamp-2">
                  {prompt.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/prompts/${prompt.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  {!prompt.isDefault && (
                    <form
                      action={async () => {
                        "use server"
                        await setDefaultPrompt(prompt.id)
                      }}
                    >
                      <Button variant="secondary" size="sm" type="submit">
                        Set Default
                      </Button>
                    </form>
                  )}
                  <form
                    action={async () => {
                      "use server"
                      await deletePrompt(prompt.id)
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
