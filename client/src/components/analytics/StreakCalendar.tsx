import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Assuming shadcn/ui Card

const StreakCalendar: React.FC = () => {
  // Placeholder data for days (e.g., last 365 days)
  // In a real implementation, this would be generated based on dates and completion data
  const days = Array(365).fill(0).map((_, i) => ({
    id: i,
    // Mock intensity: 0 = no completion, 1-4 = increasing completion
    intensity: Math.floor(Math.random() * 5),
  }));

  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0: return 'bg-muted/20 hover:bg-muted/40'; // No completions
      case 1: return 'bg-green-200 hover:bg-green-300';  // Low
      case 2: return 'bg-green-400 hover:bg-green-500';  // Medium
      case 3: return 'bg-green-600 hover:bg-green-700';  // High
      case 4: return 'bg-green-800 hover:bg-green-900';  // Very High
      default: return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Habit Completion Streak (Past Year)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Each square represents a day. Darker shades indicate higher habit completion intensity. (Placeholder data)
        </p>
        <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-1 overflow-x-auto p-1 bg-background rounded">
          {/* This creates a grid that's roughly 53 columns wide (for 52-53 weeks in a year) */}
          {/* Actual GitHub-style graphs often align items into 7-day columns. This is a simplified placeholder. */}
          {days.map((day) => (
            <div
              key={day.id}
              title={`Day ${day.id + 1} - Intensity: ${day.intensity}`}
              className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm ${getIntensityColor(day.intensity)} transition-colors duration-150 cursor-pointer`}
            />
          ))}
        </div>
        <div className="flex justify-end items-center mt-3 space-x-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-green-200"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-green-400"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-green-600"></div>
          <div className="w-2.5 h-2.5 rounded-sm bg-green-800"></div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;
