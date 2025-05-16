export type HabitCategory = 
  | 'physical' 
  | 'nutrition' 
  | 'sleep' 
  | 'mental' 
  | 'relationships' 
  | 'financial' 
  | 'health' 
  | 'social' 
  | 'general';

export type HabitFrequency = 
  | 'daily' 
  | '2x-week' 
  | '3x-week' 
  | '4x-week' 
  | '5x-week' 
  | '6x-week' 
  | 'weekly' 
  | 'monthly';

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  category: string;
  frequency: string;
  impact: number;
  effort: number;
  timeCommitment: string;
  isAbsolute?: boolean;
  streak?: number;
  createdAt?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}