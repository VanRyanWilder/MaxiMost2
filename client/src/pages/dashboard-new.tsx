import { useState, useEffect } from 'react';
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
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
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { format, addDays, startOfWeek, subDays, isSameDay, isBefore, isAfter } from 'date-fns';
import { iconMap as habitIconMap, colorSchemes } from "@/components/dashboard/edit-habit-dialog";
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { 
  Activity, 
  AlertTriangle,
  Apple,
  BookOpen,
  BookText,
  Brain,
  Candy,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cookie,
  Droplet,
  Droplets,
  Dumbbell, 
  Footprints,
  ListChecks,
  Moon,
  MoreHorizontal,
  Move,
  Pencil,
  PenLine,
  PhoneOff,
  Pill,
  PlusCircle, 
  Slash,
  Star,
  Sun,
  Timer,
  Trash,
  Trophy,
  Utensils,
  Wine,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory, CompletionEntry } from "@/types/habit"; // Added CompletionEntry

// Sample data REMOVED - will be fetched from API
// const initialHabits: Habit[] = [ ... ];
// const initialCompletions: HabitCompletion[] = [ ... ];

// Function to get icon component based on icon string
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
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
    impact: 9,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 3,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  },
  {
    id: 'h4',
    title: 'Strength Training',
    description: 'Build muscle, increase metabolism, and improve overall fitness',
    icon: 'dumbbell',
    impact: 8,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
  },
  {
    id: 'h5',
    title: 'Journal',
    description: 'Document thoughts and growth for reflection and self-awareness',
    icon: 'pencil',
    impact: 6,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
    streak: 0,
    createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
  }
];

