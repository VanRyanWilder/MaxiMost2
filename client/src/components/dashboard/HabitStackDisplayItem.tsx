import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Layers, CheckSquare } from 'lucide-react'; // Layers for stack icon, CheckSquare for completion

// Assuming a similar structure for stack data as used in sortable-dashboard-new.tsx's mockStacks
interface HabitStack {
  id: string;
  name: string;
  habits: Array<{ id: string; title: string }>; // Simplified habit structure for display
}

interface HabitStackDisplayItemProps {
  stack: HabitStack;
  onCompleteStack: (stackId: string) => void;
  // isCompletedToday?: boolean; // Future: To show visual feedback if stack is done
}

export const HabitStackDisplayItem: React.FC<HabitStackDisplayItemProps> = ({
  stack,
  onCompleteStack,
  // isCompletedToday,
}) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{stack.name}</CardTitle>
          </div>
          {/* Placeholder for future: Visual indication of completion status */}
          {/* {isCompletedToday && <CheckSquare className="h-5 w-5 text-green-500" />} */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">Contains {stack.habits.length} habits:</p>
        <ul className="list-disc list-inside pl-4 text-sm space-y-0.5 max-h-20 overflow-y-auto">
          {stack.habits.map(habit => (
            <li key={habit.id} className="truncate" title={habit.title}>{habit.title}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onCompleteStack(stack.id)}
          className="w-full bg-primary hover:bg-primary/90"
          // disabled={isCompletedToday} // Future: Disable if already completed
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Complete Stack for Today
        </Button>
      </CardFooter>
    </Card>
  );
};
