import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().min(1, "BETTER_AUTH_URL is required"),
  OPENCODE_GO_API_KEY: z.string().min(1, "OPENCODE_GO_API_KEY is required"),
  FIRECRAWL_API_KEY: z.string().min(1, "FIRECRAWL_API_KEY is required"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().min(1, "NEXT_PUBLIC_BETTER_AUTH_URL is required").default("http://localhost:3000"),
})

const isServer = typeof window === "undefined"

let env: z.infer<typeof envSchema>

if (isServer) {
  const parsedEnv = envSchema.safeParse(process.env)
  if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format())
    throw new Error("Invalid environment variables. Application cannot start.")
  }
  env = parsedEnv.data
} else {
  env = {} as z.infer<typeof envSchema>
}

export { env }