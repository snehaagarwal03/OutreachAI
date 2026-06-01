"use server"

import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { prospects, prospectSources, scrapedData } from "@/db/schema"
import type { prospectSourceTypeEnum } from "@/db/schema"
import { scrapeWebsite } from "@/lib/firecrawl"
import {
  fetchGitHubProfile,
  fetchGitHubRepository,
  extractGitHubUsernameOrRepo,
} from "@/lib/github"
import { uploadImage } from "@/lib/cloudinary"
import { summarizeContent } from "@/lib/ai"
import { requireAuth } from "@/lib/auth/session"
import { revalidatePath } from "next/cache"

export async function getProspects() {
  const user = await requireAuth()
  return db.select().from(prospects).where(eq(prospects.userId, user.id))
}

export async function getProspectById(id: string) {
  const user = await requireAuth()
  const result = await db
    .select()
    .from(prospects)
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
    .limit(1)
  return result[0] || null
}

export async function getProspectWithSources(id: string) {
  const user = await requireAuth()
  const prospectResult = await db
    .select()
    .from(prospects)
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
    .limit(1)

  if (!prospectResult[0]) return null

  const sourcesResult = await db
    .select()
    .from(prospectSources)
    .where(eq(prospectSources.prospectId, id))

  return {
    ...prospectResult[0],
    sources: sourcesResult,
  }
}

export async function createProspect(data: {
  name: string
  email?: string
  title?: string
  company?: string
  notes?: string
  rawContent?: string
  aiSummary?: string
  sources?: Array<{
    type: (typeof prospectSourceTypeEnum.enumValues)[number]
    url?: string
    content?: string
  }>
}) {
  const user = await requireAuth()
  const { sources, ...prospectData } = data

  const result = await db
    .insert(prospects)
    .values({
      ...prospectData,
      userId: user.id,
    })
    .returning()

  const prospect = result[0]

  if (sources && sources.length > 0) {
    await db.insert(prospectSources).values(
      sources.map((source) => ({
        ...source,
        prospectId: prospect.id,
      }))
    )
  }

  revalidatePath("/prospects")
  return prospect
}

export async function updateProspect(
  id: string,
  data: {
    name?: string
    email?: string
    title?: string
    company?: string
    notes?: string
    rawContent?: string
    aiSummary?: string
  }
) {
  const user = await requireAuth()
  const result = await db
    .update(prospects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
    .returning()
  revalidatePath("/prospects")
  revalidatePath(`/prospects/${id}`)
  return result[0]
}

export async function deleteProspect(id: string) {
  const user = await requireAuth()
  await db
    .delete(prospects)
    .where(and(eq(prospects.id, id), eq(prospects.userId, user.id)))
  revalidatePath("/prospects")
}

export async function addProspectSource(
  prospectId: string,
  data: {
    type: (typeof prospectSourceTypeEnum.enumValues)[number]
    url?: string
    content?: string
  }
) {
  const user = await requireAuth()
  const prospect = await getProspectById(prospectId)
  if (!prospect || prospect.userId !== user.id) {
    throw new Error("Unauthorized")
  }

  const result = await db
    .insert(prospectSources)
    .values({
      ...data,
      prospectId,
    })
    .returning()

  return result[0]
}

export async function scrapeProspectSource(
  type: string,
  url: string
): Promise<{
  success: boolean
  rawContent?: string
  aiSummary?: string
  error?: string
}> {
  if (type === "github") {
    const githubInfo = extractGitHubUsernameOrRepo(url)
    if (!githubInfo) {
      return { success: false, error: "Invalid GitHub URL" }
    }

    let rawContent = ""
    if (githubInfo.type === "repo" && githubInfo.repo) {
      const result = await fetchGitHubRepository(
        githubInfo.username,
        githubInfo.repo
      )
      if (!result.success) {
        return { success: false, error: result.error }
      }
      rawContent = JSON.stringify({
        repo: result.repo,
        readme: result.readme,
      })
    } else {
      const result = await fetchGitHubProfile(githubInfo.username)
      if (!result.success) {
        return { success: false, error: result.error }
      }
      rawContent = JSON.stringify({
        profile: result.profile,
        repos: result.repos,
      })
    }

    const summaryResult = await summarizeContent(rawContent)
    return {
      success: true,
      rawContent,
      aiSummary: summaryResult.success ? summaryResult.summary : "",
    }
  }

  if (
    type === "website" ||
    type === "company_website" ||
    type === "custom"
  ) {
    const scrapeResult = await scrapeWebsite(url)
    if (!scrapeResult.success) {
      return { success: false, error: scrapeResult.error }
    }

    const summaryResult = await summarizeContent(scrapeResult.content || "")
    return {
      success: true,
      rawContent: scrapeResult.content,
      aiSummary: summaryResult.success ? summaryResult.summary : "",
    }
  }

  return { success: false, error: "Unsupported source type" }
}

export async function uploadScreenshot(
  formData: FormData
): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  const file = formData.get("file") as File
  if (!file) {
    return { success: false, error: "No file provided" }
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await uploadImage(buffer, {
    folder: "prospect-screenshots",
  })

  return result
}
