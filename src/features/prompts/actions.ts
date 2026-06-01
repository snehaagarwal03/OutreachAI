"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { prompts } from "@/db/schema"
import { requireAuth } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"

export async function getPrompts() {
  const user = await requireAuth()
  return db.select().from(prompts).where(eq(prompts.userId, user.id))
}

export async function getPromptById(id: string) {
  const user = await requireAuth()
  const result = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.userId, user.id)))
    .limit(1)
  return result[0] || null
}

export async function getDefaultPrompt() {
  const user = await requireAuth()
  const result = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.userId, user.id), eq(prompts.isDefault, true)))
    .limit(1)
  return result[0] || null
}

export async function createPrompt(data: {
  name: string
  systemPrompt: string
  description?: string
  isDefault?: boolean
}) {
  const user = await requireAuth()

  if (data.isDefault) {
    await db
      .update(prompts)
      .set({ isDefault: false })
      .where(eq(prompts.userId, user.id))
  }

  const result = await db
    .insert(prompts)
    .values({
      ...data,
      userId: user.id,
    })
    .returning()
  revalidatePath("/prompts")
  return result[0]
}

export async function updatePrompt(
  id: string,
  data: {
    name?: string
    systemPrompt?: string
    description?: string
    isDefault?: boolean
  }
) {
  const user = await requireAuth()

  if (data.isDefault) {
    await db
      .update(prompts)
      .set({ isDefault: false })
      .where(eq(prompts.userId, user.id))
  }

  const result = await db
    .update(prompts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(prompts.id, id), eq(prompts.userId, user.id)))
    .returning()
  revalidatePath("/prompts")
  revalidatePath(`/prompts/${id}`)
  return result[0]
}

export async function deletePrompt(id: string) {
  const user = await requireAuth()
  await db
    .delete(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.userId, user.id)))
  revalidatePath("/prompts")
}

export async function setDefaultPrompt(id: string) {
  const user = await requireAuth()

  await db
    .update(prompts)
    .set({ isDefault: false })
    .where(eq(prompts.userId, user.id))

  const result = await db
    .update(prompts)
    .set({ isDefault: true, updatedAt: new Date() })
    .where(and(eq(prompts.id, id), eq(prompts.userId, user.id)))
    .returning()

  revalidatePath("/prompts")
  return result[0]
}
