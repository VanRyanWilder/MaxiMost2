// client/src/pages/sortable-dashboard-new.tsx
import { useState, useEffect, useCallback } from "react";
// ... other imports ...
import { cleanHabitTitle } from "@/utils/clean-habit-title";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Moon, CircleDollarSign, Users, AlertCircle, Loader2, Activity, CheckSquare, Calendar, Plus, Zap, Flame, Dumbbell, Brain, Droplets, BookOpen, Pill, TrendingUp, Menu, Utensils, Moon as BedIcon } from "lucide-react";
import { SortableHabit } from "@/components/dashboard/sortable-habit-new";
import { IconPicker } from "@/components/ui/icon-picker";
import { DailyMotivation } from "@/components/dashboard/daily-motivation"; // Added back for dashboard
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
// import { TopRatedSupplements } from "@/components/dashboard/top-rated-supplements"; // Moved to Explore page
import WeekView from "@/components/dashboard/WeekView"; // Import WeekView
import MonthView from "@/components/dashboard/MonthView"; // Import MonthView
import { HabitStackCard } from "@/components/dashboard/HabitStackCard"; // Import HabitStackCard
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { HabitProgressVisualization } from "@/components/dashboard/habit-progress-visualization";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
import { EditHabitDialog } from "@/components/dashboard/edit-habit-dialog-fixed-new";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { format, addDays, startOfWeek, endOfWeek, subDays, isSameDay, parseISO } from "date-fns";

