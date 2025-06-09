export type HabitCategory = 
  | 'physical' 
  | 'nutrition' 
  | 'sleep' 
  | 'mental' 
  | 'relationships' 
  | 'financial';

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
  createdAt?: string | Date; // Can be string from API, converted to Date
  userChangedColor?: boolean;

  // Fields from backend (FirestoreHabit)
  userId?: string; // Provided by backend
  isActive?: boolean; // Provided by backend

  type?: "binary" | "quantitative";
  targetValue?: number;
  targetUnit?: string;

  completions?: CompletionEntry[]; // Nested completions

  isBadHabit?: boolean;
  trigger?: string;
  replacementHabit?: string;
}

// For nested completions within a Habit object
export interface CompletionEntry {
  date: string; // YYYY-MM-DD
  value: number;
  timestamp?: string | Date | { _seconds: number, _nanoseconds: number }; // Raw from Firestore or processed
}

// HabitCompletion might still be used for local state/optimistic updates,
// but fetched data will have completions nested.
export interface HabitCompletion {
  id: string; // This might be composite (habitId + date) or specific to UI interaction
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean; // For binary habits primarily, or derived for quantitative
  value?: number; // For quantitative habits
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}