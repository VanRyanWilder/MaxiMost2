import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, CheckCircle } from 'lucide-react';
// Assuming a structure for HabitStack and a way to get habit details
// This will need to be aligned with actual data structures later.

interface Habit { // Simplified habit structure for display within stack
  id: string;
  title: string;
  // Potentially icon, completion status for the day, etc.
}

interface HabitStack {
  id: string;
  name: string;
  habits: Habit[]; // Assuming habits are populated for display
}

interface HabitStackCardProps {
  stack: HabitStack;
  onCompleteStack: (stackId: string) => void; // Placeholder action
  // Potentially onToggleIndividualHabit: (habitId: string, stackId: string) => void;
}

export const HabitStackCard: React.FC<HabitStackCardProps> = ({ stack, onCompleteStack }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="shadow-md mb-4">
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer py-3 px-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg font-semibold">{stack.name}</CardTitle>
        <div className="flex items-center">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="py-3 px-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Habits in this stack:</p>
          <ul className="space-y-1">
            {stack.habits.map(habit => (
              <li key={habit.id} className="text-sm flex items-center justify-between p-1 hover:bg-muted/50 rounded">
                <span>{habit.title}</span>
                {/* Placeholder for individual habit completion icon/button */}
                {/* <Button variant="ghost" size="icon" className="h-6 w-6"><CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" /></Button> */}
              </li>
            ))}
          </ul>
        </CardContent>
      )}

      <CardFooter className="py-3 px-4 border-t">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card expansion toggle if button is inside header
            onCompleteStack(stack.id);
          }}
          className="w-full"
          size="sm"
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Complete Stack
        </Button>
      </CardFooter>
    </Card>
  );
};
