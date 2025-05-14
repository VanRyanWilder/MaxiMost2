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
  // Authentication
  firebaseUid: text("firebase_uid"),
  // Subscription information
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionStatus: text("subscription_status").default("active"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  trialEndsAt: timestamp("trial_ends_at"),
  // Payment processing
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  currentProgramId: true,
  firebaseUid: true,
  subscriptionTier: true,
  subscriptionStatus: true,
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

// Forum posts model for community message board
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // Motivation, Nutrition, Workouts, Mindfulness, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isPinned: boolean("is_pinned").default(false),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  userId: true,
  title: true,
  content: true,
  category: true,
  isPinned: true,
});

// Forum comments model for replies to posts
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  isAnswer: boolean("is_answer").default(false),
});

export const insertForumCommentSchema = createInsertSchema(forumComments).pick({
  postId: true,
  userId: true,
  content: true,
  isAnswer: true,
});

// Daily motivational content
export const motivationalContent = pgTable("motivational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author"),
  source: text("source"),
  audioUrl: text("audio_url"),
  type: text("type").notNull(), // daily, weekly, challenge
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMotivationalContentSchema = createInsertSchema(motivationalContent).pick({
  title: true,
  content: true,
  author: true,
  source: true,
  audioUrl: true,
  type: true,
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

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

export type MotivationalContent = typeof motivationalContent.$inferSelect;
export type InsertMotivationalContent = z.infer<typeof insertMotivationalContentSchema>;
