import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const screeningDecisions = pgTable(
  "screening_decisions",
  {
    id: serial("id").primaryKey(),

    stageId: varchar("stage_id", {
      length: 255,
    }).notNull(),

    decision: varchar("decision", {
      length: 20,
    }).notNull(),

    note: text("note"),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  }
);