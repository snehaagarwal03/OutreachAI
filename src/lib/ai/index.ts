import { env } from "@/lib/utils/env"

const OPENCODE_URL = "https://opencode.ai/zen/go/v1/chat/completions"
const DEFAULT_MODEL = "opencode-go/kimi-k2.6"

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
  const apiKey = env.OPENCODE_GO_API_KEY
  const model = options.model || DEFAULT_MODEL

  console.log("AI Call:", { url: OPENCODE_URL, model })

  try {
    const response = await fetch(OPENCODE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    const responseText = await response.text()
    console.log("AI Status:", response.status, "Body:", responseText.substring(0, 400))

    if (!response.ok) {
      return {
        success: false,
        error: `API error ${response.status}: ${responseText.substring(0, 200)}`,
      }
    }

    const data = JSON.parse(responseText)

    if (data.error) {
      return {
        success: false,
        error: data.error.message || data.error,
      }
    }

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      return {
        success: false,
        error: "No choices in API response",
      }
    }

    const content = data.choices[0]?.message?.content

    if (!content) {
      return {
        success: false,
        error: "Empty content in API response",
      }
    }

    return {
      success: true,
      content,
      model: data.model || model,
    }
  } catch (error) {
    console.error("AI generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during AI generation",
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