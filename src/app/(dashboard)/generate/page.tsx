export const dynamic = "force-dynamic"

import { getOfferings } from "@/features/offerings/actions"
import { getPrompts } from "@/features/prompts/actions"
import { getProspects } from "@/features/prospects/actions"
import GeneratePageClient from "./client"

export default async function GeneratePage() {
  const [offerings, prompts, prospects] = await Promise.all([
    getOfferings(),
    getPrompts(),
    getProspects(),
  ])

  return (
    <GeneratePageClient
      offerings={offerings}
      prompts={prompts}
      prospects={prospects}
    />
  )
}
