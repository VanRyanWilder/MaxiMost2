import { Habit, HabitCompletion } from "@/types/habit";
import { subDays, isWithinInterval, startOfDay, endOfDay, differenceInDays } from "date-fns";

/**
 * Calculate the completion rate for habits over a specified time period
 * @param habits Array of habits
 * @param completions Array of habit completions
 * @param days Number of days to look back
 * @returns Completion rate as a percentage
 */
export function calculateCompletionRate(
  habits: Habit[],
  completions: HabitCompletion[],
  days: number = 7
): number {
  if (habits.length === 0) return 0;
  
  const today = new Date();
  const startDate = subDays(today, days);
  
  // Filter completions within date range
  const recentCompletions = completions.filter(completion => {
    const completionDate = typeof completion.date === 'string' 
      ? new Date(completion.date) 
      : completion.date;
      
    return isWithinInterval(completionDate, {
      start: startOfDay(startDate),
      end: endOfDay(today)
    });
  });
  
  // Count total possible completions in date range
  let totalPossible = 0;
  
  // Count for each habit based on frequency
  habits.forEach(habit => {
    switch(habit.frequency) {
      case 'daily':
        totalPossible += days;
        break;
      case '2x/week':
        totalPossible += Math.ceil(days / 7 * 2);
        break;
      case '3x/week':
        totalPossible += Math.ceil(days / 7 * 3);
        break;
      case '4x/week':
        totalPossible += Math.ceil(days / 7 * 4);
        break;
      case '5x/week':
        totalPossible += Math.ceil(days / 7 * 5);
        break;
      case '6x/week':
        totalPossible += Math.ceil(days / 7 * 6);
        break;
      case 'weekly':
        totalPossible += Math.ceil(days / 7);
        break;
      case 'monthly':
        totalPossible += Math.ceil(days / 30);
        break;
      default:
        totalPossible += days; // Default to daily
    }
  });
  
  // If no possible completions, return 0
  if (totalPossible === 0) return 0;
  
  // Calculate completion rate
  const completionRate = (recentCompletions.length / totalPossible) * 100;
  return Math.round(completionRate);
}

/**
 * Calculate the current streak for a user across all habits
 * @param habits Array of habits
 * @param completions Array of habit completions
 * @returns Current streak in days
 */
export function calculateCurrentStreak(
  habits: Habit[],
  completions: HabitCompletion[]
): number {
  if (habits.length === 0 || completions.length === 0) return 0;
  
  // Get unique dates with completions
  const completionDates = completions.map(completion => {
    const date = typeof completion.date === 'string' 
      ? new Date(completion.date) 
      : completion.date;
      
    return startOfDay(date).toISOString();
  });
  
  // Get unique dates
  const uniqueDates = [...new Set(completionDates)].map(dateStr => new Date(dateStr));
  
  // Sort dates in descending order (newest first)
  uniqueDates.sort((a, b) => b.getTime() - a.getTime());
  
  const today = startOfDay(new Date());
  let currentStreak = 0;
  let currentDate = today;
  
  // Find the most recent streak
  for (let i = 0; i < uniqueDates.length; i++) {
    const completionDate = uniqueDates[i];
    const dayDifference = differenceInDays(currentDate, completionDate);
    
    // If the difference is 1 day, we continue the streak
    if (dayDifference <= 1) {
      currentStreak++;
      currentDate = completionDate;
    } else {
      // Break in the streak
      break;
    }
  }
  
  return currentStreak;
}

/**
 * Calculate a consistency score based on habit completion patterns
 * @param habits Array of habits
 * @param completions Array of habit completions
 * @param days Number of days to analyze
 * @returns Consistency score from 0-100
 */
export function calculateConsistencyScore(
  habits: Habit[],
  completions: HabitCompletion[],
  days: number = 30
): number {
  if (habits.length === 0) return 0;
  
  // Base the score on multiple factors:
  // 1. Completion rate (60% of score)
  // 2. Streak length (20% of score)
  // 3. Habit variety (20% of score)
  
  const completionRate = calculateCompletionRate(habits, completions, days);
  const streak = calculateCurrentStreak(habits, completions);
  
  // Calculate habit variety score (percentage of habits with at least one completion)
  const habitIds = new Set(habits.map(h => h.id));
  const completedHabitIds = new Set(completions.map(c => c.habitId));
  
  // Get the intersection of the two sets
  const completedHabits = [...habitIds].filter(id => completedHabitIds.has(id));
  const habitVarietyScore = (completedHabits.length / habitIds.size) * 100;
  
  // Normalize streak to a 0-100 scale (capped at 30 days)
  const normalizedStreak = Math.min(streak, 30) / 30 * 100;
  
  // Calculate weighted score
  const consistencyScore = (
    completionRate * 0.6 +
    normalizedStreak * 0.2 +
    habitVarietyScore * 0.2
  );
  
  return Math.round(consistencyScore);
}

/**
 * Get the week-over-week trend for completion rate
 * @param habits Array of habits
 * @param completions Array of habit completions
 * @returns Trend string with "+" or "-" prefix
 */
export function getCompletionTrend(
  habits: Habit[],
  completions: HabitCompletion[]
): string {
  // Calculate current week rate
  const currentWeekRate = calculateCompletionRate(habits, completions, 7);
  
  // Calculate previous week rate
  const previousWeekRate = calculateCompletionRate(
    habits,
    completions.filter(c => {
      const completionDate = typeof c.date === 'string' ? new Date(c.date) : c.date;
      const today = new Date();
      const oneWeekAgo = subDays(today, 7);
      const twoWeeksAgo = subDays(today, 14);
      
      return isWithinInterval(completionDate, {
        start: startOfDay(twoWeeksAgo),
        end: endOfDay(oneWeekAgo)
      });
    }),
    7
  );
  
  // Calculate trend percentage
  const trendDifference = currentWeekRate - previousWeekRate;
  
  // Format with sign
  if (trendDifference >= 0) {
    return `+${trendDifference}%`;
  } else {
    return `${trendDifference}%`;
  }
}