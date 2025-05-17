import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { addDays, differenceInDays, format, isToday, parseISO, startOfDay, subDays } from "date-fns";

interface StreakDisplayProps {
  userId?: number | string;
  className?: string;
}

interface HabitCompletion {
  date: string;
  completed: boolean;
}

/**
 * Calculate streak based on habit completion data
 */
function calculateStreak(completions: HabitCompletion[]): number {
  if (!completions || completions.length === 0) return 0;

  // Sort completions by date (latest first)
  const sortedCompletions = [...completions].sort((a, b) => {
    return parseISO(b.date).getTime() - parseISO(a.date).getTime();
  });
  
  // Check if the most recent day has a completion
  const mostRecentCompletion = sortedCompletions[0];
  const mostRecentDate = parseISO(mostRecentCompletion.date);
  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));
  
  // If the most recent day doesn't have a completion on either today or yesterday,
  // the streak is broken
  if (!mostRecentCompletion.completed || 
      (differenceInDays(today, mostRecentDate) > 1 && 
       !isToday(mostRecentDate) && 
       differenceInDays(yesterday, mostRecentDate) !== 0)) {
    return 0;
  }
  
  // Count consecutive days with completions
  let streak = mostRecentCompletion.completed ? 1 : 0;
  let currentDate = mostRecentDate;
  
  // Look through the rest of the days
  for (let i = 1; i < sortedCompletions.length; i++) {
    const previousDay = parseISO(sortedCompletions[i].date);
    const dayDifference = differenceInDays(currentDate, previousDay);
    
    // Check if days are consecutive and the habit was completed
    if (dayDifference === 1 && sortedCompletions[i].completed) {
      streak++;
      currentDate = previousDay;
    } else if (dayDifference === 1 && !sortedCompletions[i].completed) {
      // Day was tracked but habit wasn't completed - break in streak
      break;
    } else if (dayDifference > 1) {
      // Gap in days - break in streak
      break;
    }
  }
  
  return streak;
}

/**
 * Calculate progress toward next milestone
 */
function calculateProgress(currentStreak: number): number {
  // Define milestone thresholds
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  
  // Find the next milestone
  const nextMilestone = milestones.find(m => m > currentStreak) || (currentStreak + 7);
  
  // Find the previous milestone
  const prevMilestoneIndex = milestones.findIndex(m => m > currentStreak) - 1;
  const prevMilestone = prevMilestoneIndex >= 0 ? milestones[prevMilestoneIndex] : 0;
  
  // Calculate progress percentage
  const range = nextMilestone - prevMilestone;
  const progress = ((currentStreak - prevMilestone) / range) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

export function StreakDisplay({ userId, className }: StreakDisplayProps) {
  // We'll provide default values while loading
  const [currentStreak, setCurrentStreak] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Fetch habit completion data for the user
  const { data: completionData, isLoading } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/user/habit-completions', userId],
    enabled: !!userId,
  });
  
  // Calculate the streak when data changes
  useEffect(() => {
    if (!completionData || !Array.isArray(completionData) || completionData.length === 0) {
      return;
    }
    
    // Calculate the current streak
    const streak = calculateStreak(completionData);
    setCurrentStreak(streak);
    
    // Calculate progress toward next milestone
    const progress = calculateProgress(streak);
    setProgressPercent(progress);
  }, [completionData]);

  return (
    <div className={cn("rounded-md bg-blue-50 dark:bg-blue-900/20 p-2.5", className)}>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-medium flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Current Streak
        </span>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </span>
      </div>
      <div className="w-full bg-blue-100 dark:bg-blue-900/40 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
}