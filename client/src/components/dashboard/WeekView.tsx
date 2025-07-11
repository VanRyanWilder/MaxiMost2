import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { CheckSquare, Square } from 'lucide-react'; // Keep for quantitative display if needed
import { FirestoreHabit } from '../../../../shared/types/firestore';
import { toDate } from '@/lib/utils';

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
                    className={cn(
                      "px-4 py-3 text-center transition-colors",
                      isCompleted && habit.type === "binary" ? "bg-green-500/10 hover:bg-green-500/20" : "",
                      isCompleted && habit.type === "quantitative" ? "bg-blue-500/10" : "", // Different bg for logged quantitative
                      habit.type === "binary" ? "cursor-pointer hover:bg-white/5" : "cursor-default"
                    )}
                    onClick={() => {
                      if (onToggleHabit && habit.id && habit.type === "binary") {
                        onToggleHabit(habit.id, day);
                      }
                      // For quantitative, no direct toggle from week view cell click, direct to day view
                      if (habit.type === "quantitative") {
                        toast({ title: "Log Value", description: `Please log value for "${habit.title}" from the Day view or habit details.`, variant: "info" });
                      }
                    }}
                  >
                    {habit.type === "binary" ? (
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => { // onCheckedChange is better for Checkbox
                          if (onToggleHabit && habit.id) {
                            onToggleHabit(habit.id, day);
                          }
                        }}
                        className="data-[state=checked]:bg-green-500/80 data-[state=checked]:border-green-500/50 border-gray-500"
                      />
                    ) : (
                      // Display for quantitative habits (non-interactive icon)
                      isCompleted ? (
                        <CheckSquare className="h-5 w-5 text-blue-400 fill-blue-500/30 mx-auto" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-600 mx-auto opacity-70" />
                      )
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
