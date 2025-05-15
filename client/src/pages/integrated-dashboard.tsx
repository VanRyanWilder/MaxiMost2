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
                      <Button variant="ghost" size="sm" onClick={handleCreateHabit}>
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
                      <Button variant="ghost" size="sm" onClick={handleCreateHabit}>
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
              <div className="w-full lg:w-1/3">
                {/* Daily Motivation Quote */}
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Daily Motivation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DailyMotivation />
                  </CardContent>
                </Card>
                
                {/* Quick Add Habit Templates */}
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Quick Add Habits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {habitTemplates.slice(0, 6).map((template, index) => {
                        // Get icon component based on template.icon
                        let IconComponent = CheckSquare;
                        switch(template.icon) {
                          case 'droplets': IconComponent = Droplets; break;
                          case 'book-open': IconComponent = BookOpen; break;
                          case 'dumbbell': IconComponent = Dumbbell; break;
                          case 'brain': IconComponent = Brain; break;
                          case 'pill': IconComponent = Pill; break;
                          case 'moon': IconComponent = Moon; break;
                          case 'activity': IconComponent = Activity; break;
                          case 'leaf': IconComponent = Leaf; break;
                          default: IconComponent = CheckSquare;
                        }
                        
                        // Get color based on iconColor
                        let colorClass = "text-blue-500";
                        switch(template.iconColor) {
                          case 'blue': colorClass = "text-blue-500"; break;
                          case 'purple': colorClass = "text-purple-500"; break;
                          case 'green': colorClass = "text-green-500"; break;
                          case 'indigo': colorClass = "text-indigo-500"; break;
                          case 'amber': colorClass = "text-amber-500"; break;
                          case 'slate': colorClass = "text-slate-500"; break;
                          case 'red': colorClass = "text-red-500"; break;
                          case 'emerald': colorClass = "text-emerald-500"; break;
                          default: colorClass = "text-blue-500";
                        }
                        
                        return (
                          <Button 
                            key={index}
                            variant="outline" 
                            className="h-auto py-2 px-3 flex justify-start items-center text-left whitespace-normal"
                            onClick={() => addHabitFromTemplate(template)}
                          >
                            <IconComponent className={`h-4 w-4 mr-2 ${colorClass}`} />
                            <span className="text-sm font-medium">{template.title}</span>
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button variant="ghost" className="w-full mt-3" onClick={handleCreateHabit}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>Create Custom Habit</span>
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Habit Stacks */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Habit Stacks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {habitStacks.map((stack, index) => (
                        <Card key={index} className="border-0 shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium text-base">{stack.title}</h3>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2"
                                onClick={() => addHabitStack(stack)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Add</span>
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{stack.description}</p>
                            <div className="text-xs text-muted-foreground">
                              {stack.habits.length} habits • Approx. {stack.habits.reduce(
                                (total, h) => total + parseInt(h.timeCommitment.split(" ")[0] || "0"), 0
                              )} min
                            </div>
                          </CardContent>
                        </Card>
                      ))}
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