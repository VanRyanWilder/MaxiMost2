import { useState } from 'react';
import { Lightbulb, PlusCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Habit } from '@/types/habit';
import { useToast } from '@/hooks/use-toast';

interface HabitSuggestionsProps {
  userHabits: Habit[];
  userGoals?: string[];
  onAddHabit: (habit: Partial<Habit>) => void;
}

// Sample pairings for suggesting habits based on existing habits
const HABIT_PAIRINGS: Record<string, Partial<Habit>[]> = {
  // Physical/Fitness related pairings
  'workout': [
    {
      title: 'Stretch for 5 minutes',
      description: 'Improve flexibility and recovery',
      icon: 'activity',
      iconColor: 'red',
      category: 'physical',
      impact: 7,
      effort: 2,
      timeCommitment: '5 min',
      frequency: '3x'
    },
    {
      title: 'Drink protein shake',
      description: 'Aid muscle recovery post-workout',
      icon: 'utensils',
      iconColor: 'orange',
      category: 'nutrition',
      impact: 7,
      effort: 2,
      timeCommitment: '2 min',
      frequency: 'daily'
    }
  ],
  'gym': [
    {
      title: 'Plan workout the night before',
      description: 'Prepare your gym routine in advance',
      icon: 'book',
      iconColor: 'amber',
      category: 'mental',
      impact: 8,
      effort: 3,
      timeCommitment: '5 min',
      frequency: 'daily'
    }
  ],
  
  // Nutrition related pairings
  'water': [
    {
      title: 'Eat a serving of vegetables',
      description: 'Add more nutrients to your diet',
      icon: 'utensils',
      iconColor: 'orange',
      category: 'nutrition',
      impact: 8,
      effort: 4,
      timeCommitment: '5 min',
      frequency: 'daily'
    }
  ],
  
  // Sleep related pairings
  'sleep': [
    {
      title: 'No screens 30 minutes before bed',
      description: 'Improve sleep quality by reducing blue light exposure',
      icon: 'moon',
      iconColor: 'indigo',
      category: 'sleep',
      impact: 9,
      effort: 5,
      timeCommitment: '30 min',
      frequency: 'daily'
    },
    {
      title: 'Read before bed',
      description: 'Calming activity to improve sleep quality',
      icon: 'book',
      iconColor: 'amber',
      category: 'mental',
      impact: 7,
      effort: 3,
      timeCommitment: '15 min',
      frequency: 'daily'
    }
  ],
  
  // Mental/Mindfulness related pairings
  'meditate': [
    {
      title: 'Journal for 5 minutes',
      description: 'Write down thoughts to clear your mind',
      icon: 'book',
      iconColor: 'amber',
      category: 'mental',
      impact: 8,
      effort: 3,
      timeCommitment: '5 min',
      frequency: 'daily'
    }
  ],
  'journal': [
    {
      title: 'Practice gratitude',
      description: 'Write down 3 things you are grateful for',
      icon: 'heart',
      iconColor: 'blue',
      category: 'mental',
      impact: 8,
      effort: 2,
      timeCommitment: '3 min',
      frequency: 'daily'
    }
  ],
  
  // Goal-based suggestions
  'weight loss': [
    {
      title: 'Track meals',
      description: 'Log your food intake to maintain awareness',
      icon: 'utensils',
      iconColor: 'orange',
      category: 'nutrition',
      impact: 9,
      effort: 5,
      timeCommitment: '5 min',
      frequency: 'daily'
    },
    {
      title: 'Walk 10 minutes after meals',
      description: 'Light activity to aid digestion and burn calories',
      icon: 'activity',
      iconColor: 'red',
      category: 'physical',
      impact: 7,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily'
    }
  ],
  'productivity': [
    {
      title: 'Plan tomorrow today',
      description: 'Spend 5 minutes planning next day tasks',
      icon: 'book',
      iconColor: 'amber',
      category: 'mental',
      impact: 9,
      effort: 3,
      timeCommitment: '5 min',
      frequency: 'daily'
    },
    {
      title: 'Time-block your day',
      description: 'Allocate specific time blocks for focused work',
      icon: 'clock',
      iconColor: 'amber',
      category: 'mental',
      impact: 8,
      effort: 4,
      timeCommitment: '10 min',
      frequency: 'daily'
    }
  ],
  'stress reduction': [
    {
      title: 'Deep breathing exercises',
      description: '5 minutes of deep breathing to reduce stress',
      icon: 'activity',
      iconColor: 'indigo',
      category: 'mental',
      impact: 8,
      effort: 2,
      timeCommitment: '5 min',
      frequency: 'daily'
    },
    {
      title: 'Go outside for 10 minutes',
      description: 'Get fresh air and sunshine to reduce stress',
      icon: 'sun',
      iconColor: 'amber',
      category: 'mental',
      impact: 7,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily'
    }
  ]
};

