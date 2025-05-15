import { Habit } from './habit';

/**
 * Represents a completed habit instance
 */
export interface HabitCompletion {
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  notes?: string;
}

/**
 * Represents a habit streak
 */
export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: Date;
}

/**
 * Get today's date with time set to midnight
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get date for specific number of days ago
 */
export function getDaysAgo(days: number): Date {
  const date = getToday();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * Get habit completion percentage for a given date range
 */
export function getCompletionPercentage(
  habit: Habit,
  completions: HabitCompletion[],
  startDate: Date,
  endDate: Date
): number {
  // Count total days in range that match habit frequency
  let totalDays = 0;
  let completedDays = 0;
  
  // Create a map of completions by date for easy lookup
  const completionMap = new Map<string, boolean>();
  completions
    .filter(c => c.habitId === habit.id)
    .forEach(c => {
      completionMap.set(formatDateKey(c.date), c.completed);
    });
  
  // Loop through each day in range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateKey = formatDateKey(currentDate);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    // For non-daily frequencies like 2x, 3x, etc per week, we just count the
    // number of completed days in the week against the target number.
    // This logic is handled in hasMetWeeklyFrequency functions elsewhere.
    const shouldCountDay = habit.frequency === 'daily';
    
    if (shouldCountDay) {
      totalDays++;
      if (completionMap.get(dateKey)) {
        completedDays++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return totalDays === 0 ? 0 : (completedDays / totalDays) * 100;
}

/**
 * Calculate current streak for a habit
 */
export function calculateStreak(
  habit: Habit,
  completions: HabitCompletion[]
): number {
  const habitCompletions = completions
    .filter(c => c.habitId === habit.id && c.completed)
    .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort desc by date
  
  if (habitCompletions.length === 0) {
    return 0;
  }
  
  let streak = 1;
  let currentDate = habitCompletions[0].date;
  
  // Check if the most recent completion is today or yesterday
  const today = getToday();
  const yesterday = getDaysAgo(1);
  
  if (!isSameDay(currentDate, today) && !isSameDay(currentDate, yesterday)) {
    // Streak broken if last completion was before yesterday
    return 0;
  }
  
  // Count back through completions to find streak
  for (let i = 1; i < habitCompletions.length; i++) {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    
    if (isSameDay(habitCompletions[i].date, prevDate)) {
      streak++;
      currentDate = habitCompletions[i].date;
    } else {
      break;
    }
  }
  
  return streak;
}