import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const skillTags = pgTable(
  "skill_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    category: varchar("category", { length: 100 }),
    proficiency: integer("proficiency").default(1),
    source: varchar("source", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userSkillUnique: unique().on(table.userId, table.name),
  }),
);

export type SkillTag = typeof skillTags.$inferSelect;
export type NewSkillTag = typeof skillTags.$inferInsert;