// Atomic habits - small, easy-to-start habits mapped by category
const ATOMIC_HABITS: Record<string, Partial<Habit>[]> = {
  physical: [
    {
      title: 'Do 5 push-ups',
      description: 'Quick and simple exercise to build strength',
      icon: 'dumbbell',
      iconColor: 'red',
      category: 'physical',
      impact: 6,
      effort: 2,
      timeCommitment: '2 min',
      frequency: 'daily'
    },
    {
      title: 'Take the stairs',
      description: 'Choose stairs over elevator when possible',
      icon: 'activity',
      iconColor: 'red',
      category: 'physical',
      impact: 5,
      effort: 3,
      timeCommitment: '2 min',
      frequency: 'daily'
    }
  ],
  nutrition: [
    {
      title: 'Drink a glass of water after waking',
      description: 'Hydrate first thing in the morning',
      icon: 'droplets',
      iconColor: 'blue',
      category: 'nutrition',
      impact: 7,
      effort: 1,
      timeCommitment: '1 min',
      frequency: 'daily'
    },
    {
      title: 'Eat one fruit',
      description: 'Simple way to add nutrition to your day',
      icon: 'apple',
      iconColor: 'orange',
      category: 'nutrition',
      impact: 6,
      effort: 2,
      timeCommitment: '2 min',
      frequency: 'daily'
    }
  ],
  mental: [
    {
      title: 'Read one page',
      description: 'Build a reading habit one page at a time',
      icon: 'book',
      iconColor: 'amber',
      category: 'mental',
      impact: 7,
      effort: 2,
      timeCommitment: '3 min',
      frequency: 'daily'
    },
    {
      title: 'Two minutes of mindfulness',
      description: 'Brief mindfulness practice to center yourself',
      icon: 'brain',
      iconColor: 'amber',
      category: 'mental',
      impact: 8,
      effort: 2,
      timeCommitment: '2 min',
      frequency: 'daily'
    }
  ],
  sleep: [
    {
      title: 'Set a bedtime alarm',
      description: 'Reminder to start winding down',
      icon: 'moon',
      iconColor: 'indigo',
      category: 'sleep',
      impact: 8,
      effort: 1,
      timeCommitment: '1 min',
      frequency: 'daily'
    },
    {
      title: 'Make your bed',
      description: 'Start your day with an accomplishment',
      icon: 'bed',
      iconColor: 'indigo',
      category: 'sleep',
      impact: 5,
      effort: 2,
      timeCommitment: '2 min',
      frequency: 'daily'
    }
  ],
  financial: [
    {
      title: 'Track daily spending',
      description: 'Note any expenses to increase awareness',
      icon: 'dollar',
      iconColor: 'green',
      category: 'financial',
      impact: 8,
      effort: 3,
      timeCommitment: '3 min',
      frequency: 'daily'
    }
  ],
  relationships: [
    {
      title: 'Send a message to someone you care about',
      description: 'Simple way to maintain connections',
      icon: 'users',
      iconColor: 'blue',
      category: 'relationships',
      impact: 7,
      effort: 2,
      timeCommitment: '2 min',
      frequency: '3x'
    }
  ]
};

