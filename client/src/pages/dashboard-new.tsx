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
//   BookOpen,
//   BookText,
//   Brain,
//   Candy,
//   Check,
//   CheckSquare,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Cookie,
//   Droplet,
//   Droplets,
//   Dumbbell,
//   Footprints,
//   ListChecks,
//   Moon,
//   MoreHorizontal,
//   Move,
//   Pencil,
//   PenLine,
//   PhoneOff,
//   Pill,
//   PlusCircle,
//   Slash,
//   Star,
//   Sun,
//   Timer,
//   Trash,
//   Trophy,
//   Utensils,
//   Wine,
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
} from 'lucide-react'; // Uncommented all icons

// Placeholders for lucide-react icons used in this file removed
// const Activity = (props: any) => <div {...props}>ActivityIcon</div>;
// ... (all other placeholders removed) ...
// const Zap = (props: any) => <div {...props}>ZapIcon</div>;

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
        const transformedHabits: Habit[] = fetchedHabits.map((item: any) => {
          const habitData = { ...item };

          // Normalize 'name' to 'title' if 'name' exists and 'title' does not
          if (habitData.name && typeof habitData.name === 'string' && !habitData.title) {
            habitData.title = habitData.name;
            delete habitData.name; // Clean up old property
          }

          // Ensure 'title' is a string, default to "Untitled Habit" if missing or not a string
          if (typeof habitData.title !== 'string') {
            console.warn(`Habit with ID ${habitData.id || 'Unknown'} is missing a title or title is not a string. Defaulting.`);
            habitData.title = 'Untitled Habit';
          }

          // Ensure 'id' is a string. If not, this habit is problematic and should be logged/filtered.
          if (typeof habitData.id !== 'string') {
            console.error('Habit data is missing a valid string ID:', habitData);
            return null; // Mark for filtering
          }

          // Ensure 'category' is a string, default if not present
          if (typeof habitData.category !== 'string') {
            console.warn(`Habit with ID ${habitData.id} is missing a category. Defaulting to 'general'.`);
            habitData.category = 'general';
          }

          // Ensure 'icon' is a string, default if not present
          if (typeof habitData.icon !== 'string') {
            console.warn(`Habit with ID ${habitData.id} is missing an icon. Defaulting to 'activity'.`);
            habitData.icon = 'activity';
          }

          return {
            ...habitData,
            createdAt: habitData.createdAt ? (typeof habitData.createdAt === 'string' ? new Date(habitData.createdAt) : new Date((habitData.createdAt._seconds || habitData.createdAt.seconds) * 1000)) : new Date(), // Default createdAt if missing
            completions: (habitData.completions || []).map((comp: any) => ({
              ...comp,
              date: comp.date ? format(new Date(comp.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), // Ensure date is string
              value: typeof comp.value === 'number' ? comp.value : 0, // Ensure value is number
              timestamp: comp.timestamp ? (typeof comp.timestamp === 'string' ? new Date(comp.timestamp) : new Date((comp.timestamp._seconds || comp.timestamp.seconds) * 1000)) : undefined,
            })),
          };
        }).filter(habit => habit !== null) as Habit[]; // Filter out any nulls from invalid items

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
      <h1 className="text-3xl font-bold mb-6">Today's Dashboard</h1>
            
            {/* Main Content */}
            <div className="space-y-6"> {/* Simplified to a single column flow */}
              {/* Unified habit tracker */}
              <div>
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
              
              {/* Motivation Card - now follows the main habit tracker section */}
              <div>
                <DailyMotivation />
              </div>
            </div>
          {/* Commenting out the stray </main> and </div> as AppLayout should handle this structure */}
          {/* </main> */}
      {/* </div> */}
      
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