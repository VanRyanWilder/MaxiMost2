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
  | "high"
  | "5 min"
  | "10 min"
  | "15 min"
  | "20 min" 
  | "30 min"
  | "45 min"
  | "60 min";

export type HabitCategory = 
  | "health" 
  | "fitness" 
  | "mind" 
  | "routine"
  | "social"
  | "productivity"
  | "creativity"
  | "finance"
  | "custom"
  | "supplements"
  | "research"
  | "stoic"
  | "sugar";

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: HabitTimeCommitment | string;
  frequency: HabitFrequency | string;
  isAbsolute: boolean; // Is this a "must-do" habit?
  category: HabitCategory | string;
  streak: number; // Current streak
  createdAt: Date;
}

// Add a helper type for creating new habits
export type PartialHabit = Partial<Habit> & {
  iconColor?: string;
};

export interface HabitStack {
  id: string;
  name: string;
  description: string;
  habits: string[]; // Array of habit IDs
  createdAt: Date;
  icon?: string;
}