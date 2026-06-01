import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { offerings, prompts, prospects, messages, conversations } from "@/db/schema"
import { eq, desc, count, sql } from "drizzle-orm"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, FileText, Users, MessageSquare, Sparkles, BarChart3, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const [
    offeringsCount,
    promptsCount,
    prospectsCount,
    messagesCount,
    recentMessages,
  ] = await Promise.all([
    db.select({ count: count() }).from(offerings).where(eq(offerings.userId, user.id)),
    db.select({ count: count() }).from(prompts).where(eq(prompts.userId, user.id)),
    db.select({ count: count() }).from(prospects).where(eq(prospects.userId, user.id)),
    db.select({ count: count() }).from(messages).where(eq(messages.userId, user.id)),
    db.select().from(messages).where(eq(messages.userId, user.id)).orderBy(desc(messages.createdAt)).limit(5),
  ])

  const stats = [
    { name: "Messages", value: messagesCount[0]?.count ?? 0, icon: MessageSquare, href: "/messages", color: "from-violet-500 to-purple-600" },
    { name: "Prospects", value: prospectsCount[0]?.count ?? 0, icon: Users, href: "/prospects", color: "from-cyan-500 to-blue-600" },
    { name: "Offerings", value: offeringsCount[0]?.count ?? 0, icon: Package, href: "/offerings", color: "from-amber-500 to-orange-600" },
    { name: "Prompts", value: promptsCount[0]?.count ?? 0, icon: FileText, href: "/prompts", color: "from-emerald-500 to-green-600" },
  ]

  const quickActions = [
    { name: "New Offering", href: "/offerings/new", icon: Package },
    { name: "New Prompt", href: "/prompts/new", icon: FileText },
    { name: "New Prospect", href: "/prospects/new", icon: Users },
    { name: "Generate Message", href: "/generate", icon: Sparkles },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name?.split(" ")[0] || "there"}</h1>
        <p className="text-muted-foreground mt-1">Manage your personalized outreach from one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                  <action.icon className="h-4 w-4" />
                  {action.name}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Messages</CardTitle>
            {recentMessages.length > 0 && (
              <Link href="/messages">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <div className="text-center py-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
                <p className="text-xs text-muted-foreground mt-1">Generate your first message to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{msg.content.substring(0, 100)}{msg.content.length > 100 ? "..." : ""}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}