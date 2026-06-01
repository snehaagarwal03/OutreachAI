import { pgTable, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core"
import { prospectSources } from "./prospect-sources"

export const scrapedData = pgTable(
  "scraped_data",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    prospectSourceId: uuid("prospect_source_id")
      .notNull()
      .references(() => prospectSources.id, { onDelete: "cascade" }),
    rawContent: text("raw_content"),
    processedContent: text("processed_content"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("scraped_data_prospect_source_id_idx").on(table.prospectSourceId),
  ]
)
