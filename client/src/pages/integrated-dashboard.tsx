import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { 
  format, 
  addDays, 
  startOfWeek, 
  subDays, 
  isSameDay,
  isBefore,
  isAfter,
  startOfToday,
  endOfToday
} from 'date-fns';
import { 
  Activity, 
  AlertTriangle,
  Apple,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Dumbbell, 
  Flame,
  Heart,
  Leaf,
  Medal,
  Moon,
  MoreHorizontal,
  Pencil,
  Pill,
  Plus,
  PlusCircle, 
  Star,
  Sun,
  Sunrise,
  User,
  Users,
  Utensils,
  X,
  Zap
} from 'lucide-react';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

// Sample data
const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
    iconColor: 'blue',
    impact: 8,
    effort: 2,
    timeCommitment: '5 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'health',
    streak: 12,
    createdAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
  },
  {
    id: 'h2',
    title: 'Read 10 Pages',
    description: 'Daily reading for continuous learning and growth',
    icon: 'book-open',
    iconColor: 'purple',
    impact: 7,
    effort: 4,
    timeCommitment: '15 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 8,
    createdAt: new Date(Date.now() - 86400000 * 15) // 15 days ago
  },
  {
    id: 'h3',
    title: 'Meditate',
    description: 'Mindfulness practice for mental clarity and stress reduction',
    icon: 'brain',
    iconColor: 'indigo',
    impact: 9,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 15,
    createdAt: new Date(Date.now() - 86400000 * 45) // 45 days ago
  },
  {
    id: 'h4',
    title: 'Resistance Training',
    description: 'Build and maintain muscle mass and strength',
    icon: 'dumbbell',
    iconColor: 'green',
    impact: 10,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 4,
    createdAt: new Date(Date.now() - 86400000 * 60) // 60 days ago
  },
  {
    id: 'h5',
    title: 'Take Supplements',
    description: 'Daily vitamin and mineral supplementation',
    icon: 'pill',
    iconColor: 'amber',
    impact: 6,
    effort: 1,
    timeCommitment: '1 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'health',
    streak: 32,
    createdAt: new Date(Date.now() - 86400000 * 32) // 32 days ago
  },
  {
    id: 'h6',
    title: 'Stretch/Mobility',
    description: 'Maintain flexibility and prevent injuries',
    icon: 'activity',
    iconColor: 'teal',
    impact: 8,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'fitness',
    streak: 3,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  }
];

const initialCompletions: HabitCompletion[] = [
  // Add some sample completions for today and past days
  {
    id: 'c1',
    habitId: 'h1',
    date: new Date(),
    completed: true
  },
  {
    id: 'c2',
    habitId: 'h2',
    date: new Date(),
    completed: true
  },
  {
    id: 'c3',
    habitId: 'h5',
    date: new Date(),
    completed: true
  }
];

// Quick-add habit templates
const habitTemplates = [
  {
    title: "Drink Water",
    description: "Stay hydrated with 64oz of water daily",
    icon: "droplets",
    iconColor: "blue",
    impact: 9,
    effort: 2,
    category: "health",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "1 min"
  },
  {
    title: "Read Book",
    description: "Read at least 10 pages daily",
    icon: "book-open",
    iconColor: "purple",
    impact: 8,
    effort: 3,
    category: "mind",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "15 min"
  },
  {
    title: "Strength Training",
    description: "Resistance training for muscle and bone health",
    icon: "dumbbell",
    iconColor: "green",
    impact: 10,
    effort: 7,
    category: "fitness",
    frequency: "3x-week",
    isAbsolute: false,
    timeCommitment: "45 min"
  },
  {
    title: "Meditate",
    description: "Mindfulness practice for mental clarity",
    icon: "brain",
    iconColor: "indigo",
    impact: 9,
    effort: 4,
    category: "mind",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "10 min"
  },
  {
    title: "Take Supplements",
    description: "Daily supplementation routine",
    icon: "pill",
    iconColor: "amber",
    impact: 7,
    effort: 1,
    category: "health",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "1 min"
  },
  {
    title: "Get 7+ Hours Sleep",
    description: "Consistent quality sleep",
    icon: "moon",
    iconColor: "slate",
    impact: 10,
    effort: 5,
    category: "health",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "7 hours"
  },
  {
    title: "Morning Cardio",
    description: "Cardiovascular exercise",
    icon: "activity",
    iconColor: "red",
    impact: 8,
    effort: 6,
    category: "fitness",
    frequency: "5x-week",
    isAbsolute: false,
    timeCommitment: "30 min"
  },
  {
    title: "Eat Vegetables",
    description: "At least 2 servings daily",
    icon: "leaf",
    iconColor: "emerald",
    impact: 8,
    effort: 4, 
    category: "nutrition",
    frequency: "daily",
    isAbsolute: true,
    timeCommitment: "10 min"
  }
];

