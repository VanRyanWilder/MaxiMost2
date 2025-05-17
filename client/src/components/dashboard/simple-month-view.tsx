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
import { Habit } from '@/types/habit';

interface MonthCalendarViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type when available
  currentMonth: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
}

// Helper function to get category color from habit
const getCategoryColor = (category: string, iconColor: string): string => {
  // Map category to color or use iconColor as fallback
  switch(category.toLowerCase()) {
    case 'physical':
      return 'text-red-500';
    case 'nutrition':
      return 'text-orange-500';
    case 'sleep':
      return 'text-indigo-500';
    case 'mental':
      return 'text-yellow-500';
    case 'relationships':
      return 'text-blue-500';
    case 'financial':
      return 'text-green-500';
    default:
      // Use iconColor as fallback
      return `text-${iconColor}-500`;
  }
};

export const SimpleMonthView: React.FC<MonthCalendarViewProps> = ({
  habits,
  completions,
  currentMonth,
  onToggleHabit
}) => {
  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date) &&
      completion.completed
    );
  };
  
  // Calculate monthly completion rate for each habit
  const getMonthlyCompletionRate = (habit: Habit): number => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const completedDays = completions.filter(
      completion => 
        completion.habitId === habit.id && 
        isSameMonth(new Date(completion.date), currentMonth) &&
        completion.completed
    ).length;
    
    let expectedCompletions = daysInMonth;
    
    if (!habit.isAbsolute) {
      // Handle different frequency patterns
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

  // Generate a grid of week rows
  const generateCalendarGrid = () => {
    const firstDay = startOfMonth(currentMonth);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create blank cells for days before the first of the month
    const blanks = Array(firstDayOfWeek).fill(null).map((_, i) => (
      <div key={`blank-${i}`} className="h-24 bg-gray-50 rounded border border-gray-100"></div>
    ));
    
    // Create cells for each day in the month
    const dayCells = days.map(day => (
      <div 
        key={day.toString()} 
        className={`
          h-24 p-1 rounded border border-gray-200 overflow-y-auto
          ${isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-white'}
        `}
      >
        <div className={`text-right text-sm font-medium mb-1 ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
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
                ? <CheckCircle2 className={`h-3 w-3 mr-1 ${getCategoryColor(habit.category, habit.iconColor)}`} /> 
                : <Circle className="h-3 w-3 mr-1 text-gray-300" />
              }
              <span className="truncate">{habit.title}</span>
            </div>
          ))}
          
          {habits.length > 3 && (
            <div className="text-xs text-gray-500 italic">+{habits.length - 3} more</div>
          )}
        </div>
      </div>
    ));
    
    // Combine blanks and days
    return [...blanks, ...dayCells];
  };

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <div className="calendar-grid">
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
            const colorClass = getCategoryColor(habit.category, habit.iconColor);
            const bgColorClass = colorClass.replace('text-', 'bg-');
            
            return (
              <Card key={habit.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${bgColorClass} mr-2`}></div>
                    <span className="font-medium text-sm">{habit.title}</span>
                  </div>
                  <span className="text-xs">{Math.round(completionRate)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${bgColorClass} h-full rounded-full`}
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimpleMonthView;