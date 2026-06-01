import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getMessages } from "@/features/messages/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MessagesPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect("/login")
  }

  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your generated outreach messages.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No messages yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Generate your first personalized message by selecting an offering, prompt, and prospect.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {message.content.substring(0, 100)}
                  {message.content.length > 100 ? "..." : ""}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {new Date(message.createdAt).toLocaleDateString()}
                  {message.rating !== "none" && ` · ${message.rating}`}
                  {message.isFavorite && " · Favorited"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}