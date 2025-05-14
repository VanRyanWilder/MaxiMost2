import type { Express } from "express";
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

export async function registerRoutes(app: Express): Promise<Server> {
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
    
    const reviews = await storage.getSupplementReviews(supplementId);
    res.json(reviews);
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

  const httpServer = createServer(app);
  return httpServer;
}
