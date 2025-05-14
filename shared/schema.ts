import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric, date, primaryKey } from "drizzle-orm/pg-core";
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

// Supplements model
export const supplements = pgTable("supplements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(),
  dosage: text("dosage").notNull(),
  sideEffects: text("side_effects"),
  interactions: text("interactions"),
  categories: text("categories").notNull(), // Comma-separated categories like: "nootropic,amino-acid,vitamin,mineral"
  upvotes: integer("upvotes").default(0),
  downvotes: integer("downvotes").default(0),
  totalReviews: integer("total_reviews").default(0),
  averageRating: numeric("average_rating").default("0"),
  imageUrl: text("image_url"),
  amazonUrl: text("amazon_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSupplementSchema = createInsertSchema(supplements).pick({
  name: true,
  description: true,
  benefits: true,
  dosage: true,
  sideEffects: true,
  interactions: true,
  categories: true,
  imageUrl: true,
  amazonUrl: true,
});

// Supplement reviews
export const supplementReviews = pgTable("supplement_reviews", {
  id: serial("id").primaryKey(),
  supplementId: integer("supplement_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 star rating
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSupplementReviewSchema = createInsertSchema(supplementReviews).pick({
  supplementId: true,
  userId: true,
  rating: true,
  content: true,
});

// Supplement votes
export const supplementVotes = pgTable("supplement_votes", {
  userId: integer("user_id").notNull(),
  supplementId: integer("supplement_id").notNull(),
  voteType: text("vote_type").notNull(), // "up" or "down"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.userId, table.supplementId] }),
  };
});

export const insertSupplementVoteSchema = createInsertSchema(supplementVotes).pick({
  userId: true,
  supplementId: true,
  voteType: true,
});

// Body stats tracking
export const bodyStats = pgTable("body_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  weight: numeric("weight"), // in kg or lbs (user preference)
  bodyFat: numeric("body_fat"), // percentage
  muscleMass: numeric("muscle_mass"), // in kg or lbs
  waistCircumference: numeric("waist_circumference"), // in cm or inches
  chestCircumference: numeric("chest_circumference"), // in cm or inches
  armCircumference: numeric("arm_circumference"), // in cm or inches
  legCircumference: numeric("leg_circumference"), // in cm or inches
  source: text("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBodyStatSchema = createInsertSchema(bodyStats).pick({
  userId: true,
  date: true,
  weight: true,
  bodyFat: true,
  muscleMass: true,
  waistCircumference: true,
  chestCircumference: true,
  armCircumference: true,
  legCircumference: true,
  source: true,
  notes: true,
});

// Blood work results
export const bloodwork = pgTable("bloodwork", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  testName: text("test_name").notNull(),
  results: jsonb("results").notNull(), // JSON structure with markers, values, reference ranges
  provider: text("provider"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBloodworkSchema = createInsertSchema(bloodwork).pick({
  userId: true,
  date: true,
  testName: true,
  results: true,
  provider: true,
  notes: true,
});

// Sleep data tracking
export const sleepData = pgTable("sleep_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  totalDuration: integer("total_duration"), // in minutes
  deepSleep: integer("deep_sleep"), // in minutes
  remSleep: integer("rem_sleep"), // in minutes
  lightSleep: integer("light_sleep"), // in minutes
  awakeDuration: integer("awake_duration"), // in minutes
  sleepScore: integer("sleep_score"), // out of 100
  hrv: numeric("hrv"), // in ms
  restingHeartRate: integer("resting_heart_rate"), // bpm
  source: text("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSleepDataSchema = createInsertSchema(sleepData).pick({
  userId: true,
  date: true,
  totalDuration: true,
  deepSleep: true,
  remSleep: true,
  lightSleep: true,
  awakeDuration: true,
  sleepScore: true,
  hrv: true,
  restingHeartRate: true,
  source: true,
  notes: true,
});

// Heart rate data tracking
export const heartRateData = pgTable("heart_rate_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  restingHeartRate: integer("resting_heart_rate"), // bpm
  maxHeartRate: integer("max_heart_rate"), // bpm
  avgHeartRate: integer("avg_heart_rate"), // bpm
  hrvMorning: numeric("hrv_morning"), // ms
  hrvNight: numeric("hrv_night"), // ms
  hrvAverage: numeric("hrv_average"), // ms
  recoveryScore: integer("recovery_score"), // out of 100
  source: text("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHeartRateDataSchema = createInsertSchema(heartRateData).pick({
  userId: true,
  date: true,
  restingHeartRate: true,
  maxHeartRate: true,
  avgHeartRate: true,
  hrvMorning: true,
  hrvNight: true,
  hrvAverage: true,
  recoveryScore: true,
  source: true,
  notes: true,
});

// Export types for new models
export type Supplement = typeof supplements.$inferSelect;
export type InsertSupplement = z.infer<typeof insertSupplementSchema>;

export type SupplementReview = typeof supplementReviews.$inferSelect;
export type InsertSupplementReview = z.infer<typeof insertSupplementReviewSchema>;

export type SupplementVote = typeof supplementVotes.$inferSelect;
export type InsertSupplementVote = z.infer<typeof insertSupplementVoteSchema>;

export type BodyStat = typeof bodyStats.$inferSelect;
export type InsertBodyStat = z.infer<typeof insertBodyStatSchema>;

export type Bloodwork = typeof bloodwork.$inferSelect;
export type InsertBloodwork = z.infer<typeof insertBloodworkSchema>;

export type SleepData = typeof sleepData.$inferSelect;
export type InsertSleepData = z.infer<typeof insertSleepDataSchema>;

export type HeartRateData = typeof heartRateData.$inferSelect;
export type InsertHeartRateData = z.infer<typeof insertHeartRateDataSchema>;
