import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'; // For navigation and completion
import { FirestoreHabit } from '../../../../shared/types/firestore'; // Adjust path as needed
import { toDate } from '@/lib/utils'; // Updated import path for toDate
import { cn } from '@/lib/utils';

interface MonthViewProps {
  habits: FirestoreHabit[];
  currentDisplayMonth: Date; // The month currently being displayed
  setCurrentDisplayMonth: (date: Date) => void; // To navigate months
  // onToggleHabit: (habitId: string, date: Date, value?: number) => void; // For future interaction
}

const MonthView: React.FC<MonthViewProps> = ({ habits, currentDisplayMonth, setCurrentDisplayMonth }) => {
  const monthStart = startOfMonth(currentDisplayMonth);
  const monthEnd = endOfMonth(currentDisplayMonth);
  // Get the first day of the week for the first week of the month & last day for last week
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Simplified completion check: counts how many habits were completed on a given day.
  const getCompletedHabitsCountForDate = (date: Date): number => {
    let count = 0;
    habits.forEach(habit => {
      if (!habit.completions || habit.completions.length === 0) {
        return;
      }
      // Check if any completion entry for this habit matches the date
      const hasCompletedOnDate = habit.completions.some(completionEntry => {
        const timestampAsDate = toDate(completionEntry.timestamp);
        // Only proceed if timestampAsDate is a valid Date and matches the target date
        return timestampAsDate && isSameDay(timestampAsDate, date) && completionEntry.value >= 1;
      });

      if (hasCompletedOnDate) {
        count++;
      }
    });
    return count;
  };

  const totalHabits = habits.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <Button variant="outline" size="icon" onClick={() => setCurrentDisplayMonth(subMonths(currentDisplayMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-center">
          {format(currentDisplayMonth, 'MMMM yyyy')}
        </h3>
        <Button variant="outline" size="icon" onClick={() => setCurrentDisplayMonth(addMonths(currentDisplayMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-border">
        {daysOfWeek.map(dayName => (
          <div key={dayName} className="py-2 text-center text-xs font-medium text-muted-foreground border-r border-b border-border bg-muted/30">
            {dayName}
          </div>
        ))}
        {daysInCalendar.map((day, index) => {
          const completedCount = getCompletedHabitsCountForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDisplayMonth);
          let bgColor = 'bg-background hover:bg-muted/50';
          if (completedCount > 0 && totalHabits > 0) {
            const completionRatio = completedCount / totalHabits;
            if (completionRatio === 1) bgColor = 'bg-green-100 dark:bg-green-800/50 hover:bg-green-200 dark:hover:bg-green-700/60';
            else if (completionRatio >= 0.5) bgColor = 'bg-yellow-100 dark:bg-yellow-800/50 hover:bg-yellow-200 dark:hover:bg-yellow-700/60';
            else bgColor = 'bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-700/60';
          }

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "h-20 md:h-24 p-1.5 border-r border-b border-border flex flex-col items-center justify-start transition-colors",
                isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-60",
                bgColor,
                isSameDay(day, new Date()) && "ring-2 ring-primary ring-inset" // Highlight today
              )}
            >
              <span className="text-xs font-medium mb-1 self-start">{format(day, 'd')}</span>
              {isCurrentMonth && totalHabits > 0 && (
                <div className="text-center mt-1">
                  {completedCount > 0 ? (
                    <span className={`text-xs font-semibold ${
                      completedCount === totalHabits ? 'text-green-700 dark:text-green-300'
                      : completedCount / totalHabits >= 0.5 ? 'text-yellow-700 dark:text-yellow-300'
                      : 'text-red-700 dark:text-red-300'
                    }`}>
                      {completedCount}/{totalHabits}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
