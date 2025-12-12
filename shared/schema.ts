import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with role support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teams table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  tag: varchar("tag").notNull(), // Team tag like [ABC]
  logo: varchar("logo"), // Optional team logo URL
  captainId: varchar("captain_id").notNull().references(() => users.id),
  player1: varchar("player1").notNull(),
  player2: varchar("player2").notNull(),
  player3: varchar("player3").notNull(),
  player4: varchar("player4").notNull(),
  discordContact: varchar("discord_contact"),
  status: varchar("status").default("pending").notNull(), // pending, approved, rejected, blocked
  isVip: boolean("is_vip").default(false).notNull(),
  slot: integer("slot"), // Assigned slot number
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schedules table for scrim events
export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  maxTeams: integer("max_teams").default(16).notNull(),
  status: varchar("status").default("upcoming").notNull(), // upcoming, active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Results table for match results
export const results = pgTable("results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scheduleId: varchar("schedule_id").references(() => schedules.id),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"), // Result screenshot
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one }) => ({
  captain: one(users, {
    fields: [teams.captainId],
    references: [users.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ many }) => ({
  results: many(results),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  schedule: one(schedules, {
    fields: [results.scheduleId],
    references: [schedules.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  captainId: true, // Added server-side from authenticated user
  createdAt: true,
  updatedAt: true,
  status: true,
  isVip: true,
  slot: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Result = typeof results.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
