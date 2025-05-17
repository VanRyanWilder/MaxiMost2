import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  getDaysInMonth
} from 'date-fns';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Habit } from '@shared/schema';
import { getCategoryColor } from '@/lib/utils';

interface MonthCalendarViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type when available
  currentMonth: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({
  habits,
  completions,
  currentMonth,
  onToggleHabit
}) => {
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create a 7-column grid (Sunday to Saturday)
  const getWeekdayIndex = (date: Date) => date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Days of the week header
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calculate empty cells to add at the beginning for proper alignment
  const firstDayIndex = getWeekdayIndex(monthStart);
  const emptyStartCells = Array(firstDayIndex).fill(null);
  
  // Check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date) &&
      completion.completed
    );
  };
  
  // Calculate the completion rate for a habit in the current month
  const getMonthlyCompletionRate = (habitId: string): number => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const completedDays = completions.filter(
      completion => completion.habitId === habitId && 
                  isSameMonth(new Date(completion.date), currentMonth) &&
                  completion.completed
    ).length;
    
    const habit = habits.find(h => h.id === habitId);
    let expectedCompletions = daysInMonth;
    
    if (habit && !habit.isAbsolute) {
      // Handle frequency
      const frequencyMap: Record<string, number> = {
        '2x-week': 2 * Math.ceil(daysInMonth / 7),
        '3x-week': 3 * Math.ceil(daysInMonth / 7),
        '4x-week': 4 * Math.ceil(daysInMonth / 7),
        '5x-week': 5 * Math.ceil(daysInMonth / 7),
        '6x-week': 6 * Math.ceil(daysInMonth / 7),
        'weekly': Math.ceil(daysInMonth / 7),
        'monthly': 1
      };
      
      expectedCompletions = habit.frequency in frequencyMap 
        ? frequencyMap[habit.frequency] 
        : daysInMonth;
    }
    
    return Math.min(100, (completedDays / expectedCompletions) * 100);
  };

  return (
    <div className="month-calendar-view">
      <div className="calendar-grid mb-4">
        {/* Calendar Header - Days of the week */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, index) => (
            <div 
              key={index}
              className={`text-center py-2 font-medium text-sm
                ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'}`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells at the beginning of the month */}
          {emptyStartCells.map((_, index) => (
            <div key={`empty-start-${index}`} className="h-20 bg-gray-50 rounded"></div>
          ))}
          
          {/* Actual calendar days */}
          {days.map(day => (
            <div 
              key={day.toString()} 
              className={`
                p-1 border rounded h-20 relative
                ${isToday(day) ? 'bg-blue-50 border-blue-300' : 'bg-white'}
              `}
            >
              {/* Day number */}
              <div className={`
                text-right text-sm font-medium mb-1
                ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
              </div>
              
              {/* Habits for this day */}
              <div className="overflow-y-auto max-h-[calc(100%-20px)]">
                {habits.slice(0, 3).map(habit => {
                  const isCompleted = isHabitCompletedOnDate(habit.id, day);
                  const colorClass = getCategoryColor(habit.category);
                  
                  return (
                    <div 
                      key={habit.id} 
                      className="flex items-center text-xs mb-1 cursor-pointer"
                      onClick={() => onToggleHabit(habit.id, day)}
                    >
                      {isCompleted 
                        ? <CheckCircle2 className={`h-3 w-3 mr-1 ${colorClass}`} />
                        : <Circle className="h-3 w-3 mr-1 text-gray-300" />
                      }
                      <span className="truncate">{habit.title}</span>
                    </div>
                  );
                })}
                
                {habits.length > 3 && (
                  <div className="text-xs text-gray-500 text-right">
                    +{habits.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Monthly Progress Summary */}
      <div className="monthly-progress">
        <h4 className="text-sm font-medium mb-2">Monthly Progress</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {habits.map(habit => {
            const completionRate = getMonthlyCompletionRate(habit.id);
            const [colorClass] = getCategoryColor(habit.category).split(' ');
            const bgColorClass = colorClass.replace('text-', 'bg-');
            
            return (
              <Card key={habit.id} className="p-2 flex flex-col">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{habit.title}</span>
                  <span className="text-xs">{Math.round(completionRate)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${bgColorClass} h-full rounded-full`}
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

export default MonthCalendarView;