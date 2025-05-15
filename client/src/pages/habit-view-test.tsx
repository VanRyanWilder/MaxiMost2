import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HabitViewModes } from '@/components/dashboard/habit-view-modes';
import { Card, CardContent } from '@/components/ui/card';
import { Habit } from '@/types/habit';
import { HabitCompletion } from '@/types/habit-completion';

export default function HabitViewTest() {
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
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "4",
      title: "Read",
      description: "Read for 15 minutes",
      icon: "award",
      iconColor: "#f97316",
      impact: 7,
      effort: 3,
      timeCommitment: "15 min",
      frequency: "4x-week",
      isAbsolute: false,
      category: "mind",
      streak: 2,
      createdAt: new Date()
    }
  ]);

  // Sample habit completions
  const [completions, setCompletions] = useState<HabitCompletion[]>([
    {
      id: uuidv4(),
      habitId: "1",
      date: new Date(),
      completed: true
    },
    {
      id: uuidv4(),
      habitId: "2",
      date: new Date(),
      completed: true
    },
    {
      id: uuidv4(),
      habitId: "3",
      date: new Date(),
      completed: false
    }
  ]);

  // Toggle habit completion
  const handleToggleHabit = (habitId: string, date: Date) => {
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && 
      c.date.getFullYear() === date.getFullYear() &&
      c.date.getMonth() === date.getMonth() &&
      c.date.getDate() === date.getDate()
    );

    let updatedCompletions;

    if (existingCompletionIndex >= 0) {
      // Toggle existing completion
      updatedCompletions = [...completions];
      updatedCompletions[existingCompletionIndex] = {
        ...updatedCompletions[existingCompletionIndex],
        completed: !updatedCompletions[existingCompletionIndex].completed
      };
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Habit Tracker with View Modes</h1>
      <p className="text-muted-foreground mb-8">
        A unified habit view with multiple viewing modes and less visual separation between habit types.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          <HabitViewModes
            habits={habits}
            completions={completions}
            onToggleHabit={handleToggleHabit}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </CardContent>
      </Card>
    </div>
  );
}