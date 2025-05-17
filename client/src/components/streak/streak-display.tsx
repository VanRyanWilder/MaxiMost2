import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface StreakDisplayProps {
  userId?: number | string;
  className?: string;
}

interface HabitCompletion {
  date: string;
  completed: boolean;
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
    
    // Get days with completed habits
    const completedDays = completionData.filter(day => day.completed);
    if (completedDays.length === 0) {
      setCurrentStreak(0);
      setProgressPercent(0);
      return;
    }
    
    // For now, set a simple placeholder streak 
    // In a real implementation, we'd calculate consecutive days
    setCurrentStreak(7);
    setProgressPercent(70);
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