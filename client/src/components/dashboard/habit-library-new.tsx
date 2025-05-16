import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Library
} from 'lucide-react';
import { HabitFrequency, HabitCategory } from "@/types/habit";

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
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Library className="h-4 w-4 mr-2 text-blue-500" />
          Habit Library
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Add ready-made habits to your tracking system
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="w-full">
          <h3 className="text-sm font-medium flex items-center mb-3">
            <CheckSquare className="h-3.5 w-3.5 mr-1 text-blue-500" />
            Quick-Add Habits
          </h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Show only visible habits based on expanded state */}
            {visibleHabits.map(habit => (
              <div 
                key={habit.id}
                className="p-2 rounded-md bg-gray-50 shadow-sm flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onAddHabit?.(habit)}
              >
                <div className="flex-shrink-0 mb-1">
                  {renderIcon(habit.icon, habit.iconColor)}
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-medium truncate" style={{color: `var(--${habit.iconColor}-600, #4B5563)`}}>
                    {habit.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 mt-1">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {/* Show expand/collapse button if we have more than the initial set */}
            {allHabits.length > 9 && (
              <div 
                className="col-span-3 text-center mt-2 text-xs text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show less habits' : 'Show more habits'} ({allHabits.length} total)
              </div>
            )}
          </div>
        
          {/* Habit Stacks Section */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium flex items-center mb-3">
              <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500" />
              Habit Stacks
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {habitSuggestions.stacks.map(stack => (
                <div 
                  key={stack.id}
                  className="bg-gray-50 rounded-md p-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 cursor-pointer mb-1" onClick={() => {}}>
                    <div className="flex-shrink-0">
                      {renderIcon(stack.icon, stack.iconColor)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{color: `var(--${stack.iconColor}-600, #4B5563)`}}>
                        {stack.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{stack.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 flex-shrink-0 text-xs"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click
                        // Send the entire stack object to be handled by the parent component
                        onAddHabit?.({...stack, isStack: true});
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add All
                    </Button>
                  </div>
                  
                  <div className="pl-6 mt-1">
                    <div className="text-xs text-muted-foreground mb-1">Contains {stack.habits.length} habits:</div>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      {stack.habits.map(habit => (
                        <div key={habit.id} className="flex items-center text-xs">
                          <div className="flex-shrink-0 mr-1 w-4 h-4">
                            {renderIcon(habit.icon, habit.iconColor)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="truncate">{habit.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}