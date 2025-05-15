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
  CheckSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ]
};

interface HabitLibraryProps {
  onAddSuggestion?: (habitTemplate: any) => void;
  onCreateCustom?: () => void;
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
    default:
      return <CheckSquare className={iconClasses} />;
  }
}

export function HabitLibrary({ onAddSuggestion, onCreateCustom }: HabitLibraryProps) {
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
          Habit Library
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Add ready-made habits from our curated collection
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid grid-cols-4 mb-3">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="mind">Mind</TabsTrigger>
            <TabsTrigger value="habits">Routines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health" className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {habitSuggestions.health.map(habit => (
                <div 
                  key={habit.id}
                  className="p-2 rounded-md bg-gray-50 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onAddSuggestion?.(habit)}
                >
                  <div className="flex-shrink-0">
                    {renderIcon(habit.icon, habit.iconColor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-${habit.iconColor}-600 truncate`}>{habit.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs py-0 px-1">
                        {habit.frequency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({habit.timeCommitment})</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-auto h-7 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSuggestion?.(habit);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fitness" className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {habitSuggestions.fitness.map(habit => (
                <div 
                  key={habit.id}
                  className="p-2 rounded-md bg-gray-50 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onAddSuggestion?.(habit)}
                >
                  <div className="flex-shrink-0">
                    {renderIcon(habit.icon, habit.iconColor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-${habit.iconColor}-600 truncate`}>{habit.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs py-0 px-1">
                        {habit.frequency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({habit.timeCommitment})</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-auto h-7 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSuggestion?.(habit);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mind" className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {habitSuggestions.mind.map(habit => (
                <div 
                  key={habit.id}
                  className="p-2 rounded-md bg-gray-50 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onAddSuggestion?.(habit)}
                >
                  <div className="flex-shrink-0">
                    {renderIcon(habit.icon, habit.iconColor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-${habit.iconColor}-600 truncate`}>{habit.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs py-0 px-1">
                        {habit.frequency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({habit.timeCommitment})</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-auto h-7 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSuggestion?.(habit);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="habits" className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {habitSuggestions.habits.map(habit => (
                <div 
                  key={habit.id}
                  className="p-2 rounded-md bg-gray-50 shadow-sm flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => onAddSuggestion?.(habit)}
                >
                  <div className="flex-shrink-0">
                    {renderIcon(habit.icon, habit.iconColor)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium text-${habit.iconColor}-600 truncate`}>{habit.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs py-0 px-1">
                        {habit.frequency}
                      </Badge>
                      <span className="text-xs text-muted-foreground">({habit.timeCommitment})</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="ml-auto h-7 text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSuggestion?.(habit);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
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