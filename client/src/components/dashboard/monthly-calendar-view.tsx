import React from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  eachWeekOfInterval,
  getDay, 
  isSameMonth, 
  isToday,
  isSameDay,
  addDays,
  getWeekOfMonth
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Habit, HabitCompletion } from "@/types/habit";

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  // Create category map with lowercase keys for consistency
  const categoryMap: Record<string, string> = {
    'physical': 'text-red-500 bg-red-50',
    'nutrition': 'text-orange-500 bg-orange-50',
    'mental': 'text-yellow-500 bg-yellow-50',
    'sleep': 'text-indigo-500 bg-indigo-50', 
    'relationships': 'text-blue-500 bg-blue-50',
    'financial': 'text-green-500 bg-green-50'
  };
  
  // Safely check for the category
  return categoryMap[category.toLowerCase()] || 'text-gray-500 bg-gray-50';
};

interface MonthlyCalendarViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  currentMonth: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  habits,
  completions,
  currentMonth,
  onToggleHabit
}) => {
  // Calendar setup
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
  
  // Get weekday names
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date) && 
      completion.completed
    );
  };
  
  // Get a styled status dot for a habit on a specific day
  const getHabitStatus = (habit: Habit, date: Date) => {
    if (!date || !isSameMonth(date, currentMonth)) return null;
    
    const isCompleted = isHabitCompletedOnDate(habit.id, date);
    const colorClass = getCategoryColor(habit.category).split(' ')[0];
    
    if (isCompleted) {
      return <CheckCircle2 className={`${colorClass} h-4 w-4`} />;
    }
    
    return <Circle className="text-gray-300 h-4 w-4" />;
  };
  
  // Calculate monthly completion rate
  const getMonthlyCompletionRate = (habitId: string): number => {
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const completedDays = daysInMonth.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
    
    const habit = habits.find(h => h.id === habitId);
    let expectedCompletions = daysInMonth.length; // Default for daily
    
    if (habit && !habit.isAbsolute) {
      // Create frequency map with proper typing
      const frequencyMap: Record<string, number> = {
        '2x-week': 2 * Math.ceil(daysInMonth.length / 7),
        '3x-week': 3 * Math.ceil(daysInMonth.length / 7),
        '4x-week': 4 * Math.ceil(daysInMonth.length / 7),
        '5x-week': 5 * Math.ceil(daysInMonth.length / 7),
        '6x-week': 6 * Math.ceil(daysInMonth.length / 7),
        'weekly': Math.ceil(daysInMonth.length / 7),
        'monthly': 1
      };
      
      // Safely access the frequency map with fallback
      expectedCompletions = habit.frequency in frequencyMap 
        ? frequencyMap[habit.frequency] 
        : daysInMonth.length;
    }
    
    // Cap the rate at 100%
    return Math.min(100, (completedDays / expectedCompletions) * 100);
  };
  
  return (
    <div className="space-y-4">
      {/* Calendar grid */}
      <div className="rounded-lg border overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {weekDays.map((day, index) => (
            <div 
              key={index}
              className="py-2 text-center text-sm font-medium text-gray-500"
            >
              {day.slice(0, 3)}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        {monthWeeks.map((week, weekIndex) => {
          const days = Array(7).fill(0).map((_, i) => addDays(week, i));
          
          return (
            <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
              {days.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isCurrentDay = isToday(day);
                
                return (
                  <div 
                    key={dayIndex}
                    className={`
                      relative min-h-[100px] p-1 border-r last:border-r-0
                      ${!isCurrentMonth ? 'bg-gray-50' : ''}
                      ${isCurrentDay ? 'bg-blue-50' : ''}
                    `}
                  >
                    {/* Day number */}
                    <div className={`
                      text-right text-sm font-medium p-1
                      ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                      ${isCurrentDay ? 'text-blue-600' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>
                    
                    {/* Habits for this day */}
                    {isCurrentMonth && (
                      <div className="flex flex-col gap-1">
                        {habits.slice(0, 4).map(habit => (
                          <TooltipProvider key={habit.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => onToggleHabit(habit.id, day)}
                                  className="flex items-center w-full"
                                >
                                  {getHabitStatus(habit, day)}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{habit.title}</p>
                                <p className="text-xs text-gray-500">
                                  {isHabitCompletedOnDate(habit.id, day) 
                                    ? "Completed" 
                                    : "Not completed"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        
                        {habits.length > 4 && (
                          <Badge variant="outline" className="text-xs w-fit">
                            +{habits.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      
      {/* Monthly Progress Summary */}
      <div className="pt-4">
        <h4 className="text-sm font-medium mb-2">Monthly Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {habits.map(habit => {
            const completionRate = getMonthlyCompletionRate(habit.id);
            // Get the category color class
            const [textClass] = getCategoryColor(habit.category).split(' ');
            const bgClass = textClass.replace('text-', 'bg-');
            
            return (
              <Card key={habit.id} className="p-3 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{habit.title}</span>
                  <span className="text-xs">{Math.round(completionRate)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${bgClass} h-full rounded-full`}
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};