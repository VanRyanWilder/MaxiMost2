export type ProgramGoalCategory = 
  | 'weight-loss' 
  | 'muscle-gain' 
  | 'health-optimization' 
  | 'performance'
  | 'focus-productivity'
  | 'stress-reduction'
  | 'sleep-improvement';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type TimeCommitment = 'minimal' | 'moderate' | 'high';

export interface UserGoalProfile {
  id: string;
  userId: string;
  primaryGoal: ProgramGoalCategory;
  secondaryGoal?: ProgramGoalCategory;
  fitnessLevel: FitnessLevel;
  timeCommitment: TimeCommitment;
  dietaryPreferences?: string[];
  healthIssues?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  primaryGoal: ProgramGoalCategory;
  supportedGoals: ProgramGoalCategory[];
  fitnessLevel: FitnessLevel[];
  timeCommitment: TimeCommitment;
  durationWeeks: number;
  habitIds: string[];
  imageUrl?: string;
  recommendationScore?: number; // Used for personalized sorting
}

export interface RecommendationCriteria {
  primaryGoal: ProgramGoalCategory;
  secondaryGoal?: ProgramGoalCategory;
  fitnessLevel: FitnessLevel;
  timeCommitment: TimeCommitment;
  dietaryPreferences?: string[];
  healthIssues?: string[];
}