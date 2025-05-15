// Ensure we have HabitCompletion type defined to fix TypeScript errors
export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}