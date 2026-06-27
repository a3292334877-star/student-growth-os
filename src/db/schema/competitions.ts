import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const competitions = pgTable("competitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 300 }).notNull(),
  level: varchar("level", { length: 50 }),
  award: varchar("award", { length: 100 }),
  role: varchar("role", { length: 100 }),
  description: text("description"),
  date: date("date"),
  certificateUrl: varchar("certificate_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;
