export const dynamic = "force-dynamic"

import Link from "next/link"
import { getOfferings, deleteOffering } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function OfferingsPage() {
  const offeringsList = await getOfferings()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offerings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products and services
          </p>
        </div>
        <Link href="/offerings/new">
          <Button>Create Offering</Button>
        </Link>
      </div>

      {offeringsList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No offerings yet</p>
            <Link href="/offerings/new" className="mt-4 inline-block">
              <Button variant="outline">Create your first offering</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offeringsList.map((offering) => (
            <Card key={offering.id}>
              <CardHeader>
                <CardTitle className="text-lg">{offering.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {offering.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/offerings/${offering.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await deleteOffering(offering.id)
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
