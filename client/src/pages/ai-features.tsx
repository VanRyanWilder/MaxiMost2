import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HabitSuggestions } from '@/components/ai-features/habit-suggestions';
import { StoicCoach } from '@/components/ai-features/stoic-coach';
import { HabitJournal } from '@/components/ai-features/habit-journal';
import { PageHeader } from '@/components/ui/page-header';
import { Sparkles, Leaf, BookText } from 'lucide-react';
import { Habit, HabitCompletion } from '@/types/habit';

// Sample data - in a real application this would come from the database
const sampleHabits: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Cardio',
    description: '30-minute cardio session',
    icon: 'running',
    iconColor: 'red',
    category: 'physical',
    frequency: '5x-week',
    impact: 8,
    effort: 7,
    timeCommitment: '30 min',
    isAbsolute: false,
    streak: 5,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 'habit-2',
    title: 'Daily Meditation',
    description: '10-minute mindfulness practice',
    icon: 'brain',
    iconColor: 'amber',
    category: 'mental',
    frequency: 'daily',
    impact: 9,
    effort: 4,
    timeCommitment: '10 min',
    isAbsolute: true,
    streak: 12,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'habit-3',
    title: 'Water Intake',
    description: 'Drink 3L of water daily',
    icon: 'droplet',
    iconColor: 'blue',
    category: 'nutrition',
    frequency: 'daily',
    impact: 8,
    effort: 3,
    timeCommitment: 'minimal',
    isAbsolute: true,
    streak: 2,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

const sampleCompletions: HabitCompletion[] = [
  {
    id: 'completion-1',
    habitId: 'habit-1',
    date: new Date().toISOString(),
    completed: true
  },
  {
    id: 'completion-2',
    habitId: 'habit-2',
    date: new Date().toISOString(),
    completed: true
  },
  {
    id: 'completion-3',
    habitId: 'habit-3',
    date: new Date().toISOString(),
    completed: false
  }
];

const sampleStreaks: Record<string, number> = {
  'habit-1': 5,
  'habit-2': 12,
  'habit-3': 2
};

export default function AIFeaturesPage() {
  const [userGoals] = useState<string[]>(['weight loss', 'improved sleep', 'stress reduction']);
  const [userHabits, setUserHabits] = useState<Habit[]>(sampleHabits);
  
  // Handle adding a new habit from suggestions
  const handleAddHabit = (habit: Partial<Habit>) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: habit.title || 'New Habit',
      description: habit.description || '',
      icon: habit.icon || 'activity',
      iconColor: habit.iconColor || 'gray',
      category: habit.category || 'general',
      frequency: habit.frequency || 'daily',
      impact: habit.impact || 5,
      effort: habit.effort || 5,
      timeCommitment: habit.timeCommitment || 'minimal'
    };
    
    setUserHabits([...userHabits, newHabit]);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <PageHeader 
        title="AI Features" 
        description="Tools powered by artificial intelligence to help you build and maintain better habits."
      />
      
      <Tabs defaultValue="suggestions" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Habit Suggestions</span>
          </TabsTrigger>
          <TabsTrigger value="coach" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Stoic Coach</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span>Habit Journal</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions">
          <HabitSuggestions 
            userHabits={userHabits} 
            userGoals={userGoals}
            onAddHabit={handleAddHabit}
          />
        </TabsContent>
        
        <TabsContent value="coach">
          <StoicCoach 
            habits={userHabits}
            completions={sampleCompletions}
            streaks={sampleStreaks}
          />
        </TabsContent>
        
        <TabsContent value="journal">
          <HabitJournal userId="user-1" />
        </TabsContent>
      </Tabs>
    </div>
  );
}