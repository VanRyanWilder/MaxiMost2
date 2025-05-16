import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitSuggestions } from '@/components/ai-features/habit-suggestions';
import { StoicCoach } from '@/components/ai-features/stoic-coach';
import { HabitJournal } from '@/components/ai-features/habit-journal';
import { Habit } from '@/types/habit';
import { PageHeader } from '@/components/ui/page-header';

export default function AIFeaturesPage() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [completions, setCompletions] = useLocalStorage('completions', []);
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  
  // Calculate streaks based on completions
  useEffect(() => {
    if (!habits || !completions) return;
    
    const calculateStreaks = () => {
      const today = new Date();
      const result: Record<string, number> = {};
      
      habits.forEach(habit => {
        let streak = 0;
        let currentDate = new Date(today);
        
        // Look back up to 30 days maximum
        for (let i = 0; i < 30; i++) {
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Check if habit was completed on this date
          const completedOnDate = completions.some(
            (c: any) => c.habitId === habit.id && c.date.split('T')[0] === dateString
          );
          
          if (completedOnDate) {
            streak++;
            // Move to previous day
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            // Streak broken
            break;
          }
        }
        
        result[habit.id] = streak;
      });
      
      setStreaks(result);
    };
    
    calculateStreaks();
  }, [habits, completions]);
  
  const handleAddHabit = (newHabit: Partial<Habit>) => {
    const habitToAdd: Habit = {
      id: `habit-${Date.now()}`,
      title: newHabit.title || 'New Habit',
      description: newHabit.description || '',
      icon: newHabit.icon || 'activity',
      iconColor: newHabit.iconColor || 'blue',
      category: newHabit.category || 'physical',
      frequency: newHabit.frequency || 'daily',
      impact: newHabit.impact || 5,
      effort: newHabit.effort || 5,
      timeCommitment: newHabit.timeCommitment || '5 min',
      reminderTime: '',
      tags: [],
      notes: '',
      createdAt: new Date().toISOString(),
      order: habits.length
    };
    
    setHabits([...habits, habitToAdd]);
  };

  // Sample user goals for habit suggestions
  const userGoals = ['weight loss', 'improved sleep', 'stress reduction'];
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="AI Features"
        description="Personalized AI tools to enhance your habit journey"
      />
      
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="suggestions">Habit Suggestions</TabsTrigger>
          <TabsTrigger value="coach">Stoic Coach</TabsTrigger>
          <TabsTrigger value="journal">Habit Journal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions" className="space-y-4">
          <HabitSuggestions 
            userHabits={habits} 
            userGoals={userGoals}
            onAddHabit={handleAddHabit}
          />
        </TabsContent>
        
        <TabsContent value="coach">
          <StoicCoach
            habits={habits}
            completions={completions}
            streaks={streaks}
          />
        </TabsContent>
        
        <TabsContent value="journal">
          <HabitJournal userId="user-1" />
        </TabsContent>
      </Tabs>
    </div>
  );
}