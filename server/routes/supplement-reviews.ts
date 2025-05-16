import { Router } from "express";
import { storage } from "../storage";
import { insertSupplementReviewSchema, insertReviewHelpfulVoteSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Get reviews for a supplement
router.get("/:supplementId", async (req, res) => {
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

// Submit a new review
router.post("/", async (req, res) => {
  try {
    // In a real app, you would get userId from the session
    // For prototype purposes, we'll use a placeholder user ID
    const userId = req.user?.id || 1;
    
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
    
    // Update supplement review statistics (average rating, etc.)
    await storage.updateSupplementReviewStatistics(validatedData.supplementId);
    
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid review data", errors: error.errors });
    }
    
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Failed to create review" });
  }
});

// Vote on a review (helpful/unhelpful)
router.post("/:reviewId/vote", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
    
    // In a real app, you would get userId from the session
    const userId = req.user?.id || 1;
    
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

export default router;