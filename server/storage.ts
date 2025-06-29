import {
  users, tasks, programs, resources, userTasks, metrics,
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

// Interface for all storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProgram(userId: number, programId: number): Promise<User | undefined>;

  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;

  // Task methods
  getTasks(): Promise<Task[]>;
  getTasksByProgram(programId: number): Promise<Task[]>;
  getTasksByCategory(category: string): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;

  // UserTask methods
  getUserTasks(userId: number, date: Date): Promise<(UserTask & { task: Task })[]>;
  createUserTask(userTask: InsertUserTask): Promise<UserTask>;
  updateUserTask(id: number, completed: boolean): Promise<UserTask | undefined>;

  // Resource methods
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Metric methods
  getUserMetrics(userId: number): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  updateMetric(id: number, metric: Partial<InsertMetric>): Promise<Metric | undefined>;

  // Forum Post methods
  getForumPosts(): Promise<(ForumPost & { user: User })[]>;
  getForumPostsByCategory(category: string): Promise<(ForumPost & { user: User })[]>;
  getForumPost(id: number): Promise<(ForumPost & { user: User }) | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPostVotes(id: number, upvotes: number, downvotes: number): Promise<ForumPost | undefined>;

  // Forum Comment methods
  getForumComments(postId: number): Promise<(ForumComment & { user: User })[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;
  markCommentAsAnswer(id: number): Promise<ForumComment | undefined>;
  updateCommentVotes(id: number, upvotes: number, downvotes: number): Promise<ForumComment | undefined>;

  // Motivational Content methods
  getMotivationalContent(): Promise<MotivationalContent[]>;
  getDailyMotivationalContent(): Promise<MotivationalContent | undefined>;
  createMotivationalContent(content: InsertMotivationalContent): Promise<MotivationalContent>;

  // Supplement methods
  getSupplements(): Promise<Supplement[]>;
  getSupplementsByCategory(category: string): Promise<Supplement[]>;
  getSupplement(id: number): Promise<Supplement | undefined>;
  createSupplement(supplement: InsertSupplement): Promise<Supplement>;
  updateSupplementVotes(id: number, upvotes: number, downvotes: number): Promise<Supplement | undefined>;

  // Supplement Review methods
  getSupplementReviews(supplementId: number): Promise<(SupplementReview & { user: User })[]>;
  getSupplementReview(id: number): Promise<SupplementReview | undefined>;
  createSupplementReview(review: InsertSupplementReview): Promise<SupplementReview>;
  updateSupplementReview(id: number, data: { rating: number, content: string | null }): Promise<SupplementReview | undefined>;
  deleteSupplementReview(id: number): Promise<void>;
  updateSupplementReviewStatus(supplementId: number, totalReviews: number, averageRating: number): Promise<Supplement | undefined>;

  // Review Helpful Votes methods
  getUserReviewHelpfulVotes(userId: number): Promise<ReviewHelpfulVote[]>;
  getReviewHelpfulVote(reviewId: number, userId: number): Promise<ReviewHelpfulVote | undefined>;
  createReviewHelpfulVote(vote: InsertReviewHelpfulVote): Promise<ReviewHelpfulVote>;
  updateReviewHelpfulVote(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpfulVote | undefined>;

  // Supplement Vote methods
  getSupplementVote(userId: number, supplementId: number): Promise<SupplementVote | undefined>;
  createSupplementVote(vote: InsertSupplementVote): Promise<SupplementVote>;
  updateSupplementVote(userId: number, supplementId: number, voteType: string): Promise<SupplementVote | undefined>;

  // Body Stats methods
  getUserBodyStats(userId: number): Promise<BodyStat[]>;
  getLatestBodyStat(userId: number): Promise<BodyStat | undefined>;
  createBodyStat(stat: InsertBodyStat): Promise<BodyStat>;

  // Bloodwork methods
  getUserBloodworkResults(userId: number): Promise<Bloodwork[]>;
  getBloodworkResult(id: number): Promise<Bloodwork | undefined>;
  createBloodworkResult(bloodwork: InsertBloodwork): Promise<Bloodwork>;

  // Sleep Data methods
  getUserSleepData(userId: number): Promise<SleepData[]>;
  getLatestSleepData(userId: number): Promise<SleepData | undefined>;
  createSleepData(data: InsertSleepData): Promise<SleepData>;

  // Heart Rate Data methods
  getUserHeartRateData(userId: number): Promise<HeartRateData[]>;
  getLatestHeartRateData(userId: number): Promise<HeartRateData | undefined>;
  createHeartRateData(data: InsertHeartRateData): Promise<HeartRateData>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private programs: Map<number, Program>;
  private tasks: Map<number, Task>;
  private userTasks: Map<number, UserTask>;
  private resources: Map<number, Resource>;
  private metrics: Map<number, Metric>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private motivationalContents: Map<number, MotivationalContent>;

  private userIdCounter: number;
  private programIdCounter: number;
  private taskIdCounter: number;
  private userTaskIdCounter: number;
  private resourceIdCounter: number;
  private metricIdCounter: number;
  private forumPostIdCounter: number;
  private forumCommentIdCounter: number;
  private motivationalContentIdCounter: number;

  // Supplement related storage
  private supplements: Map<number, Supplement>;
  private supplementReviews: Map<number, SupplementReview>;
  private supplementVotes: Map<number, SupplementVote>;
  private reviewHelpfulVotes: Map<string, ReviewHelpfulVote>;

  // Body stats and health data storage
  private bodyStats: Map<number, BodyStat>;
  private bloodworkResults: Map<number, Bloodwork>;
  private sleepDataEntries: Map<number, SleepData>;
  private heartRateDataEntries: Map<number, HeartRateData>;

  // Additional ID counters
  private supplementIdCounter: number;
  private supplementReviewIdCounter: number;
  private bodyStatIdCounter: number;
  private bloodworkIdCounter: number;
  private sleepDataIdCounter: number;
  private heartRateDataIdCounter: number;

  constructor() {
    this.users = new Map();
    this.programs = new Map();
    this.tasks = new Map();
    this.userTasks = new Map();
    this.resources = new Map();
    this.metrics = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.motivationalContents = new Map();
    this.supplements = new Map();
    this.supplementReviews = new Map();
    this.supplementVotes = new Map();
    this.reviewHelpfulVotes = new Map();
    this.bodyStats = new Map();
    this.bloodworkResults = new Map();
    this.sleepDataEntries = new Map();
    this.heartRateDataEntries = new Map();

    this.userIdCounter = 1;
    this.programIdCounter = 1;
    this.taskIdCounter = 1;
    this.userTaskIdCounter = 1;
    this.resourceIdCounter = 1;
    this.metricIdCounter = 1;
    this.forumPostIdCounter = 1;
    this.forumCommentIdCounter = 1;
    this.motivationalContentIdCounter = 1;
    this.supplementIdCounter = 1;
    this.supplementReviewIdCounter = 1;
    this.bodyStatIdCounter = 1;
    this.bloodworkIdCounter = 1;
    this.sleepDataIdCounter = 1;
    this.heartRateDataIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserProgram(userId: number, programId: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      currentProgramId: programId,
      programStartDate: new Date(),
      programProgress: 0
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Program methods
  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }

  async getProgram(id: number): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.programIdCounter++;
    const program: Program = { ...insertProgram, id };
    this.programs.set(id, program);
    return program;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByProgram(programId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.programId === programId
    );
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.category === category
    );
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  // UserTask methods
  async getUserTasks(userId: number, date: Date): Promise<(UserTask & { task: Task })[]> {
    const dateString = date.toDateString();

    return Array.from(this.userTasks.values())
      .filter(ut =>
        ut.userId === userId &&
        new Date(ut.date).toDateString() === dateString
      )
      .map(ut => {
        const task = this.tasks.get(ut.taskId);
        if (!task) throw new Error(`Task with id ${ut.taskId} not found`);
        return { ...ut, task };
      });
  }

  async createUserTask(insertUserTask: InsertUserTask): Promise<UserTask> {
    const id = this.userTaskIdCounter++;
    const userTask: UserTask = { ...insertUserTask, id };
    this.userTasks.set(id, userTask);
    return userTask;
  }

  async updateUserTask(id: number, completed: boolean): Promise<UserTask | undefined> {
    const userTask = this.userTasks.get(id);
    if (!userTask) return undefined;

    const updatedUserTask: UserTask = {
      ...userTask,
      completed
    };

    this.userTasks.set(id, updatedUserTask);
    return updatedUserTask;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.category === category
    );
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Metric methods
  async getUserMetrics(userId: number): Promise<Metric[]> {
    return Array.from(this.metrics.values()).filter(
      (metric) => metric.userId === userId
    );
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.metricIdCounter++;
    const metric: Metric = { ...insertMetric, id };
    this.metrics.set(id, metric);
    return metric;
  }

  async updateMetric(id: number, metric: Partial<InsertMetric>): Promise<Metric | undefined> {
    const existingMetric = this.metrics.get(id);
    if (!existingMetric) return undefined;

    const updatedMetric: Metric = {
      ...existingMetric,
      ...metric
    };

    this.metrics.set(id, updatedMetric);
    return updatedMetric;
  }

  // Motivational Content methods
  async getMotivationalContent(): Promise<MotivationalContent[]> {
    return Array.from(this.motivationalContents.values());
  }

  async getDailyMotivationalContent(): Promise<MotivationalContent | undefined> {
    // Get current date to potentially select content based on day of year
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

    // Get all daily content
    const dailyContent = Array.from(this.motivationalContents.values())
      .filter(content => content.type === 'daily');

    if (dailyContent.length === 0) return undefined;

    // Select content based on day of year (rotating through available content)
    return dailyContent[dayOfYear % dailyContent.length];
  }

  async createMotivationalContent(insertContent: InsertMotivationalContent): Promise<MotivationalContent> {
    const id = this.motivationalContentIdCounter++;
    const now = new Date();

    const content: MotivationalContent = {
      ...insertContent,
      id,
      createdAt: now
    };

    this.motivationalContents.set(id, content);
    return content;
  }

  // Supplement methods
  async getSupplements(): Promise<Supplement[]> {
    return Array.from(this.supplements.values());
  }

  async getSupplementsByCategory(category: string): Promise<Supplement[]> {
    return Array.from(this.supplements.values()).filter(
      (supplement) => supplement.categories.includes(category)
    );
  }

  async getSupplement(id: number): Promise<Supplement | undefined> {
    return this.supplements.get(id);
  }

  async createSupplement(insertSupplement: InsertSupplement): Promise<Supplement> {
    const id = this.supplementIdCounter++;
    const now = new Date();

    const supplement: Supplement = {
      ...insertSupplement,
      id,
      upvotes: 0,
      downvotes: 0,
      totalReviews: 0,
      averageRating: 0,
      createdAt: now,
      updatedAt: now
    };

    this.supplements.set(id, supplement);
    return supplement;
  }

  async updateSupplementVotes(id: number, upvotes: number, downvotes: number): Promise<Supplement | undefined> {
    const supplement = this.supplements.get(id);
    if (!supplement) return undefined;

    const updatedSupplement: Supplement = {
      ...supplement,
      upvotes,
      downvotes,
      updatedAt: new Date()
    };

    this.supplements.set(id, updatedSupplement);
    return updatedSupplement;
  }

  // Supplement review methods
  async getSupplementReviews(supplementId: number): Promise<(SupplementReview & { user: User })[]> {
    const reviews = Array.from(this.supplementReviews.values())
      .filter(review => review.supplementId === supplementId);

    return reviews.map(review => {
      const user = this.users.get(review.userId);
      if (!user) throw new Error(`User with id ${review.userId} not found`);
      return { ...review, user };
    });
  }

  async getSupplementReview(id: number): Promise<SupplementReview | undefined> {
    return this.supplementReviews.get(id);
  }

  async createSupplementReview(insertReview: InsertSupplementReview): Promise<SupplementReview> {
    const id = this.supplementReviewIdCounter++;
    const now = new Date();

    const review: SupplementReview = {
      ...insertReview,
      id,
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      createdAt: now,
      updatedAt: now
    };

    this.supplementReviews.set(id, review);

    // Update the supplement's review statistics
    await this.updateSupplementReviewStatistics(insertReview.supplementId);

    return review;
  }

  async updateSupplementReview(id: number, data: { rating: number, content: string | null }): Promise<SupplementReview | undefined> {
    const review = this.supplementReviews.get(id);
    if (!review) return undefined;

    const updatedReview: SupplementReview = {
      ...review,
      ...data,
      updatedAt: new Date()
    };

    this.supplementReviews.set(id, updatedReview);

    // Update supplement statistics
    await this.updateSupplementReviewStatistics(review.supplementId);

    return updatedReview;
  }

  async deleteSupplementReview(id: number): Promise<void> {
    const review = this.supplementReviews.get(id);
    if (!review) return;

    const supplementId = review.userId;
    this.supplementReviews.delete(id);

    // Update supplement statistics
    await this.updateSupplementReviewStatistics(supplementId);
  }

  async updateSupplementReviewStatus(supplementId: number, totalReviews: number, averageRating: number): Promise<Supplement | undefined> {
    const supplement = this.supplements.get(supplementId);
    if (!supplement) return undefined;

    const updatedSupplement: Supplement = {
      ...supplement,
      totalReviews,
      averageRating,
      updatedAt: new Date()
    };

    this.supplements.set(supplementId, updatedSupplement);
    return updatedSupplement;
  }

  async updateSupplementReviewStatistics(supplementId: number): Promise<void> {
    const reviews = await this.getSupplementReviews(supplementId);

    if (reviews.length === 0) {
      await this.updateSupplementReviewStatus(supplementId, 0, 0);
      return;
    }

    const totalReviews = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = parseFloat((sum / totalReviews).toFixed(1));

    await this.updateSupplementReviewStatus(supplementId, totalReviews, averageRating);
  }

  // Review helpful votes methods
  async getUserReviewHelpfulVotes(userId: number): Promise<ReviewHelpfulVote[]> {
    return Array.from(this.reviewHelpfulVotes.values())
      .filter(vote => vote.userId === userId);
  }

  async getReviewHelpfulVote(reviewId: number, userId: number): Promise<ReviewHelpfulVote | undefined> {
    const key = `${reviewId}-${userId}`;
    return this.reviewHelpfulVotes.get(key);
  }

  async createReviewHelpfulVote(vote: InsertReviewHelpfulVote): Promise<ReviewHelpfulVote> {
    const key = `${vote.reviewId}-${vote.userId}`;
    const now = new Date();

    const newVote: ReviewHelpfulVote = {
      ...vote,
      createdAt: now
    };

    this.reviewHelpfulVotes.set(key, newVote);

    // Update helpful vote counts on the review
    await this.updateReviewHelpfulCounts(vote.reviewId);

    return newVote;
  }

  async updateReviewHelpfulVote(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpfulVote | undefined> {
    const key = `${reviewId}-${userId}`;
    const vote = this.reviewHelpfulVotes.get(key);

    if (!vote) return undefined;

    const updatedVote: ReviewHelpfulVote = {
      ...vote,
      isHelpful,
      createdAt: new Date() // Using createdAt as updatedAt
    };

    this.reviewHelpfulVotes.set(key, updatedVote);

    // Update helpful vote counts on the review
    await this.updateReviewHelpfulCounts(reviewId);

    return updatedVote;
  }

  async updateReviewHelpfulCounts(reviewId: number): Promise<void> {
    const review = this.supplementReviews.get(reviewId);
    if (!review) return;

    const votes = Array.from(this.reviewHelpfulVotes.values())
      .filter(vote => vote.reviewId === reviewId);

    const helpfulVotes = votes.filter(vote => vote.isHelpful).length;
    const unhelpfulVotes = votes.filter(vote => !vote.isHelpful).length;

    const updatedReview: SupplementReview = {
      ...review,
      helpfulVotes,
      unhelpfulVotes,
      updatedAt: new Date()
    };

    this.supplementReviews.set(reviewId, updatedReview);
  }

  // Supplement votes methods
  async getSupplementVote(userId: number, supplementId: number): Promise<SupplementVote | undefined> {
    const key = `${userId}-${supplementId}`;

    return Array.from(this.supplementVotes.values())
      .find(vote => vote.userId === userId && vote.supplementId === supplementId);
  }

  async createSupplementVote(vote: InsertSupplementVote): Promise<SupplementVote> {
    const id = `${vote.userId}-${vote.supplementId}`;
    const now = new Date();

    const newVote: SupplementVote = {
      ...vote,
      createdAt: now
    };

    this.supplementVotes.set(id, newVote);

    // Update vote counts on the supplement
    await this.updateSupplementVoteCounts(vote.supplementId);

    return newVote;
  }

  async updateSupplementVote(userId: number, supplementId: number, voteType: string): Promise<SupplementVote | undefined> {
    const key = `${userId}-${supplementId}`;
    const existingVote = Array.from(this.supplementVotes.values())
      .find(vote => vote.userId === userId && vote.supplementId === supplementId);

    if (!existingVote) return undefined;

    const updatedVote: SupplementVote = {
      ...existingVote,
      voteType,
      createdAt: new Date() // Using createdAt as updatedAt
    };

    this.supplementVotes.set(key, updatedVote);

    // Update vote counts on the supplement
    await this.updateSupplementVoteCounts(supplementId);

    return updatedVote;
  }

  async updateSupplementVoteCounts(supplementId: number): Promise<void> {
    const supplement = this.supplements.get(supplementId);
    if (!supplement) return;

    const votes = Array.from(this.supplementVotes.values())
      .filter(vote => vote.supplementId === supplementId);

    const upvotes = votes.filter(vote => vote.voteType === 'up').length;
    const downvotes = votes.filter(vote => vote.voteType === 'down').length;

    await this.updateSupplementVotes(supplementId, upvotes, downvotes);
  }

  // Initialize with sample data
  private initializeData() {
    // Sample motivational content for daily principles
    const principles: InsertMotivationalContent[] = [
      {
        title: "1% Better Every Day",
        content: "Small improvements compound over time. Doing something, no matter how small, is infinitely better than doing nothing. Focus on consistency rather than perfection.",
        author: "James Clear",
        source: "Atomic Habits",
        type: "daily",
      },
      {
        title: "KISS - Keep It Simple, Stupid",
        content: "Complexity is the enemy of execution. The simplest solution is often the best one. Start with the minimal viable action and build from there.",
        author: "Kelly Johnson",
        source: "Lockheed Martin",
        type: "daily",
      },
      {
        title: "Work Now, Freedom Later",
        content: "Short-term sacrifice leads to long-term freedom. The work you avoid today becomes the burden you carry tomorrow. Embrace the struggle now for ease later.",
        author: "David Goggins",
        source: "Can't Hurt Me",
        type: "daily",
      },
      {
        title: "The Power of Showing Up",
        content: "Just showing up is half the battle. A mediocre workout is infinitely better than no workout. Don't let perfect be the enemy of good enough.",
        author: "Jocko Willink",
        source: "Discipline Equals Freedom",
        type: "daily",
      },
      {
        title: "Effort Creates Opportunity",
        content: "Luck is what happens when preparation meets opportunity. The harder you work, the luckier you get. Create your own opportunities through consistent effort.",
        author: "Seneca",
        source: "Letters from a Stoic",
        type: "daily",
      }
    ];

    principles.forEach(principle => {
      this.createMotivationalContent(principle);
    });

    // Top Supplements with Expert Insights
    const supplements: InsertSupplement[] = [
      {
        name: "Omega-3 Fatty Acids (EPA and DHA)",
        description: "Essential fatty acids that the body cannot produce on its own. Critical for reducing inflammation and supporting brain and heart health.",
        benefits: "Reduces inflammation, supports heart and brain health, aids recovery.",
        dosage: "2-4g daily, with ~2g EPA for optimal anti-inflammatory effects.",
        sideEffects: "Mild gastrointestinal issues, fishy aftertaste with some products.",
        interactions: "May interact with blood thinners. Consult with doctor if on medications.",
        categories: "Essential,Daily,Foundational",
        valueRating: 9,
        monthlyCostEstimate: "$15-30",
        bestValue: true,
        expertInsights: JSON.stringify([
          { expert: "Rhonda Patrick", insight: "Highlights omega-3s for their anti-inflammatory properties and cognitive benefits, key for recovery and mental clarity." },
          { expert: "Peter Attia", insight: "Recommends them for cardiovascular health, vital for endurance athletes." },
          { expert: "Ben Greenfield", insight: "Suggests omega-3s to reduce joint inflammation and enhance performance in high-intensity sports." }
        ])
      },
      {
        name: "Vitamin D3",
        description: "Fat-soluble vitamin critical for immune function, bone health, and overall well-being. Many people are deficient due to limited sun exposure.",
        benefits: "Boosts bone health, immunity, and muscle function.",
        dosage: "4,000-5,000 IU/day, adjusted based on blood levels.",
        sideEffects: "Rare at recommended doses. Excessive amounts can lead to toxicity.",
        interactions: "May affect calcium absorption and interact with certain medications.",
        categories: "Essential,Daily,Foundational",
        valueRating: 10,
        monthlyCostEstimate: "$5-15",
        bestValue: true,
        expertInsights: JSON.stringify([
          { expert: "Rhonda Patrick", insight: "Stresses its role in immune support and injury prevention for athletes with heavy training loads." },
          { expert: "Kelly Starrett", insight: "Advocates for vitamin D to maintain bone density and aid recovery, especially for runners." },
          { expert: "Cate Shanahan", insight: "Notes its importance for calcium absorption and preventing stress fractures." }
        ])
      },
      {
        name: "Magnesium",
        description: "Essential mineral involved in over 300 enzymatic reactions in the body. Critical for muscle function, sleep quality, and stress management.",
        benefits: "Promotes muscle relaxation, sleep quality, and energy production.",
        dosage: "1g daily, preferably as magnesium glycinate or citrate.",
        sideEffects: "Digestive discomfort or loose stools at high doses.",
        interactions: "May interfere with certain antibiotics and medications.",
        categories: "Essential,Daily,Foundational",
        valueRating: 9,
        monthlyCostEstimate: "$10-20",
        bestValue: true,
        expertInsights: JSON.stringify([
          { expert: "Peter Attia", insight: "Uses magnesium for better sleep and muscle recovery, critical for intense training schedules." },
          { expert: "Phil Maffetone", insight: "Recommends it to prevent cramps and support endurance performance." },
          { expert: "Stuart McGill", insight: "Emphasizes its role in muscle relaxation and spine health for injury prevention." }
        ])
      },
      {
        name: "Creatine Monohydrate",
        description: "The most well-researched sports supplement available. Increases power output, muscle growth, and cognitive performance.",
        benefits: "Enhances muscle strength, power, and cognitive performance.",
        dosage: "5-10g daily.",
        sideEffects: "Water retention initially, digestive discomfort in some individuals.",
        interactions: "Generally safe with few interactions.",
        categories: "Performance,Daily",
        valueRating: 10,
        monthlyCostEstimate: "$5-15",
        bestValue: true,
        expertInsights: JSON.stringify([
          { expert: "Andrew Huberman", insight: "Praises creatine for physical and mental benefits, especially under fatigue." },
          { expert: "Andy Galpin", insight: "Recommends it for strength gains and recovery in high-intensity athletes." },
          { expert: "Brad Schoenfeld", insight: "Supports its use for muscle growth and resilience against injuries." }
        ])
      },
      {
        name: "Probiotics",
        description: "Beneficial bacteria that support gut health, immune function, and even mental health through the gut-brain connection.",
        benefits: "Improves gut health, immunity, and mental well-being.",
        dosage: "10-50 billion CFU daily, depending on the product.",
        sideEffects: "Initial bloating or gas when starting supplementation.",
        interactions: "Take separate from antibiotics.",
        categories: "Health,Daily",
        valueRating: 7,
        monthlyCostEstimate: "$20-40",
        bestValue: false,
        expertInsights: JSON.stringify([
          { expert: "Peter Attia", insight: "Values probiotics for gut health and metabolic benefits, aiding recovery." },
          { expert: "Rhonda Patrick", insight: "Notes their role in reducing gut inflammation, essential for athletes with high nutritional needs." },
          { expert: "Ben Greenfield", insight: "Suggests probiotics to optimize nutrient absorption and prevent GI issues in endurance events." }
        ])
      }
    ];

    supplements.forEach(supplement => {
      this.createSupplement(supplement);
    });

    // Sample programs
    const programs: InsertProgram[] = [
      {
        name: "Discipline Kickstart",
        description: "Establish foundational habits and build mental discipline. Perfect for beginners looking to start their transformation journey.",
        duration: 3, // 3 weeks
        level: "Beginner",
        features: ["Daily habit building", "Introduction to meditation", "Basic nutrition guidelines", "Starter workout routine"],
        color: "primary",
        isPopular: false
      },
      {
        name: "Mental Toughness",
        description: "Develop the mental fortitude to push through challenges and discomfort. Based on principles from David Goggins and Jocko Willink.",
        duration: 6, // 6 weeks
        level: "Intermediate",
        features: ["Advanced Stoic challenges", "Cold exposure training", "Intermediate fitness protocol", "Optimized nutrition plan"],
        color: "warning",
        isPopular: false
      },
      {
        name: "Complete Transformation",
        description: "Comprehensive program to transform your body, mind, and habits. This is our flagship program for those serious about change.",
        duration: 12, // 12 weeks
        level: "Advanced",
        features: ["Full blood work analysis", "Custom supplement protocol", "Advanced fitness programming", "Deep habit reconstruction"],
        color: "progress",
        isPopular: true
      }
    ];

    programs.forEach(program => {
      this.createProgram(program);
    });

    // Sample tasks
    const tasks: InsertTask[] = [
      {
        title: "Morning Prayer/Meditation",
        description: "10 minutes of focused meditation",
        category: "Spirit",
        frequency: "Must-Do",
        programId: 1
      },
      {
        title: "Morning Workout",
        description: "30 min strength training",
        category: "Body",
        frequency: "Must-Do",
        programId: 1
      },
      {
        title: "Brain Dump Journaling",
        description: "Write 3 pages of stream-of-consciousness",
        category: "Mind",
        frequency: "Must-Do",
        programId: 1
      },
      {
        title: "Cold Shower",
        description: "2-minute minimum cold exposure",
        category: "Body",
        frequency: "Must-Do",
        programId: 1
      },
      {
        title: "Supplements",
        description: "Morning supplement stack",
        category: "Health",
        frequency: "Must-Do",
        programId: 1
      },
      {
        title: "Read Stoic Philosophy",
        description: "20 pages minimum",
        category: "Mind",
        frequency: "3x Weekly",
        programId: 1
      },
      {
        title: "Cardio Session",
        description: "30 min zone 2 cardio",
        category: "Body",
        frequency: "5x Weekly",
        programId: 1
      },
      {
        title: "Intermittent Fasting",
        description: "16:8 fasting window",
        category: "Health",
        frequency: "5x Weekly",
        programId: 1
      },
      {
        title: "Cognitive Training",
        description: "Dual N-Back or language learning",
        category: "Brain",
        frequency: "3x Weekly",
        programId: 1
      }
    ];

    tasks.forEach(task => {
      this.createTask(task);
    });

    // Sample resources
    const resources: InsertResource[] = [
      {
        title: "Stoicism Principles",
        description: "Essential concepts from Seneca, Marcus Aurelius, and Epictetus to build mental resilience.",
        category: "Philosophy",
        content: "Stoicism is a school of Hellenistic philosophy that flourished throughout the Roman and Greek world until the 3rd century AD. Stoicism is predominantly a philosophy of personal ethics informed by its system of logic and its views on the natural world. According to its teachings, as social beings, the path to eudaimonia (happiness, or blessedness) is found in accepting the moment as it presents itself, by not allowing oneself to be controlled by the desire for pleasure or fear of pain, by using one's mind to understand the world and to do one's part in nature's plan, and by working together and treating others fairly and justly.",
        imageUrl: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        title: "Optimal Nutrition Guide",
        description: "Huberman Lab recommended nutrition protocols for cognitive and physical performance.",
        category: "Nutrition",
        content: "Dr. Andrew Huberman's nutrition protocol focuses on optimizing cognitive function, energy levels, and overall health. Key recommendations include: 1) Time-restricted feeding (16:8 method), 2) Protein intake of 1g per pound of body weight, 3) Moderate fat intake with emphasis on omega-3s, 4) Strategic carbohydrate timing around workouts, 5) Hydration with electrolytes, 6) Micronutrient-dense foods with focus on leafy greens.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        title: "Goggins Workout System",
        description: "David Goggins' principles for building physical and mental toughness through exercise.",
        category: "Fitness",
        content: "David Goggins' workout philosophy focuses on pushing through mental barriers and doing the things you don't want to do. Key principles include: 1) The 40% Rule - when your mind tells you you're done, you're only 40% done, 2) Cookie jar method - remember past accomplishments to push through difficult times, 3) Callous the mind through physical suffering, 4) Consistency over intensity, 5) Accountability through tracking.",
        imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        title: "Meditation Practices",
        description: "Science-backed meditation techniques to develop mental clarity and focus.",
        category: "Mindfulness",
        content: "Scientific research has demonstrated numerous benefits of regular meditation practice, including reduced stress, improved attention, decreased anxiety, and enhanced self-awareness. This guide covers different meditation techniques including: 1) Focused attention meditation, 2) Open monitoring meditation, 3) Loving-kindness meditation, 4) Body scan meditation, 5) Transcendental meditation.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        title: "Supplement Protocol",
        description: "Gary Brecka's recommended supplement stack for optimal performance and longevity.",
        category: "Supplements",
        content: "Gary Brecka's supplement protocol is designed to optimize cellular function, reduce inflammation, and support longevity. Core supplements include: 1) Berberine for glucose metabolism (1500mg daily), 2) Vitamin D3 with K2 (5000-10000 IU daily), 3) Magnesium glycinate (400-600mg daily), 4) Omega-3 fish oil (2-3g daily), 5) NAD+ precursors like NMN or NR (500-1000mg daily), 6) Molecular hydrogen tablets (2 tablets daily).",
        imageUrl: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      },
      {
        title: "Sleep Optimization",
        description: "Andrew Huberman's protocol for optimizing sleep quality and recovery.",
        category: "Sleep",
        content: "Dr. Andrew Huberman's sleep optimization protocol emphasizes the importance of light exposure, temperature regulation, and consistent timing. Key recommendations include: 1) Morning sunlight exposure within 30-60 minutes of waking, 2) Avoiding bright lights, especially blue light, 1-2 hours before sleep, 3) Keeping the bedroom cool (65-68°F), 4) Maintaining consistent sleep and wake times, 5) Supplementation with magnesium threonate, apigenin, and theanine when needed.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
      }
    ];

    resources.forEach(resource => {
      this.createResource(resource);
    });

    // Sample user
    this.createUser({
      username: "john",
      password: "password",
      name: "John Davis",
      email: "john@example.com",
      currentProgramId: 3
    });

    // Sample metrics for the user
    this.createMetric({
      userId: 1,
      date: new Date(),
      workouts: 4,
      sleepHours: 7,
      meditation: 3,
      nutrition: "Good"
    });
  }
}

import { DatabaseStorage } from "./db-storage";

export const storage = new DatabaseStorage();
