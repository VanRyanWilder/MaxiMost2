import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Brain, Droplets, BookOpen, Pill } from 'lucide-react';

// A simplified list of suggested habits
const habitSuggestions = [
  {
    id: 'sl-1',
    title: 'Drink 8 glasses of water',
    icon: <Droplets className="h-4 w-4 text-blue-500" />,
    category: 'health'
  },
  {
    id: 'sl-2',
    title: 'Read 10 pages',
    icon: <BookOpen className="h-4 w-4 text-purple-500" />,
    category: 'mind'
  },
  {
    id: 'sl-3',
    title: 'Meditation',
    icon: <Brain className="h-4 w-4 text-green-500" />,
    category: 'mind'
  },
  {
    id: 'sl-4',
    title: 'Take supplements',
    icon: <Pill className="h-4 w-4 text-yellow-500" />,
    category: 'health'
  },
  {
    id: 'sl-5',
    title: 'Exercise 30 minutes',
    icon: <Dumbbell className="h-4 w-4 text-red-500" />,
    category: 'fitness'
  }
];

interface HabitLibraryProps {
  onAddSuggestion?: (habitId: string) => void;
  onCreateCustom?: () => void;
}

export function HabitLibrary({ onAddSuggestion, onCreateCustom }: HabitLibraryProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
          Habit Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {habitSuggestions.map(habit => (
            <div key={habit.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                {habit.icon}
                <span className="ml-2 text-sm font-medium">{habit.title}</span>
                <Badge variant="outline" className="ml-2 text-xs">{habit.category}</Badge>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-blue-500 hover:text-blue-700"
                onClick={() => onAddSuggestion && onAddSuggestion(habit.id)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 text-blue-500 border-blue-500 hover:bg-blue-50"
          onClick={onCreateCustom}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Custom Habit
        </Button>
      </CardContent>
    </Card>
  );
}