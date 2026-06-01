import { pgEnum } from "drizzle-orm/pg-core"

export const prospectSourceTypeEnum = pgEnum("prospect_source_type", [
  "github",
  "website",
  "company_website",
  "screenshot",
  "linkedin_screenshot",
  "custom",
])

export const conversationStatusEnum = pgEnum("conversation_status", [
  "pending",
  "replied",
  "closed",
])

export const messageRatingEnum = pgEnum("message_rating", [
  "liked",
  "disliked",
  "none",
])
