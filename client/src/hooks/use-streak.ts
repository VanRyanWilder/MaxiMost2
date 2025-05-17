import { useEffect, useState } from 'react';
import { calculateCurrentStreak, calculateLongestStreak, calculateStreakProgress } from '@/lib/streak-utils';
import { useQuery } from '@tanstack/react-query';

interface HabitCompletion {
  date: string;
  completed: boolean;
}

interface UseStreakOptions {
  userId?: number | string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  nextMilestone: number;
  progress: number;
  isLoading: boolean;
}

/**
 * Hook to calculate and manage user's habit streaks
 */
export function useStreak({ userId }: UseStreakOptions = {}): StreakData {
  // Default values
  const [streakData, setStreakData] = useState<Omit<StreakData, 'isLoading'>>({
    currentStreak: 0,
    longestStreak: 0,
    nextMilestone: 3,
    progress: 0
  });

  // Query for user habit completion data
  const { data: completionData, isLoading } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/user/habit-completions', userId],
    // Only fetch if we have a userId
    enabled: !!userId,
  });

  // Calculate streak when completion data changes
  useEffect(() => {
    if (completionData && Array.isArray(completionData) && completionData.length > 0) {
      const currentStreak = calculateCurrentStreak(completionData);
      const longestStreak = calculateLongestStreak(completionData);
      const { nextMilestone, progress } = calculateStreakProgress(currentStreak);
      
      setStreakData({
        currentStreak,
        longestStreak,
        nextMilestone,
        progress
      });
    }
  }, [completionData]);

  return {
    ...streakData,
    isLoading
  };
}