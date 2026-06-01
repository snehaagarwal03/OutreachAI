import { pgTable, uuid, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { offerings } from "./offerings"
import { prompts } from "./prompts"
import { prospects } from "./prospects"
import { messageRatingEnum } from "./enums"

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    prospectId: uuid("prospect_id")
      .notNull()
      .references(() => prospects.id, { onDelete: "cascade" }),
    offeringId: uuid("offering_id")
      .notNull()
      .references(() => offerings.id, { onDelete: "cascade" }),
    promptId: uuid("prompt_id")
      .notNull()
      .references(() => prompts.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    rating: messageRatingEnum("rating").default("none").notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    model: text("model"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("messages_user_id_idx").on(table.userId),
    index("messages_prospect_id_idx").on(table.prospectId),
    index("messages_offering_id_idx").on(table.offeringId),
    index("messages_prompt_id_idx").on(table.promptId),
  ]
)
