export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import Link from "next/link"
import { getProspectWithSources, deleteProspect } from "@/features/prospects/actions"
import { getMessagesByProspect } from "@/features/messages/actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prospect = await getProspectWithSources(id)

  if (!prospect) {
    notFound()
  }

  const messages = await getMessagesByProspect(id)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {prospect.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {prospect.title}
            {prospect.company ? ` at ${prospect.company}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/prospects/${id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <form
            action={async () => {
              "use server"
              await deleteProspect(id)
            }}
          >
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm font-medium">Email:</span>{" "}
                <span className="text-sm text-muted-foreground">
                  {prospect.email || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Title:</span>{" "}
                <span className="text-sm text-muted-foreground">
                  {prospect.title || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Company:</span>{" "}
                <span className="text-sm text-muted-foreground">
                  {prospect.company || "N/A"}
                </span>
              </div>
              {prospect.notes && (
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prospect.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {prospect.sources && prospect.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Data Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {prospect.sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <span className="text-xs font-medium uppercase bg-muted px-2 py-1 rounded">
                        {source.type}
                      </span>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 ml-2 hover:underline"
                        >
                          {source.url}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(prospect.rawContent || prospect.aiSummary) && (
            <Card>
              <CardHeader>
                <CardTitle>Scraped Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prospect.aiSummary && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">AI Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {prospect.aiSummary}
                    </p>
                  </div>
                )}
                {prospect.rawContent && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Raw Content</h4>
                    <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-md overflow-auto max-h-48">
                      {prospect.rawContent}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Message History</CardTitle>
                <Link href={`/generate?prospect=${id}`}>
                  <Button size="sm">Generate Message</Button>
                </Link>
              </div>
              <CardDescription>
                Previous outreach messages for this prospect
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages generated yet
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                        {message.isFavorite && (
                          <span className="text-yellow-600">Favorite</span>
                        )}
                        {message.rating !== "none" && (
                          <span
                            className={
                              message.rating === "liked"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {message.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
