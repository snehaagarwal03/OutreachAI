"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { conversations, replies, messages } from "@/db/schema"
import { requireAuth } from "@/lib/auth/session"
import { buildOutreachMessage } from "@/lib/ai"
import { revalidatePath } from "next/cache"

export async function createConversation(messageId: string) {
  const user = await requireAuth()
  const message = await db.select().from(messages).where(and(eq(messages.id, messageId), eq(messages.userId, user.id))).limit(1)
  if (!message[0]) throw new Error("Message not found")

  const existing = await db.select().from(conversations).where(eq(conversations.messageId, messageId)).limit(1)
  if (existing[0]) return existing[0]

  const result = await db.insert(conversations).values({ messageId }).returning()
  revalidatePath(`/messages/${messageId}`)
  return result[0]
}

export async function addReply(conversationId: string, replyContent: string) {
  const user = await requireAuth()
  const conversation = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1)
  if (!conversation[0]) throw new Error("Conversation not found")

  const message = await db.select().from(messages).where(eq(messages.id, conversation[0].messageId)).limit(1)
  if (!message[0] || message[0].userId !== user.id) throw new Error("Unauthorized")

  const promptResult = await db.select().from(messages)
    .leftJoin(conversations, eq(conversations.messageId, messages.id))
    .where(eq(messages.id, conversation[0].messageId)).limit(1)

  const originalMessage = message[0].content

  const generatedResult = await buildOutreachMessage(
    "You are continuing a conversation. The prospect has replied to your outreach message.",
    `Original message: ${originalMessage}\n\nProspect's reply: ${replyContent}\n\nGenerate a natural, contextual follow-up response that continues the conversation.`,
    replyContent,
    { model: "gpt-4o" }
  )

  if (!generatedResult.success || !generatedResult.content) {
    throw new Error(generatedResult.error || "Failed to generate reply")
  }

  const result = await db.insert(replies).values({
    conversationId,
    originalMessage,
    replyContent,
    generatedResponse: generatedResult.content,
  }).returning()

  await db.update(conversations).set({ status: "replied", updatedAt: new Date() }).where(eq(conversations.id, conversationId))

  revalidatePath(`/messages/${message[0].id}`)
  return result[0]
}

export async function getConversationByMessageId(messageId: string) {
  const user = await requireAuth()
  const message = await db.select().from(messages).where(and(eq(messages.id, messageId), eq(messages.userId, user.id))).limit(1)
  if (!message[0]) return null

  const conversation = await db.select().from(conversations).where(eq(conversations.messageId, messageId)).limit(1)
  if (!conversation[0]) return null

  const repliesList = await db.select().from(replies).where(eq(replies.conversationId, conversation[0].id))

  return { ...conversation[0], replies: repliesList }
}

export async function getConversations() {
  const user = await requireAuth()
  const result = await db
    .select({
      conversation: conversations,
      message: messages,
    })
    .from(conversations)
    .innerJoin(messages, eq(conversations.messageId, messages.id))
    .where(eq(messages.userId, user.id))
    .orderBy(conversations.updatedAt)

  return result
}