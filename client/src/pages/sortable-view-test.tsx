import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SortableHabitViewModes } from '@/components/dashboard/sortable-habit-view-modes';
import { Card, CardContent } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import { HabitCompletion, isSameDay } from '@/types/habit-completion';

export default function SortableViewTest() {
  // Sample habits data
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Drink Water",
      description: "Drink at least 8 glasses of water daily",
      icon: "activity",
      iconColor: "#3b82f6",
      impact: 8,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 5,
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Meditate",
      description: "Meditate for 10 minutes",
      icon: "zap",
      iconColor: "#8b5cf6",
      impact: 9,
      effort: 4,
      timeCommitment: "10 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 3,
      createdAt: new Date()
    },
    {
      id: "3",
      title: "Workout",
      description: "Complete a strength training session",
      icon: "star",
      iconColor: "#ef4444",
      impact: 10,
      effort: 7,
      timeCommitment: "45 min",
      frequency: "3x-week",
      isAbsolute: false,
      category: "fitness",
      streak: 1,
      createdAt: new Date()
    },
    {
      id: "4",
      title: "Read Book",
      description: "Read for 30 minutes",
      icon: "award",
      iconColor: "#f59e0b",
      impact: 7,
      effort: 3,
      timeCommitment: "30 min",
      frequency: "4x-week",
      isAbsolute: false,
      category: "mind",
      streak: 2,
      createdAt: new Date()
    },
    {
      id: "5",
      title: "Plan Tomorrow",
      description: "Plan tasks for the next day",
      icon: "calendar",
      iconColor: "#10b981",
      impact: 6,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "5x-week",
      isAbsolute: false,
      category: "productivity",
      streak: 0,
      createdAt: new Date()
    }
  ]);

  // Sample completions data
  const [completions, setCompletions] = useState<HabitCompletion[]>([
    { id: "1", habitId: "1", date: new Date(), completed: true },
    { id: "2", habitId: "2", date: new Date(), completed: true },
    { id: "3", habitId: "3", date: subDays(new Date(), 1), completed: true },
    { id: "4", habitId: "3", date: subDays(new Date(), 3), completed: true },
    { id: "5", habitId: "4", date: subDays(new Date(), 2), completed: true },
    { id: "6", habitId: "4", date: subDays(new Date(), 4), completed: true },
    { id: "7", habitId: "5", date: subDays(new Date(), 1), completed: true },
  ]);

  // Helper function to subtract days from a date
  function subDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  // Toggle habit completion
  const handleToggleHabit = (habitId: string, date: Date) => {
    const existingCompletion = completions.find(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date)
    );

    let updatedCompletions = [...completions];

    // If completion exists, toggle it
    if (existingCompletion) {
      updatedCompletions = updatedCompletions.map(c => 
        c.id === existingCompletion.id 
          ? { ...c, completed: !c.completed } 
          : c
      );
    } else {
      // Create new completion
      updatedCompletions = [
        ...completions, 
        {
          id: uuidv4(),
          habitId,
          date: new Date(date),
          completed: true
        }
      ];
    }

    setCompletions(updatedCompletions);
  };

  // Add new habit
  const handleAddHabit = () => {
    // This would open a dialog to add a new habit
    const newHabit: Habit = {
      id: uuidv4(),
      title: "New Habit",
      description: "Description of the new habit",
      icon: "activity",
      iconColor: "#0ea5e9",
      impact: 5,
      effort: 5,
      timeCommitment: "minimal",
      frequency: "daily",
      isAbsolute: false,
      category: "custom",
      streak: 0,
      createdAt: new Date()
    };

    setHabits([...habits, newHabit]);
  };

  // Update habit
  const handleUpdateHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map(h => 
      h.id === updatedHabit.id ? updatedHabit : h
    );
    setHabits(updatedHabits);
  };

  // Delete habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
    setCompletions(completions.filter(c => c.habitId !== habitId));
  };

  // Reorder habits
  const handleReorderHabits = (reorderedHabits: Habit[]) => {
    setHabits(reorderedHabits);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Habit Tracker with Drag-and-Drop</h1>
      <p className="text-muted-foreground mb-8">
        A unified habit view with multiple viewing modes and drag-and-drop functionality.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <SortableHabitViewModes
            habits={habits}
            completions={completions}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onReorderHabits={handleReorderHabits}
          />
        </CardContent>
      </Card>
    </div>
  );
}