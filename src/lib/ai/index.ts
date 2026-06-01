import OpenAI from "openai"
import { env } from "@/lib/utils/env"

const client = new OpenAI({
  apiKey: env.OPENCODE_GO_API_KEY,
  baseURL: "https://api.opencode.ai/v1",
})

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<{
  success: boolean
  content?: string
  model?: string
  error?: string
}> {
  try {
    const response = await client.chat.completions.create({
      model: options.model || "gpt-4o",
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    })

    if (!response || !response.choices || !Array.isArray(response.choices)) {
      console.error("Unexpected API response:", JSON.stringify(response, null, 2))
      return {
        success: false,
        error: "Invalid API response format",
      }
    }

    const firstChoice = response.choices[0]
    if (!firstChoice || !firstChoice.message) {
      return {
        success: false,
        error: "No message in API response",
      }
    }

    const content = firstChoice.message.content

    if (!content) {
      return {
        success: false,
        error: "Empty content in API response",
      }
    }

    return {
      success: true,
      content,
      model: response.model || options.model || "gpt-4o",
    }
  } catch (error) {
    console.error("AI generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred during AI generation",
    }
  }
}

export async function summarizeContent(
  content: string,
  options: {
    model?: string
    maxLength?: number
  } = {}
): Promise<{
  success: boolean
  content?: string
  summary?: string
  model?: string
  error?: string
}> {
  const systemPrompt = `You are a helpful assistant that summarizes content concisely. Summarize the following content in at most ${options.maxLength || 500} words. Focus on key value propositions, features, and differentiators.`

  const result = await generateCompletion(systemPrompt, content, {
    model: options.model,
    temperature: 0.5,
    maxTokens: 1000,
  })

  return {
    ...result,
    summary: result.content,
  }
}

export async function buildOutreachMessage(
  offeringSummary: string,
  promptContent: string,
  prospectSummary: string,
  options: {
    model?: string
  } = {}
): Promise<{
  success: boolean
  content?: string
  model?: string
  error?: string
}> {
  const systemPrompt = `You are an expert outreach specialist. ${promptContent}`

  const userPrompt = `## Offering Summary\n${offeringSummary}\n\n## Prospect Summary\n${prospectSummary}\n\nGenerate a personalized outreach message based on the offering and prospect context above.`

  return generateCompletion(systemPrompt, userPrompt, {
    model: options.model,
    temperature: 0.7,
    maxTokens: 2000,
  })
}