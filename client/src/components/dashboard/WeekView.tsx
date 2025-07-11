import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'; // Added parseISO
import { toast } from "@/hooks/use-toast"; // Import toast
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Square } from 'lucide-react'; // For completion status
import { FirestoreHabit } from '../../../../shared/types/firestore'; // Adjust path as needed
import { toDate } from '@/lib/utils'; // Updated import path for toDate

interface WeekViewProps {
  habits: FirestoreHabit[];
  currentDate: Date; // To determine the week to display
  onToggleHabit?: (habitId: string, date: Date, value?: number) => void; // Added for interactivity
}

const WeekView: React.FC<WeekViewProps> = ({ habits, currentDate, onToggleHabit }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getHabitCompletionForDate = (habit: FirestoreHabit, date: Date): boolean => {
    if (!habit.completions || habit.completions.length === 0) return false;

    return habit.completions.some(completionEntry => {
      if (!completionEntry.date) return false; // Guard for safety
      // completionEntry.date is "YYYY-MM-DD" string, 'date' is a Date object
      return isSameDay(parseISO(completionEntry.date), date) && completionEntry.value >= 1;
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
              {daysOfWeek.map(day => {
                const isCompleted = getHabitCompletionForDate(habit, day);
                return (
                  <td
                    key={day.toISOString()}
                    className="px-4 py-3 text-center cursor-pointer"
                    onClick={() => {
                      if (onToggleHabit && habit.id && habit.type === "binary") { // Only toggle binary habits directly
                        onToggleHabit(habit.id, day);
                      } else if (onToggleHabit && habit.id && habit.type === "quantitative") {
                        // For quantitative, direct toggle might not make sense.
                        // Could open a modal or simply not be interactive from week view.
                        // For now, let's make it toggle completion if already logged (to clear it), or do nothing if not logged.
                        // This is a simplification. A full quant log from week view is a larger feature.
                        if (isCompleted) {
                           onToggleHabit(habit.id, day, 0); // Send 0 to clear/un-complete
                        } else {
                          // Optionally, prompt or open modal for quantitative input here
                           toast({ title: "Log Value", description: `Please log value for "${habit.title}" from the Day view or habit details.`, variant: "info" });
                        }
                      }
                    }}
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-green-400 mx-auto" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-600 mx-auto opacity-70" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekView;
