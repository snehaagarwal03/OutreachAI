export const dynamic = "force-dynamic"

import Link from "next/link"
import { getOfferings } from "@/features/offerings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, ArrowRight, Globe } from "lucide-react"
import { DeleteOfferingButton } from "./_components/delete-button"

export default async function OfferingsPage() {
  const offeringsList = await getOfferings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Offerings</h1>
          <p className="text-muted-foreground mt-1">Define what you sell and who you sell it to.</p>
        </div>
        <Link href="/offerings/new">
          <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Offering
          </Button>
        </Link>
      </div>

      {offeringsList.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No offerings yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Create your first offering to start generating personalized outreach messages.</p>
            <Link href="/offerings/new">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0">
                Create your first offering
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offeringsList.map((offering) => (
            <Link key={offering.id} href={`/offerings/${offering.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{offering.name}</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardDescription className="line-clamp-2">
                    {offering.aiSummary || offering.description || "No summary available"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {offering.url && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          Scraped
                        </span>
                      )}
                      {offering.aiSummary && (
                        <Badge variant="secondary" className="text-xs">AI Analyzed</Badge>
                      )}
                      {!offering.aiSummary && !offering.description && (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                    </div>
                    <DeleteOfferingButton id={offering.id} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}