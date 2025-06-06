import { useState, useEffect } from 'react';
import { cleanHabitTitle } from '@/utils/clean-habit-title';
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Check, 
  Moon, 
  CircleDollarSign, 
  Users 
} from 'lucide-react';
import { SortableHabit } from "@/components/dashboard/sortable-habit-new";
import { IconPicker } from "@/components/ui/icon-picker";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
import { TopRatedSupplements } from "@/components/dashboard/top-rated-supplements";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { HabitProgressVisualization } from "@/components/dashboard/habit-progress-visualization";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
import { EditHabitDialog } from "@/components/dashboard/edit-habit-dialog-fixed-new";
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
import { useUser } from "@/context/user-context";

export default function SortableDashboard() {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Habit and completion state
  const [habits, setHabits] = useState<Habit[]>([]);
  
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  
  // Edit/Create habit dialog state
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Confetti celebration state
  const [showPerfectDayConfetti, setShowPerfectDayConfetti] = useState(false);
  const [showPerfectWeekConfetti, setShowPerfectWeekConfetti] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true
  const [error, setError] = useState<string | null>(null);
  
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
  const toggleCompletion = async (habitId: string, date: Date | string) => {
    if (!user || !user.id) {
      setError("User not available. Cannot toggle completion.");
      console.error("User not available for toggling completion.");
      return;
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    setError(null);

    try {
      const payload = {
        userId: user.id,
        taskId: habitId, // Assuming habitId from client maps to taskId in backend
        date: dateObj.toISOString(),
      };

      const response = await fetch('/api/user-tasks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
        throw new Error(errorData.message || `Failed to toggle completion: ${response.statusText}`);
      }

      const completionFromServer: HabitCompletion = await response.json();
      
      // Update local completions state
      let newCompletionsState: HabitCompletion[] = [];
      setCompletions(prevCompletions => {
        const existingIndex = prevCompletions.findIndex(c => c.id === completionFromServer.id);
        if (existingIndex !== -1) {
          newCompletionsState = prevCompletions.map(c => c.id === completionFromServer.id ? completionFromServer : c);
        } else {
          newCompletionsState = [...prevCompletions, completionFromServer];
        }
        return newCompletionsState;
      });
      
      const isNowCompleted = completionFromServer.completed;

      // Only check for celebrations if a habit was marked as completed
      if (isNowCompleted) {
        // Important: Use a callback with setCompletions to ensure confetti logic runs *after* state update
        // However, since newCompletionsState is derived synchronously after the setCompletions call starts,
        // we can use it here for the confetti logic directly. This relies on the fact that setCompletions
        // will eventually update to this state. For more complex scenarios, a useEffect watching completions
        // might be safer for triggering side effects like confetti.
        
        // Check for perfect day completion (all of today's habits completed)
        if (isSameDay(dateObj, new Date())) {
          const habitIds = habits.map(h => h.id);
          const allHabitsCompletedToday = habitIds.every(hId => {
            return newCompletionsState.some(c =>
              c.habitId === hId &&
              c.completed &&
              isSameDay(new Date(c.date), dateObj)
            );
          });
          
          if (allHabitsCompletedToday) {
            setShowPerfectDayConfetti(true);
          }
        }

        // Check for perfect week completion
        const currentWeekStart = startOfWeek(new Date());
        const currentWeekEnd = endOfWeek(new Date());
        const habitCompletionMap = new Map();

        habits.forEach(habit => {
          habitCompletionMap.set(habit.id, {
            completedCount: 0,
            target: getTargetDaysFromFrequency(habit.frequency),
            isAbsolute: habit.isAbsolute
          });
        });

        newCompletionsState.forEach(completion => {
          const completionDate = new Date(completion.date);
          if (completion.completed && completionDate >= currentWeekStart && completionDate <= currentWeekEnd) {
            const habitInfo = habitCompletionMap.get(completion.habitId);
            if (habitInfo) {
              habitInfo.completedCount += 1;
            }
          }
        });

        const perfectWeek = Array.from(habitCompletionMap.values()).every(info => {
          return info.completedCount >= info.target;
        });

        if (perfectWeek) {
          setShowPerfectWeekConfetti(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while toggling completion.");
      console.error("Toggle completion error:", err);
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
  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'userId'>) => {
    if (!user || !user.id) {
      setError("User not available. Cannot add habit.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // Clean up any trailing O characters in title
    let title = habitData.title;
    if (title && title.endsWith("O")) {
      title = title.replace(/O$/, "");
      console.log("Removed trailing O character from new habit title");
    }

    const newHabitPayload = {
      ...habitData,
      title, // Use cleaned title
      userId: user.id,
      // Server will set id, createdAt, updatedAt. Streak defaults to 0 on server or client.
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabitPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add habit: ${response.statusText}`);
      }
      const habitFromServer: Habit = await response.json();
      setHabits(prev => [...prev, habitFromServer]);
      console.log("➕ Added new habit via API:", habitFromServer.title);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while adding habit.");
      console.error("Add habit error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Improved habit editing function with better error handling and reliability
  const editHabit = async (updatedHabit: Habit) => {
    if (!user || !user.id) {
      setError("User not available. Cannot edit habit.");
      return;
    }
    if (!updatedHabit.id || typeof updatedHabit.id !== 'string' || updatedHabit.id.startsWith('h-')) {
        // This check helps differentiate client-generated IDs if they follow a pattern like 'h-'
        // Server-generated IDs are usually numbers or UUIDs without such a prefix.
        // This might indicate an issue if we're trying to PATCH a habit that wasn't properly created on the server.
        console.warn("Attempting to edit a habit with a client-side ID or invalid ID:", updatedHabit.id);
        // Depending on UX, you might want to attempt to create it instead, or show an error.
        // For now, we'll proceed, but this is a potential point of failure if the ID isn't a valid server ID.
    }

    console.log("⚡⚡ EDIT FUNCTION (API) - START");
    console.log("Updating habit:", updatedHabit.title, "ID:", updatedHabit.id);

    setIsLoading(true);
    setError(null);
    
    // Clean up title to remove any trailing "O" characters
    let cleanTitle = updatedHabit.title;
    if (cleanTitle && cleanTitle.endsWith("O")) {
      cleanTitle = cleanTitle.replace(/O$/, "");
      console.log("Removed trailing O character from habit title");
    }

    const habitToUpdate = {
      ...updatedHabit,
      title: cleanTitle,
      isAbsolute: updatedHabit.frequency === 'daily' ? true : updatedHabit.isAbsolute,
      iconColor: updatedHabit.iconColor || 'blue',
      icon: updatedHabit.icon || 'check-square',
    };
    
    // Remove userId, id, createdAt, updatedAt from payload for PATCH as they are not typically updatable or are part of URL
    const { id, userId, createdAt, updatedAt, streak, ...updatePayload } = habitToUpdate;

    try {
      const response = await fetch(`/api/tasks/${habitToUpdate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update habit: ${response.statusText}`);
      }
      const habitFromServer: Habit = await response.json();
      setHabits(prev => prev.map(h => (h.id === habitFromServer.id ? habitFromServer : h)));
      console.log("✏️ Updated existing habit via API:", habitFromServer.title);
      
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while updating habit.");
      console.error("Update habit error:", err);
    } finally {
      setIsLoading(false);
      console.log("⚡⚡ EDIT FUNCTION (API) - COMPLETE");
    }
  };
  
  // Delete a habit
  const deleteHabit = async (habitId: string) => {
    if (!user || !user.id) {
      setError("User not available. Cannot delete habit.");
      return;
    }
     if (!habitId || typeof habitId !== 'string' || habitId.startsWith('h-')) {
        console.warn("Attempting to delete a habit with a client-side ID or invalid ID:", habitId);
        // If it's a client-side only habit, just remove from state
        setHabits(prev => prev.filter(h => h.id !== habitId));
        setCompletions(prev => prev.filter(c => c.habitId !== habitId));
        return;
    }

    console.log("⚡⚡ DELETE FUNCTION (API) - START");
    console.log("Deleting habit with ID:", habitId);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${habitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // If status is 404, it might mean it was already deleted or never existed on server
        if (response.status === 404) {
          console.warn(`Habit with ID ${habitId} not found on server. Removing from local state.`);
        } else {
          const errorData = await response.json().catch(() => ({})); // Catch if response is not JSON
          throw new Error(errorData.message || `Failed to delete habit: ${response.statusText}`);
        }
      }
      
      // Remove from local state regardless of 404, as the goal is to remove it from UI
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setCompletions(prev => prev.filter(c => c.habitId !== habitId));
      console.log("🗑️ Deleted habit via API (or ensured removal from local state):", habitId);

    } catch (err: any) {
      setError(err.message || "An unknown error occurred while deleting habit.");
      console.error("Delete habit error:", err);
    } finally {
      setIsLoading(false);
      console.log("⚡⚡ DELETE FUNCTION (API) - COMPLETE");
    }
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
      createdAt: new Date().toISOString()
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

  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch Habits
          const habitsResponse = await fetch(`/api/users/${user.id}/tasks`);
          if (!habitsResponse.ok) {
            throw new Error(`Failed to fetch habits: ${habitsResponse.statusText}`);
          }
          const fetchedHabits: Habit[] = await habitsResponse.json();
          setHabits(fetchedHabits);

          // Fetch Completions
          // Using /api/user-tasks/:userId?days=90 as per instructions.
          // This endpoint currently returns UserTask[] which is compatible with HabitCompletion[] if taskId maps to habitId.
          // If the backend for /api/user-tasks/:userId currently expects a single date and not a range,
          // this part might need adjustment later, or the backend endpoint might need to be updated
          // to support fetching completions for a date range or all completions for a user.
          // For now, proceeding with the assumption that it can return relevant completions for the dashboard.
          const completionsResponse = await fetch(`/api/user-tasks/${user.id}?days=90`);
          if (!completionsResponse.ok) {
            throw new Error(`Failed to fetch completions: ${completionsResponse.statusText}`);
          }
          const fetchedCompletions: HabitCompletion[] = await completionsResponse.json();
          setCompletions(fetchedCompletions);

        } catch (err: any) {
          setError(err.message || "An unknown error occurred while fetching data.");
          console.error("Fetch data error:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      // No user, so set habits and completions to empty and stop loading.
      setHabits([]);
      setCompletions([]);
      setIsLoading(false);
    }
  }, [user]); // Dependency array includes user

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
          createdAt: new Date().toISOString()
        };
        
        // Add it directly to the habits array
        setHabits(prevHabits => [...prevHabits, newHabit]);
      }
    } else if (habitTemplate.habits && Array.isArray(habitTemplate.habits)) {
      // It's a stack but called differently
      // Add all habits from the stack
      const habitsToAdd = [...habitTemplate.habits];
      
      // Create all new habits from the stack
      const newHabits = habitsToAdd.map((habitItem, i) => {
        // Generate a new unique ID for the habit
        const timeStamp = Date.now();
        const newId = `h-${timeStamp}-${Math.floor(Math.random() * 1000000)}-${i}`;
        
        // Create the new habit from the template
        return {
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
          createdAt: new Date().toISOString()
        };
      });
      
      // Add all habits at once to avoid state update issues
      setHabits(prevHabits => [...prevHabits, ...newHabits]);
    } else {
      // It's a single habit, add it
      addHabitFromTemplate(habitTemplate);
    }
  };
  
  // Helper function to add a single habit from a template
  const addHabitFromTemplate = (template: any) => {
    // Generate a new unique ID for the habit
    const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Clean up any trailing O characters in template title
    let cleanTitle = template.title;
    if (cleanTitle && cleanTitle.endsWith("O")) {
      cleanTitle = cleanTitle.replace(/O$/, "");
      console.log("Removed trailing O character from template habit title");
    }
    
    // Create a new habit from the template with clean title
    const newHabit: Habit = {
      id: newId,
      title: cleanTitle,
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
      createdAt: new Date().toISOString()
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
                
                {/* Top Rated Supplements Card */}
                <TopRatedSupplements />
                
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
      
      {/* Edit Habit Dialog - Using the consistent component */}
      <EditHabitDialog
        open={editHabitDialogOpen}
        setOpen={setEditHabitDialogOpen}
        habit={selectedHabit}
        onSave={(dataFromDialog) => {
          // The dataFromDialog contains all fields from the form.
          // If dataFromDialog.id is a client-generated one (e.g., starts with 'h-') or is missing, it's a new habit.
          // Otherwise, it's an existing habit.

          // Ensure `user` is available before proceeding
          if (!user || !user.id) {
            setError("User information is not available. Please log in.");
            console.error("User not available for saving habit.");
            return;
          }

          if (dataFromDialog.id && typeof dataFromDialog.id === 'string' && !dataFromDialog.id.startsWith('h-') && habits.some(h => h.id === dataFromDialog.id)) {
            // Existing habit - ID is present, doesn't start with 'h-', and exists in current habits list
            console.log("Calling editHabit for:", dataFromDialog.title);
            editHabit(dataFromDialog as Habit); // Cast as Habit, assuming server ID is number/string
          } else {
            // New habit
            console.log("Calling addHabit for:", dataFromDialog.title);
            // Destructure to omit client-generated 'id', 'createdAt', 'streak' for the addHabit payload
            const { id, createdAt, streak, ...newHabitData } = dataFromDialog;
            addHabit(newHabitData);
          }
        }}
        onDelete={deleteHabit}
      />
    </SettingsProvider>
  );
}