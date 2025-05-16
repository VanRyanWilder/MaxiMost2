import { Habit, HabitCompletion } from "@/types/habit";
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  format,
  addDays,
  subDays,
  subWeeks,
  isWithinInterval
} from "date-fns";

// Share these category colors across the app for consistency
export const CATEGORY_COLORS = {
  "Physical": "#ef4444",  // Red
  "Nutrition": "#f97316", // Orange
  "Sleep": "#8b5cf6",     // Indigo
  "Mental": "#facc15",    // Yellow
  "Relationships": "#0ea5e9", // Blue
  "Financial": "#22c55e", // Green
};

// Calculate completion rate by category and date range
export function calculateCompletionRateByCategory(
  habits: Habit[],
  completions: HabitCompletion[],
  startDate: Date, 
  endDate: Date
): {
  [category: string]: { date: string; value: number }[]
} {
  // Get all days in the time range
  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group habits by category
  const habitsByCategory: { [category: string]: Habit[] } = {};
  
  habits.forEach(habit => {
    const category = habit.category;
    if (!habitsByCategory[category]) {
      habitsByCategory[category] = [];
    }
    habitsByCategory[category].push(habit);
  });
  
  // Initialize results object with empty arrays for each category
  const results: { [category: string]: { date: string; value: number }[] } = {};
  
  // For each category and each day, calculate completion rate
  Object.keys(habitsByCategory).forEach(category => {
    results[category] = [];
    
    // Calculate weekly data points to reduce noise
    // Group days into weeks
    let currentWeek: Date[] = [];
    let currentWeekStart: Date | null = null;
    
    daysInRange.forEach(day => {
      if (currentWeekStart === null || day.getDay() === 0) { // Start new week on Sunday
        if (currentWeekStart !== null && currentWeek.length > 0) {
          // Process the completed week
          const weekCompletionRate = calculateWeekCompletionRate(
            habitsByCategory[category],
            completions,
            currentWeek
          );
          
          results[category].push({
            date: format(currentWeek[0], 'yyyy-MM-dd'),
            value: weekCompletionRate
          });
        }
        
        currentWeekStart = day;
        currentWeek = [day];
      } else {
        currentWeek.push(day);
      }
    });
    
    // Process the last week if needed
    if (currentWeek.length > 0) {
      const weekCompletionRate = calculateWeekCompletionRate(
        habitsByCategory[category],
        completions,
        currentWeek
      );
      
      results[category].push({
        date: format(currentWeek[0], 'yyyy-MM-dd'),
        value: weekCompletionRate
      });
    }
  });
  
  return results;
}

// Helper function to calculate completion rate for a week
function calculateWeekCompletionRate(
  categoryHabits: Habit[],
  completions: HabitCompletion[],
  weekDays: Date[]
): number {
  if (categoryHabits.length === 0) return 0;
  
  let totalRequired = 0;
  let totalCompleted = 0;
  
  categoryHabits.forEach(habit => {
    // For each habit, determine how many times it should be completed in this week
    let requiredCompletions = 0;
    
    if (habit.frequency === 'daily') {
      requiredCompletions = weekDays.length;
    } else {
      // Handle frequency like '3x', '5x', etc.
      const frequencyNumber = parseInt(habit.frequency.replace('x', ''));
      requiredCompletions = Math.min(frequencyNumber, weekDays.length);
    }
    
    totalRequired += requiredCompletions;
    
    // Count actual completions for this habit in this week
    const habitCompletions = completions.filter(
      c => c.habitId === habit.id && 
      weekDays.some(day => isSameDay(new Date(c.date), day))
    );
    
    totalCompleted += habitCompletions.length;
  });
  
  return totalRequired > 0 
    ? Math.round((totalCompleted / totalRequired) * 100) 
    : 0;
}

// Get completions by category for the latest date range
export function getLatestCompletionsByCategory(
  habits: Habit[],
  completions: HabitCompletion[]
): { name: string; value: number }[] {
  const today = new Date();
  const fourWeeksAgo = subWeeks(today, 4);
  
  const completionsByCategory = calculateCompletionRateByCategory(
    habits,
    completions,
    fourWeeksAgo,
    today
  );
  
  return Object.keys(completionsByCategory).map(category => {
    const categoryData = completionsByCategory[category];
    const latestValue = categoryData.length > 0 
      ? categoryData[categoryData.length - 1].value 
      : 0;
      
    return {
      name: category,
      value: latestValue
    };
  });
}

// Calculate trend for each category
export function calculateTrend(data: { date: string; value: number }[]) {
  if (data.length < 2) return { trend: "stable", percentage: 0 };
  
  const firstValue = data[0].value;
  const lastValue = data[data.length - 1].value;
  const difference = lastValue - firstValue;
  const percentageChange = Math.round((difference / Math.max(firstValue, 1)) * 100);
  
  let trend = "stable";
  if (percentageChange > 0) trend = "up";
  else if (percentageChange < 0) trend = "down";
  
  return {
    trend,
    percentage: Math.abs(percentageChange)
  };
}

// Format date for display
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}