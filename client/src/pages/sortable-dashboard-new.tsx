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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedEditDialog } from '@/components/dashboard/fixed-edit-dialog';
import { UltimateEditDialog } from '@/components/dashboard/ultimate-edit-dialog';
import { RobustHabitEditor } from '@/components/dashboard/robust-habit-editor';
import { NewHabitEditor } from '@/components/dashboard/new-habit-editor';
import { MaximostHabitEditor } from '@/components/dashboard/maximost-habit-editor';
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { HabitProgressVisualization } from "@/components/dashboard/habit-progress-visualization";
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
  Pill,
  TrendingUp,
  Menu,
  Utensils,
  Moon as BedIcon
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
  
  // Improved habit editing function with better error handling and reliability
  const editHabit = (updatedHabit: Habit) => {
    console.log("⚡⚡ EDIT FUNCTION - START");
    console.log("Updating habit:", updatedHabit.title);
    
    // Ensure we have all required fields
    if (!updatedHabit.id || !updatedHabit.title) {
      console.error("❌ Missing required fields in habit");
      return;
    }
    
    // Force daily habits to be absolute
    const finalHabit = {
      ...updatedHabit,
      isAbsolute: updatedHabit.frequency === 'daily' ? true : updatedHabit.isAbsolute,
      // Ensure these fields have valid values
      iconColor: updatedHabit.iconColor || 'blue',
      icon: updatedHabit.icon || 'check-square',
      updatedAt: new Date()
    };
    
    console.log("Saving with color:", finalHabit.iconColor);
    console.log("Saving with icon:", finalHabit.icon);
    
    try {
      // Make a fresh copy of habits to avoid state mutation issues
      const currentHabits = [...habits];
      
      // Check if habit exists
      const existingIndex = currentHabits.findIndex(h => h.id === finalHabit.id);
      
      // Create new habits array with updated or added habit
      let newHabitsArray: Habit[];
      
      if (existingIndex >= 0) {
        // Update existing habit
        newHabitsArray = [
          ...currentHabits.slice(0, existingIndex),
          finalHabit,
          ...currentHabits.slice(existingIndex + 1)
        ];
        console.log("✏️ Updated existing habit:", finalHabit.title);
      } else {
        // Add as new habit
        newHabitsArray = [...currentHabits, finalHabit];
        console.log("➕ Adding as new habit:", finalHabit.title);
      }
      
      console.log("📊 Total habits:", newHabitsArray.length);
      
      // Save to localStorage first for reliability
      const saveData = JSON.stringify(newHabitsArray);
      try {
        localStorage.setItem('maximost-habits', saveData);
        console.log("💾 Successfully saved to localStorage");
      } catch (storageError) {
        console.error("❌ Error saving to localStorage:", storageError);
      }
      
      // Update state with the new array
      setHabits(newHabitsArray);
      
      console.log("⚡⚡ EDIT FUNCTION - COMPLETE");
      
    } catch (error) {
      console.error("❌ Error updating habit:", error);
    }
  };
  
  // Delete a habit - completely rewritten for reliability
  const deleteHabit = (habitId: string) => {
    console.log("⚡⚡ DIRECT DELETE FUNCTION - START");
    console.log("Deleting habit with ID:", habitId);
    
    // Create a new array without the habit to delete
    const newHabitsArray = habits.filter(h => h.id !== habitId);
    
    // Create a new array of completions without the deleted habit's completions
    const newCompletions = completions.filter(c => c.habitId !== habitId);
    
    console.log(`Before delete: ${habits.length} habits, After delete: ${newHabitsArray.length} habits`);
    
    // First save to localStorage
    try {
      const saveData = JSON.stringify(newHabitsArray);
      localStorage.setItem('maximost-habits', saveData);
      console.log("✅ Successfully saved updated habits to localStorage after deletion");
      
      // Update habit state
      setHabits(newHabitsArray);
      
      // Update completions state
      setCompletions(newCompletions);
      
      // Save completions to localStorage too
      localStorage.setItem('maximost-completions', JSON.stringify(newCompletions));
      console.log("✅ Successfully saved updated completions to localStorage after deletion");
      
    } catch (error) {
      console.error("❌ Error saving to localStorage after deletion:", error);
    }
    
    console.log("⚡⚡ DIRECT DELETE FUNCTION - COMPLETE");
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
      // It's a stack but called differently
      // Add all habits from the stack
      const habitsToAdd = [...habitTemplate.habits];
      
      // Add all habits in the stack
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
            {/* Adding settings button at the top right */}
            <div className="flex justify-end items-center mb-4">
              {/* Add settings button where the original settings UI was */}
              <HeaderWithSettings />
            </div>
            
            {/* Two-column layout for desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Main content */}
              <div className="flex-1">
                {/* Progress Summary Cards removed for cleaner UI */}
                
                {/* Removed duplicate date selector */}
                
                {/* Habits Section with Tabs for Tracking and Progress */}
                <Card className="mb-8">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-lg font-semibold">
                        Habit Dashboard
                        <Badge variant="outline" className="ml-2 font-normal">
                          {habits.length} habits
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="tracker" className="w-full">
                      <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-2">
                        <TabsTrigger value="tracker" className="flex items-center gap-1">
                          <CheckSquare className="h-4 w-4" />
                          <span>Habit Tracker</span>
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Progress Visualization</span>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="tracker" className="mt-0">
                        <SortableHabitViewModes
                          habits={habits}
                          completions={completions}
                          onToggleHabit={toggleCompletion}
                          onAddHabit={handleCreateHabit}
                          onEditHabit={handleEditHabit}
                          onUpdateHabit={handleEditHabit}
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
                      </TabsContent>
                      
                      <TabsContent value="progress" className="mt-0">
                        <HabitProgressVisualization />
                      </TabsContent>
                    </Tabs>
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
      
      {/* Edit Habit Dialog - Using a more robust editor with improved state management */}
      <RobustHabitEditor
        open={editHabitDialogOpen}
        onOpenChange={setEditHabitDialogOpen}
        habit={selectedHabit}
        onSave={(updatedHabit) => {
          console.log("🔄 Dashboard received habit from RobustHabitEditor:", updatedHabit.title);
          console.log("🔄 Color value being saved:", updatedHabit.iconColor);
          
          // For editing, we'll use our unified save function
          if (updatedHabit.id.includes("habit-")) {
            // This is a new habit
            addHabit(updatedHabit);
          } else {
            // This is an edit to an existing habit
            editHabit(updatedHabit);
          }
        }}
        onDelete={(habitId) => {
          console.log("🔄 Dashboard received delete request for habit ID:", habitId);
          
          // Use our dedicated deletion function
          deleteHabit(habitId);
        }}
      />
    </SettingsProvider>
  );
}