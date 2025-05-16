import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, programs, tasks, userTasks, resources, metrics,
  forumPosts, forumComments, motivationalContent,
  supplements, supplementReviews, supplementVotes, reviewHelpfulVotes,
  bodyStats, bloodwork, sleepData, heartRateData,
  type User, type InsertUser,
  type Program, type InsertProgram,
  type Task, type InsertTask,
  type UserTask, type InsertUserTask,
  type Resource, type InsertResource,
  type Metric, type InsertMetric,
  type ForumPost, type InsertForumPost,
  type ForumComment, type InsertForumComment,
  type MotivationalContent, type InsertMotivationalContent,
  type Supplement, type InsertSupplement,
  type SupplementReview, type InsertSupplementReview,
  type SupplementVote, type InsertSupplementVote,
  type ReviewHelpfulVote, type InsertReviewHelpfulVote,
  type BodyStat, type InsertBodyStat,
  type Bloodwork, type InsertBloodwork,
  type SleepData, type InsertSleepData,
  type HeartRateData, type InsertHeartRateData
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserProgram(userId: number, programId: number): Promise<User | undefined> {
    const [updated] = await db
      .update(users)
      .set({
        currentProgramId: programId,
        programStartDate: new Date(),
        programProgress: 0
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // Program methods
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db.insert(programs).values(insertProgram).returning();
    return program;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTasksByProgram(programId: number): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.programId, programId));
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.category, category));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  // UserTask methods
  async getUserTasks(userId: number, date: Date): Promise<(UserTask & { task: Task })[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const userTasksList = await db.select()
      .from(userTasks)
      .where(
        eq(userTasks.userId, userId)
      )
      .execute();
    
    // Filter by date range manually
    const filteredUserTasks = userTasksList.filter(ut => {
      const utDate = new Date(ut.date);
      return utDate >= startOfDay && utDate <= endOfDay;
    });
    
    // If no user tasks found, return empty array
    if (filteredUserTasks.length === 0) {
      return [];
    }
    
    // Fetch tasks for the user tasks
    const taskIds = filteredUserTasks.map(ut => ut.taskId);
    
    // Get tasks individually to avoid using .in() operator
    const tasksPromises = taskIds.map(id => db.select().from(tasks).where(eq(tasks.id, id)).execute());
    const taskResults = await Promise.all(tasksPromises);
    
    // Flatten and filter out empty results
    const tasksList = taskResults.flatMap(result => result.length > 0 ? [result[0]] : []);
    
    // Map tasks to user tasks
    const tasksMap = new Map(tasksList.map(task => [task.id, task]));
    
    return filteredUserTasks.map(ut => {
      const task = tasksMap.get(ut.taskId);
      if (!task) throw new Error(`Task with id ${ut.taskId} not found`);
      return { ...ut, task };
    });
  }

  async createUserTask(insertUserTask: InsertUserTask): Promise<UserTask> {
    const [userTask] = await db.insert(userTasks).values(insertUserTask).returning();
    return userTask;
  }

  async updateUserTask(id: number, completed: boolean): Promise<UserTask | undefined> {
    const [updated] = await db
      .update(userTasks)
      .set({ completed })
      .where(eq(userTasks.id, id))
      .returning();
    return updated;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db.select().from(resources).where(eq(resources.category, category));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(insertResource).returning();
    return resource;
  }

  // Metric methods
  async getUserMetrics(userId: number): Promise<Metric[]> {
    return await db.select().from(metrics).where(eq(metrics.userId, userId));
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const [metric] = await db.insert(metrics).values(insertMetric).returning();
    return metric;
  }

  async updateMetric(id: number, metric: Partial<InsertMetric>): Promise<Metric | undefined> {
    const [updated] = await db
      .update(metrics)
      .set(metric)
      .where(eq(metrics.id, id))
      .returning();
    return updated;
  }

  // Forum Post methods
  async getForumPosts(): Promise<(ForumPost & { user: User })[]> {
    const posts = await db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt));
    
    // Get users individually to avoid using .in() operator
    const userPromises = posts.map(post => db.select().from(users).where(eq(users.id, post.userId)).execute());
    const userResults = await Promise.all(userPromises);
    
    // Create a map of user IDs to users
    const usersMap = new Map();
    userResults.forEach(result => {
      if (result.length > 0) {
        const user = result[0];
        usersMap.set(user.id, user);
      }
    });
    
    return posts.map(post => {
      const user = usersMap.get(post.userId);
      if (!user) throw new Error(`User with id ${post.userId} not found`);
      return { ...post, user };
    });
  }

  async getForumPostsByCategory(category: string): Promise<(ForumPost & { user: User })[]> {
    const posts = await db.select()
      .from(forumPosts)
      .where(eq(forumPosts.category, category))
      .orderBy(desc(forumPosts.createdAt));
    
    // Get users individually to avoid using .in() operator
    const userPromises = posts.map(post => db.select().from(users).where(eq(users.id, post.userId)).execute());
    const userResults = await Promise.all(userPromises);
    
    // Create a map of user IDs to users
    const usersMap = new Map();
    userResults.forEach(result => {
      if (result.length > 0) {
        const user = result[0];
        usersMap.set(user.id, user);
      }
    });
    
    return posts.map(post => {
      const user = usersMap.get(post.userId);
      if (!user) throw new Error(`User with id ${post.userId} not found`);
      return { ...post, user };
    });
  }

  async getForumPost(id: number): Promise<(ForumPost & { user: User }) | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    if (!post) return undefined;
    
    const [user] = await db.select().from(users).where(eq(users.id, post.userId));
    if (!user) throw new Error(`User with id ${post.userId} not found`);
    
    return { ...post, user };
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const [post] = await db.insert(forumPosts).values(insertPost).returning();
    return post;
  }

  async updateForumPostVotes(id: number, upvotes: number, downvotes: number): Promise<ForumPost | undefined> {
    const [updated] = await db
      .update(forumPosts)
      .set({ upvotes, downvotes })
      .where(eq(forumPosts.id, id))
      .returning();
    return updated;
  }

  // Forum Comment methods
  async getForumComments(postId: number): Promise<(ForumComment & { user: User })[]> {
    const comments = await db.select()
      .from(forumComments)
      .where(eq(forumComments.postId, postId))
      .orderBy(asc(forumComments.createdAt));
    
    // Fetch users for the comments
    const userIds = comments.map(comment => comment.userId);
    const usersList = userIds.length > 0 
      ? await db.select().from(users).where(sql`${users.id} IN (${userIds.join(',')})`)
      : [];
    
    // Map users to comments
    const usersMap = new Map(usersList.map(user => [user.id, user]));
    
    return comments.map(comment => {
      const user = usersMap.get(comment.userId);
      if (!user) throw new Error(`User with id ${comment.userId} not found`);
      return { ...comment, user };
    });
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const [comment] = await db.insert(forumComments).values(insertComment).returning();
    return comment;
  }

  async markCommentAsAnswer(id: number): Promise<ForumComment | undefined> {
    const [updated] = await db
      .update(forumComments)
      .set({ isAnswer: true })
      .where(eq(forumComments.id, id))
      .returning();
    return updated;
  }

  async updateCommentVotes(id: number, upvotes: number, downvotes: number): Promise<ForumComment | undefined> {
    const [updated] = await db
      .update(forumComments)
      .set({ upvotes, downvotes })
      .where(eq(forumComments.id, id))
      .returning();
    return updated;
  }

  // Motivational Content methods
  async getMotivationalContent(): Promise<MotivationalContent[]> {
    return await db.select().from(motivationalContent).orderBy(desc(motivationalContent.createdAt));
  }

  async getDailyMotivationalContent(): Promise<MotivationalContent | undefined> {
    const [content] = await db
      .select()
      .from(motivationalContent)
      .where(eq(motivationalContent.type, "daily"))
      .orderBy(desc(motivationalContent.createdAt))
      .limit(1);
    return content;
  }

  async createMotivationalContent(insertContent: InsertMotivationalContent): Promise<MotivationalContent> {
    const [content] = await db.insert(motivationalContent).values(insertContent).returning();
    return content;
  }

  // Supplement methods
  async getSupplements(): Promise<Supplement[]> {
    return await db.select({
      id: supplements.id,
      name: supplements.name,
      description: supplements.description,
      benefits: supplements.benefits,
      dosage: supplements.dosage,
      sideEffects: supplements.sideEffects,
      interactions: supplements.interactions,
      categories: supplements.categories,
      upvotes: supplements.upvotes,
      downvotes: supplements.downvotes,
      totalReviews: supplements.totalReviews,
      averageRating: supplements.averageRating,
      valueRating: supplements.valueRating,
      monthlyCostEstimate: supplements.monthlyCostEstimate,
      bestValue: supplements.bestValue,
      imageUrl: supplements.imageUrl,
      amazonUrl: supplements.amazonUrl,
      createdAt: supplements.createdAt,
      updatedAt: supplements.updatedAt
    })
    .from(supplements)
    .orderBy(desc(supplements.upvotes));
  }

  async getSupplementsByCategory(category: string): Promise<Supplement[]> {
    // Get all supplements and filter by category manually
    const allSupplements = await db
      .select({
        id: supplements.id,
        name: supplements.name,
        description: supplements.description,
        benefits: supplements.benefits,
        dosage: supplements.dosage,
        sideEffects: supplements.sideEffects,
        interactions: supplements.interactions,
        categories: supplements.categories,
        upvotes: supplements.upvotes,
        downvotes: supplements.downvotes,
        totalReviews: supplements.totalReviews,
        averageRating: supplements.averageRating,
        valueRating: supplements.valueRating,
        monthlyCostEstimate: supplements.monthlyCostEstimate,
        bestValue: supplements.bestValue,
        imageUrl: supplements.imageUrl,
        amazonUrl: supplements.amazonUrl,
        createdAt: supplements.createdAt,
        updatedAt: supplements.updatedAt
      })
      .from(supplements)
      .orderBy(desc(supplements.upvotes))
      .execute();
    
    // Filter supplements where the category is included in the comma-separated categories list
    return allSupplements.filter(supplement => 
      supplement.categories.split(',').map(cat => cat.trim()).includes(category) ||
      supplement.categories.includes(category)
    );
  }

  async getSupplement(id: number): Promise<Supplement | undefined> {
    const [supplement] = await db.select().from(supplements).where(eq(supplements.id, id));
    return supplement;
  }

  async createSupplement(insertSupplement: InsertSupplement): Promise<Supplement> {
    const [supplement] = await db.insert(supplements).values(insertSupplement).returning();
    return supplement;
  }

  async updateSupplementVotes(id: number, upvotes: number, downvotes: number): Promise<Supplement | undefined> {
    const [updated] = await db
      .update(supplements)
      .set({ upvotes, downvotes })
      .where(eq(supplements.id, id))
      .returning();
    return updated;
  }

  // Supplement Review methods
  async getSupplementReviews(supplementId: number): Promise<(SupplementReview & { user: User })[]> {
    try {
      // Use raw SQL to get only the columns that exist in the database
      const result = await db.execute(sql`
        SELECT 
          id, 
          supplement_id as "supplementId", 
          user_id as "userId", 
          rating, 
          content, 
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM supplement_reviews
        WHERE supplement_id = ${supplementId}
        ORDER BY created_at DESC
      `);
      
      // Convert result to array of objects
      const rawReviews = Array.isArray(result) ? result : (result.rows || []);
      
      // Add default values for missing columns
      const reviews = rawReviews.map((row: any) => ({
        ...row,
        helpfulVotes: 0,
        unhelpfulVotes: 0,
        isVerifiedPurchase: false
      }));
      
      if (reviews.length === 0) {
        return [];
      }
      
      // Fetch users for the reviews
      const userIds = reviews.map(review => review.userId);
      const usersList = userIds.length > 0 
        ? await db.select().from(users).where(sql`${users.id} IN (${userIds.join(',')})`)
        : [];
      
      // Map users to reviews
      const usersMap = new Map(usersList.map(user => [user.id, user]));
      
      return reviews.map(review => {
        const user = usersMap.get(review.userId);
        if (!user) {
          console.warn(`User with id ${review.userId} not found for review ${review.id}`);
          // Return review without user rather than failing
          return { 
            ...review, 
            user: { 
              id: review.userId, 
              username: 'Unknown User', 
              name: 'Unknown',
              email: '',
              password: '' 
            } as User 
          };
        }
        return { ...review, user };
      });
    } catch (error) {
      console.error('Error in getSupplementReviews:', error);
      return []; // Return empty array instead of failing
    }
  }

  async getSupplementReview(id: number): Promise<SupplementReview | undefined> {
    try {
      // Use raw SQL to get only the columns that exist in the database
      const result = await db.execute(sql`
        SELECT 
          id, 
          supplement_id as "supplementId", 
          user_id as "userId", 
          rating, 
          content, 
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM supplement_reviews
        WHERE id = ${id}
      `);
      
      // Convert result to array of objects
      const rawReviews = Array.isArray(result) ? result : (result.rows || []);
      
      if (!rawReviews || rawReviews.length === 0) {
        return undefined;
      }
      
      // Add default values for missing columns
      return {
        ...rawReviews[0],
        helpfulVotes: 0,
        unhelpfulVotes: 0,
        isVerifiedPurchase: false
      };
    } catch (error) {
      console.error('Error in getSupplementReview:', error);
      return undefined;
    }
  }

  async createSupplementReview(insertReview: InsertSupplementReview): Promise<SupplementReview> {
    const [review] = await db.insert(supplementReviews).values(insertReview).returning();
    
    // Update the supplement's review statistics
    await this.updateSupplementReviewStatistics(review.supplementId);
    
    return review;
  }

  async updateSupplementReview(id: number, data: { rating: number, content: string | null }): Promise<SupplementReview | undefined> {
    // Get the existing review to get the supplementId
    const existingReview = await this.getSupplementReview(id);
    if (!existingReview) return undefined;
    
    // Update the review
    const [updatedReview] = await db
      .update(supplementReviews)
      .set({
        rating: data.rating,
        content: data.content,
        updatedAt: new Date()
      })
      .where(eq(supplementReviews.id, id))
      .returning();
    
    // Update the supplement statistics
    if (updatedReview) {
      await this.updateSupplementReviewStatistics(updatedReview.supplementId);
    }
    
    return updatedReview;
  }
  
  async deleteSupplementReview(id: number): Promise<void> {
    // Get the existing review to get the supplementId
    const existingReview = await this.getSupplementReview(id);
    if (!existingReview) return;
    
    const supplementId = existingReview.supplementId;
    
    // Delete any helpful votes related to this review
    await db
      .delete(reviewHelpfulVotes)
      .where(eq(reviewHelpfulVotes.reviewId, id));
    
    // Delete the review
    await db
      .delete(supplementReviews)
      .where(eq(supplementReviews.id, id));
    
    // Update supplement statistics
    await this.updateSupplementReviewStatistics(supplementId);
  }
  
  async updateSupplementReviewStatus(supplementId: number, totalReviews: number, averageRating: number): Promise<Supplement | undefined> {
    const [updated] = await db
      .update(supplements)
      .set({ 
        totalReviews,
        averageRating: averageRating.toString() // Convert to string for numeric type
      })
      .where(eq(supplements.id, supplementId))
      .returning();
    return updated;
  }

  // Helper method to update supplement review statistics
  private async updateSupplementReviewStatistics(supplementId: number): Promise<void> {
    // Get all reviews for this supplement
    const reviews = await db
      .select()
      .from(supplementReviews)
      .where(eq(supplementReviews.supplementId, supplementId));
    
    // Calculate average rating
    const totalReviews = reviews.length;
    let totalRating = 0;
    
    reviews.forEach(review => {
      totalRating += review.rating;
    });
    
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
    
    // Update the supplement
    await this.updateSupplementReviewStatus(supplementId, totalReviews, averageRating);
  }
  
  // Review Helpful Votes methods
  async getUserReviewHelpfulVotes(userId: number): Promise<ReviewHelpfulVote[]> {
    return await db
      .select()
      .from(reviewHelpfulVotes)
      .where(eq(reviewHelpfulVotes.userId, userId));
  }
  
  async getReviewHelpfulVote(reviewId: number, userId: number): Promise<ReviewHelpfulVote | undefined> {
    const [vote] = await db
      .select()
      .from(reviewHelpfulVotes)
      .where(and(
        eq(reviewHelpfulVotes.reviewId, reviewId),
        eq(reviewHelpfulVotes.userId, userId)
      ));
    return vote;
  }
  
  async createReviewHelpfulVote(vote: InsertReviewHelpfulVote): Promise<ReviewHelpfulVote> {
    const [newVote] = await db
      .insert(reviewHelpfulVotes)
      .values(vote)
      .returning();
    
    // Update the helpful/unhelpful counts on the review
    await this.updateReviewHelpfulCounts(newVote.reviewId);
    
    return newVote;
  }
  
  async updateReviewHelpfulVote(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpfulVote | undefined> {
    const [updatedVote] = await db
      .update(reviewHelpfulVotes)
      .set({ isHelpful })
      .where(and(
        eq(reviewHelpfulVotes.reviewId, reviewId),
        eq(reviewHelpfulVotes.userId, userId)
      ))
      .returning();
    
    // Update the helpful/unhelpful counts on the review
    if (updatedVote) {
      await this.updateReviewHelpfulCounts(reviewId);
    }
    
    return updatedVote;
  }
  
  // Helper method to update helpful/unhelpful vote counts
  private async updateReviewHelpfulCounts(reviewId: number): Promise<void> {
    // Count helpful votes
    const helpfulResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviewHelpfulVotes)
      .where(and(
        eq(reviewHelpfulVotes.reviewId, reviewId),
        eq(reviewHelpfulVotes.isHelpful, true)
      ));
    
    // Count unhelpful votes
    const unhelpfulResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviewHelpfulVotes)
      .where(and(
        eq(reviewHelpfulVotes.reviewId, reviewId),
        eq(reviewHelpfulVotes.isHelpful, false)
      ));
    
    const helpfulVotes = helpfulResult[0]?.count || 0;
    const unhelpfulVotes = unhelpfulResult[0]?.count || 0;
    
    // Update the review
    await db
      .update(supplementReviews)
      .set({
        helpfulVotes,
        unhelpfulVotes,
        updatedAt: new Date()
      })
      .where(eq(supplementReviews.id, reviewId));
  }

  // Supplement Vote methods
  async getSupplementVote(userId: number, supplementId: number): Promise<SupplementVote | undefined> {
    const [vote] = await db
      .select()
      .from(supplementVotes)
      .where(
        and(
          eq(supplementVotes.userId, userId),
          eq(supplementVotes.supplementId, supplementId)
        )
      );
    return vote;
  }

  async createSupplementVote(insertVote: InsertSupplementVote): Promise<SupplementVote> {
    const [vote] = await db.insert(supplementVotes).values(insertVote).returning();
    
    // Update supplement vote counts
    await this.updateSupplementVoteCounts(vote.supplementId);
    
    return vote;
  }

  async updateSupplementVote(userId: number, supplementId: number, voteType: string): Promise<SupplementVote | undefined> {
    const [updated] = await db
      .update(supplementVotes)
      .set({ voteType })
      .where(
        and(
          eq(supplementVotes.userId, userId),
          eq(supplementVotes.supplementId, supplementId)
        )
      )
      .returning();
    
    if (updated) {
      // Update supplement vote counts
      await this.updateSupplementVoteCounts(supplementId);
    }
    
    return updated;
  }

  // Helper method to update supplement vote counts
  private async updateSupplementVoteCounts(supplementId: number): Promise<void> {
    // Count upvotes
    const upvoteResult = await db
      .select({ count: supplements.upvotes })
      .from(supplementVotes)
      .where(
        and(
          eq(supplementVotes.supplementId, supplementId),
          eq(supplementVotes.voteType, "up")
        )
      );
    
    // Count downvotes
    const downvoteResult = await db
      .select({ count: supplements.downvotes })
      .from(supplementVotes)
      .where(
        and(
          eq(supplementVotes.supplementId, supplementId),
          eq(supplementVotes.voteType, "down")
        )
      );
    
    const upvotes = upvoteResult.length;
    const downvotes = downvoteResult.length;
    
    // Update the supplement
    await this.updateSupplementVotes(supplementId, upvotes, downvotes);
  }
  
  // Body Stats methods
  async getUserBodyStats(userId: number): Promise<BodyStat[]> {
    return await db
      .select()
      .from(bodyStats)
      .where(eq(bodyStats.userId, userId))
      .orderBy(desc(bodyStats.date));
  }

  async getLatestBodyStat(userId: number): Promise<BodyStat | undefined> {
    const [stat] = await db
      .select()
      .from(bodyStats)
      .where(eq(bodyStats.userId, userId))
      .orderBy(desc(bodyStats.date))
      .limit(1);
    return stat;
  }

  async createBodyStat(insertStat: InsertBodyStat): Promise<BodyStat> {
    const [stat] = await db.insert(bodyStats).values(insertStat).returning();
    return stat;
  }

  // Bloodwork methods
  async getUserBloodworkResults(userId: number): Promise<Bloodwork[]> {
    return await db
      .select()
      .from(bloodwork)
      .where(eq(bloodwork.userId, userId))
      .orderBy(desc(bloodwork.date));
  }

  async getBloodworkResult(id: number): Promise<Bloodwork | undefined> {
    const [result] = await db.select().from(bloodwork).where(eq(bloodwork.id, id));
    return result;
  }

  async createBloodworkResult(insertBloodwork: InsertBloodwork): Promise<Bloodwork> {
    const [result] = await db.insert(bloodwork).values(insertBloodwork).returning();
    return result;
  }

  // Sleep Data methods
  async getUserSleepData(userId: number): Promise<SleepData[]> {
    return await db
      .select()
      .from(sleepData)
      .where(eq(sleepData.userId, userId))
      .orderBy(desc(sleepData.date));
  }

  async getLatestSleepData(userId: number): Promise<SleepData | undefined> {
    const [data] = await db
      .select()
      .from(sleepData)
      .where(eq(sleepData.userId, userId))
      .orderBy(desc(sleepData.date))
      .limit(1);
    return data;
  }

  async createSleepData(insertData: InsertSleepData): Promise<SleepData> {
    const [data] = await db.insert(sleepData).values(insertData).returning();
    return data;
  }

  // Heart Rate Data methods
  async getUserHeartRateData(userId: number): Promise<HeartRateData[]> {
    return await db
      .select()
      .from(heartRateData)
      .where(eq(heartRateData.userId, userId))
      .orderBy(desc(heartRateData.date));
  }

  async getLatestHeartRateData(userId: number): Promise<HeartRateData | undefined> {
    const [data] = await db
      .select()
      .from(heartRateData)
      .where(eq(heartRateData.userId, userId))
      .orderBy(desc(heartRateData.date))
      .limit(1);
    return data;
  }

  async createHeartRateData(insertData: InsertHeartRateData): Promise<HeartRateData> {
    const [data] = await db.insert(heartRateData).values(insertData).returning();
    return data;
  }
}