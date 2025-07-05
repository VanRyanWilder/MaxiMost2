import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { DashboardHabits } from "@/components/dashboard/dashboard-habits";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitViewModes } from "@/components/dashboard/habit-view-modes";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { SortableHabitViewModesFixed } from "@/components/dashboard/sortable-habit-view-modes-fixed";
import { UnifiedHabitDialog } from "@/components/dashboard/unified-habit-dialog";
import { useUser } from "@/context/user-context";
import { format, addDays, startOfWeek, subDays, isSameDay } from 'date-fns';
import { 
  Activity, 
  Zap, 
  PlusCircle, 
  AlertTriangle,
  ChevronDown,
  BookOpen,
  Pencil,
  Apple,
  Brain,
  Dumbbell,
  Droplets,
  Trash,
  Sun,
  Clock,
  CheckSquare,
  Pill,
  Bed,
  Utensils
} from 'lucide-react';
import {
  calculateCompletionRate,
  calculateCurrentStreak,
  calculateConsistencyScore,
  getCompletionTrend
} from "@/utils/dashboard-stats";

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";
import { apiClient } from "@/lib/apiClient"; // Import apiClient
import { HabitSkeleton } from "@/components/dashboard/habit-skeleton"; // Import Skeleton

// Sample data (same as in dashboard-habits.tsx)
// const initialHabits: Habit[] = [
// Removed initialHabits to fetch from API
// ];

// Sample completions data
// const initialCompletions: HabitCompletion[] = [
// Removed initialCompletions
// ];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Initialize habits as null to represent loading state
  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]); // Initialize as empty
  const [showCustomHabitDialog, setShowCustomHabitDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  // Updated to use firebaseUser and userLoading from the refactored context
  const { firebaseUser, userLoading: authLoading, userError: authError } = useUser();
  const [isLoading, setIsLoading] = useState(true); // This is for data fetching state
  const [error, setError] = useState<string | null>(null); // For data fetching errors

  useEffect(() => {
    // If auth state is still loading, don't do anything yet.
    if (authLoading) {
      setIsLoading(true); // Keep data loading true if auth is loading
      return;
    }

    // If there was an auth error, display it and don't fetch.
    if (authError) {
      setError(`Authentication error: ${authError.message}`);
      setIsLoading(false);
      setHabits([]);
      return;
    }

    const fetchHabitsAndCompletions = async () => {
      if (firebaseUser) { // Check for firebaseUser now
        setIsLoading(true);
        setError(null);
        try {
          // Replace with your actual API endpoints
          const fetchedHabits = await apiClient<Habit[]>('/habits');
          const fetchedCompletions = await apiClient<HabitCompletion[]>('/completions');
          setHabits(fetchedHabits);
          setCompletions(fetchedCompletions);
        } catch (err) {
          console.error("Failed to fetch data:", err);
          setError("Failed to load habits. Please try again.");
          setHabits([]); // Set to empty array on error to avoid crash and show "no habits"
        } finally {
          setIsLoading(false);
        }
      } else {
        // Handle case where user is not logged in, or set to sample data for demo
        setHabits([]); // Or some placeholder/sample data if preferred for non-logged-in state
        setCompletions([]);
        setIsLoading(false);
      }
    };

    fetchHabitsAndCompletions();
  }, [firebaseUser, authLoading, authError]);

  // Get selected date range for Weekly View - starts on Monday of current week
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  {
    id: 'h1',
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
    iconColor: '#3b82f6',
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
    title: 'Morning Meditation',
    description: 'Start the day with a clear, focused mind',
    icon: 'brain',
    iconColor: '#8b5cf6',
    impact: 9,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 7,
    createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
  },
  {
    id: 'h3',
    title: 'Strength Training',
    description: 'Build strength and muscle mass',
    icon: 'dumbbell',
    iconColor: '#ef4444',
    impact: 9,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 2,
    createdAt: new Date(Date.now() - 86400000 * 21) // 21 days ago
  },
  {
    id: 'h4',
    title: 'Read Books',
    description: 'Feed your mind with quality information',
    icon: 'bookopen',
    iconColor: '#f59e0b',
    impact: 8,
    effort: 4,
    timeCommitment: '30 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
    streak: 5,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  },
  {
    id: 'h5',
    title: 'Social Connection',
    description: 'Connect with friends or family',
    icon: 'users',
    iconColor: '#10b981',
    impact: 7,
    effort: 3,
    timeCommitment: '30 min',
    frequency: '2x-week',
    isAbsolute: false,
    category: 'social',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
  }
];

