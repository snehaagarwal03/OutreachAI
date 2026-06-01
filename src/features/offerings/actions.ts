"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { offerings } from "@/db/schema"
import { scrapeWebsite } from "@/lib/firecrawl"
import { summarizeContent } from "@/lib/ai"
import { requireAuth } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"

export async function getOfferings() {
  const user = await requireAuth()
  return db.select().from(offerings).where(eq(offerings.userId, user.id))
}

export async function getOfferingById(id: string) {
  const user = await requireAuth()
  const result = await db
    .select()
    .from(offerings)
    .where(and(eq(offerings.id, id), eq(offerings.userId, user.id)))
    .limit(1)
  return result[0] || null
}

export async function createOffering(data: {
  name: string
  description?: string
  url?: string
  rawContent?: string
  aiSummary?: string
  manualContent?: string
}) {
  const user = await requireAuth()
  const result = await db
    .insert(offerings)
    .values({
      ...data,
      userId: user.id,
    })
    .returning()
  revalidatePath("/offerings")
  return result[0]
}

export async function updateOffering(
  id: string,
  data: {
    name?: string
    description?: string
    url?: string
    rawContent?: string
    aiSummary?: string
    scrapedContent?: string
    manualContent?: string
  }
) {
  const user = await requireAuth()
  const result = await db
    .update(offerings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(offerings.id, id), eq(offerings.userId, user.id)))
    .returning()
  revalidatePath("/offerings")
  revalidatePath(`/offerings/${id}`)
  return result[0]
}

export async function deleteOffering(id: string) {
  const user = await requireAuth()
  await db
    .delete(offerings)
    .where(and(eq(offerings.id, id), eq(offerings.userId, user.id)))
  revalidatePath("/offerings")
}

export async function scrapeOfferingUrl(url: string) {
  const scrapeResult = await scrapeWebsite(url)

  if (!scrapeResult.success) {
    return {
      success: false,
      error: scrapeResult.error,
    }
  }

  const summaryResult = await summarizeContent(scrapeResult.content || "")

  return {
    success: true,
    rawContent: scrapeResult.content,
    aiSummary: summaryResult.success ? summaryResult.summary : "",
  }
}
