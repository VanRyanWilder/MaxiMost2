import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/use-streak";

interface StreakIndicatorProps {
  userId?: number | string;
  showLabel?: boolean;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StreakIndicator({
  userId,
  showLabel = true,
  showProgress = true,
  size = "md",
  className
}: StreakIndicatorProps) {
  const { currentStreak, progress, isLoading } = useStreak({ userId });
  
  // Size variants
  const sizeClasses = {
    sm: {
      container: "p-1.5",
      icon: "h-3 w-3",
      label: "text-xs",
      progress: "h-1.5"
    },
    md: {
      container: "p-2.5",
      icon: "h-3.5 w-3.5",
      label: "text-xs",
      progress: "h-2.5"
    },
    lg: {
      container: "p-3",
      icon: "h-4 w-4",
      label: "text-sm",
      progress: "h-3"
    }
  };
  
  if (isLoading) {
    return (
      <div className={cn(
        "rounded-md bg-blue-50 dark:bg-blue-900/20 animate-pulse",
        sizeClasses[size].container,
        className
      )}>
        <div className="h-8 w-full"></div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "rounded-md bg-blue-50 dark:bg-blue-900/20",
      sizeClasses[size].container,
      className
    )}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="font-medium flex items-center gap-1.5">
            <Zap className={cn("text-amber-500", sizeClasses[size].icon)} />
            <span className={sizeClasses[size].label}>Current Streak</span>
          </span>
          <span className={cn("font-semibold text-blue-600 dark:text-blue-400", sizeClasses[size].label)}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      )}
      
      {showProgress && (
        <div className="w-full bg-blue-100 dark:bg-blue-900/40 rounded-full overflow-hidden">
          <div 
            className={cn(
              "bg-gradient-to-r from-blue-500 to-blue-600 rounded-full",
              sizeClasses[size].progress
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}