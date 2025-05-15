export type HabitFrequency = 
  | "daily" 
  | "weekdays" 
  | "weekends" 
  | "1x-week" 
  | "2x-week" 
  | "3x-week" 
  | "4x-week" 
  | "5x-week" 
  | "6x-week"
  | "weekly";

export type HabitTimeCommitment = 
  | "minimal" 
  | "moderate" 
  | "high";

export type HabitCategory = 
  | "health" 
  | "fitness" 
  | "mind" 
  | "routine"
  | "social"
  | "productivity"
  | "creativity"
  | "finance"
  | "custom";

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: HabitTimeCommitment;
  frequency: HabitFrequency;
  isAbsolute: boolean; // Is this a "must-do" habit?
  category: HabitCategory;
  streak: number; // Current streak
  createdAt: Date;
}