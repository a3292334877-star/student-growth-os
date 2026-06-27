import {
  pgTable,
  uuid,
  integer,
  text,
  jsonb,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const weeklyReports = pgTable(
  "weekly_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    weekNumber: integer("week_number").notNull(),
    aiContent: text("ai_content"),
    editedContent: text("edited_content"),
    rawData: jsonb("raw_data"),
    status: varchar("status", { length: 20 }).default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userWeekUnique: unique().on(table.userId, table.year, table.weekNumber),
  }),
);

export type WeeklyReport = typeof weeklyReports.$inferSelect;
export type NewWeeklyReport = typeof weeklyReports.$inferInsert;
