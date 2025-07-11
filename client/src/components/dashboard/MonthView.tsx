import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns'; // Added parseISO
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'; // For navigation and completion
import { FirestoreHabit } from '../../../../shared/types/firestore'; // Adjust path as needed
import { toDate } from '@/lib/utils'; // Updated import path for toDate
import { cn } from '@/lib/utils';

interface MonthViewProps {
  habits: FirestoreHabit[];
  currentDisplayMonth: Date;
  setCurrentDisplayMonth: (date: Date) => void;
  onNavigateToDay?: (date: Date) => void; // New prop to handle navigation
  // onToggleHabit prop is available from DashboardPage but might not be used directly for toggling in month cells
  onToggleHabit?: (habitId: string, date: Date, value?: number) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ habits, currentDisplayMonth, setCurrentDisplayMonth, onNavigateToDay }) => {
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
        if (!completionEntry.date) return false; // Guard for safety
        // completionEntry.date is "YYYY-MM-DD" string, 'date' is a Date object
        return isSameDay(parseISO(completionEntry.date), date) && completionEntry.value >= 1;
      });

      if (hasCompletedOnDate) {
        count++;
      }
    });
    return count;
  };

  const totalHabits = habits.length;

  return (
    // Apply GlassCard like styling to the main container for MonthView
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDisplayMonth(subMonths(currentDisplayMonth, 1))}
          className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass style
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold text-center text-gray-100"> {/* Text color */}
          {format(currentDisplayMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDisplayMonth(addMonths(currentDisplayMonth, 1))}
          className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass style
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-white/20"> {/* Grid border */}
        {daysOfWeek.map(dayName => (
          // Day name header styling
          <div key={dayName} className="py-2 text-center text-xs font-medium text-gray-400 border-r border-b border-white/20 bg-white/5">
            {dayName}
          </div>
        ))}
        {daysInCalendar.map((day, index) => {
          const completedCount = getCompletedHabitsCountForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDisplayMonth);

          let dayCellBgColor = 'bg-white/5 hover:bg-white/10'; // Default for current month, no completion
          let dayCellTextColor = 'text-gray-100';
          let completionTextColor = 'text-gray-400';

          if (!isCurrentMonth) {
            dayCellBgColor = 'bg-black/10 hover:bg-black/20'; // Darker for other months
            dayCellTextColor = 'text-gray-600 opacity-70';
          } else if (completedCount > 0 && totalHabits > 0) {
            const completionRatio = completedCount / totalHabits;
            if (completionRatio === 1) { // All habits done
              dayCellBgColor = 'bg-green-500/30 hover:bg-green-500/40';
              completionTextColor = 'text-green-300';
            } else if (completionRatio >= 0.5) { // More than half done
              dayCellBgColor = 'bg-yellow-500/30 hover:bg-yellow-500/40';
              completionTextColor = 'text-yellow-300';
            } else { // Some habits done, but less than half
              dayCellBgColor = 'bg-blue-500/30 hover:bg-blue-500/40'; // Changed from red to blue for positive indication
              completionTextColor = 'text-blue-300';
            }
          }

          return (
            <button // Changed div to button for better accessibility and click handling
              type="button"
              key={day.toISOString()}
              onClick={() => {
                if (isCurrentMonth && onNavigateToDay) {
                  onNavigateToDay(day);
                }
              }}
              disabled={!isCurrentMonth} // Disable clicks on days not in the current month
              className={cn(
                "h-20 md:h-24 p-1.5 border-r border-b border-white/20 flex flex-col items-center justify-start transition-colors text-left w-full", // Added text-left and w-full for button
                dayCellTextColor,
                dayCellBgColor,
                isSameDay(day, new Date()) && "ring-2 ring-blue-400 ring-inset", // Highlight today
                isCurrentMonth ? "cursor-pointer" : "cursor-default" // Pointer only for current month days
              )}
            >
              <span className="text-xs font-medium mb-1 self-start">{format(day, 'd')}</span>
              {isCurrentMonth && totalHabits > 0 && (
                <div className="text-center mt-1">
                  {completedCount > 0 ? (
                    <span className={cn("text-xs font-semibold", completionTextColor)}>
                      {completedCount}/{totalHabits}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">-</span> // Muted for no completion
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
