import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { useTheme } from "@/components/theme-provider";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { HeaderWithSettings } from "@/components/layout/header-with-settings";
import { SettingsProvider } from "@/components/settings/settings-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
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
  endOfWeek, 
  subDays, 
  isSameDay
} from 'date-fns';
import { 
  Activity, 
  CheckSquare,
  Calendar,
  Plus,
  Zap,
  Flame,
  Dumbbell,
  Brain,
  Droplets,
  BookOpen,
  Pill
} from 'lucide-react';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

export default function SortableDashboard() {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Habit and completion state
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "h-1",
      title: "Drink 8 glasses",
      description: "Stay hydrated throughout the day",
      icon: "droplets",
      iconColor: "blue",
      impact: 8,
      effort: 3,
      timeCommitment: "2 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-2",
      title: "Read 10 pages",
      description: "Daily reading from a book of your choice",
      icon: "book",
      iconColor: "amber",
      impact: 9,
      effort: 4,
      timeCommitment: "15 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-3",
      title: "Meditate",
      description: "10 minutes of guided meditation",
      icon: "brain",
      iconColor: "indigo",
      impact: 10,
      effort: 3,
      timeCommitment: "10 min",
      frequency: "5x-week",
      isAbsolute: false,
      category: "mind",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-4",
      title: "Morning stretch",
      description: "Do a quick full-body stretch in the morning",
      icon: "activity",
      iconColor: "green",
      impact: 7,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "fitness",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-no-snacking",
      title: "No snacking",
      description: "Avoid between-meal snacks",
      icon: "apple",
      iconColor: "red",
      impact: 8,
      effort: 6,
      timeCommitment: "All day",
      frequency: "3x-week",
      isAbsolute: false,
      category: "health",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-6",
      title: "Cold shower",
      description: "End your shower with 30 seconds cold water",
      icon: "droplets",
      iconColor: "cyan",
      impact: 8,
      effort: 7,
      timeCommitment: "1 min",
      frequency: "4x-week",
      isAbsolute: false,
      category: "health",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-7",
      title: "Track calories",
      description: "Log all meals in a food tracking app",
      icon: "utensils",
      iconColor: "orange",
      impact: 9,
      effort: 5,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 0,
      createdAt: new Date()
    },
    {
      id: "h-8",
      title: "Exercise",
      description: "30 minutes of moderate exercise",
      icon: "dumbbell",
      iconColor: "red",
      impact: 10,
      effort: 7,
      timeCommitment: "30 min",
      frequency: "3x-week",
      isAbsolute: false,
      category: "fitness",
      streak: 2,
      createdAt: new Date(2023, 0, 15)
    },
    {
      id: "h-stretch-routine",
      title: "Stretch",
      description: "Morning stretching routine",
      icon: "activity",
      iconColor: "orange",
      impact: 7,
      effort: 3,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "fitness",
      streak: 0,
      createdAt: new Date(2023, 0, 20)
    }
  ]);
  
  const [completions, setCompletions] = useState<HabitCompletion[]>([
    { id: "c-1", habitId: "h-1", date: new Date(), completed: true },
    { id: "c-2", habitId: "h-2", date: new Date(), completed: true },
    { id: "c-3", habitId: "h-3", date: subDays(new Date(), 1), completed: true },
    { id: "c-4", habitId: "h-1", date: subDays(new Date(), 1), completed: true },
    { id: "c-5", habitId: "h-2", date: subDays(new Date(), 1), completed: true }
  ]);
  
  // Edit/Create habit dialog state
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Confetti celebration state
  const [showPerfectDayConfetti, setShowPerfectDayConfetti] = useState(false);
  const [showPerfectWeekConfetti, setShowPerfectWeekConfetti] = useState(false);
  
  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits(habits => {
        const oldIndex = habits.findIndex(h => h.id === active.id);
        const newIndex = habits.findIndex(h => h.id === over?.id);
        
        return arrayMove(habits, oldIndex, newIndex);
      });
    }
  };
  
  // Check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      c => c.habitId === habitId && 
           c.completed && 
           isSameDay(new Date(c.date), date)
    );
  };
  
  // Toggle habit completion for a specific date
  const toggleCompletion = (habitId: string, date: Date) => {
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(new Date(c.date), date)
    );
    
    let updatedCompletions = [...completions];
    let isNowCompleted = false;
    
    if (existingCompletionIndex !== -1) {
      // Toggle existing completion
      isNowCompleted = !updatedCompletions[existingCompletionIndex].completed;
      updatedCompletions[existingCompletionIndex] = {
        ...updatedCompletions[existingCompletionIndex],
        completed: isNowCompleted
      };
      setCompletions(updatedCompletions);
    } else {
      // Create a new completion
      isNowCompleted = true;
      const newCompletion: HabitCompletion = {
        id: `c-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        habitId,
        date,
        completed: true
      };
      updatedCompletions = [...completions, newCompletion];
      setCompletions(updatedCompletions);
    }
    
    // Only check for celebrations if a habit was marked as completed
    if (isNowCompleted) {
      // Check for perfect day completion (all of today's habits completed)
      if (isSameDay(date, new Date())) {
        // Get all habit IDs
        const habitIds = habits.map(h => h.id);
        
        // Check if every habit has a completion for today
        const allHabitsCompleted = habitIds.every(hId => {
          return updatedCompletions.some(c => 
            c.habitId === hId && 
            c.completed && 
            isSameDay(new Date(c.date), date)
          );
        });
        
        if (allHabitsCompleted) {
          // Trigger perfect day celebration
          setShowPerfectDayConfetti(true);
        }
      }
      
      // Check for perfect week completion
      const currentWeekStart = startOfWeek(new Date());
      const currentWeekEnd = endOfWeek(new Date());
      
      // Map to track completed days per habit per frequency
      const habitCompletionMap = new Map();
      
      // Initialize tracking for each habit
      habits.forEach(habit => {
        habitCompletionMap.set(habit.id, {
          completed: 0,
          target: getTargetDaysFromFrequency(habit.frequency),
          isAbsolute: habit.isAbsolute
        });
      });
      
      // Count completed days for each habit in the current week
      updatedCompletions.forEach(completion => {
        const completionDate = new Date(completion.date);
        
        // Only consider completions in the current week
        if (completion.completed && 
            completionDate >= currentWeekStart && 
            completionDate <= currentWeekEnd) {
          
          const habitInfo = habitCompletionMap.get(completion.habitId);
          if (habitInfo) {
            habitInfo.completed += 1;
          }
        }
      });
      
      // Check if all habits have met their frequency requirements
      const perfectWeek = Array.from(habitCompletionMap.values()).every(info => {
        return info.completed >= info.target;
      });
      
      if (perfectWeek) {
        // Trigger perfect week celebration
        setShowPerfectWeekConfetti(true);
      }
    }
  };
  
  // Helper function to get target days from frequency
  const getTargetDaysFromFrequency = (frequency: string): number => {
    switch (frequency) {
      case 'daily': return 7;
      case '2x-week': return 2;
      case '3x-week': return 3;
      case '4x-week': return 4;
      case '5x-week': return 5;
      case '6x-week': return 6;
      default: return 1;
    }
  };
  
  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };
  
  // Edit an existing habit - completely rewritten for reliability
  const editHabit = (updatedHabit: Habit) => {
    console.log("EDITING HABIT - START", {
      id: updatedHabit.id,
      title: updatedHabit.title
    });
    
    // Force daily habits to be absolute
    const isDaily = updatedHabit.frequency === 'daily';
    const finalHabit = {
      ...updatedHabit,
      isAbsolute: isDaily ? true : updatedHabit.isAbsolute
    };
    
    // Create a brand new array replacing the matching habit
    const newHabitsArray = [];
    
    // Track if we found the habit to update
    let habitFound = false;
    
    // Manually build a new array with the updated habit
    for (const habit of habits) {
      if (habit.id === finalHabit.id) {
        // Found the habit to update
        habitFound = true;
        newHabitsArray.push(finalHabit);
        console.log("Updated habit:", finalHabit.title);
      } else {
        // Keep existing habit
        newHabitsArray.push(habit);
      }
    }
    
    if (!habitFound) {
      console.warn("Habit not found for editing:", finalHabit.id);
      // If we didn't find the habit, add it as a new one
      newHabitsArray.push(finalHabit);
    }
    
    console.log("FINAL HABITS ARRAY:", 
      newHabitsArray.map(h => `${h.id}: ${h.title}`).join(", ")
    );
    
    // Update state with the new array
    setHabits(newHabitsArray);
    
    // Persist immediately to localStorage
    try {
      localStorage.setItem('maximost-habits', JSON.stringify(newHabitsArray));
      console.log("✅ Habits saved to localStorage, total count:", newHabitsArray.length);
    } catch (err) {
      console.error("❌ Error saving to localStorage:", err);
    }
    
    // Force refresh local storage for backup purposes
    window.localStorage.setItem('maximost-habits-backup', JSON.stringify(newHabitsArray));
    
    console.log("EDITING HABIT - COMPLETE");
  };
  
  // Delete a habit
  const deleteHabit = (habitId: string) => {
    console.log("Attempting to delete habit with ID:", habitId);
    console.log("Before delete - Habits count:", habits.length);
    
    // Special handling for "No snacking" habit since it may have a specific ID issue
    if (habitId === "h-5" || (typeof habitId === 'string' && habitId.includes("snacking"))) {
      console.log("Special handling for 'No snacking' habit");
      // Find the habit by title instead of ID
      const noSnackingHabit = habits.find(h => h.title === "No snacking");
      if (noSnackingHabit) {
        console.log("Found 'No snacking' habit by title, ID:", noSnackingHabit.id);
        // Remove by filtering out this specific habit
        setHabits(habits.filter(h => h.id !== noSnackingHabit.id));
        setCompletions(completions.filter(c => c.habitId !== noSnackingHabit.id));
      }
    } else {
      // Normal deletion for other habits
      setHabits(habits.filter(h => h.id !== habitId));
      setCompletions(completions.filter(c => c.habitId !== habitId));
    }
    
    // Log after the delete operation
    setTimeout(() => {
      console.log("After delete - Habits count:", habits.length);
    }, 100);
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
      isAbsolute: true,
      category: 'health',
      streak: 0,
      createdAt: new Date()
    };
    
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
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

  // Handle adding a habit from the library
  const handleAddFromLibrary = (habitTemplate: any) => {
    // Check if this is a habit stack with multiple habits
    if (habitTemplate.isStack && habitTemplate.habits && Array.isArray(habitTemplate.habits)) {
      // Create a copy of the habits array to prevent modifications during iteration
      const habitsToAdd = [...habitTemplate.habits];
      
      // Add all habits synchronously in a for loop instead of forEach
      for (let i = 0; i < habitsToAdd.length; i++) {
        const habitItem = habitsToAdd[i];
        
        // Generate a new unique ID for the habit
        const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}-${i}`;
        
        // Create the new habit from the template
        const newHabit = {
          id: newId,
          title: habitItem.title,
          description: habitItem.description,
          icon: habitItem.icon,
          iconColor: habitItem.iconColor,
          impact: habitItem.impact,
          effort: habitItem.effort,
          timeCommitment: habitItem.timeCommitment,
          frequency: habitItem.frequency,
          isAbsolute: habitItem.isAbsolute,
          category: habitItem.category,
          streak: 0,
          createdAt: new Date()
        };
        
        // Add it directly to the habits array
        setHabits(prevHabits => [...prevHabits, newHabit]);
      }
    } else if (habitTemplate.habits && Array.isArray(habitTemplate.habits)) {
      // It's a stack but called from an individual habit in the stack
      addHabitFromTemplate(habitTemplate);
    } else {
      // It's a single habit, add it
      addHabitFromTemplate(habitTemplate);
    }
  };
  
  // Helper function to add a single habit from a template
  const addHabitFromTemplate = (template: any) => {
    // Generate a new unique ID for the habit
    const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a new habit from the template
    const newHabit: Habit = {
      id: newId,
      title: template.title,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor,
      impact: template.impact,
      effort: template.effort,
      timeCommitment: template.timeCommitment,
      frequency: template.frequency,
      isAbsolute: template.isAbsolute,
      category: template.category,
      streak: 0,
      createdAt: new Date()
    };
    
    // Add the new habit to the list
    addHabit(newHabit);
    
    // Show success feedback
    console.log('Added habit from library:', newHabit.title);
  };

  const { setTheme } = useTheme();

  // Load user preferences on initial load if available in settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.theme) {
          setTheme(parsedSettings.theme);
        }
      } catch (error) {
        console.error('Failed to parse settings from localStorage', error);
      }
    }
  }, [setTheme]);

  return (
    <SettingsProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main content area */}
        <main className="flex-1">
          <PageContainer>
            {/* Header with Settings */}
            <HeaderWithSettings 
              title="Habit Dashboard" 
              subtitle="Track your habits and build consistency"
              onMenuClick={() => setIsSidebarOpen(true)}
              viewMode="weekly"
              currentDay={currentDate}
              onPreviousClick={goToPreviousDay}
              onTodayClick={() => setCurrentDate(new Date())}
              onNextClick={goToNextDay}
            />
            
            {/* Two-column layout for desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Main content */}
              <div className="flex-1">
                {/* Progress Summary */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
                  {/* Progress Cards */}
                  <div className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Day Streak</p>
                        <p className="text-2xl font-bold">28</p>
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
                        <p className="text-2xl font-bold">75</p>
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
                        <p className="text-2xl font-bold">{habits.length}</p>
                      </div>
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly Streak</p>
                        <p className="text-2xl font-bold">4</p>
                      </div>
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Flame className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Date selector and add habit button */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                      <span className="sr-only">Previous day</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </Button>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">
                        {format(currentDate, 'EEEE, MMMM d')}
                      </span>
                    </div>
                    <Button variant="outline" size="icon" onClick={goToNextDay}>
                      <span className="sr-only">Next day</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                {/* Habits Section with View Modes (Daily, Weekly, Monthly) */}
                <Card className="mb-8">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">
                      Habit Tracker
                      <Badge variant="outline" className="ml-2 font-normal">
                        {habits.length} habits
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SortableHabitViewModes
                      habits={habits}
                      completions={completions}
                      onToggleHabit={toggleCompletion}
                      onAddHabit={handleCreateHabit}
                      onEditHabit={handleEditHabit}
                      onDeleteHabit={deleteHabit}
                      onReorderHabits={(newOrderedHabits) => setHabits(newOrderedHabits)}
                    />
                    
                    {habits.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No habits added yet.</p>
                        <Button onClick={handleCreateHabit} variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Your First Habit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - Additional features */}
              <div className="w-full lg:w-80 space-y-6">
                {/* Daily Motivation Card */}
                <DailyMotivation />
                
                {/* Habit Library Card */}
                <HabitLibrary onAddHabit={handleAddFromLibrary} />
              </div>
            </div>
          </PageContainer>
        </main>
      </div>
      
      {/* Confetti Celebrations */}
      <ConfettiCelebration 
        trigger={showPerfectDayConfetti} 
        type="perfectDay"
        onComplete={() => setShowPerfectDayConfetti(false)}
      />
      
      <ConfettiCelebration 
        trigger={showPerfectWeekConfetti} 
        type="perfectWeek"
        onComplete={() => setShowPerfectWeekConfetti(false)}
      />
      
      {/* Edit Habit Dialog */}
      <EditHabitDialog 
        open={editHabitDialogOpen}
        setOpen={setEditHabitDialogOpen}
        habit={selectedHabit}
        onSave={(updatedHabit) => {
          console.log("EDIT DIALOG - Received habit update for:", updatedHabit.title);
          
          // Create a completely new habits array
          let newHabitsArray = [...habits];
          
          // Find if this habit already exists
          const existingIndex = newHabitsArray.findIndex(h => h.id === updatedHabit.id);
          
          if (existingIndex >= 0) {
            // This is an edit of an existing habit - replace it in the array
            console.log("EDIT - Replacing habit at index:", existingIndex);
            
            // Create a new array with the updated habit
            newHabitsArray = [
              ...newHabitsArray.slice(0, existingIndex),
              updatedHabit,
              ...newHabitsArray.slice(existingIndex + 1)
            ];
          } else {
            // This is a new habit
            console.log("ADD - Adding new habit");
            newHabitsArray.push(updatedHabit);
          }
          
          // Directly set the habits state with the new array
          console.log("Setting habits state to new array with length:", newHabitsArray.length);
          setHabits(newHabitsArray);
          
          // Save to localStorage immediately
          try {
            localStorage.setItem('maximost-habits', JSON.stringify(newHabitsArray));
            console.log("✅ Saved to localStorage successfully");
          } catch (err) {
            console.error("❌ Error saving to localStorage:", err);
          }
        }}
      />
    </SettingsProvider>
  );
}