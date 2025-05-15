export interface Program {
  id: string;
  title: string;
  description: string;
  durationWeeks: number;
  category: ProgramCategory;
  difficulty: ProgramDifficulty;
  goals: string[];
  benefits: string[];
  image?: string;
  color: string;
  habits: string[]; // Habit IDs
  tasks: ProgramTask[];
  resources: ProgramResource[];
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

export interface RecommendationCriteria {
  goalType: string; // Primary goal
  secondaryGoals: string[];
  timeCommitment: string; // How much time per day/week
  difficulty: ProgramDifficulty;
  healthConditions: string[];
  preferences: string[];
}