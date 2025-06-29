import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertProgramSchema,
  insertTaskSchema,
  insertUserTaskSchema,
  insertResourceSchema,
  insertMetricSchema,
  insertSupplementSchema,
  insertSupplementReviewSchema,
  insertSupplementVoteSchema,
  insertReviewHelpfulVoteSchema,
  insertBodyStatSchema,
  insertBloodworkSchema
} from "@shared/schema";
import fetch from "node-fetch";
// Using native URLSearchParams for fetch requests
import { URLSearchParams as NodeURLSearchParams } from "url";
import path from "path";
import fs from "fs";

// Helper function to encode credentials for Basic Auth
const encodeCredentials = (clientId: string, clientSecret: string): string => {
  return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Remove this line as we're handling static files in index.ts

  // Landing page route for the "Fake Door" test
  app.get("/landing", (req, res) => {
    const landingPath = path.join(process.cwd(), 'public', 'landing.html');
    if (fs.existsSync(landingPath)) {
      res.sendFile(landingPath);
    } else {
      res.status(404).send('Landing page not found');
    }
  });

  // Also serve the landing page at the root URL for maximum visibility
  app.get("/", (req, res) => {
    const landingPath = path.join(process.cwd(), 'public', 'landing.html');
    if (fs.existsSync(landingPath)) {
      res.sendFile(landingPath);
    } else {
      res.status(404).send('Landing page not found');
    }
  });
  // Users routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);

      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id/program", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { programId } = req.body;
    if (typeof programId !== "number") {
      return res.status(400).json({ message: "Invalid program ID" });
    }

    const updatedUser = await storage.updateUserProgram(id, programId);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  });

  // Programs routes
  app.get("/api/programs", async (_req, res) => {
    const programs = await storage.getPrograms();
    res.json(programs);
  });

  app.get("/api/programs/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid program ID" });
    }

    const program = await storage.getProgram(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(program);
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const programData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    const { programId, category } = req.query;

    if (programId) {
      const id = parseInt(programId as string);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }

      const tasks = await storage.getTasksByProgram(id);
      return res.json(tasks);
    }

    if (category) {
      const tasks = await storage.getTasksByCategory(category as string);
      return res.json(tasks);
    }

    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await storage.getTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Tasks routes
  app.get("/api/user-tasks/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const dateParam = req.query.date as string;
    const date = dateParam ? new Date(dateParam) : new Date();

    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const userTasks = await storage.getUserTasks(userId, date);
    res.json(userTasks);
  });

  app.post("/api/user-tasks", async (req, res) => {
    try {
      const userTaskData = insertUserTaskSchema.parse(req.body);
      const userTask = await storage.createUserTask(userTaskData);
      res.status(201).json(userTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/user-tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user task ID" });
    }

    const { completed } = req.body;
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid completed status" });
    }

    const updatedUserTask = await storage.updateUserTask(id, completed);
    if (!updatedUserTask) {
      return res.status(404).json({ message: "User task not found" });
    }

    res.json(updatedUserTask);
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    const { category } = req.query;

    if (category) {
      const resources = await storage.getResourcesByCategory(category as string);
      return res.json(resources);
    }

    const resources = await storage.getResources();
    res.json(resources);
  });

  app.get("/api/resources/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }

    const resource = await storage.getResource(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Metrics routes
  app.get("/api/metrics/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const metrics = await storage.getUserMetrics(userId);
    res.json(metrics);
  });

  app.post("/api/metrics", async (req, res) => {
    try {
      const metricData = insertMetricSchema.parse(req.body);
      const metric = await storage.createMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/metrics/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid metric ID" });
    }

    try {
      const metricData = req.body;
      const updatedMetric = await storage.updateMetric(id, metricData);

      if (!updatedMetric) {
        return res.status(404).json({ message: "Metric not found" });
      }

      res.json(updatedMetric);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Supplements routes
  app.get("/api/supplements", async (req, res) => {
    const { category } = req.query;

    if (category) {
      const supplements = await storage.getSupplementsByCategory(category as string);
      return res.json(supplements);
    }

    const supplements = await storage.getSupplements();
    res.json(supplements);
  });

  app.get("/api/supplements/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid supplement ID" });
    }

    const supplement = await storage.getSupplement(id);
    if (!supplement) {
      return res.status(404).json({ message: "Supplement not found" });
    }

    res.json(supplement);
  });

  app.post("/api/supplements", async (req, res) => {
    try {
      const supplementData = insertSupplementSchema.parse(req.body);
      const supplement = await storage.createSupplement(supplementData);
      res.status(201).json(supplement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Supplement Reviews routes
  app.get("/api/supplements/:supplementId/reviews", async (req, res) => {
    const supplementId = parseInt(req.params.supplementId);
    if (isNaN(supplementId)) {
      return res.status(400).json({ message: "Invalid supplement ID" });
    }

    try {
      const reviews = await storage.getSupplementReviews(supplementId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching supplement reviews:", error);
      // Return empty array instead of failing
      res.json([]);
    }
  });

  app.post("/api/supplements/reviews", async (req, res) => {
    try {
      const reviewData = insertSupplementReviewSchema.parse(req.body);
      const review = await storage.createSupplementReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/supplements/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const { rating, content } = req.body;
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const existingReview = await storage.getSupplementReview(id);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      const updatedReview = await storage.updateSupplementReview(id, { rating, content });
      res.json(updatedReview);
    } catch (error) {
      console.error("Update review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/supplements/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      const existingReview = await storage.getSupplementReview(id);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      await storage.deleteSupplementReview(id);
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Delete review error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Review helpful votes routes
  app.get("/api/supplements/reviews/helpful/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const votes = await storage.getUserReviewHelpfulVotes(userId);
      res.json(votes);
    } catch (error) {
      console.error("Get helpful votes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/supplements/reviews/helpful", async (req, res) => {
    try {
      const voteData = insertReviewHelpfulVoteSchema.parse(req.body);

      // Check if user already voted on this review
      const existingVote = await storage.getReviewHelpfulVote(voteData.reviewId, voteData.userId);

      let vote;
      if (existingVote) {
        // Update existing vote if the helpful status is different
        if (existingVote.isHelpful !== voteData.isHelpful) {
          vote = await storage.updateReviewHelpfulVote(voteData.reviewId, voteData.userId, voteData.isHelpful);
        } else {
          vote = existingVote;
        }
      } else {
        // Create new vote
        vote = await storage.createReviewHelpfulVote(voteData);
      }

      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      console.error("Create helpful vote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get a specific vote
  app.get("/api/supplements/reviews/helpful/:reviewId/:userId", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const userId = parseInt(req.params.userId);

      if (isNaN(reviewId) || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid review ID or user ID" });
      }

      const vote = await storage.getReviewHelpfulVote(reviewId, userId);
      if (!vote) {
        return res.status(404).json({ message: "Vote not found" });
      }

      res.json(vote);
    } catch (error) {
      console.error("Get vote error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Supplement Votes routes
  app.post("/api/supplements/votes", async (req, res) => {
    try {
      const { userId, supplementId, voteType } = req.body;

      if (!userId || !supplementId || !voteType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (voteType !== "up" && voteType !== "down") {
        return res.status(400).json({ message: "Invalid vote type" });
      }

      // Check if user already voted
      const existingVote = await storage.getSupplementVote(userId, supplementId);

      if (existingVote) {
        // If vote type is the same, don't do anything
        if (existingVote.voteType === voteType) {
          return res.json(existingVote);
        }

        // Update existing vote
        const updatedVote = await storage.updateSupplementVote(userId, supplementId, voteType);
        return res.json(updatedVote);
      } else {
        // Create new vote
        const voteData = insertSupplementVoteSchema.parse({
          userId,
          supplementId,
          voteType
        });

        const vote = await storage.createSupplementVote(voteData);
        res.status(201).json(vote);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Body Stats routes
  app.get("/api/users/:userId/body-stats", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bodyStats = await storage.getUserBodyStats(userId);
    res.json(bodyStats);
  });

  app.get("/api/users/:userId/body-stats/latest", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const latestStats = await storage.getLatestBodyStat(userId);
    if (!latestStats) {
      return res.status(404).json({ message: "No body stats found for user" });
    }

    res.json(latestStats);
  });

  app.post("/api/body-stats", async (req, res) => {
    try {
      const bodyStatData = insertBodyStatSchema.parse(req.body);
      const bodyStat = await storage.createBodyStat(bodyStatData);
      res.status(201).json(bodyStat);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Bloodwork routes
  app.get("/api/users/:userId/bloodwork", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bloodworkResults = await storage.getUserBloodworkResults(userId);
    res.json(bloodworkResults);
  });

  app.get("/api/bloodwork/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid bloodwork ID" });
    }

    const bloodworkResult = await storage.getBloodworkResult(id);
    if (!bloodworkResult) {
      return res.status(404).json({ message: "Bloodwork result not found" });
    }

    res.json(bloodworkResult);
  });

  app.post("/api/bloodwork", async (req, res) => {
    try {
      const bloodworkData = insertBloodworkSchema.parse(req.body);
      const bloodworkResult = await storage.createBloodworkResult(bloodworkData);
      res.status(201).json(bloodworkResult);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Supplement Review routes - updated API endpoints for community review system
  app.get("/api/supplement-reviews/:supplementId", async (req, res) => {
    try {
      const supplementId = parseInt(req.params.supplementId);
      if (isNaN(supplementId)) {
        return res.status(400).json({ message: "Invalid supplement ID" });
      }

      const reviews = await storage.getSupplementReviews(supplementId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching supplement reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/supplement-reviews", async (req, res) => {
    try {
      // In a real app, you would get userId from the session
      // For prototype purposes, we'll use a placeholder user ID
      const userId = (req as any).user?.id || 1;

      const validatedData = insertSupplementReviewSchema.parse({
        ...req.body,
        userId,
      });

      // Check if user already reviewed this supplement
      const existingReviews = await storage.getSupplementReviews(validatedData.supplementId);
      const userAlreadyReviewed = existingReviews.some(review => review.userId === userId);

      if (userAlreadyReviewed) {
        return res.status(400).json({ message: "You have already reviewed this supplement" });
      }

      const review = await storage.createSupplementReview(validatedData);

      // Update supplement status with review counts
      await storage.updateSupplementReviewStatus(
        validatedData.supplementId,
        existingReviews.length + 1,
        (existingReviews.reduce((sum, r) => sum + r.rating, 0) + validatedData.rating) / (existingReviews.length + 1)
      );

      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }

      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.post("/api/supplement-reviews/:reviewId/vote", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }

      // In a real app, you would get userId from the session
      const userId = (req as any).user?.id || 1;

      const { isHelpful } = req.body;
      if (typeof isHelpful !== 'boolean') {
        return res.status(400).json({ message: "isHelpful must be a boolean" });
      }

      // Check if review exists
      const review = await storage.getSupplementReview(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Check if user already voted
      const existingVote = await storage.getReviewHelpfulVote(reviewId, userId);

      if (existingVote) {
        // Update existing vote
        await storage.updateReviewHelpfulVote(reviewId, userId, isHelpful);
      } else {
        // Create new vote
        await storage.createReviewHelpfulVote({
          reviewId,
          userId,
          isHelpful,
        });
      }

      res.json({ message: "Vote recorded successfully" });
    } catch (error) {
      console.error("Error processing vote:", error);
      res.status(500).json({ message: "Failed to process vote" });
    }
  });

  // Habit completion data for streak calculation
  app.get("/api/user/habit-completions", async (req, res) => {
    try {
      const { userId, days } = req.query;
      const userIdParsed = parseInt(userId as string);

      if (isNaN(userIdParsed)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Default to 90 days of history
      const daysToFetch = parseInt(days as string) || 90;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      // Get all user tasks in the date range
      const completions = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const userTasks = await storage.getUserTasks(userIdParsed, new Date(currentDate));

        // Format completion data for streak calculation
        completions.push({
          date: currentDate.toISOString(),
          // Consider the day completed if any task was completed
          completed: userTasks.some(userTask => userTask.completed)
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      res.json(completions);
    } catch (error) {
      console.error("Error fetching habit completion data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Fitness Tracker API Routes

  // Fitbit OAuth endpoints
  app.post("/api/fitness-trackers/fitbit/token", async (req, res) => {
    try {
      const { code, clientId, redirectUri } = req.body;

      if (!code || !clientId || !redirectUri) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      // Request Fitbit API key from user if not set
      if (!process.env.FITBIT_CLIENT_SECRET) {
        return res.status(400).json({
          message: "Fitbit client secret not configured. Please set FITBIT_CLIENT_SECRET environment variable."
        });
      }

      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);

      const response = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${encodeCredentials(clientId, process.env.FITBIT_CLIENT_SECRET)}`
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fitbit token exchange error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to exchange code for token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error exchanging Fitbit code for token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/fitness-trackers/fitbit/refresh", async (req, res) => {
    try {
      const { refreshToken, clientId } = req.body;

      if (!refreshToken || !clientId) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      // Request Fitbit API key from user if not set
      if (!process.env.FITBIT_CLIENT_SECRET) {
        return res.status(400).json({
          message: "Fitbit client secret not configured. Please set FITBIT_CLIENT_SECRET environment variable."
        });
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);

      const response = await fetch('https://api.fitbit.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${encodeCredentials(clientId, process.env.FITBIT_CLIENT_SECRET)}`
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fitbit token refresh error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to refresh token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error refreshing Fitbit token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Samsung Health OAuth endpoints
  app.post("/api/fitness-trackers/samsung-health/token", async (req, res) => {
    try {
      const { code, redirectUri, apiKey } = req.body;

      if (!code || !redirectUri || !apiKey) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('client_id', apiKey);

      const response = await fetch('https://api.health.samsung.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Samsung Health token exchange error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to exchange code for token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error exchanging Samsung Health code for token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/fitness-trackers/samsung-health/refresh", async (req, res) => {
    try {
      const { refreshToken, apiKey } = req.body;

      if (!refreshToken || !apiKey) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);
      params.append('client_id', apiKey);

      const response = await fetch('https://api.health.samsung.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Samsung Health token refresh error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to refresh token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error refreshing Samsung Health token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Apple Health endpoints
  app.post("/api/fitness-trackers/apple-health/sync", async (req, res) => {
    try {
      // Apple Health doesn't use OAuth - it uses HealthKit which is accessed directly from iOS
      // This endpoint receives data that's already been collected by the client
      const { healthData } = req.body;

      if (!healthData) {
        return res.status(400).json({ message: "Missing health data" });
      }

      // Process and store the Apple Health data
      // This would depend on your specific storage implementation

      res.json({ message: "Apple Health data synced successfully" });
    } catch (error) {
      console.error('Error syncing Apple Health data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Google Fit OAuth endpoints
  app.post("/api/fitness-trackers/google-fit/token", async (req, res) => {
    try {
      const { code, redirectUri } = req.body;

      if (!code || !redirectUri) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      // Request Google Fit API keys from user if not set
      if (!process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET) {
        return res.status(400).json({
          message: "Google Fit credentials not configured. Please set GOOGLE_FIT_CLIENT_ID and GOOGLE_FIT_CLIENT_SECRET environment variables."
        });
      }

      const params = new URLSearchParams();
      params.append('code', code);
      params.append('client_id', process.env.GOOGLE_FIT_CLIENT_ID);
      params.append('client_secret', process.env.GOOGLE_FIT_CLIENT_SECRET);
      params.append('redirect_uri', redirectUri);
      params.append('grant_type', 'authorization_code');

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Fit token exchange error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to exchange code for token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error exchanging Google Fit code for token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/fitness-trackers/google-fit/refresh", async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ message: "Missing refresh token" });
      }

      // Request Google Fit API keys from user if not set
      if (!process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET) {
        return res.status(400).json({
          message: "Google Fit credentials not configured. Please set GOOGLE_FIT_CLIENT_ID and GOOGLE_FIT_CLIENT_SECRET environment variables."
        });
      }

      const params = new URLSearchParams();
      params.append('refresh_token', refreshToken);
      params.append('client_id', process.env.GOOGLE_FIT_CLIENT_ID);
      params.append('client_secret', process.env.GOOGLE_FIT_CLIENT_SECRET);
      params.append('grant_type', 'refresh_token');

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Fit token refresh error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to refresh token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error refreshing Google Fit token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Garmin OAuth endpoints
  app.post("/api/fitness-trackers/garmin/token", async (req, res) => {
    try {
      const { oauth_token, oauth_verifier } = req.body;

      if (!oauth_token || !oauth_verifier) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      // Request Garmin API keys from user if not set
      if (!process.env.GARMIN_CONSUMER_KEY || !process.env.GARMIN_CONSUMER_SECRET) {
        return res.status(400).json({
          message: "Garmin credentials not configured. Please set GARMIN_CONSUMER_KEY and GARMIN_CONSUMER_SECRET environment variables."
        });
      }

      // Note: Garmin uses OAuth 1.0a which is more complex
      // In a full implementation, we would use a library like OAuth-1.0a to handle this
      // This is a simplified version for demonstration

      // Construct OAuth parameters (simplified)
      const params = new URLSearchParams();
      params.append('oauth_token', oauth_token);
      params.append('oauth_verifier', oauth_verifier);

      // In a real implementation, you would generate an OAuth signature here

      const response = await fetch('https://connectapi.garmin.com/oauth-service/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          // OAuth 1.0a Authorization header would be generated and added here
        },
        body: params
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Garmin token exchange error:', errorText);
        return res.status(response.status).json({
          message: 'Failed to exchange OAuth token',
          error: errorText
        });
      }

      // Garmin returns data in URL-encoded format, not JSON
      const responseText = await response.text();
      const tokenData = Object.fromEntries(new URLSearchParams(responseText));

      res.json({
        access_token: tokenData.oauth_token,
        token_secret: tokenData.oauth_token_secret,
        user_id: tokenData.user_id
      });
    } catch (error) {
      console.error('Error exchanging Garmin OAuth token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // MyFitnessPal OAuth endpoints
  app.post("/api/fitness-trackers/myfitnesspal/token", async (req, res) => {
    try {
      const { code, clientId, clientSecret, redirectUri } = req.body;

      if (!code || !clientId || !clientSecret || !redirectUri) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      const response = await fetch('https://auth.myfitnesspal.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('MyFitnessPal token exchange error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to exchange code for token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error exchanging MyFitnessPal code for token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/fitness-trackers/myfitnesspal/refresh", async (req, res) => {
    try {
      const { refreshToken, clientId, clientSecret } = req.body;

      if (!refreshToken || !clientId || !clientSecret) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);

      const response = await fetch('https://auth.myfitnesspal.com/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('MyFitnessPal token refresh error:', errorData);
        return res.status(response.status).json({
          message: 'Failed to refresh token',
          error: errorData
        });
      }

      const tokenData = await response.json();
      res.json(tokenData);
    } catch (error) {
      console.error('Error refreshing MyFitnessPal token:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
