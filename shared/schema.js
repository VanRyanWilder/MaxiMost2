"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHeartRateDataSchema = exports.heartRateData = exports.insertSleepDataSchema = exports.sleepData = exports.insertBloodworkSchema = exports.bloodwork = exports.insertBodyStatSchema = exports.bodyStats = exports.insertSupplementVoteSchema = exports.supplementVotes = exports.insertReviewHelpfulVoteSchema = exports.reviewHelpfulVotes = exports.insertSupplementReviewSchema = exports.supplementReviews = exports.insertSupplementSchema = exports.supplements = exports.insertMotivationalContentSchema = exports.motivationalContent = exports.insertForumCommentSchema = exports.forumComments = exports.insertForumPostSchema = exports.forumPosts = exports.insertMetricSchema = exports.metrics = exports.insertResourceSchema = exports.resources = exports.insertUserTaskSchema = exports.userTasks = exports.insertTaskSchema = exports.tasks = exports.insertProgramSchema = exports.programs = exports.insertUserSchema = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// User model
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull().unique(),
    currentProgramId: (0, pg_core_1.integer)("current_program_id"),
    programStartDate: (0, pg_core_1.timestamp)("program_start_date"),
    programProgress: (0, pg_core_1.integer)("program_progress").default(0),
    // Authentication
    firebaseUid: (0, pg_core_1.text)("firebase_uid"),
    // Subscription information
    subscriptionTier: (0, pg_core_1.text)("subscription_tier").default("free"),
    subscriptionStatus: (0, pg_core_1.text)("subscription_status").default("active"),
    subscriptionStartDate: (0, pg_core_1.timestamp)("subscription_start_date"),
    subscriptionEndDate: (0, pg_core_1.timestamp)("subscription_end_date"),
    trialEndsAt: (0, pg_core_1.timestamp)("trial_ends_at"),
    // Payment processing
    stripeCustomerId: (0, pg_core_1.text)("stripe_customer_id"),
    stripeSubscriptionId: (0, pg_core_1.text)("stripe_subscription_id"),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
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
exports.programs = (0, pg_core_1.pgTable)("programs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    duration: (0, pg_core_1.integer)("duration").notNull(), // in weeks
    level: (0, pg_core_1.text)("level").notNull(), // beginner, intermediate, advanced
    features: (0, pg_core_1.jsonb)("features").notNull(), // array of features
    color: (0, pg_core_1.text)("color").notNull(), // for styling
    isPopular: (0, pg_core_1.boolean)("is_popular").default(false),
});
exports.insertProgramSchema = (0, drizzle_zod_1.createInsertSchema)(exports.programs).pick({
    name: true,
    description: true,
    duration: true,
    level: true,
    features: true,
    color: true,
    isPopular: true,
});
// Tasks model
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.text)("category").notNull(), // Mind, Body, Brain, Spirit, Health
    frequency: (0, pg_core_1.text)("frequency").notNull(), // Must-Do, 3x Weekly, 5x Weekly, etc.
    programId: (0, pg_core_1.integer)("program_id"),
});
exports.insertTaskSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tasks).pick({
    title: true,
    description: true,
    category: true,
    frequency: true,
    programId: true,
});
// User tasks for tracking completion
exports.userTasks = (0, pg_core_1.pgTable)("user_tasks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    taskId: (0, pg_core_1.integer)("task_id").notNull(),
    completed: (0, pg_core_1.boolean)("completed").default(false),
    date: (0, pg_core_1.timestamp)("date").notNull(),
});
exports.insertUserTaskSchema = (0, drizzle_zod_1.createInsertSchema)(exports.userTasks).pick({
    userId: true,
    taskId: true,
    completed: true,
    date: true,
});
// Resources model
exports.resources = (0, pg_core_1.pgTable)("resources", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // Philosophy, Nutrition, Fitness, Mindfulness, etc.
    content: (0, pg_core_1.text)("content").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url"),
});
exports.insertResourceSchema = (0, drizzle_zod_1.createInsertSchema)(exports.resources).pick({
    title: true,
    description: true,
    category: true,
    content: true,
    imageUrl: true,
});
// Metrics model for tracking user progress
exports.metrics = (0, pg_core_1.pgTable)("metrics", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    date: (0, pg_core_1.timestamp)("date").notNull(),
    workouts: (0, pg_core_1.integer)("workouts").default(0),
    sleepHours: (0, pg_core_1.integer)("sleep_hours").default(0),
    meditation: (0, pg_core_1.integer)("meditation").default(0),
    nutrition: (0, pg_core_1.text)("nutrition").default("Not tracked"),
});
exports.insertMetricSchema = (0, drizzle_zod_1.createInsertSchema)(exports.metrics).pick({
    userId: true,
    date: true,
    workouts: true,
    sleepHours: true,
    meditation: true,
    nutrition: true,
});
// Forum posts model for community message board
exports.forumPosts = (0, pg_core_1.pgTable)("forum_posts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    category: (0, pg_core_1.text)("category").notNull(), // Motivation, Nutrition, Workouts, Mindfulness, etc.
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    upvotes: (0, pg_core_1.integer)("upvotes").default(0),
    downvotes: (0, pg_core_1.integer)("downvotes").default(0),
    isPinned: (0, pg_core_1.boolean)("is_pinned").default(false),
});
exports.insertForumPostSchema = (0, drizzle_zod_1.createInsertSchema)(exports.forumPosts).pick({
    userId: true,
    title: true,
    content: true,
    category: true,
    isPinned: true,
});
// Forum comments model for replies to posts
exports.forumComments = (0, pg_core_1.pgTable)("forum_comments", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    postId: (0, pg_core_1.integer)("post_id").notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    upvotes: (0, pg_core_1.integer)("upvotes").default(0),
    downvotes: (0, pg_core_1.integer)("downvotes").default(0),
    isAnswer: (0, pg_core_1.boolean)("is_answer").default(false),
});
exports.insertForumCommentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.forumComments).pick({
    postId: true,
    userId: true,
    content: true,
    isAnswer: true,
});
// Daily motivational content
exports.motivationalContent = (0, pg_core_1.pgTable)("motivational_content", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    author: (0, pg_core_1.text)("author"),
    source: (0, pg_core_1.text)("source"),
    audioUrl: (0, pg_core_1.text)("audio_url"),
    type: (0, pg_core_1.text)("type").notNull(), // daily, weekly, challenge
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertMotivationalContentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.motivationalContent).pick({
    title: true,
    content: true,
    author: true,
    source: true,
    audioUrl: true,
    type: true,
});
// Supplements model
exports.supplements = (0, pg_core_1.pgTable)("supplements", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    benefits: (0, pg_core_1.text)("benefits").notNull(),
    dosage: (0, pg_core_1.text)("dosage").notNull(),
    sideEffects: (0, pg_core_1.text)("side_effects"),
    interactions: (0, pg_core_1.text)("interactions"),
    categories: (0, pg_core_1.text)("categories").notNull(), // Simplified to: "Essential,Performance,Daily,Foundational,Advanced,etc."
    upvotes: (0, pg_core_1.integer)("upvotes").default(0),
    downvotes: (0, pg_core_1.integer)("downvotes").default(0),
    totalReviews: (0, pg_core_1.integer)("total_reviews").default(0),
    averageRating: (0, pg_core_1.numeric)("average_rating").default("0"),
    valueRating: (0, pg_core_1.numeric)("value_rating").default("5.0"), // 1-10 scale, higher is better value
    monthlyCostEstimate: (0, pg_core_1.text)("monthly_cost_estimate").default("$15-30"),
    bestValue: (0, pg_core_1.boolean)("best_value").default(false), // Flag for best value supplements
    imageUrl: (0, pg_core_1.text)("image_url"),
    amazonUrl: (0, pg_core_1.text)("amazon_url"),
    expertInsights: (0, pg_core_1.jsonb)("expert_insights").default([]).notNull(), // Array of expert insights
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.insertSupplementSchema = (0, drizzle_zod_1.createInsertSchema)(exports.supplements).pick({
    name: true,
    description: true,
    benefits: true,
    dosage: true,
    sideEffects: true,
    interactions: true,
    categories: true,
    valueRating: true,
    monthlyCostEstimate: true,
    bestValue: true,
    imageUrl: true,
    amazonUrl: true,
    expertInsights: true,
});
// Supplement reviews
exports.supplementReviews = (0, pg_core_1.pgTable)("supplement_reviews", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    supplementId: (0, pg_core_1.integer)("supplement_id").notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    rating: (0, pg_core_1.integer)("rating").notNull(), // 1-5 star rating
    content: (0, pg_core_1.text)("content"),
    helpfulVotes: (0, pg_core_1.integer)("helpful_votes").default(0),
    unhelpfulVotes: (0, pg_core_1.integer)("unhelpful_votes").default(0),
    isVerifiedPurchase: (0, pg_core_1.boolean)("is_verified_purchase").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.insertSupplementReviewSchema = (0, drizzle_zod_1.createInsertSchema)(exports.supplementReviews).pick({
    supplementId: true,
    userId: true,
    rating: true,
    content: true,
    isVerifiedPurchase: true,
});
// Review helpful votes tracking
exports.reviewHelpfulVotes = (0, pg_core_1.pgTable)("review_helpful_votes", {
    reviewId: (0, pg_core_1.integer)("review_id").notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    isHelpful: (0, pg_core_1.boolean)("is_helpful").notNull(), // true for helpful, false for unhelpful
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.reviewId, table.userId] }),
    };
});
exports.insertReviewHelpfulVoteSchema = (0, drizzle_zod_1.createInsertSchema)(exports.reviewHelpfulVotes).pick({
    reviewId: true,
    userId: true,
    isHelpful: true,
});
// Supplement votes
exports.supplementVotes = (0, pg_core_1.pgTable)("supplement_votes", {
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    supplementId: (0, pg_core_1.integer)("supplement_id").notNull(),
    voteType: (0, pg_core_1.text)("vote_type").notNull(), // "up" or "down"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.userId, table.supplementId] }),
    };
});
exports.insertSupplementVoteSchema = (0, drizzle_zod_1.createInsertSchema)(exports.supplementVotes).pick({
    userId: true,
    supplementId: true,
    voteType: true,
});
// Body stats tracking
exports.bodyStats = (0, pg_core_1.pgTable)("body_stats", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    weight: (0, pg_core_1.numeric)("weight"), // in kg or lbs (user preference)
    bodyFat: (0, pg_core_1.numeric)("body_fat"), // percentage
    muscleMass: (0, pg_core_1.numeric)("muscle_mass"), // in kg or lbs
    waistCircumference: (0, pg_core_1.numeric)("waist_circumference"), // in cm or inches
    chestCircumference: (0, pg_core_1.numeric)("chest_circumference"), // in cm or inches
    armCircumference: (0, pg_core_1.numeric)("arm_circumference"), // in cm or inches
    legCircumference: (0, pg_core_1.numeric)("leg_circumference"), // in cm or inches
    source: (0, pg_core_1.text)("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertBodyStatSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bodyStats).pick({
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
exports.bloodwork = (0, pg_core_1.pgTable)("bloodwork", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    testName: (0, pg_core_1.text)("test_name").notNull(),
    results: (0, pg_core_1.jsonb)("results").notNull(), // JSON structure with markers, values, reference ranges
    provider: (0, pg_core_1.text)("provider"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertBloodworkSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bloodwork).pick({
    userId: true,
    date: true,
    testName: true,
    results: true,
    provider: true,
    notes: true,
});
// Sleep data tracking
exports.sleepData = (0, pg_core_1.pgTable)("sleep_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    totalDuration: (0, pg_core_1.integer)("total_duration"), // in minutes
    deepSleep: (0, pg_core_1.integer)("deep_sleep"), // in minutes
    remSleep: (0, pg_core_1.integer)("rem_sleep"), // in minutes
    lightSleep: (0, pg_core_1.integer)("light_sleep"), // in minutes
    awakeDuration: (0, pg_core_1.integer)("awake_duration"), // in minutes
    sleepScore: (0, pg_core_1.integer)("sleep_score"), // out of 100
    hrv: (0, pg_core_1.numeric)("hrv"), // in ms
    restingHeartRate: (0, pg_core_1.integer)("resting_heart_rate"), // bpm
    source: (0, pg_core_1.text)("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertSleepDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.sleepData).pick({
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
exports.heartRateData = (0, pg_core_1.pgTable)("heart_rate_data", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    date: (0, pg_core_1.date)("date").notNull(),
    restingHeartRate: (0, pg_core_1.integer)("resting_heart_rate"), // bpm
    maxHeartRate: (0, pg_core_1.integer)("max_heart_rate"), // bpm
    avgHeartRate: (0, pg_core_1.integer)("avg_heart_rate"), // bpm
    hrvMorning: (0, pg_core_1.numeric)("hrv_morning"), // ms
    hrvNight: (0, pg_core_1.numeric)("hrv_night"), // ms
    hrvAverage: (0, pg_core_1.numeric)("hrv_average"), // ms
    recoveryScore: (0, pg_core_1.integer)("recovery_score"), // out of 100
    source: (0, pg_core_1.text)("source").default("manual"), // "manual", "apple_health", "fitbit", etc.
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertHeartRateDataSchema = (0, drizzle_zod_1.createInsertSchema)(exports.heartRateData).pick({
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
//# sourceMappingURL=schema.js.map