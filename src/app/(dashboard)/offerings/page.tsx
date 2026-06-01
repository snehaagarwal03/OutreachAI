import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function OfferingsPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offerings</h1>
          <p className="text-muted-foreground mt-1">
            Define what you sell and who you sell it to.
          </p>
        </div>
        <Link href="/offerings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Offering
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>No offerings yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create your first offering to start generating personalized outreach messages.
            You can paste a website URL, type it out manually, or do both.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}