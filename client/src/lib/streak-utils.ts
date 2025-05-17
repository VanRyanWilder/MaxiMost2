import { addDays, differenceInDays, isSameDay, parseISO, startOfDay } from 'date-fns';

interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
}

/**
 * Calculate the current streak based on habit completion history
 * A streak is defined as consecutive days where at least one habit was completed
 * 
 * @param completions Array of habit completions with dates and completion status
 * @returns Current streak count (0 if no streak)
 */
export function calculateCurrentStreak(completions: HabitCompletion[]): number {
  // Filter only completed habits
  const completedHabits = completions.filter(habit => habit.completed);
  if (completedHabits.length === 0) return 0;
  
  // Sort habits by date (newest first)
  const sortedCompletions = [...completedHabits].sort((a, b) => 
    parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );

  // Get unique dates when habits were completed
  const uniqueDates = Array.from(new Set(
    sortedCompletions.map(completion => startOfDay(parseISO(completion.date)).toISOString())
  ));
  
  // Start from the most recent day and count backwards
  let currentStreak = 1; // Start with 1 for today
  let currentDate = parseISO(uniqueDates[0]);
  
  // Check if most recent completion is today
  const today = startOfDay(new Date());
  if (!isSameDay(currentDate, today)) {
    const daysSinceLastCompletion = differenceInDays(today, currentDate);
    // If it's been more than 1 day since last completion, streak is broken
    if (daysSinceLastCompletion > 1) {
      return 0;
    }
  }
  
  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    const nextDate = parseISO(uniqueDates[i]);
    const dayDifference = differenceInDays(currentDate, nextDate);
    
    // Check if dates are consecutive
    if (dayDifference === 1) {
      currentStreak++;
      currentDate = nextDate;
    } else {
      // Break in streak found
      break;
    }
  }
  
  return currentStreak;
}

/**
 * Calculate the user's longest streak based on habit completion history
 * 
 * @param completions Array of habit completions with dates and completion status
 * @returns Longest streak count
 */
export function calculateLongestStreak(completions: HabitCompletion[]): number {
  // Filter only completed habits
  const completedHabits = completions.filter(habit => habit.completed);
  if (completedHabits.length === 0) return 0;
  
  // Get unique dates when habits were completed, sorted chronologically
  const uniqueDates = Array.from(new Set(
    completedHabits.map(completion => startOfDay(parseISO(completion.date)).toISOString())
  )).sort();
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  // Calculate streaks
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = parseISO(uniqueDates[i]);
    const prevDate = parseISO(uniqueDates[i - 1]);
    
    // Check if dates are consecutive
    if (differenceInDays(currentDate, prevDate) === 1) {
      currentStreak++;
      // Update longest streak if current streak is longer
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Break in streak found, reset current streak
      currentStreak = 1;
    }
  }
  
  return longestStreak;
}

/**
 * Calculate streak milestone progress (how close to next milestone)
 * 
 * @param currentStreak The current streak value
 * @param milestones Array of milestone values (e.g., [3, 7, 14, 30, 60, 90])
 * @returns Object with nextMilestone and progress percentage
 */
export function calculateStreakProgress(
  currentStreak: number,
  milestones: number[] = [3, 7, 14, 30, 60, 90, 180, 365]
): { nextMilestone: number; progress: number } {
  // Find the next milestone
  const nextMilestone = milestones.find(milestone => milestone > currentStreak) || 
    (currentStreak + 7); // If beyond all milestones, set next +7 days
  
  // Find the previous milestone
  const previousMilestoneIndex = milestones.findIndex(milestone => milestone > currentStreak) - 1;
  const previousMilestone = previousMilestoneIndex >= 0 ? 
    milestones[previousMilestoneIndex] : 0;
  
  // Calculate progress percentage
  const totalDays = nextMilestone - previousMilestone;
  const daysCompleted = currentStreak - previousMilestone;
  const progress = Math.min(100, Math.round((daysCompleted / totalDays) * 100));
  
  return {
    nextMilestone,
    progress
  };
}