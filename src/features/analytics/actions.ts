"use server"

import { eq, count, sql } from "drizzle-orm"
import { db } from "@/db"
import { offerings, prospects, messages, conversations } from "@/db/schema"
import { requireAuth } from "@/lib/auth/session"

export async function getAnalytics() {
  const user = await requireAuth()

  const [
    totalMessages,
    totalProspects,
    totalOfferings,
    conversationsWithReplies,
    mostUsedOffering,
  ] = await Promise.all([
    db.select({ count: count() }).from(messages).where(eq(messages.userId, user.id)),
    db.select({ count: count() }).from(prospects).where(eq(prospects.userId, user.id)),
    db.select({ count: count() }).from(offerings).where(eq(offerings.userId, user.id)),
    db.select({ count: count() }).from(conversations).where(eq(conversations.status, "replied")),
    db.select({
      offeringId: messages.offeringId,
      count: count(),
    }).from(messages).where(eq(messages.userId, user.id)).groupBy(messages.offeringId)
      .orderBy(sql`count(*) desc`).limit(1),
  ])

  let mostUsedOfferingName: string | null = null
  if (mostUsedOffering[0]?.offeringId) {
    const offering = await db.select({ name: offerings.name }).from(offerings).where(eq(offerings.id, mostUsedOffering[0].offeringId)).limit(1)
    mostUsedOfferingName = offering[0]?.name ?? null
  }

  return {
    totalMessages: totalMessages[0]?.count ?? 0,
    totalProspects: totalProspects[0]?.count ?? 0,
    totalOfferings: totalOfferings[0]?.count ?? 0,
    conversationsWithReplies: conversationsWithReplies[0]?.count ?? 0,
    mostUsedOffering: mostUsedOfferingName,
    mostUsedOfferingCount: mostUsedOffering[0]?.count ?? 0,
  }
}