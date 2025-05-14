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
  insertMetricSchema 
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

  const httpServer = createServer(app);
  return httpServer;
}