// Sample completions data
const initialCompletions: HabitCompletion[] = [
  // Today
  { id: 'c1', habitId: 'h1', date: new Date(), completed: true },
  { id: 'c2', habitId: 'h2', date: new Date(), completed: true },
  
  // Yesterday
  { id: 'c3', habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { id: 'c4', habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { id: 'c5', habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  
  // 2 days ago
  { id: 'c6', habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { id: 'c7', habitId: 'h2', date: subDays(new Date(), 2), completed: false },
  { id: 'c8', habitId: 'h4', date: subDays(new Date(), 2), completed: true },
  { id: 'c9', habitId: 'h5', date: subDays(new Date(), 2), completed: true },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [showCustomHabitDialog, setShowCustomHabitDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { user } = useUser();
  
  // Get selected date range for Weekly View - starts on Monday of current week
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // Function to handle habit completion toggle
  const toggleCompletion = (habitId: string, date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Only allow toggling if date is today or earlier
    if (date > today) return;
    
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(c.date, date)
    );
    
    if (existingCompletionIndex >= 0) {
      const newCompletions = [...completions];
      newCompletions[existingCompletionIndex].completed = !newCompletions[existingCompletionIndex].completed;
      setCompletions(newCompletions);
    } else {
      setCompletions([
        ...completions,
        { 
          id: `c-${Date.now()}`, 
          habitId, 
          date: new Date(date), 
          completed: true 
        }
      ]);
    }
  };
  
  // Function to add a new habit
  const addHabit = async (newHabitData: Omit<Habit, 'id' | 'createdAt' | 'streak'>) => {
    // Show loading state or disable button if needed here
    try {
      const createdHabit = await apiClient<Habit>('/habits', {
        method: 'POST',
        body: JSON.stringify(newHabitData), // Send data like name, description, icon, category etc.
      });
      // Add the habit returned by the API (which includes the server-generated id and createdAt)
      setHabits(prevHabits => [...(prevHabits || []), createdHabit]);
      setShowCustomHabitDialog(false); // Close dialog on success
    } catch (err) {
      console.error("Failed to add habit:", err);
      // Display error to user, e.g., using a toast notification
      setError("Failed to save habit. Please try again."); // Or a more specific error state for the dialog
    } finally {
      // Hide loading state
    }
  };
  
  // Function to edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  };
  
  // Function to delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    setCompletions(completions.filter(completion => completion.habitId !== habitId));
  };
  
  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col min-h-screen">
        <MobileHeader 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          pageTitle="Habit Dashboard"
        />
        
        <PageContainer>
          <div className="pt-4 pb-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                Your Habit Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track, measure, and optimize your daily habits for maximum ROI on your time.
              </p>
            </div>
            
            {/* Progress Cards removed for cleaner UI */}
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Unified habit tracker (left column) */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-500" /> Habit Tracker
                      </CardTitle>
                      <Button 
                        onClick={() => {
                          // Open the enhanced dialog
                          setShowCustomHabitDialog(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add New Habit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    {isLoading ? (
                      <HabitSkeleton />
                    ) : error ? (
                      <div className="text-red-500 text-center py-10">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
                        <p className="mt-4 text-lg">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-4">
                          Try Again
                        </Button>
                      </div>
                    ) : habits && habits.length > 0 ? (
                      <div className="space-y-6">
                        <SortableHabitViewModesFixed
                          habits={habits}
                          completions={completions}
                          onToggleHabit={toggleCompletion}
                          onOpenAddHabitDialog={() => setShowCustomHabitDialog(true)}
                          onUpdateHabit={editHabit}
                          onDeleteHabit={deleteHabit}
                          onReorderHabits={(reorderedHabits) => setHabits(reorderedHabits)}
                          onEditHabit={(habit) => setEditingHabit(habit)}
                        />

                        {/* DashboardHabits might be redundant if SortableHabitViewModesFixed covers all views */}
                        {/* <div className="mt-8">
                          <DashboardHabits
                            habits={habits}
                            completions={completions.filter(c => isSameDay(c.date, new Date()))}
                            onToggleCompletion={(habitId) => toggleCompletion(habitId, new Date())}
                            onAddHabit={() => setShowCustomHabitDialog(true)}
                            onEditHabit={setEditingHabit}
                            onDeleteHabit={deleteHabit}
                          />
                        </div> */}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Zap className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No habits yet!</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by adding a new habit.</p>
                        <Button onClick={() => setShowCustomHabitDialog(true)} className="mt-6">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add First Habit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column with habit library and other elements */}
              <div className="space-y-6">
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
                            { title: "Make Bed", iconName: "checkSquare", IconComponent: CheckSquare, description: "Start the day right", category: "mind" as HabitCategory },
                            { title: "Pray", iconName: "sun", IconComponent: Sun, description: "Daily prayer practice", category: "mind" as HabitCategory },
                            { title: "Lift Weights", iconName: "dumbbell", IconComponent: Dumbbell, description: "Strength training", category: "fitness" as HabitCategory },
                            { title: "Brush Teeth", iconName: "activity", IconComponent: Activity, description: "Oral hygiene", category: "health" as HabitCategory },
                            { title: "Wash Face", iconName: "droplets", IconComponent: Droplets, description: "Skincare", category: "health" as HabitCategory },
                            { title: "Meditate", iconName: "brain", IconComponent: Brain, description: "Mental clarity", category: "mind" as HabitCategory },
                            { title: "Call Friend", iconName: "users", IconComponent: Users, description: "Social connection", category: "social" as HabitCategory },
                            { title: "Drink Water", iconName: "droplets", IconComponent: Droplets, description: "Stay hydrated", category: "health" as HabitCategory },
                            { title: "Journal", iconName: "bookOpen", IconComponent: BookOpen, description: "Express thoughts", category: "mind" as HabitCategory },
                            { title: "Brain Dump", iconName: "brain", IconComponent: Brain, description: "Clear your mind", category: "mind" as HabitCategory },
                            { title: "Eat That Frog", iconName: "activity", IconComponent: Activity, description: "Do hardest task first", category: "mind" as HabitCategory },
                            { title: "Cardio", iconName: "activity", IconComponent: Activity, description: "Heart health", category: "fitness" as HabitCategory },
                            { title: "Supplements", iconName: "pill", IconComponent: Pill, description: "Daily vitamins", category: "health" as HabitCategory },
                            { title: "Custom", iconName: "plusCircle", IconComponent: PlusCircle, description: "Create custom habit", category: "other" as HabitCategory }
                          ].map((quickHabit, index) => (
                            <div key={index} className="border rounded-md bg-gray-50/50 p-2 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <quickHabit.IconComponent className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium">{quickHabit.title}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={async () => {
                                    if (quickHabit.title === "Custom") {
                                      setShowCustomHabitDialog(true);
                                    } else {
                                      const habitDataForApi: Omit<Habit, 'id' | 'createdAt' | 'streak'> = {
                                        title: quickHabit.title,
                                        description: quickHabit.description,
                                        icon: quickHabit.iconName,
                                        // iconColor: 'blue', // Will be set by dialog or backend based on category
                                        impact: 5, // Default impact
                                        effort: 3, // Default effort
                                        timeCommitment: '5 min', // Default time
                                        frequency: 'daily', // Default frequency
                                        isAbsolute: true,
                                        category: quickHabit.category,
                                        // iconColor is intentionally omitted to be derived from category or default
                                      };
                                      await addHabit(habitDataForApi);
                                      // Consider a toast notification for success
                                      // alert(`Added "${quickHabit.title}" to your habits!`); // Alert can be intrusive
                                    }
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <PlusCircle className="h-4 w-4 text-blue-500" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{quickHabit.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Habit Stacks Section */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Expert Habit Stacks</h4>
                        
                        {/* Morning Routine Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                Morning Routine Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={async () => {
                                  const morningHabitTemplates = [
                                    {
                                      title: "Morning Meditation",
                                      description: "10 minutes of focused breathing",
                                      icon: "brain", // iconName
                                      impact: 9, effort: 2, timeCommitment: '10 min',
                                      frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "mind" as HabitCategory,
                                    },
                                    {
                                      title: "Morning Hydration",
                                      description: "Drink 16oz of water immediately after waking",
                                      icon: "droplets", // iconName
                                      impact: 9, effort: 1, timeCommitment: '2 min',
                                      frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Gratitude Journaling",
                                      description: "Write down 3 things you're grateful for",
                                      icon: "bookOpen", // iconName
                                      impact: 9, effort: 3, timeCommitment: '10 min',
                                      frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "mind" as HabitCategory,
                                    }
                                  ];
                                  
                                  try {
                                    const habitPromises = morningHabitTemplates.map(template => {
                                      const { ...habitDataForApi } = template; // Spread to ensure no id, createdAt, streak
                                      return addHabit(habitDataForApi);
                                    });
                                    await Promise.all(habitPromises);
                                    alert("Added Morning Routine stack successfully!"); // Or use a toast
                                  } catch (error) {
                                    console.error("Failed to add Morning Routine stack:", error);
                                    alert("Error adding habit stack. Some habits may not have been added."); // Or use a toast
                                  }
                                }}
                              >
                                Add All {morningHabitTemplates.length} Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Meditation</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">10 minutes of focused breathing</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Hydration</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Drink 16oz water</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Gratitude Journal</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Write 3 things you're grateful for</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Huberman Lab Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                Huberman Lab Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={async () => {
                                  const hubermanHabitTemplates = [
                                    {
                                      title: "Morning Sunlight", description: "Get 2-10 minutes of morning sunlight exposure within 30-60 minutes of waking",
                                      icon: "sun", impact: 9, effort: 1, timeCommitment: '5 min', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Delay Caffeine", description: "Wait 90-120 minutes after waking before consuming caffeine",
                                      icon: "clock", impact: 7, effort: 3, timeCommitment: '0 min', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Cold Exposure", description: "Brief cold exposure via shower or cold plunge",
                                      icon: "droplets", impact: 8, effort: 6, timeCommitment: '2 min', frequency: 'daily' as HabitFrequency, isAbsolute: false, category: "health" as HabitCategory,
                                    }
                                  ];
                                  try {
                                    const habitPromises = hubermanHabitTemplates.map(template => addHabit(template));
                                    await Promise.all(habitPromises);
                                    alert("Added Huberman Lab stack successfully!");
                                  } catch (error) {
                                    console.error("Failed to add Huberman Lab stack:", error);
                                    alert("Error adding Huberman Lab stack.");
                                  }
                                }}
                              >
                                Add All {hubermanHabitTemplates.length} Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Sunlight</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">5 min daily</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
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
                                onClick={async () => {
                                  const jockoHabitTemplates = [
                                    {
                                      title: "4:30 AM Wake-Up", description: "Wake up at 4:30 AM for early start advantage",
                                      icon: "sun", impact: 8, effort: 8, timeCommitment: '0 min', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "mind" as HabitCategory,
                                    },
                                    {
                                      title: "Morning Workout", description: "Intense workout (weight training or calisthenics)",
                                      icon: "dumbbell", impact: 9, effort: 7, timeCommitment: '45 min', frequency: 'daily' as HabitFrequency, isAbsolute: false, category: "fitness" as HabitCategory,
                                    },
                                    {
                                      title: "Strategic Planning", description: "Plan your day with strategic priorities",
                                      icon: "bookOpen", impact: 8, effort: 3, timeCommitment: '10 min', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "mind" as HabitCategory,
                                    }
                                  ];
                                  try {
                                    const habitPromises = jockoHabitTemplates.map(template => addHabit(template));
                                    await Promise.all(habitPromises);
                                    alert("Added Jocko Willink stack successfully!");
                                  } catch (error) {
                                    console.error("Failed to add Jocko Willink stack:", error);
                                    alert("Error adding Jocko Willink stack.");
                                  }
                                }}
                              >
                                Add All {jockoHabitTemplates.length} Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">4:30 AM Wake-Up</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Daily discipline</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Workout</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">45-60 min daily</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Strategic Planning</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">10 min daily</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Dr. Brecka Protocol Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Pill className="h-4 w-4 text-green-500" />
                                Dr. Brecka Protocol
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={async () => {
                                  const breckaHabitTemplates = [
                                    {
                                      title: "Track blood sugar", description: "Monitor glucose levels to optimize metabolism",
                                      icon: "activity", iconColor: "blue", impact: 9, effort: 3, timeCommitment: '1 min', frequency: 'daily' as HabitFrequency, isAbsolute: false, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Optimize sleep", description: "Prioritize sleep quality through environment and timing",
                                      icon: "bed", iconColor: "indigo", impact: 10, effort: 5, timeCommitment: '8 hours', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Supplement protocol", description: "Take targeted supplements based on biomarkers",
                                      icon: "pill", iconColor: "green", impact: 8, effort: 2, timeCommitment: '2 min', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Protein intake", description: "Consume 1g protein per pound of body weight",
                                      icon: "utensils", iconColor: "red", impact: 8, effort: 5, timeCommitment: 'All day', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    }
                                  ];
                                  try {
                                    const habitPromises = breckaHabitTemplates.map(template => addHabit(template));
                                    await Promise.all(habitPromises);
                                    alert("Added Dr. Brecka Protocol stack successfully!");
                                  } catch (error) {
                                    console.error("Failed to add Dr. Brecka Protocol stack:", error);
                                    alert("Error adding Dr. Brecka Protocol stack.");
                                  }
                                }}
                              >
                                Add All {breckaHabitTemplates.length} Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Track blood sugar</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Optimize metabolism</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm font-medium">Optimize sleep</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">8 hours daily</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Pill className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">Supplement protocol</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Based on biomarkers</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Utensils className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium">Protein intake</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">1g per pound daily</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Fitness Stack */}
                        <div className="border rounded-md hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                Fitness Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={async () => {
                                  const fitnessHabitTemplates = [
                                    {
                                      title: "Strength Training", description: "Resistance training for muscle growth and strength",
                                      icon: "dumbbell", impact: 9, effort: 7, timeCommitment: '45 min', frequency: '3x-week' as HabitFrequency, isAbsolute: false, category: "fitness" as HabitCategory,
                                    },
                                    {
                                      title: "Protein Intake", description: "Consume adequate protein (1g per lb of bodyweight)",
                                      icon: "apple", impact: 8, effort: 5, timeCommitment: 'All day', frequency: 'daily' as HabitFrequency, isAbsolute: true, category: "health" as HabitCategory,
                                    },
                                    {
                                      title: "Post-workout Stretch", description: "5-10 minutes of stretching after workout",
                                      icon: "activity", impact: 7, effort: 3, timeCommitment: '15 min', frequency: '3x-week' as HabitFrequency, isAbsolute: false, category: "fitness" as HabitCategory,
                                    }
                                  ];
                                  try {
                                    const habitPromises = fitnessHabitTemplates.map(template => addHabit(template));
                                    await Promise.all(habitPromises);
                                    alert("Added Fitness stack successfully!");
                                  } catch (error) {
                                    console.error("Failed to add Fitness stack:", error);
                                    alert("Error adding Fitness stack.");
                                  }
                                }}
                              >
                                Add All {fitnessHabitTemplates.length} Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Strength Training</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">3× per week</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Protein Intake</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Daily nutrition</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Post-workout Stretch</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Improve recovery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Motivation */}
                <DailyMotivation />
              </div>
            </div>
          </div>
        </PageContainer>
        
        {/* Unified Habit Dialog for both adding and editing habits */}
        <UnifiedHabitDialog 
          open={!!editingHabit || showCustomHabitDialog} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingHabit(null);
              setShowCustomHabitDialog(false);
            }
          }}
          habit={editingHabit}
          onSave={(habitFromDialog) => {
            if (editingHabit) {
              // If we're editing an existing habit
              // editHabit will need similar API call logic (PUT request)
              editHabit(habitFromDialog); // Placeholder: This also needs to be an async API call
            } else {
              // If we're adding a new habit
              const { id, createdAt, streak, ...newHabitData } = habitFromDialog;
              addHabit(newHabitData); // Call the async addHabit
            }
            // Dialog closing is now handled within addHabit/editHabit on success
            // For edit, we might want to close it here or after successful save.
            // For add, addHabit already closes it.
            // Let's ensure editingHabit is cleared.
            if (editingHabit) { // Only clear if it was an edit operation
                setEditingHabit(null);
                setShowCustomHabitDialog(false); // Explicitly close for edit for now
            }
          }}
          onDelete={deleteHabit}
        />
      </div>
    </>
  );
}