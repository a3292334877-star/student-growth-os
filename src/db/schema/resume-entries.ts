import {
  pgTable,
  uuid,
  varchar,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { resumes } from "./resumes";

export const resumeEntries = pgTable("resume_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "cascade" }),
  section: varchar("section", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
  sourceType: varchar("source_type", { length: 50 }),
  sourceId: uuid("source_id"),
  title: varchar("title", { length: 300 }),
  subtitle: varchar("subtitle", { length: 300 }),
  description: text("description"),
  aiOptimized: text("ai_optimized"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ResumeEntry = typeof resumeEntries.$inferSelect;
export type NewResumeEntry = typeof resumeEntries.$inferInsert;
