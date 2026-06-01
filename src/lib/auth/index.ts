import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db"
import { env } from "@/lib/utils/env"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // update session every 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache session for 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "hyperreach",
    crossSubDomainCookies: {
      enabled: false,
    },
  },
})

export type AuthSession = typeof auth.$Infer.Session