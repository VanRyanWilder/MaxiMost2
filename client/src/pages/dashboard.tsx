import { useState, useEffect } from 'react';
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
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
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Removed
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
    // Sidebar and MobileHeader removed, outer div structure simplified
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
              
              {/* Right column is now clear for future dashboard-specific widgets or can be removed if layout becomes single column */}
              <div className="space-y-6">
                {/* This column is now available for new dashboard-specific content if needed. */}
                {/* For example, summary stats, charts, or other focused elements. */}
                {/* If no content is planned here, the lg:col-span-2 on the left column could be changed to lg:col-span-3 */}
                {/* and this div removed to make the habit tracker full-width on larger screens. */}
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
      {/* </div> // Removed corresponding outer div closing tag */}
    </PageContainer> // Assuming PageContainer is the root for this page's content now
  );
}