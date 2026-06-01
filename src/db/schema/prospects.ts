import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const prospects = pgTable(
  "prospects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    title: text("title"),
    company: text("company"),
    notes: text("notes"),
    rawContent: text("raw_content"),
    aiSummary: text("ai_summary"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("prospects_user_id_idx").on(table.userId),
  ]
)