// Dummy completion data
const initialCompletions: HabitCompletion[] = [
  { id: 'c1', habitId: 'h1', date: new Date(), completed: true },
  { id: 'c2', habitId: 'h2', date: new Date(), completed: true },
  { id: 'c3', habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { id: 'c4', habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { id: 'c5', habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  { id: 'c6', habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { id: 'c7', habitId: 'h2', date: subDays(new Date(), 2), completed: true },
  { id: 'c8', habitId: 'h4', date: subDays(new Date(), 2), completed: true },
  { id: 'c9', habitId: 'h1', date: subDays(new Date(), 3), completed: true },
];

// Function to get icon component based on icon string

function getIconComponent(iconName: string, iconColor?: string, className: string = "h-4 w-4") {
  // Get color scheme classes
  const colorScheme = iconColor ? 
    colorSchemes.find(c => c.id === iconColor) : 
    { primary: "text-slate-600", bg: "bg-slate-100" };
  
  // If the icon exists in our shared icon map from edit-habit-dialog
  if (habitIconMap[iconName]) {
    const IconComponent = habitIconMap[iconName].component;
    return <IconComponent className={`${className} ${colorScheme?.primary || ""}`} />;
  }
  
  // Fallback icons for backward compatibility
  const fallbackMap: Record<string, React.ReactNode> = {
    activity: <Activity className={`${className} ${colorScheme?.primary || ""}`} />,
    "book-open": <BookOpen className={`${className} ${colorScheme?.primary || ""}`} />,
    apple: <Apple className={`${className} ${colorScheme?.primary || ""}`} />,
    star: <Star className={`${className} ${colorScheme?.primary || ""}`} />,
    "check-square": <CheckSquare className={`${className} ${colorScheme?.primary || ""}`} />,
  };
  
  // Return from fallback map or default to activity icon
  return fallbackMap[iconName.toLowerCase()] || <Activity className={`${className} ${colorScheme?.primary || ""}`} />;
}

export default function Dashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

  // const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Removed
  const [habits, setHabits] = useState<Habit[]>([]); // Initialize with empty array
  // const [completions, setCompletions] = useState<HabitCompletion[]>([]); // Removed, completions are part of habits
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [weekOffset, setWeekOffset] = useState(0);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  // const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Not actively used, can be removed if only for initialCompletions

  useEffect(() => {
    if (!user) {
      setHabits([]);
      // setCompletions([]); // Completions state removed
      setIsLoading(false);
      setError(null); // Clear error if user logs out
      return;
    }

    const fetchHabits = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const response = await fetch(`${apiBaseUrl}/api/habits`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.text(); // Try to get more error info
          console.error("Failed to fetch habits response:", errorData);
          throw new Error(`Failed to fetch habits: ${response.status} ${response.statusText}`);
        }

        const fetchedHabits: any[] = await response.json(); // Initially parse as any to handle raw dates

        // Transform data (e.g., convert Firestore Timestamps)
        const transformedHabits: Habit[] = fetchedHabits.map(habit => ({
          ...habit,
          createdAt: habit.createdAt ? (typeof habit.createdAt === 'string' ? new Date(habit.createdAt) : new Date((habit.createdAt._seconds || habit.createdAt.seconds) * 1000)) : undefined,
          completions: (habit.completions || []).map((comp: any) => ({
            ...comp,
            timestamp: comp.timestamp ? (typeof comp.timestamp === 'string' ? new Date(comp.timestamp) : new Date((comp.timestamp._seconds || comp.timestamp.seconds) * 1000)) : undefined,
          })),
        }));

        setHabits(transformedHabits);
      } catch (err: any) {
        console.error("Error fetching habits:", err);
        setError(err.message || "An unknown error occurred while fetching habits.");
        setHabits([]); // Clear habits on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabits();
  }, [user, apiBaseUrl]); // apiBaseUrl added as dependency, though it shouldn't change often

  // Set up sensors for the drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Generate dates for the week
  const today = new Date(); // Keep for date calculations
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });

  const toggleCompletion = async (habitId: string, dateToToggle: Date) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    const token = await user.getIdToken();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      toast({ title: "Error", description: "Habit not found.", variant: "destructive" });
      return;
    }

    const dateString = format(dateToToggle, 'yyyy-MM-dd');
    const existingCompletion = (habit.completions || []).find(c => c.date === dateString);
    
    let newValue = 1; // Default to complete (value 1 for binary)
    if (habit.type === 'quantitative') {
      // For quantitative, default to targetValue if not completed, or 0 if "uncompleting"
      // This part may need more sophisticated UI for quantitative value input later
      newValue = existingCompletion && existingCompletion.value > 0 ? 0 : (habit.targetValue || 1);
    } else { // Binary
      newValue = existingCompletion && existingCompletion.value > 0 ? 0 : 1;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/habits/${habitId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ value: newValue }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to toggle completion: ${response.status}`);
      }

      const result = await response.json(); // Expects { habitId, message, completions }

      // Optimistically update the habit in the local state with new completions from backend
      setHabits(prevHabits =>
        prevHabits.map(h => {
          if (h.id === habitId) {
            // Transform timestamps in the returned completions
            const transformedCompletions = (result.completions || []).map((comp: any) => ({
              ...comp,
              timestamp: comp.timestamp ? (typeof comp.timestamp === 'string' ? new Date(comp.timestamp) : new Date((comp.timestamp._seconds || comp.timestamp.seconds) * 1000)) : undefined,
            }));
            return { ...h, completions: transformedCompletions };
          }
          return h;
        })
      );

      toast({
        title: "Habit Updated",
        description: `Completion for "${habit.title}" on ${format(dateToToggle, 'MMM d')} ${newValue > 0 ? 'logged' : 'removed'}.`
      });

    } catch (err: any) {
      console.error("Error toggling completion:", err);
      toast({ title: "Error Toggling Completion", description: err.message || "An unknown error occurred.", variant: "destructive" });
      // Optionally, re-fetch habits to ensure consistency if optimistic update fails badly
      // fetchHabits();
    }
  };

  // Function to add or edit a habit via API
  const handleSaveHabit = async (habitData: Habit) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    const token = await user.getIdToken();
    const isNewHabit = !habitData.id || habitData.id.startsWith('h-'); // Simple check for new habit

    const endpoint = isNewHabit ? `${apiBaseUrl}/api/habits` : `${apiBaseUrl}/api/habits/${habitData.id}`;
    const method = isNewHabit ? 'POST' : 'PUT';

    // Prepare payload, remove client-side only fields or transform if needed
    const payload = { ...habitData };
    if (isNewHabit) {
      delete payload.id; // Backend will assign ID
    }
    // Ensure createdAt is not sent as Date object if backend expects string or server timestamp
    // For add, backend sets createdAt. For edit, it's usually not updated or backend handles.
    // Let's assume backend handles createdAt appropriately if it's part of payload.
    // If `payload.createdAt` is a Date object, convert to ISO string or remove for add.
    if (payload.createdAt && typeof payload.createdAt !== 'string') {
        payload.createdAt = (payload.createdAt as Date).toISOString();
    }
    // Remove habit.completions from the main habit payload if they are handled by a separate endpoint
    // or if the backend doesn't expect them on habit create/update directly.
    // Based on current backend, completions are part of the habit document, but not directly updatable via POST/PUT habit.
    // Let's assume for now that we don't send completions when creating/updating the main habit fields.
    // If the backend DOES accept completions on PUT, this might need adjustment.
    // delete payload.completions; // Assuming completions are managed via /complete endpoint primarily

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to save habit: ${response.status}`);
      }

      const savedHabit = await response.json();

      // Transform timestamps for frontend state
      const transformedSavedHabit: Habit = {
          ...savedHabit,
          createdAt: savedHabit.createdAt ? (typeof savedHabit.createdAt === 'string' ? new Date(savedHabit.createdAt) : new Date((savedHabit.createdAt._seconds || savedHabit.createdAt.seconds) * 1000)) : undefined,
          completions: (savedHabit.completions || []).map((comp: any) => ({
            ...comp,
            timestamp: comp.timestamp ? (typeof comp.timestamp === 'string' ? new Date(comp.timestamp) : new Date((comp.timestamp._seconds || comp.timestamp.seconds) * 1000)) : undefined,
          })),
        };


      if (isNewHabit) {
        setHabits(prevHabits => [...prevHabits, transformedSavedHabit]);
        toast({ title: "Habit Added", description: `"${transformedSavedHabit.title}" was successfully added.` });
      } else {
        setHabits(prevHabits => prevHabits.map(h => (h.id === transformedSavedHabit.id ? transformedSavedHabit : h)));
        toast({ title: "Habit Updated", description: `"${transformedSavedHabit.title}" was successfully updated.` });
      }
      setEditHabitDialogOpen(false); // Close dialog on success
    } catch (err: any) {
      console.error("Error saving habit:", err);
      toast({ title: "Error Saving Habit", description: err.message || "An unknown error occurred.", variant: "destructive" });
    }
  };
  
  // Handle drag end for sorting habits
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find indices of dragged item and drop target
      const oldIndex = habits.findIndex(h => h.id === active.id);
      const newIndex = habits.findIndex(h => h.id === over.id);
      
      // Use arrayMove utility to get the new order of habits
      const reorderedHabits = arrayMove(habits, oldIndex, newIndex);
      
      // Update state with new order
      setHabits(reorderedHabits);
      
      // Persist the order in localStorage
      localStorage.setItem('habits', JSON.stringify(reorderedHabits));
      
      // Show a confirmation toast
      toast({
        title: "Habit order updated",
        description: "Your habits have been reordered successfully.",
        variant: "default",
      });
    }
  };

  // Function to delete a habit
  const deleteHabit = async (habitId: string) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (!habitId) {
      toast({ title: "Error", description: "Habit ID is missing.", variant: "destructive" });
      return;
    }
    const token = await user.getIdToken();

    // Optimistic update (optional, for quicker UI response)
    // const originalHabits = habits;
    // setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));

    try {
      const response = await fetch(`${apiBaseUrl}/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // If optimistic update was done, revert it
        // setHabits(originalHabits);
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Failed to delete habit: ${response.status}`);
      }

      // If no optimistic update, update state after successful API call
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
      toast({ title: "Habit Deleted", description: "The habit was successfully deleted." });
    } catch (err: any) {
      console.error("Error deleting habit:", err);
      toast({ title: "Error Deleting Habit", description: err.message || "An unknown error occurred.", variant: "destructive" });
      // If optimistic update was done and failed, ensure state is reverted
      // This might require fetching habits again if not reverting, or more complex state management.
      // For simplicity, if optimistic update is used, the revert is important.
      // Without optimistic: fetchHabits(); // Or rely on user to see change on next full fetch.
    }
  };
  
  // Handle habit editing
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  // Function to add a quick habit from the library
  const addQuickHabit = async (
    title: string, 
    icon: string, 
    category: string, 
    description: string, 
    impact = 7, 
    effort = 4, 
    timeCommitment = '10 min', 
    frequency: HabitFrequency = 'daily', 
    isAbsolute?: boolean,
    iconColor?: string
  ) => {
    let defaultColor = iconColor;
    if (!defaultColor) {
      switch (category) {
        case 'physical': defaultColor = 'blue'; break; // Example color mapping
        case 'nutrition': defaultColor = 'green'; break;
        case 'sleep': defaultColor = 'indigo'; break;
        case 'mental': defaultColor = 'purple'; break;
        case 'relationships': defaultColor = 'pink'; break;
        case 'financial': defaultColor = 'teal'; break;
        default: defaultColor = 'slate';
      }
    }
    
    const shouldBeAbsolute = isAbsolute !== undefined ? isAbsolute : frequency === 'daily';
    
    // Prepare a partial Habit object for saving. ID will be set by backend.
    const newHabitData: Partial<Habit> = {
      title, description, icon, iconColor: defaultColor, category, frequency, impact, effort, timeCommitment, isAbsolute,
      // Default other fields that backend expects but are not part of quick add params
      type: 'binary', // Assuming quick adds are binary by default
      streak: 0,
      // createdAt will be set by backend
    };
    
    // Call handleSaveHabit which now handles API call
    await handleSaveHabit(newHabitData as Habit); // Cast as Habit, ID is optional on create
  };

  // Function to check if a habit is completed on a specific date
  // This will need to use the nested `completions` in the `Habit` object (Ticket #17)
  const isHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
    return (habit.completions || []).some(c =>
      isSameDay(new Date(c.date), date) && 
      c.value > 0 // Assuming value > 0 means completed for binary/quantitative
    );
  };

  // Function to count completed days in the current week for a habit
  // This will also use nested completions
  const countCompletedDaysInWeek = (habit: Habit): number => {
    return weekDates.filter(date => isHabitCompletedOnDate(habit, date)).length;
  };

  // Check if the habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedDays = countCompletedDaysInWeek(habit); // Pass the whole habit
    const targetDays = habit.frequency === 'daily' ? 7 : 
                     habit.frequency === '2x-week' ? 2 :
                     habit.frequency === '3x-week' ? 3 :
                     habit.frequency === '4x-week' ? 4 : 1;
    
    return completedDays >= targetDays;
  };
  
  // Create a new habit
  const createNewHabit = () => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title: "New Habit",
      description: "Description of your new habit",
      icon: "activity",
      impact: 8,
      effort: 4,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: true,
      category: "health",
      streak: 0,
      createdAt: new Date()
    };
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
  };

  // Get absolute (must-do) and additional habits
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);

  return (
    // Outer layout divs, Sidebar, MobileHeader removed
    // AppLayout will provide the overall page structure
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Dashboard (New)</h1>
      {/* Profile and Stats Summary */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
              {/* Progress Cards */}
              <ProgressCard 
                number={28} 
                label="Day Streak" 
                icon={<Zap className="h-4 w-4 text-yellow-500" />} 
                tooltipText="Your current unbroken streak for completing daily habits"
              />
              
              <ProgressCard 
                number={75} 
                label="Completion %" 
                icon={<CheckSquare className="h-4 w-4 text-green-500" />}
                tooltipText="Your average habit completion rate for the last 7 days"
              />
              
              <ProgressCard 
                number={5} 
                label="Active Habits" 
                icon={<Activity className="h-4 w-4 text-blue-500" />}
                tooltipText="The number of habits you're currently tracking"
              />
              
              <ProgressCard 
                number={185} 
                label="Total Completions" 
                icon={<Trophy className="h-4 w-4 text-orange-500" />}
                tooltipText="The total number of habit completions you've logged"
              />
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Unified habit tracker (left column) */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-500" /> MaxiMost Habit Tracker
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(weekOffset - 1)}
                            className="h-8 px-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <span className="mx-2 text-sm">
                            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(weekOffset + 1)}
                            className="h-8 px-2"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={createNewHabit}
                          className="bg-blue-500 hover:bg-blue-600"
                          size="sm"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" /> Add New Habit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    {/* Week day header */}
                    <div className="grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2">
                      <div className="px-3 py-1 text-muted-foreground text-sm font-medium">
                        Habit
                      </div>
                      {weekDates.map((date, i) => (
                        <div 
                          key={i}
                          className={`text-center text-xs font-medium py-1 ${
                            isSameDay(date, today) ? 'text-blue-500 bg-blue-50 rounded-md' : 'text-muted-foreground'
                          }`}
                        >
                          <div>{format(date, 'EEE')}</div>
                          <div>{format(date, 'd')}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Must-do habits section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Must-Do Habits</h3>
                      {/* Loading and Error UI */}
                      {isLoading && <p className="px-3 py-4 text-center text-muted-foreground">Loading habits...</p>}
                      {error && <p className="px-3 py-4 text-center text-red-600">Error loading habits: {error}. Please try again later.</p>}
                      {!isLoading && !error && absoluteHabits.length === 0 && (
                        <div className="text-sm text-center py-4 text-muted-foreground italic">
                          No must-do habits added yet. Click "Add New Habit" to create one.
                        </div>
                      )}
                      {!isLoading && !error && absoluteHabits.length > 0 && (
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={absoluteHabits.map(habit => habit.id)} // Ensure habit.id is not undefined
                            strategy={verticalListSortingStrategy}
                          >
                            {absoluteHabits.map((habit) => (
                              <SortableHabit
                                key={habit.id}
                                habit={habit}
                                // Pass habit's own completions, or empty array if none
                                completions={habit.completions || []}
                                onToggleCompletion={toggleCompletion}
                                onEdit={handleEditHabit}
                                // currentDate seems unused in SortableHabit based on previous context,
                                // but if needed, pass weekDates[0] or relevant date
                                // For now, assuming isHabitCompletedOnDate in SortableHabit will use habit.completions
                                // and the date from weekDates mapping within SortableHabit itself.
                                // The isHabitCompletedOnDate prop for SortableHabit might need to be removed
                                // if the component is to use its own internal logic with nested completions.
                                // Or, pass the main isHabitCompletedOnDate function.
                                isHabitCompletedOnDate={(date: Date) => isHabitCompletedOnDate(habit, date)}
                                weekDates={weekDates} // Pass weekDates for rendering checkmarks
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                    
                    {/* Additional habits section */}
                    {!isLoading && !error && additionalHabits.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Additional Habits</h3>
                        {/* No DND for additional habits in this example, but could be added */}
                        {additionalHabits.map((habit) => {
                          const weeklyGoalMet = hasMetWeeklyFrequency(habit);
                          const completedDays = countCompletedDaysInWeek(habit);
                          const targetDays = habit.frequency === 'daily' ? 7 : 
                                          habit.frequency === '2x-week' ? 2 :
                                          habit.frequency === '3x-week' ? 3 :
                                          habit.frequency === '4x-week' ? 4 : 1;

                          // This is a simplified rendering part, assuming SortableHabit is not used here
                          // or would need similar prop adjustments.
                          // For now, replicating some of the SortableHabit display logic directly for simplicity
                          // to show how nested completions would be used.
                          return (
                            <div 
                              key={habit.id} 
                              className={`grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2 ${weeklyGoalMet ? 'bg-gradient-to-r from-green-50 to-transparent rounded-lg shadow-sm border border-green-100' : ''}`}
                            >
                              <div className="flex items-center p-1.5 relative group">
                                {/* ... (icon and title rendering as before) ... */}
                                <div className="flex items-center gap-2 min-w-0">
                                   <div className={`p-1.5 rounded-md ${
                                      weeklyGoalMet 
                                        ? 'bg-green-100 text-green-600' 
                                        : habit.iconColor 
                                          ? colorSchemes.find(c => c.id === habit.iconColor)?.bg || 'bg-slate-100'
                                          : 'bg-slate-100'
                                    }`}>
                                    {getIconComponent(
                                      habit.icon || 'activity', // Fallback icon
                                      weeklyGoalMet ? undefined : habit.iconColor
                                    )}
                                  </div>
                                  <div className="min-w-0 flex flex-col">
                                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
                                      {habit.title}
                                    </span>
                                     <div className="flex items-center justify-between gap-1 mt-0.5">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 border-blue-200">
                                        {habit.category?.charAt(0).toUpperCase() + habit.category?.slice(1)}
                                      </Badge>
                                      <span className={`text-[10px] ${weeklyGoalMet ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                                        {completedDays}/{targetDays} {habit.frequency} 
                                        {weeklyGoalMet && " ✓"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit Habit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => deleteHabit(habit.id)} className="text-red-600">
                                        <Trash className="h-4 w-4 mr-2" /> Delete Habit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              {weekDates.map((date, i) => {
                                const completedInfo = (habit.completions || []).find(c => isSameDay(new Date(c.date), date));
                                const completed = !!(completedInfo && completedInfo.value > 0);
                                const isPast = isBefore(date, today) && !isSameDay(date, today);
                                const isFuture = isAfter(date, today) && !isSameDay(date, today);
                                
                                return (
                                  <div key={i} className="flex justify-center">
                                    <button 
                                      onClick={() => toggleCompletion(habit.id, date)}
                                      disabled={isFuture}
                                      className={`flex items-center justify-center transition-all duration-200 ease-in-out
                                        ${completed 
                                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md' 
                                          : isPast 
                                            ? 'text-muted-foreground hover:bg-red-50 hover:text-red-500' 
                                            : 'text-muted-foreground/50 hover:text-blue-500 hover:bg-blue-50'
                                        } w-full h-10`}
                                    >
                                      {completed ? <Check className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-current"></div>}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                     {!isLoading && !error && habits.length > 0 && absoluteHabits.length === 0 && additionalHabits.length === 0 && (
                        <div className="text-sm text-center py-4 text-muted-foreground italic">
                          No habits matching current filters. Try adjusting or adding new habits.
                        </div>
                      )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column with habit library and other elements */}
              <div className="space-y-6">
                {/* Legend Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Legend
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="font-medium">Impact Score</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Higher numbers (1-10) indicate habits with greater potential impact on wellness and progress.
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">Effort Score</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Higher numbers (1-10) indicate habits requiring more effort or willpower to complete.
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 bg-green-100 rounded">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="font-medium">Weekly Goals</span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Green background shows when you've met your target frequency for the week.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Habit Library Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Habit Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quick Add Individual Habits Section */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Quick Add Individual Habits</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            More <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Mind</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => addQuickHabit("Cold Shower", "brain", "mind", "Boost circulation and mental resilience", 7, 6, "10 min", "daily", true, "blue")}>
                              <Brain className="mr-2 h-4 w-4 text-blue-500" /> Cold Shower
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Journal", "pencil", "mind", "Write thoughts and reflections for mental clarity", 6, 3, "15 min", "daily", true, "purple")}>
                              <Pencil className="mr-2 h-4 w-4 text-purple-500" /> Journal
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Reading", "book", "mind", "Read a book or article for growth", 7, 4, "30 min", "daily", true, "amber")}>
                              <BookOpen className="mr-2 h-4 w-4 text-amber-500" /> Reading
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Digital Detox", "zap", "mind", "Take a break from all digital devices", 8, 7, "60 min", "daily", true, "red")}>
                              <Zap className="mr-2 h-4 w-4 text-red-500" /> Digital Detox
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Pray", "star", "mind", "Take time for spiritual reflection and gratitude", 9, 2, "5 min", "daily", true, "amber")}>
                              <Star className="mr-2 h-4 w-4 text-amber-500" /> Pray
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Health</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => addQuickHabit("Sleep 8 Hours", "moon", "health", "Prioritize quality sleep for recovery and cognition", 9, 5, "8 hours", "daily", true, "indigo")}>
                              <Moon className="mr-2 h-4 w-4 text-indigo-500" /> Sleep 8 Hours
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("No Sugar", "cookie", "health", "Avoid added sugar for better metabolic health", 8, 7, "All day", "daily", true, "red")}>
                              <Cookie className="mr-2 h-4 w-4 text-red-500" /> No Sugar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Green Smoothie", "utensils", "health", "Nutrient-dense breakfast for health and energy", 7, 4, "10 min", "daily", true, "green")}>
                              <Utensils className="mr-2 h-4 w-4 text-green-500" /> Green Smoothie
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Take Vitamins", "pill", "health", "Supplement with necessary micronutrients", 6, 2, "1 min", "daily", true, "purple")}>
                              <Pill className="mr-2 h-4 w-4 text-purple-500" /> Take Vitamins
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment", 6, 1, "2 min", "daily", true, "amber")}>
                              <Sun className="mr-2 h-4 w-4 text-amber-500" /> Make Bed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Brush Teeth", "zap", "health", "Maintain oral hygiene and health", 7, 1, "3 min", "2x-day", true, "blue")}>
                              <Zap className="mr-2 h-4 w-4 text-blue-500" /> Brush Teeth
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Fitness</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => addQuickHabit("Walk 10K Steps", "footprints", "fitness", "Improve daily movement and cardiovascular health", 8, 6, "60 min", "daily", true, "green")}>
                              <Footprints className="mr-2 h-4 w-4 text-green-500" /> Walk 10K Steps
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Daily Stretching", "move", "fitness", "Improve flexibility and mobility", 7, 3, "15 min", "daily", true, "blue")}>
                              <Move className="mr-2 h-4 w-4 text-blue-500" /> Daily Stretching
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("Strength Training", "dumbbell", "fitness", "Build muscle and boost metabolism", 9, 7, "45 min", "3x-week", false, "red")}>
                              <Dumbbell className="mr-2 h-4 w-4 text-red-500" /> Strength Training
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addQuickHabit("HIIT Workout", "timer", "fitness", "High intensity interval training", 9, 8, "20 min", "3x-week", false, "amber")}>
                              <Timer className="mr-2 h-4 w-4 text-amber-500" /> HIIT Workout
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 mb-6">
                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Drink Water", "droplets", "health", "Stay hydrated for optimal body function", 9, 2)}
                      >
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Drink Water <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">1.2k</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Read", "book-open", "mind", "Daily reading for continuous growth", 8, 5)}
                      >
                        <BookOpen className="h-4 w-4 text-amber-500" />
                        Read <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-200">856</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Meditate", "brain", "mind", "Mindfulness practice for clarity", 8, 4)}
                      >
                        <Brain className="h-4 w-4 text-violet-500" />
                        Meditate <Badge className="ml-auto bg-violet-100 text-violet-700 hover:bg-violet-200">721</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Cardio", "activity", "fitness", "Heart-healthy aerobic activity", 10, 6)}
                      >
                        <Activity className="h-4 w-4 text-red-500" />
                        Cardio <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-200">695</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Gratitude", "pencil", "mind", "Write down three things you're grateful for", 7, 3)}
                      >
                        <Pencil className="h-4 w-4 text-green-500" />
                        Gratitude <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200">582</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("No Phone Hour", "zap", "mind", "Take a break from screens before bed", 7, 5)}
                      >
                        <Zap className="h-4 w-4 text-yellow-500" />
                        No Phone <Badge className="ml-auto bg-yellow-100 text-yellow-700 hover:bg-yellow-200">447</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment", 6, 1)}
                      >
                        <Sun className="h-4 w-4 text-amber-500" />
                        Make Bed <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-200">412</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Brush Teeth", "zap", "health", "Maintain oral hygiene and health", 7, 1, "3 min", "2x-day")}
                      >
                        <Zap className="h-4 w-4 text-blue-500" />
                        Brush Teeth <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">405</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Pray", "star", "mind", "Take time for spiritual reflection and gratitude", 9, 2, "5 min", "daily")}
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                        Pray <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-200">399</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Track Calories", "activity", "health", "Monitor daily caloric intake", 8, 7)}
                      >
                        <Activity className="h-4 w-4 text-orange-500" />
                        Track Calories <Badge className="ml-auto bg-orange-100 text-orange-700 hover:bg-orange-200">387</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Protein Intake", "dumbbell", "health", "Ensure adequate protein consumption", 8, 5, "10 min", "daily")}
                      >
                        <Dumbbell className="h-4 w-4 text-purple-500" />
                        Protein Intake <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-200">398</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Supplements", "droplets", "health", "Take daily supplements", 6, 2, "2 min")}
                      >
                        <Droplets className="h-4 w-4 text-green-500" />
                        Supplements <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200">375</Badge>
                      </Button>

                      <Button
                        variant="outline"
                        className="justify-start gap-2 text-sm"
                        onClick={() => addQuickHabit("Intermittent Fast", "clock", "health", "Practice time-restricted eating", 8, 6, "60 min", "daily")}
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                        Intermittent Fast <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">354</Badge>
                      </Button>
                    </div>

                    <h3 className="text-sm font-medium mb-2">Expert Habit Stacks</h3>

                    {/* Morning Routine Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Morning Routine</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment", 6, 1);
                              addQuickHabit("Drink Water", "droplets", "health", "Hydrate first thing in the morning", 9, 1);
                              addQuickHabit("Meditate", "brain", "mind", "5-minute mindfulness practice", 8, 3);
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Sun className="text-amber-500 h-4 w-4" />
                            <span>Make your bed</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment", 6, 1)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Droplets className="text-blue-500 h-4 w-4" />
                            <span>Drink 16oz water</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Drink Water", "droplets", "health", "Hydrate first thing in the morning", 9, 1)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Brain className="text-violet-500 h-4 w-4" />
                            <span>5-min meditation</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Meditate", "brain", "mind", "5-minute mindfulness practice", 8, 3)}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Evening Routine Stack */}
                    <Card className="mt-4">
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Evening Routine</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("Reflection Journal", "penLine", "mind", "Write down 3 things that went well today", 8, 3);
                              addQuickHabit("No Screens Before Bed", "phoneOff", "health", "Avoid screens 30min before sleep", 9, 5);
                              addQuickHabit("Tomorrow's Plan", "listChecks", "mind", "Write down 3 priorities for tomorrow", 7, 2);
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <PenLine className="text-indigo-500 h-4 w-4" />
                            <span>Evening reflection</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Reflection Journal", "penLine", "mind", "Write down 3 things that went well today", 8, 3)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <PhoneOff className="text-red-500 h-4 w-4" />
                            <span>No screens 30min before bed</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("No Screens Before Bed", "phoneOff", "health", "Avoid screens 30min before sleep", 9, 5)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <ListChecks className="text-emerald-500 h-4 w-4" />
                            <span>Plan tomorrow</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Tomorrow's Plan", "listChecks", "mind", "Write down 3 priorities for tomorrow", 7, 2)}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Break Bad Habits Stack */}
                    <Card className="mt-4">
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Break Bad Habits</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("No Alcohol", "wineOff", "health", "Skip alcoholic beverages", 10, 7);
                              addQuickHabit("No Social Media", "slash", "mind", "Avoid checking social media", 8, 6);
                              addQuickHabit("No Sugar", "candy", "health", "Avoid added sugar", 9, 8);
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Wine className="text-red-500 h-4 w-4" />
                            <span>No alcohol</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("No Alcohol", "wineOff", "health", "Skip alcoholic beverages", 10, 7)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Slash className="text-orange-500 h-4 w-4" />
                            <span>No social media</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("No Social Media", "slash", "mind", "Avoid checking social media", 8, 6)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Candy className="text-pink-500 h-4 w-4" />
                            <span>No sugar</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("No Sugar", "candy", "health", "Avoid added sugar", 9, 8)}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Huberman Lab Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Huberman Lab</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("Morning Sunlight", "sun", "health", "Get morning sun exposure for circadian rhythm", 10, 3);
                              addQuickHabit("Consistent Sleep Schedule", "clock", "health", "Go to bed and wake up at consistent times", 10, 6);
                              addQuickHabit("Zone 2 Cardio", "activity", "fitness", "Moderate-intensity cardio for 30-45 minutes", 9, 5);
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Sun className="text-amber-500 h-4 w-4" />
                            <span>Morning sunlight</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Morning Sunlight", "sun", "health", "Get sun exposure for circadian rhythm", 10, 3)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Clock className="text-blue-500 h-4 w-4" />
                            <span>Consistent sleep</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Consistent Sleep", "clock", "health", "Go to bed and wake up at consistent times", 10, 6)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Dumbbell className="text-red-500 h-4 w-4" />
                            <span>Zone 2 cardio</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Zone 2 Cardio", "activity", "fitness", "Moderate-intensity cardio for 30-45 minutes", 9, 5)}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Stoic Philosophy Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Stoic Philosophy</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("Morning Reflection", "sun", "mind", "Start the day with focused thought and intention", 8, 2);
                              addQuickHabit("Evening Journal", "pencil", "mind", "Reflect on the day's events and lessons", 7, 3);
                              addQuickHabit("Negative Visualization", "brain", "mind", "Practice considering potential challenges", 9, 4);
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Sun className="text-amber-500 h-4 w-4" />
                            <span>Morning reflection</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Morning Reflection", "sun", "mind", "Start the day with focused thought and intention", 8, 2)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Pencil className="text-violet-500 h-4 w-4" />
                            <span>Evening journal</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Evening Journal", "pencil", "mind", "Reflect on the day's events and lessons", 7, 3)}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Brain className="text-blue-500 h-4 w-4" />
                            <span>Negative visualization</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Negative Visualization", "brain", "mind", "Practice considering potential challenges", 9, 4)}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Fitness Fundamentals Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Fitness Fundamentals</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs"
                            onClick={() => {
                              addQuickHabit("Protein with Every Meal", "apple", "health", "Ensure adequate protein intake for muscle support");
                              addQuickHabit("Progressive Overload", "dumbbell", "fitness", "Gradually increase workout intensity over time");
                              addQuickHabit("Mobility Work", "activity", "fitness", "Maintain joint health and prevent injuries");
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Apple className="text-green-500 h-4 w-4" />
                            <span>Protein with every meal</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Protein with Every Meal", "apple", "health", "Ensure adequate protein intake for muscle support")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Dumbbell className="text-red-500 h-4 w-4" />
                            <span>Progressive overload</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Progressive Overload", "dumbbell", "fitness", "Gradually increase workout intensity over time")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Activity className="text-blue-500 h-4 w-4" />
                            <span>Mobility work</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Mobility Work", "activity", "fitness", "Maintain joint health and prevent injuries")}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                  </CardContent>
                </Card>
                
                {/* Motivation Card */}
                <DailyMotivation />
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
        onSave={handleSaveHabit} // Use the new handleSaveHabit
      />
    </PageContainer>
    // Removed closing tags for outer divs that are no longer needed
  );
}