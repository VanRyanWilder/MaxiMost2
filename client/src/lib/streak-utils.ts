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

// --- New function for daily habit streaks based on CompletionEntry[] ---
import { CompletionEntry } from '@/types/habit'; // Ensure this path is correct
import { subDays } from 'date-fns'; // Added missing import for subDays

/**
 * Calculates the current streak for a specific daily habit.
 * A streak is defined as consecutive days of completion ending on the given 'currentReferenceDay' or the day before it.
 *
 * @param completions Array of completion entries for the habit.
 * @param currentReferenceDay The date to calculate the streak relative to (e.g., 'today' from the view).
 * @returns The current streak count.
 */
export function calculateDailyHabitStreak(
  completions: CompletionEntry[] | undefined,
  currentReferenceDay: Date
): number {
  if (!completions || completions.length === 0) {
    return 0;
  }

  const today = startOfDay(currentReferenceDay); // Use the reference day

  // Filter for valid completions (value > 0) and parse dates
  const validCompletionDates = completions
    .filter(c => c.value > 0 && c.date)
    .map(c => startOfDay(parseISO(c.date))) // Normalize to start of day for reliable comparison
    .sort((a, b) => b.getTime() - a.getTime()); // Sort descending by date

  if (validCompletionDates.length === 0) {
    return 0;
  }

  let streak = 0;
  let expectedDate = today;

  // Check if today is completed
  const todayCompleted = validCompletionDates.some(d => isSameDay(d, today));

  // Check if yesterday is completed
  const yesterday = subDays(today, 1);
  const yesterdayCompleted = validCompletionDates.some(d => isSameDay(d, yesterday));

  if (todayCompleted) {
    // Streak includes today
    expectedDate = today;
  } else if (yesterdayCompleted) {
    // Streak ends on yesterday
    expectedDate = yesterday;
  } else {
    // Neither today nor yesterday is completed, so no current streak.
    return 0;
  }

  // Iterate backwards from the most recent valid completion day (expectedDate)
  for (const completionDate of validCompletionDates) {
    if (isSameDay(completionDate, expectedDate)) {
      streak++;
      expectedDate = subDays(expectedDate, 1); // Move to the previous day to check
    } else if (completionDate < expectedDate) {
      // If we find a completion date that is earlier than the current day we are checking in the streak,
      // AND it's not the expectedDate, it means there was a gap.
      // This condition might be tricky if completions are not perfectly sequential in the sorted list
      // after the initial expectedDate is found.
      // The primary check is `isSameDay(completionDate, expectedDate)`. If it's not, and it's earlier, the streak is broken.
      break;
    }
    // If completionDate is later than expectedDate, it means we jumped too far back in sorted list,
    // which shouldn't happen if we correctly set initial expectedDate.
  }

  return streak;
}