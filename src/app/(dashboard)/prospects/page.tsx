export const dynamic = "force-dynamic"

import Link from "next/link"
import { getProspects, deleteProspect } from "@/features/prospects/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ProspectsPage() {
  const prospectsList = await getProspects()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prospects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your outreach targets
          </p>
        </div>
        <Link href="/prospects/new">
          <Button>Create Prospect</Button>
        </Link>
      </div>

      {prospectsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No prospects yet</p>
            <Link href="/prospects/new" className="mt-4 inline-block">
              <Button variant="outline">Create your first prospect</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prospectsList.map((prospect) => (
            <Card key={prospect.id}>
              <CardHeader>
                <CardTitle className="text-lg">{prospect.name}</CardTitle>
                <CardDescription>
                  {prospect.title}
                  {prospect.company ? ` at ${prospect.company}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {prospect.email || "No email"}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/prospects/${prospect.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/prospects/${prospect.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await deleteProspect(prospect.id)
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
