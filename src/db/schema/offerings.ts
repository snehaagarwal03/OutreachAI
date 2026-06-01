import { pgTable, uuid, text, timestamp, index, boolean } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const offerings = pgTable(
  "offerings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    rawContent: text("raw_content"),
    aiSummary: text("ai_summary"),
    scrapedContent: text("scraped_content"),
    manualContent: text("manual_content"),
    url: text("url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("offerings_user_id_idx").on(table.userId),
  ]
)
