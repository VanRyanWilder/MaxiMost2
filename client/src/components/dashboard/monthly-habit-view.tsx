import React from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameMonth, 
  isToday,
  isSameDay,
  isWeekend
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Habit, HabitCompletion } from "@/types";
import { getHabitCategoryColor } from "@/lib/habits";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface MonthlyHabitViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  currentMonth: Date;
  onToggleHabit: (habitId: number, date: Date) => void;
}

export const MonthlyHabitView: React.FC<MonthlyHabitViewProps> = ({
  habits,
  completions,
  currentMonth,
  onToggleHabit,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  
  // Create array for the calendar grid (6 rows x 7 columns)
  const calendarDays = Array(42).fill(null);
  
  // Fill the calendar grid with dates
  monthDays.forEach((day, index) => {
    calendarDays[startDay + index] = day;
  });
  
  // Check if habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: number, date: Date): boolean => {
    return completions.some(
      (completion) => 
        completion.habitId === habitId && 
        isSameDay(new Date(completion.date), date)
    );
  };
  
  // Calculate completion rate for each habit in the current month
  const getMonthlyCompletionRate = (habitId: number): { completed: number, total: number } => {
    const daysInMonth = monthDays.length;
    const completedDays = monthDays.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
    
    return {
      completed: completedDays,
      total: daysInMonth
    };
  };
  
  // Get the status icon for a habit on a specific date
  const getHabitStatusForDate = (habit: Habit, date: Date) => {
    if (!date) return null;
    
    // If not in current month, show nothing
    if (!isSameMonth(date, currentMonth)) return null;
    
    // Check if habit is completed on this date
    const isCompleted = isHabitCompletedOnDate(habit.id, date);
    
    // Get category color
    const categoryColor = getHabitCategoryColor(habit.category);
    
    if (isCompleted) {
      return (
        <CheckCircle2 
          className={`h-5 w-5 ${categoryColor}`} 
          fill="currentColor"
          fillOpacity={0.2}
        />
      );
    } else {
      // Only show empty circles for past days
      const isPastDay = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      if (isPastDay) {
        return <Circle className="h-5 w-5 text-gray-300" />;
      } else if (isToday(date)) {
        return (
          <Circle 
            className={`h-5 w-5 ${categoryColor} animate-pulse`} 
            strokeWidth={2}
          />
        );
      } else {
        return <Circle className="h-5 w-5 text-gray-200" strokeWidth={1.5} />;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Month header and weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div 
            key={i} 
            className={`text-xs font-medium py-1 ${
              i === 0 || i === 6 ? "text-orange-500" : "text-gray-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => (
          <div 
            key={i} 
            className={`
              min-h-[80px] p-1 border rounded-md 
              ${!day ? "bg-gray-50" : ""}
              ${day && isToday(day) ? "bg-blue-50 border-blue-200" : ""}
              ${day && isWeekend(day) ? "bg-gray-50/50" : ""}
            `}
          >
            {day && (
              <div className="flex flex-col h-full">
                <div className={`
                  text-xs font-medium mb-1 p-0.5 rounded-full w-5 h-5 flex items-center justify-center
                  ${isToday(day) ? "bg-blue-500 text-white" : "text-gray-600"}
                `}>
                  {format(day, "d")}
                </div>
                <div className="flex flex-col gap-1 flex-grow overflow-y-auto">
                  {habits.slice(0, 3).map((habit) => (
                    <TooltipProvider key={habit.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="flex items-center justify-center"
                            onClick={() => onToggleHabit(habit.id, day)}
                          >
                            {getHabitStatusForDate(habit, day)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="font-medium">{habit.title}</p>
                          <p className="text-xs text-gray-500">
                            {isHabitCompletedOnDate(habit.id, day) ? "Completed" : "Not completed"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {habits.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{habits.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Monthly Summary */}
      <div className="mt-6 border rounded-md p-4 bg-gray-50/50">
        <h3 className="text-sm font-medium mb-3">Monthly Summary</h3>
        <div className="grid gap-2">
          {habits.map(habit => {
            const stats = getMonthlyCompletionRate(habit.id);
            const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
            const categoryColor = getHabitCategoryColor(habit.category);
            
            return (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${categoryColor}`}></div>
                  <span className="text-sm">{habit.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    {stats.completed}/{stats.total} days
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        completionRate >= 80 ? "bg-green-500" :
                        completionRate >= 50 ? "bg-amber-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {Math.round(completionRate)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};