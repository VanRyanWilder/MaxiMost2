import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Replaced by GlassCard
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle
} from "@/components/glass/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Dumbbell, 
  Brain, 
  Droplets, 
  BookOpen, 
  Pill, 
  Sun, 
  Moon, 
  Coffee,
  Apple,
  Utensils, 
  BedIcon,
  Smartphone,
  Timer,
  ScrollText,
  Smile,
  Activity,
  CheckSquare,
  Zap,
  Library,
  X
} from 'lucide-react';
import { HabitFrequency, HabitCategory } from "@/types/habit";

// HabitStackCard Component - separated to avoid React Hooks errors
interface HabitStackCardProps {
  stack: any;
  onAddHabit: (habit: any) => void;
}

function HabitStackCard({ stack, onAddHabit }: HabitStackCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    stack.habits.forEach((habit: any) => {
      initial[habit.id] = true; // Initially select all habits
    });
    return initial;
  });
  
  // For debugging
  useEffect(() => {
    console.log('Selected habits:', selectedHabits);
  }, [selectedHabits]);
  
  const toggleHabitSelection = (habitId: string) => {
    setSelectedHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
  };
  
  const handleCardClick = () => {
    // If dialog is not open, just show the dialog
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  const addSelectedHabits = () => {
    console.log("Adding selected habits");
    const selectedHabitIds = Object.entries(selectedHabits)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    console.log("Selected habit IDs:", selectedHabitIds);
    
    // Get the actual habit objects for selected IDs
    const habitsToAdd = stack.habits.filter((habit: any) => 
      selectedHabitIds.includes(habit.id)
    );
    
    console.log("Habits to add:", habitsToAdd);
    
    if (habitsToAdd.length > 0) {
      // Generate a timestamp once to ensure each habit gets a unique but related timestamp
      const timestamp = Date.now();
      
      // Create an array of all habits with unique IDs
      const uniqueHabits = habitsToAdd.map((habit: any, index: number) => ({
        ...habit,
        id: `${habit.id}-${timestamp}-${index}-${Math.random().toString(36).substring(2, 9)}`
      }));
      
      console.log("Created unique habits:", uniqueHabits.map(h => h.title));
      
      // Add each habit one by one
      uniqueHabits.forEach((uniqueHabit: any, index: number) => {
        console.log(`Adding habit ${index+1}/${uniqueHabits.length}:`, uniqueHabit.title);
        onAddHabit(uniqueHabit);
      });
    }
    setIsOpen(false);
  };
  
  // Helper function to render icons
  const renderIcon = (icon: string, color: string = 'blue') => {
    const iconMap: Record<string, React.ReactNode> = {
      dumbbell: <Dumbbell className={`text-${color}-500 h-5 w-5`} />,
      brain: <Brain className={`text-${color}-500 h-5 w-5`} />,
      droplets: <Droplets className={`text-${color}-500 h-5 w-5`} />,
      book: <BookOpen className={`text-${color}-500 h-5 w-5`} />,
      pill: <Pill className={`text-${color}-500 h-5 w-5`} />,
      sun: <Sun className={`text-${color}-500 h-5 w-5`} />,
      moon: <Moon className={`text-${color}-500 h-5 w-5`} />,
      coffee: <Coffee className={`text-${color}-500 h-5 w-5`} />,
      apple: <Apple className={`text-${color}-500 h-5 w-5`} />,
      food: <Utensils className={`text-${color}-500 h-5 w-5`} />,
      bed: <BedIcon className={`text-${color}-500 h-5 w-5`} />,
      phone: <Smartphone className={`text-${color}-500 h-5 w-5`} />,
      timer: <Timer className={`text-${color}-500 h-5 w-5`} />,
      scroll: <ScrollText className={`text-${color}-500 h-5 w-5`} />,
      smile: <Smile className={`text-${color}-500 h-5 w-5`} />,
      activity: <Activity className={`text-${color}-500 h-5 w-5`} />,
      check: <CheckSquare className={`text-${color}-500 h-5 w-5`} />,
      zap: <Zap className={`text-${color}-500 h-5 w-5`} />,
      library: <Library className={`text-${color}-500 h-5 w-5`} />,
    };
    
    return iconMap[icon] || <Activity className={`text-${color}-500 h-5 w-5`} />;
  };
  
  return (
    <>
      {/* Stack Card */}
      <div 
        className="p-3 rounded-md bg-gray-50 dark:bg-gray-800 shadow-sm flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex-shrink-0 mb-1">
          {renderIcon(stack.icon, stack.iconColor)}
        </div>
        <div className="w-full text-center">
          <p className="text-sm font-medium text-foreground dark:text-gray-100">
            {stack.title}
          </p>
          <p className="text-xs text-muted-foreground dark:text-gray-300 line-clamp-2 h-8">{stack.description}</p>
        </div>
        <Badge variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
          {stack.habits.length} habits
        </Badge>
      </div>
      
      {/* Detailed Stack Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-md mx-4 p-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-gray-100">
                {renderIcon(stack.icon, stack.iconColor)}
                {stack.title}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm mb-4 dark:text-gray-300">{stack.description}</p>
            
            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium dark:text-gray-200">Select habits to add:</h4>
              {stack.habits.map((habit: any) => (
                <div 
                  key={habit.id}
                  className="flex items-start p-2 rounded border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center h-5 mr-2 mt-0.5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={selectedHabits[habit.id]}
                      onChange={() => toggleHabitSelection(habit.id)}
                    />
                  </div>
                  <div className="flex flex-1 items-center gap-2">
                    {renderIcon(habit.icon, habit.iconColor)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium dark:text-gray-100">{habit.title}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{habit.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] dark:text-gray-300 dark:border-gray-600">
                          Effort: {habit.effort}/10
                        </Badge>
                        <Badge variant="outline" className="text-[10px] dark:text-gray-300 dark:border-gray-600">
                          Impact: {habit.impact}/10
                        </Badge>
                        <Badge variant="outline" className="text-[10px] dark:text-gray-300 dark:border-gray-600">
                          {habit.timeCommitment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={addSelectedHabits}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// A comprehensive list of suggested habits organized by category
const habitSuggestions = {
  health: [
    {
      id: 'sl-h1',
      title: 'Drink 8 glasses of water',
      icon: 'droplets',
      iconColor: 'blue',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 8,
      effort: 2,
      timeCommitment: '5 min',
      description: 'Stay hydrated throughout the day'
    },
    {
      id: 'sl-h2',
      title: 'Take supplements',
      icon: 'pill',
      iconColor: 'yellow',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 7,
      effort: 1,
      timeCommitment: '1 min',
      description: 'Take daily vitamins and supplements'
    },
    {
      id: 'sl-h3',
      title: 'Sleep 8 hours',
      icon: 'bed',
      iconColor: 'indigo',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 10,
      effort: 5,
      timeCommitment: '8 hours',
      description: 'Get adequate sleep for recovery and brain health'
    },
    {
      id: 'sl-h4',
      title: 'Morning sunlight',
      icon: 'sun',
      iconColor: 'orange',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 7,
      effort: 2,
      timeCommitment: '5 min',
      description: 'Get morning sunlight for better circadian rhythm'
    },
    {
      id: 'sl-h5',
      title: 'Eat protein breakfast',
      icon: 'apple',
      iconColor: 'green',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 8,
      effort: 4,
      timeCommitment: '15 min',
      description: 'Start day with high protein breakfast'
    },
    {
      id: 'sl-h6',
      title: 'No snacking',
      icon: 'utensils',
      iconColor: 'red',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 7,
      effort: 6,
      timeCommitment: 'all day',
      description: 'Avoid between-meal snacking'
    },
    {
      id: 'sl-h7',
      title: 'Cold exposure',
      icon: 'droplets',
      iconColor: 'blue',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 6,
      effort: 7,
      timeCommitment: '2 min',
      description: 'Cold shower or ice bath for health benefits'
    },
    {
      id: 'sl-h8',
      title: 'Track calories',
      icon: 'activity',
      iconColor: 'green',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 8,
      effort: 5,
      timeCommitment: '10 min',
      description: 'Log all food intake for awareness'
    },
    {
      id: 'sl-h9',
      title: 'Make Bed',
      icon: 'sun',
      iconColor: 'amber',
      category: 'health',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 6,
      effort: 1,
      timeCommitment: '1 min',
      description: 'Start the day with a small accomplishment'
    },
    {
      id: 'sl-h10',
      title: 'Brush Teeth',
      icon: 'zap',
      iconColor: 'blue',
      category: 'health',
      frequency: '2x-day' as HabitFrequency,
      isAbsolute: true,
      impact: 7,
      effort: 1,
      timeCommitment: '3 min',
      description: 'Maintain oral hygiene and health'
    }
  ],
  fitness: [
    {
      id: 'sl-f1',
      title: 'Exercise 30 minutes',
      icon: 'dumbbell',
      iconColor: 'red',
      category: 'fitness',
      frequency: '5x-week' as HabitFrequency,
      isAbsolute: false,
      impact: 10,
      effort: 7,
      timeCommitment: '30 min',
      description: 'Regular exercise for strength and cardiovascular health'
    },
    {
      id: 'sl-f2',
      title: 'Morning stretch',
      icon: 'activity',
      iconColor: 'orange',
      category: 'fitness',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 6,
      effort: 3,
      timeCommitment: '5 min',
      description: 'Simple morning stretching routine'
    },
    {
      id: 'sl-f3',
      title: 'Walk 10k steps',
      icon: 'activity',
      iconColor: 'green',
      category: 'fitness',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 8,
      effort: 5,
      timeCommitment: '90 min',
      description: 'Walk 10,000 steps throughout the day'
    },
    {
      id: 'sl-f4',
      title: 'Weight training',
      icon: 'dumbbell',
      iconColor: 'red',
      category: 'fitness',
      frequency: '3x-week' as HabitFrequency,
      isAbsolute: false,
      impact: 9,
      effort: 7,
      timeCommitment: '45 min',
      description: 'Strength training with weights'
    }
  ],
  mind: [
    {
      id: 'sl-m1',
      title: 'Meditation',
      icon: 'brain',
      iconColor: 'purple',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 9,
      effort: 4,
      timeCommitment: '10 min',
      description: 'Daily mindfulness meditation practice'
    },
    {
      id: 'sl-m2',
      title: 'Read 10 pages',
      icon: 'book-open',
      iconColor: 'blue',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 8,
      effort: 4,
      timeCommitment: '15 min',
      description: 'Daily reading habit for continuous learning'
    },
    {
      id: 'sl-m3',
      title: 'Pray',
      icon: 'star',
      iconColor: 'amber',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 9,
      effort: 2,
      timeCommitment: '5 min',
      description: 'Take time for spiritual reflection and gratitude'
    },
    {
      id: 'sl-m4',
      title: 'Journal',
      icon: 'scroll-text',
      iconColor: 'yellow',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 7,
      effort: 3,
      timeCommitment: '10 min',
      description: 'Daily reflection and journaling'
    },
    {
      id: 'sl-m4',
      title: 'No phone 1hr before bed',
      icon: 'smartphone',
      iconColor: 'gray',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 8,
      effort: 6,
      timeCommitment: '60 min',
      description: 'Avoid screens before bedtime for better sleep'
    },
    {
      id: 'sl-m5',
      title: 'Gratitude practice',
      icon: 'smile',
      iconColor: 'yellow',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 7,
      effort: 2,
      timeCommitment: '5 min',
      description: 'Write down three things you are grateful for'
    },
    {
      id: 'sl-m6',
      title: 'Learn something new',
      icon: 'book-open',
      iconColor: 'blue',
      category: 'mind',
      frequency: '3x-week' as HabitFrequency,
      isAbsolute: false,
      impact: 7,
      effort: 4,
      timeCommitment: '30 min',
      description: 'Dedicate time to learning a new skill'
    },
    {
      id: 'sl-m7',
      title: 'Focus blocks',
      icon: 'timer',
      iconColor: 'red',
      category: 'mind',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 9,
      effort: 5,
      timeCommitment: '90 min',
      description: 'Dedicated deep work with no distractions'
    }
  ],
  habits: [
    {
      id: 'sl-hb1',
      title: 'Morning routine',
      icon: 'sun',
      iconColor: 'yellow',
      category: 'habits',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 10,
      effort: 5,
      timeCommitment: '30 min',
      description: 'Complete structured morning routine'
    },
    {
      id: 'sl-hb2',
      title: 'Evening routine',
      icon: 'moon',
      iconColor: 'indigo',
      category: 'habits',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      impact: 9,
      effort: 4,
      timeCommitment: '30 min',
      description: 'Complete structured evening routine'
    },
    {
      id: 'sl-hb3',
      title: 'Weekly review',
      icon: 'scroll-text',
      iconColor: 'blue',
      category: 'habits',
      frequency: '1x-week' as HabitFrequency,
      isAbsolute: false,
      impact: 9,
      effort: 5,
      timeCommitment: '30 min',
      description: 'Review goals and progress weekly'
    },
    {
      id: 'sl-hb4',
      title: 'Intermittent fasting',
      icon: 'timer',
      iconColor: 'orange',
      category: 'habits',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: false,
      impact: 8,
      effort: 6,
      timeCommitment: '16 hours',
      description: '16:8 intermittent fasting schedule'
    }
  ],
  stacks: [
    {
      id: 'stack-huberman',
      title: 'Huberman Protocol',
      category: 'stacks',
      description: 'Science-based habits for optimal brain function and health',
      icon: 'brain',
      iconColor: 'purple',
      impact: 10,
      habits: [
        {
          id: 'huberman-1',
          title: 'Morning sunlight',
          icon: 'sun',
          iconColor: 'orange',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 9,
          effort: 1,
          timeCommitment: '5-10 min',
          description: 'Get sunlight exposure within 30-60 minutes of waking'
        },
        {
          id: 'huberman-2',
          title: 'Avoid morning caffeine',
          icon: 'coffee',
          iconColor: 'red',
          category: 'health',
          frequency: 'daily' as HabitFrequency, 
          isAbsolute: true,
          impact: 7,
          effort: 4,
          timeCommitment: 'N/A',
          description: 'Delay caffeine by 90-120 minutes after waking'
        },
        {
          id: 'huberman-3',
          title: 'Non-sleep deep rest',
          icon: 'brain',
          iconColor: 'blue',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 8,
          effort: 2,
          timeCommitment: '10-20 min',
          description: 'NSDR or meditation to restore focus and energy'
        },
        {
          id: 'huberman-4',
          title: 'Cold exposure',
          icon: 'droplets',
          iconColor: 'blue',
          category: 'health',
          frequency: '3x-week' as HabitFrequency,
          isAbsolute: false,
          impact: 8,
          effort: 7,
          timeCommitment: '2-5 min',
          description: 'Cold shower or exposure for mental resilience and metabolism'
        }
      ]
    },
    {
      id: 'stack-goggins',
      title: 'Goggins Method',
      category: 'stacks',
      description: 'Extreme mental toughness and physical discipline habits',
      icon: 'zap',
      iconColor: 'red',
      impact: 10,
      habits: [
        {
          id: 'goggins-1',
          title: 'Early morning workout',
          icon: 'dumbbell',
          iconColor: 'red',
          category: 'fitness',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 9,
          effort: 9,
          timeCommitment: '45-60 min',
          description: 'Hard training before 6am to build mental toughness'
        },
        {
          id: 'goggins-2',
          title: 'Push past 40%',
          icon: 'activity',
          iconColor: 'orange',
          category: 'fitness',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 10,
          effort: 10,
          timeCommitment: 'All day',
          description: 'Push through the 40% mental barrier in any activity'
        },
        {
          id: 'goggins-3',
          title: 'Daily calluses',
          icon: 'scroll-text',
          iconColor: 'yellow',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 6,
          timeCommitment: '5 min',
          description: 'Document daily hardships overcome to build mental calluses'
        },
        {
          id: 'goggins-4',
          title: 'Accountability mirror',
          icon: 'smile',
          iconColor: 'blue',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 3,
          timeCommitment: '5 min',
          description: 'Honest self-assessment in mirror each morning'
        }
      ]
    },
    {
      id: 'stack-jocko',
      title: 'Jocko Protocol',
      category: 'stacks',
      description: 'Discipline, leadership, and warrior mentality habits',
      icon: 'timer',
      iconColor: 'slate',
      impact: 9,
      habits: [
        {
          id: 'jocko-1',
          title: '4:30 AM wake-up',
          icon: 'timer',
          iconColor: 'gray',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 10,
          effort: 8,
          timeCommitment: 'N/A',
          description: 'Extreme early rising for psychological advantage'
        },
        {
          id: 'jocko-2',
          title: 'Intense training',
          icon: 'dumbbell',
          iconColor: 'red',
          category: 'fitness',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 9,
          effort: 8,
          timeCommitment: '60-90 min',
          description: 'High-intensity strength and conditioning'
        },
        {
          id: 'jocko-3',
          title: 'After Action Review',
          icon: 'scroll-text',
          iconColor: 'blue',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 4,
          timeCommitment: '10 min',
          description: 'End-of-day assessment of performance and mistakes'
        },
        {
          id: 'jocko-4',
          title: 'Detachment',
          icon: 'brain',
          iconColor: 'purple',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 7,
          effort: 6,
          timeCommitment: 'All day',
          description: 'Practice emotional detachment from outcomes'
        }
      ]
    },
    {
      id: 'stack-brecka',
      title: 'Brecka Protocol',
      category: 'stacks',
      description: 'Optimizing health span through medical testing and biomarkers',
      icon: 'pill',
      iconColor: 'green',
      impact: 9,
      habits: [
        {
          id: 'brecka-1',
          title: 'Track blood sugar',
          icon: 'activity',
          iconColor: 'blue',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 9,
          effort: 3,
          timeCommitment: '1 min',
          description: 'Monitor glucose levels to optimize metabolism'
        },
        {
          id: 'brecka-2',
          title: 'Optimize sleep',
          icon: 'bed',
          iconColor: 'indigo',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 10,
          effort: 5,
          timeCommitment: '8 hours',
          description: 'Prioritize sleep quality through environment and timing'
        },
        {
          id: 'brecka-3',
          title: 'Supplement protocol',
          icon: 'pill',
          iconColor: 'green',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 2,
          timeCommitment: '2 min',
          description: 'Take targeted supplements based on biomarkers'
        },
        {
          id: 'brecka-4',
          title: 'Protein intake',
          icon: 'utensils',
          iconColor: 'red',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 5,
          timeCommitment: 'All day',
          description: 'Consume 1g protein per pound of body weight'
        }
      ]
    },
    {
      id: 'stack-1',
      title: 'Morning Power Stack',
      category: 'stacks',
      description: 'The perfect morning routine for optimal energy and focus',
      icon: 'sun',
      iconColor: 'yellow',
      impact: 10,
      habits: [
        {
          id: 'stack-1-1',
          title: 'Morning sunlight',
          icon: 'sun',
          iconColor: 'orange',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 7,
          effort: 2,
          timeCommitment: '5 min',
          description: 'Get morning sunlight for better circadian rhythm'
        },
        {
          id: 'stack-1-2',
          title: 'Morning stretch',
          icon: 'activity',
          iconColor: 'orange',
          category: 'fitness',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 6,
          effort: 3,
          timeCommitment: '5 min',
          description: 'Simple morning stretching routine'
        },
        {
          id: 'stack-1-3',
          title: 'Protein breakfast',
          icon: 'apple',
          iconColor: 'green',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 4,
          timeCommitment: '15 min',
          description: 'Start day with high protein breakfast'
        }
      ]
    },
    {
      id: 'stack-2',
      title: 'Evening Wind-Down Stack',
      category: 'stacks',
      description: 'Prepare your mind and body for optimal sleep',
      icon: 'moon',
      iconColor: 'indigo',
      impact: 9,
      habits: [
        {
          id: 'stack-2-1',
          title: 'No phone 1hr before bed',
          icon: 'smartphone',
          iconColor: 'gray',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 6,
          timeCommitment: '60 min',
          description: 'Avoid screens before bedtime for better sleep'
        },
        {
          id: 'stack-2-2',
          title: 'Evening journal',
          icon: 'scroll-text',
          iconColor: 'yellow',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 7,
          effort: 3,
          timeCommitment: '10 min',
          description: 'Reflect on your day and set priorities for tomorrow'
        },
        {
          id: 'stack-2-3',
          title: 'Read fiction',
          icon: 'book-open',
          iconColor: 'blue',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 6,
          effort: 2,
          timeCommitment: '15 min',
          description: 'Read fiction to help calm the mind before sleep'
        }
      ]
    },
    {
      id: 'stack-3',
      title: 'Mind-Body Performance Stack',
      category: 'stacks',
      description: 'The ultimate weekly plan for physical and mental wellness',
      icon: 'zap',
      iconColor: 'green',
      impact: 10,
      habits: [
        {
          id: 'stack-3-1',
          title: 'Weight training',
          icon: 'dumbbell',
          iconColor: 'red',
          category: 'fitness',
          frequency: '3x-week' as HabitFrequency,
          isAbsolute: false,
          impact: 9,
          effort: 7,
          timeCommitment: '45 min',
          description: 'Strength training with weights'
        },
        {
          id: 'stack-3-2',
          title: 'Meditation',
          icon: 'brain',
          iconColor: 'purple',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 9,
          effort: 4,
          timeCommitment: '10 min',
          description: 'Daily mindfulness meditation practice'
        },
        {
          id: 'stack-3-3',
          title: 'Take supplements',
          icon: 'pill',
          iconColor: 'yellow',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 7,
          effort: 1,
          timeCommitment: '1 min',
          description: 'Take daily vitamins and supplements'
        },
        {
          id: 'stack-3-4',
          title: 'Intermittent fasting',
          icon: 'timer',
          iconColor: 'orange',
          category: 'habits',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 8,
          effort: 6,
          timeCommitment: '16 hours',
          description: '16:8 intermittent fasting schedule'
        }
      ]
    },
    {
      id: 'stack-4',
      title: 'Anti-Sugar Stack',
      category: 'stacks',
      description: 'Break the sugar addiction with these complementary habits',
      icon: 'utensils',
      iconColor: 'red',
      impact: 9,
      habits: [
        {
          id: 'stack-4-1',
          title: 'No added sugar',
          icon: 'utensils',
          iconColor: 'red',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 9,
          effort: 8,
          timeCommitment: 'all day',
          description: 'Avoid foods with added sugar'
        },
        {
          id: 'stack-4-2',
          title: 'Drink water instead of soda',
          icon: 'droplets',
          iconColor: 'blue',
          category: 'health',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: true,
          impact: 8,
          effort: 5,
          timeCommitment: 'all day',
          description: 'Replace all sugary drinks with water'
        },
        {
          id: 'stack-4-3',
          title: 'Sugar craving journal',
          icon: 'scroll-text',
          iconColor: 'purple',
          category: 'mind',
          frequency: 'daily' as HabitFrequency,
          isAbsolute: false,
          impact: 7,
          effort: 3,
          timeCommitment: '5 min',
          description: 'Track and analyze your sugar cravings'
        }
      ]
    }
  ]
};

interface HabitLibraryProps {
  onAddHabit?: (habitTemplate: any) => void;
}

// Helper function to render the appropriate icon component
function renderIcon(iconName: string, iconColor: string) {
  const iconClasses = `h-4 w-4 text-${iconColor}-500`;
  
  switch (iconName) {
    case 'droplets':
      return <Droplets className={iconClasses} />;
    case 'pill':
      return <Pill className={iconClasses} />;
    case 'book-open':
      return <BookOpen className={iconClasses} />;
    case 'brain':
      return <Brain className={iconClasses} />;
    case 'dumbbell':
      return <Dumbbell className={iconClasses} />;
    case 'activity':
      return <Activity className={`h-4 w-4 text-${iconColor}-500`} />;
    case 'sun':
      return <Sun className={iconClasses} />;
    case 'moon':
      return <Moon className={iconClasses} />;
    case 'coffee':
      return <Coffee className={iconClasses} />;
    case 'apple':
      return <Apple className={iconClasses} />;
    case 'utensils':
      return <Utensils className={iconClasses} />;
    case 'bed':
      return <BedIcon className={iconClasses} />;
    case 'smartphone':
      return <Smartphone className={iconClasses} />;
    case 'timer':
      return <Timer className={iconClasses} />;
    case 'scroll-text':
      return <ScrollText className={iconClasses} />;
    case 'smile':
      return <Smile className={iconClasses} />;
    case 'zap':
      return <Zap className={iconClasses} />;
    default:
      return <CheckSquare className={iconClasses} />;
  }
}

export function HabitLibrary({ onAddHabit }: HabitLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Function to filter habits based on search query
  const filterHabits = (habits: any[], query: string) => {
    if (!query.trim()) return habits;
    
    const lowerQuery = query.toLowerCase();
    return habits.filter(habit => 
      habit.title.toLowerCase().includes(lowerQuery) || 
      habit.description.toLowerCase().includes(lowerQuery)
    );
  };

  // Combined all habits from different categories
  const allHabits = [...habitSuggestions.health, ...habitSuggestions.fitness, ...habitSuggestions.mind];
  
  // State for expandable section
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show initial limited set or all habits based on expanded state
  const visibleHabits = isExpanded ? allHabits : allHabits.slice(0, 9);

  return (
    <GlassCard className="mb-4"> {/* Changed to GlassCard */}
      <GlassCardHeader className="pb-2"> {/* Changed to GlassCardHeader */}
        {/* GlassCardTitle handles text color */}
        <GlassCardTitle className="text-lg flex items-center">
          <Library className="h-4 w-4 mr-2 text-blue-400" /> {/* Adjusted icon color */}
          Habit Library
        </GlassCardTitle>
        {/* Use GlassCardDescription or ensure text color is light */}
        <p className="text-xs text-gray-400">
          Add ready-made habits to your tracking system
        </p>
      </GlassCardHeader>
      
      <GlassCardContent> {/* Changed to GlassCardContent */}
        <div className="w-full">
          <h3 className="text-sm font-medium flex items-center mb-3 text-gray-200"> {/* Adjusted text color */}
            <CheckSquare className="h-3.5 w-3.5 mr-1 text-blue-400" /> {/* Adjusted icon color */}
            Quick-Add Habits
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4"> {/* Responsive grid */}
            {visibleHabits.map(habit => (
              <div 
                key={habit.id}
                // Styling for individual habit items for glass theme
                className="p-3 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 shadow-md flex flex-col items-center gap-1 cursor-pointer transition-colors"
                onClick={() => onAddHabit?.(habit)}
              >
                <div className="flex-shrink-0 mb-1">
                  {/* Ensure renderIcon provides good contrast or adjust icon colors in habitSuggestions */}
                  {renderIcon(habit.icon, habit.iconColor || 'gray')}
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-medium truncate text-gray-100">
                    {habit.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{habit.description}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 mt-1 text-gray-300 hover:text-white hover:bg-white/10"> {/* Style Button */}
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {allHabits.length > 9 && (
              <div 
                className="col-span-1 sm:col-span-2 md:col-span-3 text-center mt-2 text-xs text-blue-400 hover:text-blue-300 cursor-pointer" /* Adjusted link color */
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show less habits' : `Show more habits (${allHabits.length - 9} more)`}
              </div>
            )}
          </div>
        
          {/* Habit Stacks Section */}
          <div className="mt-6 border-t border-white/10 pt-4"> {/* Adjusted border color */}
            <h3 className="text-sm font-medium flex items-center mb-3 text-gray-200"> {/* Adjusted text color */}
              <Zap className="h-3.5 w-3.5 mr-1 text-yellow-400" /> {/* Adjusted icon color */}
              Habit Stacks
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4"> {/* Responsive grid */}
              {habitSuggestions.stacks.slice(0, 8).map(stack => (
                // Assuming HabitStackCard will also be themed appropriately or its styles adjusted
                // For now, the container for these cards is themed.
                <HabitStackCard
                  key={stack.id}
                  stack={stack}
                  onAddHabit={onAddHabit}
                />
              ))}
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}