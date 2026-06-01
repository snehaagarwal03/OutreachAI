"use server"

import { eq, and, desc } from "drizzle-orm"
import { db } from "@/db"
import { messages, prospects, offerings, prompts } from "@/db/schema"
import { buildOutreachMessage } from "@/lib/ai"
import { requireAuth } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"

export async function getMessages() {
  const user = await requireAuth()
  return db
    .select()
    .from(messages)
    .where(eq(messages.userId, user.id))
    .orderBy(desc(messages.createdAt))
}

export async function getMessagesByProspect(prospectId: string) {
  const user = await requireAuth()
  return db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.prospectId, prospectId),
        eq(messages.userId, user.id)
      )
    )
    .orderBy(desc(messages.createdAt))
}

export async function getMessageById(id: string) {
  const user = await requireAuth()
  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.id, id), eq(messages.userId, user.id)))
    .limit(1)
  return result[0] || null
}

export async function generateMessage(data: {
  offeringId: string
  promptId: string
  prospectId: string
  model?: string
}) {
  const user = await requireAuth()

  const offeringResult = await db
    .select()
    .from(offerings)
    .where(and(eq(offerings.id, data.offeringId), eq(offerings.userId, user.id)))
    .limit(1)

  const promptResult = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, data.promptId), eq(prompts.userId, user.id)))
    .limit(1)

  const prospectResult = await db
    .select()
    .from(prospects)
    .where(
      and(eq(prospects.id, data.prospectId), eq(prospects.userId, user.id))
    )
    .limit(1)

  if (!offeringResult[0] || !promptResult[0] || !prospectResult[0]) {
    throw new Error("One or more selected items not found")
  }

  const offering = offeringResult[0]
  const prompt = promptResult[0]
  const prospect = prospectResult[0]

  const offeringSummary =
    offering.aiSummary || offering.scrapedContent || offering.manualContent || ""
  const prospectSummary =
    prospect.aiSummary || prospect.rawContent || prospect.notes || ""

  const generationResult = await buildOutreachMessage(
    offeringSummary,
    prompt.systemPrompt,
    prospectSummary,
    { model: data.model }
  )

  if (!generationResult.success) {
    throw new Error(generationResult.error || "Failed to generate message")
  }

  const messageResult = await db
    .insert(messages)
    .values({
      userId: user.id,
      prospectId: data.prospectId,
      offeringId: data.offeringId,
      promptId: data.promptId,
      content: generationResult.content!,
      model: generationResult.model || data.model,
    })
    .returning()

  revalidatePath("/generate")
  revalidatePath(`/prospects/${data.prospectId}`)
  return messageResult[0]
}

export async function regenerateMessage(id: string) {
  const user = await requireAuth()
  const existingMessage = await getMessageById(id)

  if (!existingMessage) {
    throw new Error("Message not found")
  }

  return generateMessage({
    offeringId: existingMessage.offeringId,
    promptId: existingMessage.promptId,
    prospectId: existingMessage.prospectId,
    model: existingMessage.model || undefined,
  })
}

export async function updateMessage(
  id: string,
  data: {
    content?: string
    rating?: "liked" | "disliked" | "none"
    isFavorite?: boolean
  }
) {
  const user = await requireAuth()
  const result = await db
    .update(messages)
    .set(data)
    .where(and(eq(messages.id, id), eq(messages.userId, user.id)))
    .returning()
  revalidatePath("/generate")
  revalidatePath(`/prospects/${result[0]?.prospectId}`)
  return result[0]
}

export async function deleteMessage(id: string) {
  const user = await requireAuth()
  const message = await getMessageById(id)
  if (!message) {
    throw new Error("Message not found")
  }
  await db
    .delete(messages)
    .where(and(eq(messages.id, id), eq(messages.userId, user.id)))
  revalidatePath("/generate")
  revalidatePath(`/prospects/${message.prospectId}`)
}

export async function copyMessage(id: string) {
  const user = await requireAuth()
  const message = await getMessageById(id)
  if (!message) {
    throw new Error("Message not found")
  }

  const result = await db
    .insert(messages)
    .values({
      userId: user.id,
      prospectId: message.prospectId,
      offeringId: message.offeringId,
      promptId: message.promptId,
      content: message.content,
      model: message.model,
    })
    .returning()

  revalidatePath("/generate")
  revalidatePath(`/prospects/${message.prospectId}`)
  return result[0]
}

export async function toggleFavorite(id: string) {
  const user = await requireAuth()
  const message = await getMessageById(id)
  if (!message) {
    throw new Error("Message not found")
  }

  const result = await db
    .update(messages)
    .set({ isFavorite: !message.isFavorite })
    .where(and(eq(messages.id, id), eq(messages.userId, user.id)))
    .returning()

  revalidatePath("/generate")
  revalidatePath(`/prospects/${message.prospectId}`)
  return result[0]
}

export async function rateMessage(
  id: string,
  rating: "liked" | "disliked" | "none"
) {
  return updateMessage(id, { rating })
}
