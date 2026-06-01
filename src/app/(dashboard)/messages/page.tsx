export const dynamic = "force-dynamic"

import { redirect } from "next/navigation"
import { getMessages } from "@/features/messages/actions"
import { getCurrentUser } from "@/lib/auth/session"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Star, ArrowRight } from "lucide-react"

export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your generated outreach messages.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Generate your first personalized message by selecting an offering, prompt, and prospect.
            </p>
            <Link href="/generate" className="mt-4 inline-block">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
                Generate Message <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="hover:bg-accent/30 transition-colors">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm leading-relaxed flex-1">
                    {msg.content.substring(0, 200)}{msg.content.length > 200 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {msg.isFavorite && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      msg.rating === "liked" ? "bg-emerald-500/10 text-emerald-400" :
                      msg.rating === "disliked" ? "bg-red-500/10 text-red-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {msg.rating === "none" ? "Unrated" : msg.rating === "liked" ? "Liked" : "Disliked"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}