// Habit stacks
const habitStacks = [
  {
    title: "Morning Routine",
    description: "Set up your day for success",
    habits: [
      {
        title: "Morning Hydration",
        description: "16oz water with lemon to start the day",
        icon: "droplets",
        iconColor: "blue",
        impact: 7,
        effort: 1,
        category: "health",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "1 min"
      },
      {
        title: "5-Minute Meditation",
        description: "Brief mindfulness practice",
        icon: "brain",
        iconColor: "indigo",
        impact: 6,
        effort: 2,
        category: "mind",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "5 min"
      },
      {
        title: "Morning Stretch",
        description: "Quick full-body mobility routine",
        icon: "activity",
        iconColor: "teal",
        impact: 6,
        effort: 2,
        category: "fitness",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "5 min"
      }
    ]
  },
  {
    title: "Evening Wind-Down",
    description: "Prepare for quality sleep",
    habits: [
      {
        title: "No Screens Before Bed",
        description: "Avoid blue light 1 hour before sleeping",
        icon: "x",
        iconColor: "red",
        impact: 8,
        effort: 5,
        category: "health",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "60 min"
      },
      {
        title: "Evening Reflection",
        description: "Journal 3 things you're grateful for",
        icon: "pencil",
        iconColor: "amber",
        impact: 7,
        effort: 3,
        category: "mind",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "5 min"
      },
      {
        title: "Bedtime Routine",
        description: "Consistent sleep schedule",
        icon: "moon",
        iconColor: "slate",
        impact: 9,
        effort: 4,
        category: "health",
        frequency: "daily",
        isAbsolute: true,
        timeCommitment: "15 min"
      }
    ]
  },
  {
    title: "Fitness Foundation",
    description: "Core physical fitness habits",
    habits: [
      {
        title: "Strength Training",
        description: "Resistance-based workout",
        icon: "dumbbell",
        iconColor: "green",
        impact: 10,
        effort: 7,
        category: "fitness",
        frequency: "3x-week",
        isAbsolute: false,
        timeCommitment: "45 min"
      },
      {
        title: "Cardio Session",
        description: "Heart-healthy aerobic exercise",
        icon: "activity",
        iconColor: "red",
        impact: 8,
        effort: 6,
        category: "fitness",
        frequency: "3x-week",
        isAbsolute: false,
        timeCommitment: "30 min"
      },
      {
        title: "Post-Workout Protein",
        description: "Protein intake within 30 minutes",
        icon: "utensils",
        iconColor: "violet",
        impact: 7,
        effort: 3,
        category: "nutrition",
        frequency: "3x-week",
        isAbsolute: false,
        timeCommitment: "5 min"
      }
    ]
  }
];