export function HabitSuggestions({ userHabits, userGoals = [], onAddHabit }: HabitSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Partial<Habit>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Function to generate habit suggestions based on existing habits and goals
  const generateSuggestions = () => {
    setIsLoading(true);
    
    // This would be replaced with a real AI call in the future
    const newSuggestions: Partial<Habit>[] = [];
    
    // Check for pairings with existing habits
    userHabits.forEach(habit => {
      // Look for keywords in the habit title
      Object.keys(HABIT_PAIRINGS).forEach(keyword => {
        if (habit.title.toLowerCase().includes(keyword.toLowerCase())) {
          HABIT_PAIRINGS[keyword].forEach(suggestion => {
            // Check if user already has this habit
            const hasHabit = userHabits.some(h => 
              h.title.toLowerCase() === suggestion.title?.toLowerCase()
            );
            
            if (!hasHabit && !newSuggestions.some(s => s.title === suggestion.title)) {
              newSuggestions.push(suggestion);
            }
          });
        }
      });
    });
    
    // Add suggestions based on goals
    userGoals.forEach(goal => {
      Object.keys(HABIT_PAIRINGS).forEach(keyword => {
        if (goal.toLowerCase().includes(keyword.toLowerCase())) {
          HABIT_PAIRINGS[keyword].forEach(suggestion => {
            // Check if user already has this habit
            const hasHabit = userHabits.some(h => 
              h.title.toLowerCase() === suggestion.title?.toLowerCase()
            );
            
            if (!hasHabit && !newSuggestions.some(s => s.title === suggestion.title)) {
              newSuggestions.push(suggestion);
            }
          });
        }
      });
    });
    
    // If no matches were found, add some atomic habits from random categories
    if (newSuggestions.length === 0) {
      const categories = Object.keys(ATOMIC_HABITS);
      // Pick 2-3 random categories
      const randomCategories = categories
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 2) + 2);
      
      randomCategories.forEach(category => {
        const categoryHabits = ATOMIC_HABITS[category];
        if (categoryHabits && categoryHabits.length > 0) {
          // Pick a random habit from this category
          const randomHabit = categoryHabits[Math.floor(Math.random() * categoryHabits.length)];
          
          // Check if user already has this habit
          const hasHabit = userHabits.some(h => 
            h.title.toLowerCase() === randomHabit.title?.toLowerCase()
          );
          
          if (!hasHabit) {
            newSuggestions.push(randomHabit);
          }
        }
      });
    }
    
    // Limit to 3 suggestions maximum
    const limitedSuggestions = newSuggestions.slice(0, 3);
    
    // Simulate an API delay
    setTimeout(() => {
      setSuggestions(limitedSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  const handleAddHabit = (habit: Partial<Habit>) => {
    onAddHabit(habit);
    // Remove from suggestions
    setSuggestions(prev => prev.filter(s => s.title !== habit.title));
    toast({
      title: "Habit added",
      description: `"${habit.title}" has been added to your habits.`,
    });
  };

  const handleDismiss = (habitTitle: string) => {
    setDismissed(prev => ({ ...prev, [habitTitle]: true }));
    setSuggestions(prev => prev.filter(s => s.title !== habitTitle));
  };

  const filteredSuggestions = suggestions.filter(s => s.title && !dismissed[s.title]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-medium">AI Habit Suggestions</h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestions}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Get Suggestions'}
        </Button>
      </div>
      
      {filteredSuggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuggestions.map((habit, index) => (
            <Card key={index} className="overflow-hidden border border-blue-100">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between">
                  <CardTitle className="text-base">{habit.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => habit.title ? handleDismiss(habit.title) : null}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>{habit.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {habit.timeCommitment}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {habit.category}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {habit.frequency === 'daily' ? 'Daily' : habit.frequency}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span>Impact: {habit.impact}/10 • Effort: {habit.effort}/10</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  className="w-full gap-1"
                  onClick={() => handleAddHabit(habit)}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add This Habit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              <p className="text-blue-700">Analyzing your habits and goals...</p>
            </div>
          ) : (
            <p className="text-blue-700">
              Click "Get Suggestions" to generate habit recommendations tailored to your goals and existing habits.
            </p>
          )}
        </div>
      )}
    </div>
  );
}