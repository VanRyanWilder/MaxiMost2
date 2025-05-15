// Shared habit types used across the application
export type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "5x-week" | "6x-week" | "custom";
export type HabitCategory = "health" | "fitness" | "mind" | "social" | "work" | "study" | "hobby" | "finance" | "spiritual" | "custom" | string;

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor?: string; // Color scheme for the habit (blue, green, red, etc.)
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean;
  category: HabitCategory;
  streak: number;
  createdAt: Date;
  type?: "principle" | "custom" | "default";
  principle?: string;
  lastCompleted?: Date | null;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
}