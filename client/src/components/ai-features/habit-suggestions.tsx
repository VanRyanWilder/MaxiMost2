import React, { useState } from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, PlusCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EnhancedHabitIcon } from '@/components/ui/enhanced-habit-icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HabitSuggestionsProps {
  userHabits: Habit[];
  userGoals: string[];
  onAddHabit: (habit: Partial<Habit>) => void;
}

// Predefined habit suggestions based on common goals
const HABIT_SUGGESTIONS: Record<string, Partial<Habit>[]> = {
  'weight loss': [
    {
      title: 'Daily 16:8 Intermittent Fasting',
      description: 'Fast for 16 hours, eat during an 8-hour window each day',
      icon: 'timer', 
      iconColor: 'amber',
      category: 'nutrition',
      frequency: 'daily',
      impact: 8,
      effort: 6,
      timeCommitment: 'minimal'
    },
    {
      title: 'Morning Protein-Rich Breakfast',
      description: 'Start each day with at least 20g of protein to reduce hunger throughout the day',
      icon: 'utensils', 
      iconColor: 'orange',
      category: 'nutrition',
      frequency: '6x-week',
      impact: 7,
      effort: 4,
      timeCommitment: '10 min'
    },
    {
      title: 'Zone 2 Cardio Training',
      description: 'Low-intensity steady state cardio at 60-70% of max heart rate',
      icon: 'heartpulse', 
      iconColor: 'red',
      category: 'physical',
      frequency: '3x-week',
      impact: 9,
      effort: 7,
      timeCommitment: '45 min'
    }
  ],
  'improved sleep': [
    {
      title: 'Digital Sunset: No Screens Before Bed',
      description: 'Turn off all screens 1 hour before bedtime to improve sleep quality',
      icon: 'moon', 
      iconColor: 'indigo',
      category: 'sleep',
      frequency: 'daily',
      impact: 9,
      effort: 6,
      timeCommitment: 'minimal'
    },
    {
      title: 'Consistent Sleep Schedule',
      description: 'Go to bed and wake up at the same time every day',
      icon: 'bed', 
      iconColor: 'indigo',
      category: 'sleep',
      frequency: 'daily',
      impact: 10,
      effort: 7,
      timeCommitment: 'minimal'
    },
    {
      title: 'Evening Magnesium Supplement',
      description: 'Take magnesium glycinate before bed to promote deeper sleep',
      icon: 'pill', 
      iconColor: 'indigo',
      category: 'sleep',
      frequency: 'daily',
      impact: 7,
      effort: 2,
      timeCommitment: '5 min'
    }
  ],
  'stress reduction': [
    {
      title: 'Daily Meditation Practice',
      description: 'Mindfulness meditation to reduce stress and improve focus',
      icon: 'brain', 
      iconColor: 'amber',
      category: 'mental',
      frequency: 'daily',
      impact: 9,
      effort: 5,
      timeCommitment: '15 min'
    },
    {
      title: 'Nature Walk',
      description: 'Regular walks in nature to reduce cortisol levels and improve mood',
      icon: 'activity', 
      iconColor: 'green',
      category: 'mental',
      frequency: '3x-week',
      impact: 7,
      effort: 4,
      timeCommitment: '30 min'
    },
    {
      title: 'Journaling Practice',
      description: 'Daily journaling to process emotions and reduce mental clutter',
      icon: 'booktext', 
      iconColor: 'amber',
      category: 'mental',
      frequency: '4x-week',
      impact: 8,
      effort: 3,
      timeCommitment: '10 min'
    }
  ]
};

// Generate additional suggestions that are complementary to existing habits
function generateComplementaryHabits(habits: Habit[]): Partial<Habit>[] {
  const categories = habits.map(h => h.category);
  const complementary: Partial<Habit>[] = [];
  
  // If user has fitness habits but no nutrition habits
  if (categories.includes('physical') && !categories.includes('nutrition')) {
    complementary.push({
      title: 'Post-Workout Protein',
      description: 'Consume protein within 30 minutes after exercise',
      icon: 'utensils',
      iconColor: 'orange',
      category: 'nutrition',
      frequency: '4x-week',
      impact: 8,
      effort: 3,
      timeCommitment: '5 min'
    });
  }
  
  // If user has workout habits but no recovery habits
  if (categories.includes('physical') && !categories.some(c => c === 'sleep')) {
    complementary.push({
      title: 'Recovery Day Protocol',
      description: 'Active recovery, stretching, and foam rolling',
      icon: 'heart', 
      iconColor: 'red',
      category: 'physical',
      frequency: '2x-week',
      impact: 7,
      effort: 4,
      timeCommitment: '20 min'
    });
  }
  
  // If user has mental habits but no social habits
  if (categories.includes('mental') && !categories.includes('relationships')) {
    complementary.push({
      title: 'Weekly Social Connection',
      description: 'Meaningful conversation with a friend or family member',
      icon: 'users', 
      iconColor: 'blue',
      category: 'relationships',
      frequency: '2x-week',
      impact: 8,
      effort: 5,
      timeCommitment: '45 min'
    });
  }
  
  return complementary;
}

export function HabitSuggestions({ userHabits, userGoals, onAddHabit }: HabitSuggestionsProps) {
  const [addedHabits, setAddedHabits] = useState<Record<string, boolean>>({});
  
  // Get suggestions based on goals and complementary habits
  const goalSuggestions = userGoals.flatMap(goal => 
    HABIT_SUGGESTIONS[goal] || []
  );
  
  const complementarySuggestions = generateComplementaryHabits(userHabits);
  
  // Combine all suggestions
  const allSuggestions = [...goalSuggestions, ...complementarySuggestions];
  
  // Filter out suggestions that match existing habits
  const filteredSuggestions = allSuggestions.filter(suggestion => 
    !userHabits.some(habit => 
      habit.title.toLowerCase() === suggestion.title?.toLowerCase()
    )
  );

  const handleAddHabit = (habit: Partial<Habit>) => {
    onAddHabit(habit);
    setAddedHabits({
      ...addedHabits,
      [habit.title || '']: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-xl font-semibold">AI-Powered Habit Suggestions</h2>
      </div>
      
      <Alert>
        <AlertDescription>
          Based on your current habits and goals, here are some high-impact habits you might consider adding to your routine.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((habit, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <EnhancedHabitIcon 
                    icon={habit.icon || 'activity'} 
                    color={habit.iconColor}
                    category={habit.category || 'health'} 
                    size="sm" 
                  />
                  <div>
                    <CardTitle className="text-base">{habit.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {habit.category ? habit.category.charAt(0).toUpperCase() + habit.category.slice(1) : 'General'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {habit.frequency || 'daily'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {habit.timeCommitment}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="text-sm text-muted-foreground pb-3">
                <p>{habit.description}</p>
              </CardContent>
              
              <CardFooter className="pt-0 pb-3 flex justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Impact:</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`h-1.5 w-4 rounded-full mx-0.5 ${
                          i < ((habit.impact || 5) / 2) 
                            ? 'bg-green-500' 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {addedHabits[habit.title || ''] ? (
                  <Button variant="outline" size="sm" className="gap-1" disabled>
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span>Added</span>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleAddHabit(habit)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Habit</span>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center p-8">
            <p className="text-muted-foreground">
              No additional habit suggestions at this time. Check back after adding more habits or goals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}