// Main component
export default function IntegratedDashboard() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end event to reorder habits
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      toast({
        title: "Habit Reordered",
        description: "Your habits have been reordered successfully",
        duration: 2000
      });
    }
  };
  
  // Toggle habit completion for the selected date
  const toggleCompletion = (habitId: string, date: Date) => {
    // Check if we already have a completion for this habit on this date
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(new Date(c.date), date)
    );
    
    if (existingCompletionIndex >= 0) {
      // Toggle the existing completion
      const updatedCompletions = [...completions];
      updatedCompletions[existingCompletionIndex] = {
        ...updatedCompletions[existingCompletionIndex],
        completed: !updatedCompletions[existingCompletionIndex].completed
      };
      setCompletions(updatedCompletions);
    } else {
      // Create a new completion
      const newCompletion: HabitCompletion = {
        id: `c-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        habitId,
        date,
        completed: true
      };
      setCompletions([...completions, newCompletion]);
    }
    
    // Find habit to update streak
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      // TODO: Update streak logic
    }
  };
  
  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
    toast({
      title: "Habit Added",
      description: `${habit.title} has been added to your dashboard`,
      duration: 3000
    });
  };
  
  // Edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
    toast({
      title: "Habit Updated",
      description: `${updatedHabit.title} has been updated successfully`,
      duration: 2000
    });
  };
  
  // Delete a habit
  const deleteHabit = (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    setHabits(habits.filter(h => h.id !== habitId));
    setCompletions(completions.filter(c => c.habitId !== habitId));
    toast({
      title: "Habit Deleted",
      description: habitToDelete ? `${habitToDelete.title} has been removed` : "Habit has been removed",
      variant: "destructive",
      duration: 2000
    });
  };
  
  // Shortcut to open edit dialog for a habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  // Open dialog to create a new habit
  const handleCreateHabit = () => {
    const frequency: HabitFrequency = 'daily'; 
    
    const newHabit: Habit = {
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: '',
      description: '',
      icon: 'check-square',
      iconColor: 'blue',
      impact: 5,
      effort: 5,
      timeCommitment: '5 min',
      frequency,
      isAbsolute: frequency === 'daily',
      category: 'health',
      streak: 0,
      createdAt: new Date()
    };
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
  };
  
  // Add a habit from template
  const addHabitFromTemplate = (template: any) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor,
      impact: template.impact,
      effort: template.effort,
      timeCommitment: template.timeCommitment,
      frequency: template.frequency as HabitFrequency,
      isAbsolute: template.isAbsolute,
      category: template.category as HabitCategory,
      streak: 0,
      createdAt: new Date()
    };
    
    addHabit(newHabit);
  };
  
  // Add habit stack (group of habits)
  const addHabitStack = (stack: any) => {
    const newHabits = stack.habits.map((habit: any) => ({
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: habit.title,
      description: habit.description,
      icon: habit.icon,
      iconColor: habit.iconColor,
      impact: habit.impact,
      effort: habit.effort,
      timeCommitment: habit.timeCommitment,
      frequency: habit.frequency as HabitFrequency,
      isAbsolute: habit.isAbsolute,
      category: habit.category as HabitCategory,
      streak: 0,
      createdAt: new Date()
    }));
    
    setHabits([...habits, ...newHabits]);
    
    toast({
      title: "Habit Stack Added",
      description: `Added ${stack.title} with ${stack.habits.length} habits`,
      duration: 3000
    });
  };
  
  // Calculate summary stats
  const calculateStats = () => {
    const totalHabits = habits.length;
    
    // Today's completions
    const todayCompletions = completions.filter(c => 
      isSameDay(new Date(c.date), new Date()) && c.completed
    );
    
    const todayHabits = habits.filter(h => {
      if (h.frequency === 'daily') return true;
      // For weekly frequency habits, we could add more logic here
      return true;
    });
    
    const completionPercentage = todayHabits.length > 0 
      ? Math.round((todayCompletions.length / todayHabits.length) * 100) 
      : 0;
    
    // Get the max streak
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
    
    return {
      totalHabits,
      completionPercentage,
      todayCompleted: todayCompletions.length,
      maxStreak
    };
  };
  
  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      c => c.habitId === habitId && 
           isSameDay(new Date(c.date), date) && 
           c.completed
    );
  };
  
  // Calculate whether a habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const lastWeekCompletions = completions.filter(
      c => c.habitId === habit.id && 
           c.completed && 
           new Date(c.date) >= subDays(new Date(), 7)
    );
    
    const targetDays = habit.frequency === 'daily' ? 7 : 
                     habit.frequency === '2x-week' ? 2 :
                     habit.frequency === '3x-week' ? 3 :
                     habit.frequency === '4x-week' ? 4 : 
                     habit.frequency === '5x-week' ? 5 :
                     habit.frequency === '6x-week' ? 6 : 1;
                     
    return lastWeekCompletions.length >= targetDays;
  };
  
  // Navigate to previous/next day
  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };
  
  // Get absolute (must-do) and additional habits
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);
  
  // Calculate stats for the dashboard
  const stats = calculateStats();

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main content area */}
        <main className="flex-1">
          <PageContainer>
            {/* Mobile Header */}
            <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
            
            {/* Dashboard header and stats */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                MaxiMost Habit Tracker
              </h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  {format(currentDate, 'EEEE, MMMM d')}
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextDay}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Stats summary */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                    <p className="text-2xl font-bold">{stats.maxStreak}</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion %</p>
                    <p className="text-2xl font-bold">{stats.completionPercentage}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Habits</p>
                    <p className="text-2xl font-bold">{stats.totalHabits}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Completed</p>
                    <p className="text-2xl font-bold">{stats.todayCompleted}</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main dashboard content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left side - Habit Lists */}
              <div className="w-full lg:w-2/3">
                {/* Daily Habits Section */}
                <Card className="mb-8">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">
                        Daily Absolute Habits
                        <Badge variant="outline" className="ml-2 font-normal">
                          {absoluteHabits.length} habits
                        </Badge>
                      </CardTitle>
                      <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white" size="sm" onClick={handleCreateHabit}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Habit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                      <div className="px-3">Habit</div>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date(currentDate);
                        date.setDate(date.getDate() + i);
                        return (
                          <div key={i} className="text-center">
                            {format(date, 'EEE')}
                            <span className="block">{format(date, 'd')}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={absoluteHabits.map(h => h.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {absoluteHabits.map(habit => (
                          <SortableHabit
                            key={habit.id}
                            habit={habit}
                            completions={completions}
                            onToggleCompletion={toggleCompletion}
                            onEdit={handleEditHabit}
                            currentDate={currentDate}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>
                
                {/* Additional Habits Section */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">
                        Additional Habits
                        <Badge variant="outline" className="ml-2 font-normal">
                          {additionalHabits.length} habits
                        </Badge>
                      </CardTitle>
                      <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white" size="sm" onClick={handleCreateHabit}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Habit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                      <div className="px-3">Habit</div>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date(currentDate);
                        date.setDate(date.getDate() + i);
                        return (
                          <div key={i} className="text-center">
                            {format(date, 'EEE')}
                            <span className="block">{format(date, 'd')}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={additionalHabits.map(h => h.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {additionalHabits.map(habit => (
                          <SortableHabit
                            key={habit.id}
                            habit={habit}
                            completions={completions}
                            onToggleCompletion={toggleCompletion}
                            onEdit={handleEditHabit}
                            currentDate={currentDate}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right side - Templates and Quick Actions */}
              <div className="w-full lg:w-1/3 space-y-6">
                {/* Habit Library Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-500" /> Habit Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quick Add Habits Section */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Quick Add Individual Habits</h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {[
                            { title: "Make Bed", icon: <CheckSquare className="h-4 w-4 text-blue-500" />, description: "Start the day right", category: "mind" },
                            { title: "Lift Weights", icon: <Dumbbell className="h-4 w-4 text-blue-500" />, description: "Strength training", category: "fitness" },
                            { title: "Drink Water", icon: <Droplets className="h-4 w-4 text-blue-500" />, description: "Stay hydrated", category: "health" },
                            { title: "Read 10 pages", icon: <BookOpen className="h-4 w-4 text-blue-500" />, description: "Daily reading", category: "mind" },
                            { title: "Meditate", icon: <Brain className="h-4 w-4 text-blue-500" />, description: "Calm the mind", category: "mind" },
                            { title: "Take Vitamins", icon: <Pill className="h-4 w-4 text-blue-500" />, description: "Daily supplements", category: "health" },
                          ].map((template, i) => (
                            <Button
                              key={i}
                              variant="default" 
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              size="sm"
                              onClick={() => addHabitFromTemplate({
                                ...template,
                                impact: 7,
                                effort: 3,
                                timeCommitment: "5 min",
                                frequency: "daily",
                                isAbsolute: true,
                                iconColor: "blue",
                              })}
                              title={template.description}
                            >
                              <div className="flex items-center gap-1.5 text-xs">
                                {template.icon}
                                <span>{template.title}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Habit Stacks Section */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Habit Stacks</h4>
                        
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addHabitStack({
                              title: "Morning Routine",
                              habits: [
                                {
                                  title: "Make Bed",
                                  description: "Start the day with achievement",
                                  icon: "check-square",
                                  iconColor: "blue",
                                  impact: 5,
                                  effort: 2,
                                  timeCommitment: "2 min",
                                  frequency: "daily",
                                  isAbsolute: true,
                                  category: "productivity"
                                },
                                {
                                  title: "Drink Water",
                                  description: "Hydrate after sleep",
                                  icon: "droplets",
                                  iconColor: "blue",
                                  impact: 7,
                                  effort: 1,
                                  timeCommitment: "1 min",
                                  frequency: "daily",
                                  isAbsolute: true,
                                  category: "health"
                                },
                                {
                                  title: "Meditate",
                                  description: "Clear the mind",
                                  icon: "brain",
                                  iconColor: "purple",
                                  impact: 8,
                                  effort: 5,
                                  timeCommitment: "10 min",
                                  frequency: "daily",
                                  isAbsolute: true,
                                  category: "mind"
                                }
                              ]
                            })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Morning Routine (3 habits)</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addHabitStack({
                              title: "Workout Stack",
                              habits: [
                                {
                                  title: "Stretching",
                                  description: "Prepare the body",
                                  icon: "activity",
                                  iconColor: "green",
                                  impact: 6,
                                  effort: 3,
                                  timeCommitment: "5 min",
                                  frequency: "daily",
                                  isAbsolute: false,
                                  category: "fitness"
                                },
                                {
                                  title: "Cardio",
                                  description: "Heart healthy",
                                  icon: "heart-pulse",
                                  iconColor: "red",
                                  impact: 9,
                                  effort: 7,
                                  timeCommitment: "20 min",
                                  frequency: "3x-week",
                                  isAbsolute: false,
                                  category: "fitness"
                                },
                                {
                                  title: "Strength Training",
                                  description: "Build muscle",
                                  icon: "dumbbell",
                                  iconColor: "blue",
                                  impact: 8,
                                  effort: 8,
                                  timeCommitment: "30 min",
                                  frequency: "3x-week",
                                  isAbsolute: false,
                                  category: "fitness"
                                }
                              ]
                            })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Workout Stack (3 habits)</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addHabitStack({
                              title: "Evening Routine",
                              habits: [
                                {
                                  title: "No Screens",
                                  description: "Better sleep prep",
                                  icon: "phone-off",
                                  iconColor: "red",
                                  impact: 7,
                                  effort: 6,
                                  timeCommitment: "60 min",
                                  frequency: "daily",
                                  isAbsolute: false,
                                  category: "sleep"
                                },
                                {
                                  title: "Reading",
                                  description: "Calm the mind",
                                  icon: "book-text",
                                  iconColor: "purple",
                                  impact: 6,
                                  effort: 4,
                                  timeCommitment: "15 min",
                                  frequency: "daily",
                                  isAbsolute: false,
                                  category: "mind"
                                },
                                {
                                  title: "Gratitude Journal",
                                  description: "Count your blessings",
                                  icon: "pen-tool",
                                  iconColor: "amber",
                                  impact: 7,
                                  effort: 3,
                                  timeCommitment: "5 min",
                                  frequency: "daily",
                                  isAbsolute: false,
                                  category: "mind"
                                }
                              ]
                            })}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Evening Routine (3 habits)</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Daily Motivation Quote */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-500" /> Daily Motivation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DailyMotivation />
                  </CardContent>
                </Card>

              </div>
                                    timeCommitment: '0 min',
                                    frequency: 'daily' as HabitFrequency,
                                    isAbsolute: true,
                                    category: "health" as HabitCategory,
                                    streak: 0,
                                    createdAt: new Date()
                                  },
                                  {
                                    id: `h-${Date.now()}-h3`,
                                    title: "Cold Exposure",
                                    description: "Brief cold exposure via shower or cold plunge",
                                    icon: "droplets",
                                    iconColor: "blue",
                                    impact: 8,
                                    effort: 6,
                                    timeCommitment: '2 min',
                                    frequency: 'daily' as HabitFrequency,
                                    isAbsolute: false,
                                    category: "health" as HabitCategory,
                                    streak: 0,
                                    createdAt: new Date()
                                  }
                                ];
                                
                                setHabits([...habits, ...hubermanHabits]);
                                toast({
                                  title: "Added Huberman Lab Stack",
                                  description: "3 habits have been added to your dashboard",
                                  duration: 3000
                                });
                              }}
                            >
                              Add All 3 Habits
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <Sun className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium">Morning Sunlight</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">5 min daily</p>
                          </div>
                          
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="text-sm font-medium">Delay Caffeine</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">90+ min after waking</p>
                          </div>
                          
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Cold Exposure</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">2 min cold shower</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Jocko Stack */}
                      <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                        <div className="p-3 border-b bg-gray-50">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              Jocko Willink Stack
                            </h5>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                              onClick={() => {
                                const jockoHabits = [
                                  {
                                    id: `h-${Date.now()}-j1`,
                                    title: "4:30 AM Wake-Up",
                                    description: "Wake up at 4:30 AM for early start advantage",
                                    icon: "alarm-clock",
                                    iconColor: "red",
                                    impact: 8,
                                    effort: 8,
                                    timeCommitment: '0 min',
                                    frequency: 'daily' as HabitFrequency,
                                    isAbsolute: true,
                                    category: "mind" as HabitCategory,
                                    streak: 0,
                                    createdAt: new Date()
                                  },
                                  {
                                    id: `h-${Date.now()}-j2`,
                                    title: "Discipline Workout",
                                    description: "Intense exercise training regardless of circumstances",
                                    icon: "dumbbell",
                                    iconColor: "green",
                                    impact: 9,
                                    effort: 7,
                                    timeCommitment: '60 min',
                                    frequency: 'daily' as HabitFrequency,
                                    isAbsolute: true,
                                    category: "fitness" as HabitCategory,
                                    streak: 0,
                                    createdAt: new Date()
                                  },
                                  {
                                    id: `h-${Date.now()}-j3`,
                                    title: "Ownership Mindset",
                                    description: "Take extreme ownership of all areas of your life",
                                    icon: "check-square",
                                    iconColor: "blue",
                                    impact: 10,
                                    effort: 6,
                                    timeCommitment: '0 min',
                                    frequency: 'daily' as HabitFrequency,
                                    isAbsolute: true,
                                    category: "mind" as HabitCategory,
                                    streak: 0,
                                    createdAt: new Date()
                                  }
                                ];
                                
                                setHabits([...habits, ...jockoHabits]);
                                toast({
                                  title: "Added Jocko Willink Stack",
                                  description: "3 habits have been added to your dashboard",
                                  duration: 3000
                                });
                              }}
                            >
                              Add All 3 Habits
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium">4:30 AM Wake-Up</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Early morning discipline</p>
                          </div>
                          
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">Discipline Workout</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Daily physical training</p>
                          </div>
                          
                          <div className="p-2 border rounded-md bg-gray-50/50">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Ownership Mindset</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">No excuses, take control</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PageContainer>
        </main>
      </div>
      
      {/* Edit Habit Dialog */}
      <EditHabitDialog 
        open={editHabitDialogOpen}
        onOpenChange={setEditHabitDialogOpen}
        habit={selectedHabit}
        onSave={(habit) => {
          if (habits.some(h => h.id === habit.id)) {
            editHabit(habit);
          } else {
            addHabit(habit);
          }
          setEditHabitDialogOpen(false);
        }}
        onDelete={(habitId) => {
          deleteHabit(habitId);
          setEditHabitDialogOpen(false);
        }}
      />
    </>
  );
}