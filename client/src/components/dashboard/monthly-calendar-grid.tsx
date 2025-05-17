import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isSameMonth 
} from 'date-fns';
import { Card } from '@/components/ui/card';
import { Habit } from '@/types/habit';

interface MonthlyCalendarGridProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type when available
  currentMonth: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
}

export function MonthlyCalendarGrid({ 
  habits, 
  completions, 
  currentMonth, 
  onToggleHabit 
}: MonthlyCalendarGridProps) {
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Helper function to check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date) &&
      completion.completed
    );
  };
  
  // Calculate monthly completion rate for each habit
  const getMonthlyCompletionRate = (habit: Habit): number => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    
    const completedDays = completions.filter(
      c => c.habitId === habit.id && 
      isSameMonth(new Date(c.date), currentMonth) &&
      c.completed
    ).length;
    
    // Default to daily expected completions
    let expectedCompletions = daysInMonth;
    
    // Handle frequency-based habits
    if (habit.isAbsolute === false) {
      if (habit.frequency === '2x-week') expectedCompletions = 8;
      else if (habit.frequency === '3x-week') expectedCompletions = 12;
      else if (habit.frequency === '4x-week') expectedCompletions = 16;
      else if (habit.frequency === '5x-week') expectedCompletions = 20;
      else if (habit.frequency === '6x-week') expectedCompletions = 24;
      else if (habit.frequency === 'weekly') expectedCompletions = 4;
      else if (habit.frequency === 'monthly') expectedCompletions = 1;
    }
    
    return Math.min(100, (completedDays / expectedCompletions) * 100);
  };
  
  // Get color for habit based on category
  const getHabitColor = (habit: Habit): string => {
    const colorMap: Record<string, string> = {
      'red': '#ef4444',
      'orange': '#f97316',
      'yellow': '#eab308',
      'green': '#22c55e',
      'blue': '#3b82f6',
      'indigo': '#6366f1',
      'purple': '#a855f7'
    };
    
    return colorMap[habit.iconColor] || '#3b82f6';
  };
  
  // Generate the calendar grid
  const generateCalendarGrid = () => {
    // Calculate empty cells for days before the first of the month
    const firstDayOfWeek = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const blanks = Array(firstDayOfWeek).fill(null).map((_, i) => (
      <div key={`blank-${i}`} className="h-24 bg-gray-50 rounded border border-gray-100"></div>
    ));
    
    // Create cells for each day in the month
    const dayCells = days.map(day => {
      const isCurrentDay = isSameDay(day, new Date());
      
      return (
        <div 
          key={day.toString()} 
          className={`
            h-24 p-1 rounded border border-gray-200 overflow-y-auto
            ${isCurrentDay ? 'bg-blue-50 border-blue-200' : 'bg-white'}
          `}
        >
          <div className={`text-right text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
            {format(day, 'd')}
          </div>
          
          <div className="space-y-1">
            {habits.slice(0, 3).map(habit => (
              <div 
                key={habit.id}
                className="flex items-center text-xs cursor-pointer"
                onClick={() => onToggleHabit(habit.id, day)}
              >
                {isHabitCompletedOnDate(habit.id, day) 
                  ? <div className="h-3 w-3 mr-1 rounded-full" style={{ backgroundColor: getHabitColor(habit) }}></div> 
                  : <div className="h-3 w-3 mr-1 rounded-full border border-gray-300"></div>
                }
                <span className="truncate">{habit.title}</span>
              </div>
            ))}
            
            {habits.length > 3 && (
              <div className="text-xs text-gray-500 italic">+{habits.length - 3} more</div>
            )}
          </div>
        </div>
      );
    });
    
    return [...blanks, ...dayCells];
  };

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="monthly-calendar">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div 
              key={day} 
              className={`text-center py-2 font-medium text-sm
                ${i === 0 || i === 6 ? 'text-red-500' : 'text-gray-600'}
              `}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days grid */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarGrid()}
        </div>
      </div>
      
      {/* Monthly Progress */}
      <div className="monthly-progress">
        <h4 className="text-base font-medium mb-3">Monthly Progress</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {habits.map(habit => {
            const completionRate = getMonthlyCompletionRate(habit);
            const habitColor = getHabitColor(habit);
            
            return (
              <Card key={habit.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: habitColor }}></div>
                    <span className="font-medium text-sm">{habit.title}</span>
                  </div>
                  <span className="text-xs">{Math.round(completionRate)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full rounded-full" 
                    style={{ width: `${completionRate}%`, backgroundColor: habitColor }}
                  ></div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}