import { Habit as ClientHabitType, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";
import { FirestoreHabit, HabitCompletionEntry, FirestoreTimestamp } from "../../../shared/types/firestore";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/user-context";
import { toast } from "@/hooks/use-toast";

const toDate = (timestamp: FirestoreTimestamp | Date | string): Date => {
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === "string") return parseISO(timestamp);
  if (timestamp && typeof timestamp.toDate === "function") return timestamp.toDate();
  if (timestamp && typeof timestamp.seconds === "number" && typeof timestamp.nanoseconds === "number") {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
  return new Date(timestamp as any);
};

export default function SortableDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<FirestoreHabit[]>([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState<boolean>(true);
  const [loadHabitsError, setLoadHabitsError] = useState<string | null>(null);
  const [isSubmittingHabit, setIsSubmittingHabit] = useState<boolean>(false);
  const [submitHabitError, setSubmitHabitError] = useState<string | null>(null);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Partial<FirestoreHabit> | null>(null);
  const [showPerfectDayConfetti, setShowPerfectDayConfetti] = useState(false);
  const [showPerfectWeekConfetti, setShowPerfectWeekConfetti] = useState(false);
  const [currentDashboardView, setCurrentDashboardView] = useState<'day' | 'week' | 'month'>('day');
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(new Date()); // For MonthView navigation

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
   );
  const { user, userLoading } = useUser();

  const fetchHabitsAsync = useCallback(async (showLoadingIndicator = true) => {
    if (!user) return;
    if(showLoadingIndicator) setIsLoadingHabits(true);
    setLoadHabitsError(null);
    try {
      const fetchedHabits = await apiClient<FirestoreHabit[]>("/habits", { method: "GET" });
      const habitsWithEnsuredCompletions = fetchedHabits.map(h => ({ ...h, completions: (h.completions || []).map(c => c) }));
      setHabits(habitsWithEnsuredCompletions);
    } catch (error: any) {
      console.error("Failed to fetch habits:", error);
      setLoadHabitsError(error.message || "An unknown error occurred while fetching habits.");
      if(showLoadingIndicator) toast({ title: "Error loading habits", description: error.message, variant: "destructive" });
    } finally {
      if(showLoadingIndicator) setIsLoadingHabits(false);
    }
  }, [user]);

  useEffect(() => {
     if (user && !userLoading) { fetchHabitsAsync(true); }
     else if (!user && !userLoading) { setHabits([]); setIsLoadingHabits(false); }
  }, [user, userLoading, fetchHabitsAsync]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id) {
      setHabits(currentHabits => {
        const oldIndex = currentHabits.findIndex(h => h.habitId === active.id);
        const newIndex = currentHabits.findIndex(h => h.habitId === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentHabits;
        return arrayMove(currentHabits, oldIndex, newIndex);
      });
    }
  };

  // Updated toggleCompletion to accept an optional value for quantitative habits
  const toggleCompletion = async (habitId: string, date: Date | string, quantValue?: number) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const habit = habits.find(h => h.habitId === habitId);
    if (!habit) {
      toast({ title: "Error", description: "Habit not found.", variant: "destructive" });
      return;
    }

    const dateObj = typeof date === "string" ? parseISO(date) : date;
    // Note: Original code had a toast about logging for today only. This might need review
    // if user can log for other days via a new UI. For now, keeping it focused on the value.

    let completionApiValue: number;
    const existingCompletion = (habit.completions || []).find(c => isSameDay(toDate(c.timestamp), dateObj));


    if (habit.type === "binary") {
      // Toggle: if exists and value > 0, set to 0 (uncomplete). Else, set to 1 (complete).
      completionApiValue = (existingCompletion && existingCompletion.value > 0) ? 0 : 1;
    } else if (habit.type === "quantitative") {
      if (quantValue === undefined || quantValue === null) {
        // If no value provided (e.g. user wants to "uncheck" or clear a quantitative log)
        // We can set it to 0 or handle as a deletion of the entry for that day.
        // For now, setting to 0 to indicate no value or clearing.
        completionApiValue = 0;
        toast({
          title: "Quantitative Log Cleared",
          description: `Log for "${habit.title}" on ${format(dateObj, "MMM d")} cleared.`,
          variant: "info",
        });
      } else {
        completionApiValue = quantValue;
        toast({
            title: "Quantitative Log",
            description: `Logging ${quantValue} ${habit.targetUnit || ""} for "${habit.title}".`,
            variant: "info",
        });
      }
    } else {
      toast({ title: "Error", description: "Unknown habit type. Cannot log completion.", variant: "destructive" });
      return;
    }

    try {
      // The backend /api/habits/:habitId/complete should be updated to accept this body structure
      // and handle the { date, value } for creating/updating a completion entry.
      // For now, the body structure is simplified as per previous structure.
      // The backend will need to know which date this completion is for.
      // The current backend placeholder for /complete doesn't use the body.
      // This part assumes backend is updated to handle: { value: number, date: string (YYYY-MM-DD) }
      await apiClient(`/habits/${habit.habitId}/complete`, {
        method: "POST",
        body: { value: completionApiValue, date: format(dateObj, "yyyy-MM-dd") },
      });
      toast({ title: "Success", description: `"${habit.title}" completion logged.` });
      await fetchHabitsAsync(false); // Re-fetch habits to update UI
    } catch (error: any) {
      console.error(`Failed to log completion for habit "${habit.title}":`, error);
      toast({ title: "Error", description: `Failed to log completion: ${error.message}`, variant: "destructive" });
    }
  };

  // Updated isHabitCompletedOnDate for V1.1
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    const habit = habits.find(h => h.habitId === habitId);
    if (!habit || !habit.completions || habit.completions.length === 0) return false;

    const targetDateString = format(date, "yyyy-MM-dd");
    const completionEntry = habit.completions.find(c => c.date === targetDateString);

    if (!completionEntry) return false;

    if (habit.type === "binary") {
      return completionEntry.value >= 1;
    } else if (habit.type === "quantitative") {
      if (typeof habit.targetValue === "number" && habit.targetValue > 0) {
        return completionEntry.value >= habit.targetValue;
      }
      return completionEntry.value > 0;
    }
    return false;
  };

  // REMOVING THIS DUPLICATE/OLD VERSION of toggleCompletion
  // The correct one is defined earlier and handles quantValue.
  /*
  const toggleCompletion = async (habitId: string, date: Date | string) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const habit = habits.find(h => h.habitId === habitId);
    if (!habit) {
      toast({ title: "Error", description: "Habit not found.", variant: "destructive" });
      return;
    }

    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isSameDay(dateObj, new Date())) {
        toast({
            title: "Completion Note",
            description: `Completion will be logged for today (${format(new Date(), "MMM d")}). Logging for past/future dates will be available later.`,
            variant: "default",
            duration: 5000,
        });
    }

    let completionValue: number;
    if (habit.type === "binary") {
      completionValue = 1;
    } else if (habit.type === "quantitative") {
      completionValue = (typeof habit.targetValue === "number" && habit.targetValue > 0) ? habit.targetValue : 1;
      toast({
          title: "Quantitative Completion",
          description: `Logging completion with value: ${completionValue} ${habit.targetUnit || ""}. Custom value input via UI coming soon.`,
          variant: "info",
          duration: 5000,
      });
    } else {
      toast({ title: "Error", description: "Unknown habit type. Cannot log completion.", variant: "destructive" });
      return;
    }

    try {
      await apiClient(`/habits/${habit.habitId}/complete`, {
        method: "POST",
        body: { value: completionValue },
      });
      toast({ title: "Success", description: `"${habit.title}" completion logged.` });
      await fetchHabitsAsync(false);
    } catch (error: any) {
      console.error(`Failed to log completion for habit "${habit.title}":`, error);
      toast({ title: "Error", description: `Failed to log completion: ${error.message}`, variant: "destructive" });
    }
  };
  */

  const addHabit = async (habitData: Omit<FirestoreHabit, "habitId" | "userId" | "createdAt" | "isActive" | "completions" | "streak">) => { /* ... as before ... */
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in to add habits.", variant: "destructive" }); return; }
    setIsSubmittingHabit(true);
    setSubmitHabitError(null);
    try {
      const newHabitPayload: Partial<FirestoreHabit> = {
        title: habitData.title, description: habitData.description || "", category: habitData.category,
        type: habitData.type,
        targetValue: habitData.type === "quantitative" ? habitData.targetValue : undefined,
        targetUnit: habitData.type === "quantitative" ? habitData.targetUnit : undefined,
        isBadHabit: habitData.isBadHabit || false,
        trigger: habitData.isBadHabit ? habitData.trigger : undefined,
        replacementHabit: habitData.isBadHabit ? habitData.replacementHabit : undefined,
        icon: habitData.icon || "activity", iconColor: habitData.iconColor || "gray",
        impact: habitData.impact || 5, effort: habitData.effort || 5,
        timeCommitment: habitData.timeCommitment || "N/A", frequency: habitData.frequency || "daily",
        isAbsolute: typeof habitData.isAbsolute === "boolean" ? habitData.isAbsolute : (habitData.frequency === "daily"),
      };
      const createdHabit = await apiClient<FirestoreHabit>("/habits", { method: "POST", body: newHabitPayload });
      setHabits(prevHabits => [...prevHabits, createdHabit]);
      toast({ title: "Success!", description: `Habit "${createdHabit.title}" added.` });
      setEditHabitDialogOpen(false);
    } catch (error: any) {
        setSubmitHabitError(error.message || "An unknown error occurred.");
        toast({ title: "Error adding habit", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingHabit(false);
    }
  };
  const editHabit = async (updatedHabitFull: FirestoreHabit) => { /* ... as before ... */
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to edit habits.", variant: "destructive" });
      return;
    }
    if (!updatedHabitFull.habitId) {
      toast({ title: "Error", description: "Cannot edit habit without an ID.", variant: "destructive" });
      return;
    }
    setIsSubmittingHabit(true);
    setSubmitHabitError(null);
    const { habitId, userId, createdAt, completions, streak, ...editableFields } = updatedHabitFull;
    const payload = editableFields;
    try {
      const savedHabit = await apiClient<FirestoreHabit>(`/habits/${habitId}`, {
        method: "PUT",
        body: payload,
      });
      setHabits(prevHabits => prevHabits.map(h => (h.habitId === savedHabit.habitId ? savedHabit : h)));
      toast({ title: "Success!", description: `Habit "${savedHabit.title}" updated.` });
      setEditHabitDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to edit habit:", error);
      setSubmitHabitError(error.message || "An unknown error occurred while editing the habit.");
      toast({
        title: "Error Editing Habit",
        description: `${error.message}${error.status === 501 ? " (Edit endpoint may not be implemented on backend)" : ""}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmittingHabit(false);
    }
  };
  const deleteHabit = async (habitId: string) => { /* ... as before ... */
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    const habitToDelete = habits.find(h => h.habitId === habitId);
    const habitTitle = habitToDelete ? habitToDelete.title : "Habit";
    try {
      await apiClient(`/habits/${habitId}`, { method: "DELETE" });
      toast({ title: "Success", description: `Habit "${habitTitle}" archived.` });
      setHabits(prevHabits => prevHabits.filter(h => h.habitId !== habitId));
      if (selectedHabit && selectedHabit.habitId === habitId) {
        setEditHabitDialogOpen(false);
        setSelectedHabit(null);
      }
    } catch (error: any) {
        toast({ title: "Error archiving habit", description: error.message, variant: "destructive" });
    }
   };
  const handleEditHabitClick = (habit: FirestoreHabit) => { setSelectedHabit(habit); setEditHabitDialogOpen(true); };
  const handleCreateHabitClick = () => { /* ... as before ... */
    const newHabitTemplate: Partial<FirestoreHabit> = {
        title: "", description: "", icon: "activity", iconColor: "gray", impact: 5, effort: 5,
        timeCommitment: "N/A", frequency: "daily", isAbsolute: true, category: "health",
        isBadHabit: false, completions: [], type: "binary", targetValue: undefined, targetUnit: undefined,
    };
    setSelectedHabit(newHabitTemplate);
    setEditHabitDialogOpen(true);
  };
  const handleSaveHabit = async (dialogHabitData: ClientHabitType & { type?: "binary" | "quantitative", targetValue?: number, targetUnit?: string }) => { /* ... as before ... */
    const dataToSave: Omit<FirestoreHabit, "habitId" | "userId" | "createdAt" | "isActive" | "completions" | "streak"> & { type: "binary" | "quantitative" } = {
        title: dialogHabitData.title, description: dialogHabitData.description,
        category: dialogHabitData.category as HabitCategory, icon: dialogHabitData.icon,
        iconColor: dialogHabitData.iconColor, impact: dialogHabitData.impact,
        effort: dialogHabitData.effort, timeCommitment: dialogHabitData.timeCommitment,
        frequency: dialogHabitData.frequency as HabitFrequency, isAbsolute: dialogHabitData.isAbsolute,
        isBadHabit: dialogHabitData.isBadHabit || false, trigger: dialogHabitData.trigger,
        replacementHabit: dialogHabitData.replacementHabit,
        type: dialogHabitData.type || "binary",
        targetValue: dialogHabitData.type === "quantitative" ? dialogHabitData.targetValue : undefined,
        targetUnit: dialogHabitData.type === "quantitative" ? dialogHabitData.targetUnit : undefined,
    };
    if (selectedHabit && selectedHabit.habitId) {
      const habitToUpdate: FirestoreHabit = {
        ...(selectedHabit as FirestoreHabit), ...dataToSave, habitId: selectedHabit.habitId,
      };
      await editHabit(habitToUpdate);
    } else { await addHabit(dataToSave); }
  };
  const { setTheme } = useTheme();
  useEffect(() => { /* ... theme ... */ }, [setTheme]);

  // Mock Habit Stack Data for Dashboard Display
  // In a real scenario, this would come from a fetch call, similar to habits
  const mockStacks = [
    {
      id: "stack_morning_routine",
      name: "Morning Power Routine",
      habits: [ // These would be actual habit objects or IDs linked to full habit data
        { id: "h1", title: "Make Bed" },
        { id: "h2", title: "Hydrate (16oz Water)" },
        { id: "h3", title: "Morning Sunlight (10 min)" },
        { id: "h4", title: "Quick Meditation (5 min)" },
      ]
    },
    {
      id: "stack_evening_winddown",
      name: "Evening Wind-Down",
      habits: [
        { id: "h5", title: "Plan Tomorrow" },
        { id: "h6", title: "Read Fiction (20 min)" },
        { id: "h7", title: "No Screens 1hr Before Bed" },
      ]
    }
  ];

  const handleCompleteStack = (stackId: string) => {
    const stack = mockStacks.find(s => s.id === stackId);
    alert(`Placeholder: Completing stack "${stack?.name || 'Unknown Stack'}"! This would mark all its habits as complete for today.`);
    // TODO: Implement actual logic to complete all habits in the stack for the current day.
    // This would involve iterating through stack.habits, finding their full details from the main 'habits' state,
    // and calling toggleCompletion for each.
  };

  let habitContent;
  if (isLoadingHabits) { habitContent = (<div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading habits...</p></div>); }
  else if (loadHabitsError) { habitContent = (<div className="flex flex-col items-center justify-center py-10 text-destructive"><AlertCircle className="h-8 w-8 mb-2" /><p className="font-semibold">Error loading habits</p><p className="text-sm">{loadHabitsError}</p></div>); }
  else if (habits.length === 0 && !userLoading && user) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>No habits added yet. Start building your optimal life!</p><Button onClick={handleCreateHabitClick} variant="outline" size="sm" className="mt-2"><Plus className="h-4 w-4 mr-1" />Add Your First Habit</Button></div>); }
  else if (!user && !userLoading) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>Please log in to manage and view your habits.</p></div>); }
  else {
    if (currentDashboardView === 'day') {
      habitContent = (
        <SortableHabitViewModes // This is the current "Day" view
          habits={habits.map(h => ({ ...h, id: h.habitId!, isCompletedToday: isHabitCompletedOnDate(h.habitId!, currentDate) } as any))}
          onToggleHabit={toggleCompletion} onAddHabit={handleCreateHabitClick}
          onEditHabit={handleEditHabitClick} onUpdateHabit={editHabit}
          onDeleteHabit={deleteHabit}
          onReorderHabits={(newOrderedHabits) => setHabits(newOrderedHabits.map(h => ({...h, habitId: h.id})))}
        />);
    } else if (currentDashboardView === 'week') {
      habitContent = <WeekView habits={habits} currentDate={currentDate} />;
    } else if (currentDashboardView === 'month') {
      habitContent = <MonthView habits={habits} currentDisplayMonth={currentDisplayMonth} setCurrentDisplayMonth={setCurrentDisplayMonth} />;
    }
  }

  // Placeholder for DailyMotivation styling - to be implemented in DailyMotivation.tsx itself or via props
  // For now, just rendering it in the right sidebar.
  const dailyMotivationCard = (
    <Card className="bg-gradient-to-br from-primary/80 to-primary dark:from-primary/70 dark:to-primary/90 text-primary-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Flame className="w-5 h-5 mr-2" /> Daily Spark of Wisdom
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DailyMotivation /> {/* This component already provides a daily quote */}
      </CardContent>
    </Card>
  );

  const todaysLogCard = (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-500" /> Today's Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Daily Spark of Wisdom:</h4>
          {/* DailyMotivation component is already fulfilling the "Daily Spark" role,
              so we can either show its content here or rely on the separate card.
              For now, let's assume the separate card is the main display for the spark.
              If needed, a shorter version could be pulled here.
              Keeping this distinct from the main DailyMotivation card for now.
          */}
          <p className="text-xs italic text-foreground">"The best time to plant a tree was 20 years ago. The second best time is now." - Chinese Proverb</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-1 text-muted-foreground">Today's Journal Preview:</h4>
          <p className="text-xs text-foreground italic">
            No journal entry for today yet. Click below to add one.
            {/* In a real app, this would show a snippet of journalEntries[format(new Date(), 'yyyy-MM-dd')] */}
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={() => window.location.href = '/journal'}>
          Go to Journal
        </Button>
      </CardContent>
    </Card>
  );

  const handleAddFromLibrary = async (habitTemplate: any) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to add habits.", variant: "destructive" });
      return;
    }

    // Construct the payload for the addHabit function
    // The habitTemplate comes from habitSuggestions in habit-library-new.tsx
    const newHabitData = {
      title: habitTemplate.title,
      description: habitTemplate.description || "",
      category: habitTemplate.category as HabitCategory, // Ensure type assertion if necessary
      type: habitTemplate.type || "binary", // Default to binary if not specified
      targetValue: habitTemplate.type === "quantitative" ? habitTemplate.targetValue : undefined,
      targetUnit: habitTemplate.type === "quantitative" ? habitTemplate.targetUnit : undefined,
      isBadHabit: habitTemplate.isBadHabit || false,
      trigger: habitTemplate.isBadHabit ? habitTemplate.trigger : undefined,
      replacementHabit: habitTemplate.isBadHabit ? habitTemplate.replacementHabit : undefined,
      icon: habitTemplate.icon || "activity",
      iconColor: habitTemplate.iconColor || "gray",
      impact: habitTemplate.impact || 5,
      effort: habitTemplate.effort || 2,
      timeCommitment: habitTemplate.timeCommitment || "5 min",
      frequency: habitTemplate.frequency as HabitFrequency || "daily", // Ensure type assertion
      isAbsolute: typeof habitTemplate.isAbsolute === 'boolean' ? habitTemplate.isAbsolute : (habitTemplate.frequency === 'daily'),
    };

    // Call the existing addHabit function which handles API call and state update
    await addHabit(newHabitData);
  };

  return (
    <SettingsProvider>
      <div className="flex min-h-screen bg-background"><Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /><main className="flex-1"><PageContainer><div className="flex justify-end items-center mb-4"><HeaderWithSettings /></div><div className="flex flex-col lg:flex-row gap-6"><div className="flex-1">
            {/* Habit Stacks Section - Added before the main Habit Dashboard card */}
            {mockStacks.length > 0 && user && !userLoading && (
              <Card className="mb-6 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Your Habit Stacks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {mockStacks.map(stack => (
                    <HabitStackCard key={stack.id} stack={stack} onCompleteStack={handleCompleteStack} />
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="mb-8">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg font-semibold">Habit Dashboard{!isLoadingHabits && !loadHabitsError && user && (<Badge variant="outline" className="ml-2 font-normal">{habits.length} habits</Badge>)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* View Toggle Buttons */}
                <div className="mb-4 flex justify-center sm:justify-start space-x-2">
                  {(['day', 'week', 'month'] as const).map((view) => (
                    <Button
              key={view}
              variant={currentDashboardView === view ? 'default' : 'outline'}
              onClick={() => setCurrentDashboardView(view)}
              size="sm"
              className="capitalize"
            >
              {view}
            </Button>
          ))}
        </div>
      <Tabs defaultValue="tracker" className="w-full"><TabsList className="mb-4 w-full sm:w-auto grid grid-cols-2"><TabsTrigger value="tracker" className="flex items-center gap-1"><CheckSquare className="h-4 w-4" /><span>Habit Tracker</span></TabsTrigger><TabsTrigger value="progress" className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /><span>Progress Visualization</span></TabsTrigger></TabsList><TabsContent value="tracker" className="mt-0">{habitContent}</TabsContent><TabsContent value="progress" className="mt-0"><HabitProgressVisualization habits={habits} /></TabsContent></Tabs></CardContent></Card></div><div className="w-full lg:w-80 space-y-6">{dailyMotivationCard}{todaysLogCard}<HabitLibrary onAddHabit={handleAddFromLibrary} /></div></div></PageContainer></main></div>
      <ConfettiCelebration trigger={showPerfectDayConfetti} type="perfectDay" onComplete={() => setShowPerfectDayConfetti(false)} />
      <ConfettiCelebration trigger={showPerfectWeekConfetti} type="perfectWeek" onComplete={() => setShowPerfectWeekConfetti(false)} />
      <EditHabitDialog
        open={editHabitDialogOpen}
        setOpen={setEditHabitDialogOpen}
        habit={selectedHabit as ClientHabitType & { type?: "binary" | "quantitative", targetValue?: number, targetUnit?: string } | null}
        onSave={handleSaveHabit}
        onDelete={deleteHabit}
        isSaving={isSubmittingHabit}
        saveError={submitHabitError}
      />
    </SettingsProvider>
  );
}
