import {
  pgTable,
  uuid,
  date,
  integer,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const studyLogs = pgTable("study_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  durationMin: integer("duration_min"),
  content: text("content"),
  tags: varchar("tags", { length: 50 }).array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StudyLog = typeof studyLogs.$inferSelect;
export type NewStudyLog = typeof studyLogs.$inferInsert;
