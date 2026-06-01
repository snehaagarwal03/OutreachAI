import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core"
import { conversations } from "./conversations"

export const replies = pgTable(
  "replies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    originalMessage: text("original_message").notNull(),
    replyContent: text("reply_content").notNull(),
    generatedResponse: text("generated_response").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("replies_conversation_id_idx").on(table.conversationId),
  ]
)
