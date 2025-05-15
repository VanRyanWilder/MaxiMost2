export interface Program {
  id: string;
  title: string;
  name: string;
  description: string;
  durationWeeks: number;
  category: ProgramCategory;
  difficulty: ProgramDifficulty;
  goals: string[];
  benefits: string[];
  image?: string;
  color: string;
  habits: string[]; // Habit IDs
  habitIds?: string[]; // For backward compatibility
  tasks: ProgramTask[];
  resources: ProgramResource[];
  // Added fields for program recommendations
  primaryGoal?: string;
  supportedGoals?: string[];
  timeCommitment?: string;
  fitnessLevel?: string;
  matchScore?: number;
}

export type ProgramCategory = 
  | "health" 
  | "fitness" 
  | "mind" 
  | "nutrition" 
  | "sleep"
  | "productivity";

export type ProgramDifficulty = 
  | "beginner" 
  | "intermediate" 
  | "advanced";

export interface ProgramTask {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  frequency: string;
  category: string;
}

export interface ProgramResource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  content?: string;
}

export type ResourceType = 
  | "article" 
  | "video" 
  | "book" 
  | "app" 
  | "workout" 
  | "recipe";

export type ProgramGoalCategory = 
  | "health-optimization"
  | "morning-routine"
  | "sugar-free"
  | "strength" 
  | "mental-clarity"
  | "sleep"
  | "nutrition"
  | "weight-loss"
  | "stress-reduction"
  | "productivity"
  | "focus"
  | "energy"
  | "recovery";

export type TimeCommitment = "minimal" | "moderate" | "high";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export interface RecommendationCriteria {
  primaryGoal: ProgramGoalCategory; 
  secondaryGoal?: ProgramGoalCategory;
  timeCommitment: TimeCommitment;
  fitnessLevel: FitnessLevel;
}