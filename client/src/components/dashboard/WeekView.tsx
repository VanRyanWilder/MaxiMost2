import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Square } from 'lucide-react'; // For completion status
import { FirestoreHabit } from '../../../../shared/types/firestore'; // Adjust path as needed
import { toDate } from '@/pages/sortable-dashboard-new'; // Import the utility

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
    if (!habit.completions) return false;
    const completion = habit.completions.find(c => isSameDay(toDate(c.timestamp), date));
    // Assuming binary completion for simplicity in week view for now
    return completion ? completion.value >= 1 : false;
  };

  if (!habits || habits.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No habits to display for this week.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider sticky left-0 bg-muted/50 z-10">
              Habit
            </th>
            {daysOfWeek.map(day => (
              <th key={day.toISOString()} scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <div>{format(day, 'EEE')}</div>
                <div className="text-sm font-normal">{format(day, 'd')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background divide-y divide-border">
          {habits.map((habit) => (
            <tr key={habit.habitId}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground sticky left-0 bg-background z-10">
                {habit.title}
              </td>
              {daysOfWeek.map(day => (
                <td key={day.toISOString()} className="px-4 py-3 text-center">
                  {getHabitCompletionForDate(habit, day) ? (
                    <CheckSquare className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground mx-auto opacity-50" />
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
