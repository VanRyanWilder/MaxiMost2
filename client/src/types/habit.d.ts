// Define habit-related types for the application
export type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
export type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean; // Must-do daily vs flexible habit
  category: HabitCategory;
  streak: number;
  createdAt: Date;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string | Date;
  completed: boolean;
}

export interface HabitStack {
  id: string;
  name: string;
  description: string;
  icon: string;
  habits: Omit<Habit, "id" | "streak" | "createdAt">[];
}