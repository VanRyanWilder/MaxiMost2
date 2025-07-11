import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Square } from 'lucide-react'; // For completion status
import { FirestoreHabit } from '../../../../shared/types/firestore'; // Adjust path as needed
import { toDate } from '@/lib/utils'; // Updated import path for toDate

interface WeekViewProps {
  habits: FirestoreHabit[];
  currentDate: Date; // To determine the week to display
  // onToggleHabit: (habitId: string, date: Date, value?: number) => void; // For future interaction
}

const WeekView: React.FC<WeekViewProps> = ({ habits, currentDate }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getHabitCompletionForDate = (habit: FirestoreHabit, date: Date): boolean => {
    if (!habit.completions || habit.completions.length === 0) return false;

    return habit.completions.some(completionEntry => {
      const timestampAsDate = toDate(completionEntry.timestamp);
      return timestampAsDate && isSameDay(timestampAsDate, date) && completionEntry.value >= 1;
    });
  };

  if (!habits || habits.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No habits to display for this week.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-black/20 border border-white/10 p-1"> {/* Added container style */}
      <table className="min-w-full divide-y divide-white/20"> {/* Table border */}
        <thead className="bg-white/5"> {/* Header background */}
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider sticky left-0 bg-black/20 z-10"> {/* Header text & sticky bg */}
              Habit
            </th>
            {daysOfWeek.map(day => (
              <th key={day.toISOString()} scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"> {/* Header text */}
                <div>{format(day, 'EEE')}</div>
                <div className="text-sm font-normal">{format(day, 'd')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-transparent divide-y divide-white/10"> {/* Body background and row divide */}
          {habits.map((habit) => (
            <tr key={habit.id || habit.habitId} className="hover:bg-white/5 transition-colors"> {/* Row hover effect */}
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-100 sticky left-0 bg-black/20 z-10"> {/* Cell text & sticky bg */}
                {habit.title}
              </td>
              {daysOfWeek.map(day => (
                <td key={day.toISOString()} className="px-4 py-3 text-center">
                  {getHabitCompletionForDate(habit, day) ? (
                    <CheckSquare className="h-5 w-5 text-green-400 mx-auto" /> /* Adjusted icon color */
                  ) : (
                    <Square className="h-5 w-5 text-gray-600 mx-auto opacity-70" /> /* Adjusted icon color */
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekView;
