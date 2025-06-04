import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scales = pgTable("scales", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  intervals: jsonb("intervals").notNull().$type<number[]>(),
  description: text("description").notNull(),
  formula: text("formula").notNull(),
  usage: text("usage").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScaleSchema = createInsertSchema(scales).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScale = z.infer<typeof insertScaleSchema>;
export type Scale = typeof scales.$inferSelect;
