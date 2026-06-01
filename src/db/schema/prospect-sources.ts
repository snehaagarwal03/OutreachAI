import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core"
import { prospects } from "./prospects"
import { prospectSourceTypeEnum } from "./enums"

export const prospectSources = pgTable(
  "prospect_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    prospectId: uuid("prospect_id")
      .notNull()
      .references(() => prospects.id, { onDelete: "cascade" }),
    type: prospectSourceTypeEnum("type").notNull(),
    url: text("url"),
    content: text("content"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("prospect_sources_prospect_id_idx").on(table.prospectId),
  ]
)
