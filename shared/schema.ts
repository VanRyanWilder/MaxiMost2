import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  currentProgramId: integer("current_program_id"),
  programStartDate: timestamp("program_start_date"),
  programProgress: integer("program_progress").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  currentProgramId: true,
});

// Programs model
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in weeks
  level: text("level").notNull(), // beginner, intermediate, advanced
  features: jsonb("features").notNull(), // array of features
  color: text("color").notNull(), // for styling
  isPopular: boolean("is_popular").default(false),
});

export const insertProgramSchema = createInsertSchema(programs).pick({
  name: true,
  description: true,
  duration: true,
  level: true,
  features: true,
  color: true,
  isPopular: true,
});

// Tasks model
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Mind, Body, Brain, Spirit, Health
  frequency: text("frequency").notNull(), // Must-Do, 3x Weekly, 5x Weekly, etc.
  programId: integer("program_id"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  category: true,
  frequency: true,
  programId: true,
});

// User tasks for tracking completion
export const userTasks = pgTable("user_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  completed: boolean("completed").default(false),
  date: timestamp("date").notNull(),
});

export const insertUserTaskSchema = createInsertSchema(userTasks).pick({
  userId: true,
  taskId: true,
  completed: true,
  date: true,
});

// Resources model
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Philosophy, Nutrition, Fitness, Mindfulness, etc.
  content: text("content").notNull(),
  imageUrl: text("image_url"),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  category: true,
  content: true,
  imageUrl: true,
});

// Metrics model for tracking user progress
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  workouts: integer("workouts").default(0),
  sleepHours: integer("sleep_hours").default(0),
  meditation: integer("meditation").default(0),
  nutrition: text("nutrition").default("Not tracked"),
});

export const insertMetricSchema = createInsertSchema(metrics).pick({
  userId: true,
  date: true,
  workouts: true,
  sleepHours: true,
  meditation: true,
  nutrition: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type UserTask = typeof userTasks.$inferSelect;
export type InsertUserTask = z.infer<typeof insertUserTaskSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
