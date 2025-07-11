// client/src/pages/sortable-dashboard-new.tsx
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { PageContainer } from "@/components/layout/page-container";
import { HeaderWithSettings } from "@/components/layout/header-with-settings";
import { SettingsProvider } from "@/components/settings/settings-panel";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Replaced by GlassCard
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent
} from "@/components/glass/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Moon, CircleDollarSign, Users, AlertCircle, Loader2, Activity, CheckSquare, Calendar, Plus, Zap, Flame, Dumbbell, Brain, Droplets, BookOpen, Pill, TrendingUp, Menu, Utensils, Moon as BedIcon, Layers } from "lucide-react";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { TodaysLog } from "@/components/dashboard/TodaysLog"; // Import TodaysLog
import WeekView from "@/components/dashboard/WeekView";
import MonthView from "@/components/dashboard/MonthView";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { HabitStackDisplayItem } from "@/components/dashboard/HabitStackDisplayItem";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";
import { EditHabitDialog } from "@/components/dashboard/edit-habit-dialog-fixed-new";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { format, isSameDay, parseISO } from "date-fns";
import { toDate } from "@/lib/utils";

import { Habit as ClientHabitType } from "@/types/habit";
import { FirestoreHabit } from "../../../shared/types/firestore";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/user-context";
import { useHabits } from "@/context/HabitContext"; // Import useHabits
import { toast } from "@/hooks/use-toast";

export default function SortableDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Remove local habit state, use context instead
  // const [habits, setHabits] = useState<FirestoreHabit[]>([]);
  // const [isLoadingHabits, setIsLoadingHabits] = useState<boolean>(true);
  // const [loadHabitsError, setLoadHabitsError] = useState<string | null>(null);
  const {
    habits,
    isLoadingHabits,
    loadHabitsError,
    fetchHabits: refreshHabitsList
  } = useHabits();

  // Removed DIAGNOSTIC LOG for context values update from DashboardPage

  const [isSubmittingHabit, setIsSubmittingHabit] = useState<boolean>(false);
  const [submitHabitError, setSubmitHabitError] = useState<string | null>(null);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Partial<FirestoreHabit> | null>(null);
  const [showPerfectDayConfetti, setShowPerfectDayConfetti] = useState(false);
  const [showPerfectWeekConfetti, setShowPerfectWeekConfetti] = useState(false);
  const [currentDashboardView, setCurrentDashboardView] = useState<'day' | 'week' | 'month'>('day');
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(new Date());

  const { user, userLoading } = useUser(); // userLoading from UserContext is for auth state, not habit data loading

  // Remove local fetchHabitsAsync and related useEffect for initial fetch.
  // HabitContext will handle initial fetching and re-fetching based on user.
  // const fetchHabitsAsync = useCallback(async (showLoadingIndicator = true) => { ... });
  // useEffect(() => { ... }, [user, userLoading, fetchHabitsAsync]);


  // DNDKit's arrayMove might need to be adapted if habit order is persisted on backend
  // For now, if it's client-side only ordering, it needs to update context or a local copy
  // This local setHabits for DND might be problematic if it overwrites context.
  // For now, let's assume DND reordering is client-side visual only or needs a separate save.
  // TODO: Revisit DND state management if order needs to be persisted.
  // For now, this local setHabits will be an issue.
  // It should ideally call a function to update order in context or backend.
  // For this refactor, I will comment out the DND reordering state update to avoid conflict
  // with the context-driven `habits` state. A proper solution would involve updating the
  // order via context/backend and then re-fetching or updating context state.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over?.id) {
      // Assuming DND active.id and over.id correspond to habit.id from the backend
      console.warn("Drag and drop reordering needs to be connected to HabitContext or backend for persistence using habit.id.");
      // Example: if context had a setHabitsOrder function:
      // const oldIndex = habits.findIndex(h => h.id === active.id); // Changed habitId to id
      // const newIndex = habits.findIndex(h => h.id === over.id); // Changed habitId to id
      // if (oldIndex !== -1 && newIndex !== -1) {
      //   const reordered = arrayMove([...habits], oldIndex, newIndex);
      //   // context.setHabitsOrder(reordered.map(h => h.id)); // Changed habitId to id
      // }
    }
  };

  const toggleCompletion = async (habitId: string, date: Date | string, quantValue?: number) => {
     if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    // Assuming habitId parameter is the correct 'id' from the backend
    const habit = habits.find(h => h.id === habitId); // Changed h.habitId to h.id
    if (!habit) { toast({ title: "Error", description: "Habit not found.", variant: "destructive" }); return; }
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    let completionApiValue: number;
    const existingCompletion = (habit.completions || []).find(c => c.date === format(dateObj, "yyyy-MM-dd"));
    if (habit.type === "binary") {
      completionApiValue = (existingCompletion && existingCompletion.value > 0) ? 0 : 1;
    } else if (habit.type === "quantitative") {
      if (quantValue === undefined || quantValue === null) {
        completionApiValue = 0;
        toast({ title: "Quantitative Log Cleared", description: `Log for "${habit.title}" cleared.`, variant: "info" });
      } else {
        completionApiValue = quantValue;
        toast({ title: "Quantitative Log", description: `Logging ${quantValue} ${habit.targetUnit || ""} for "${habit.title}".`, variant: "info"});
      }
    } else { toast({ title: "Error", description: "Unknown habit type.", variant: "destructive" }); return; }
    try {
      // API call uses habit.id (which should be the correct ID from Firestore)
      await apiClient(`/habits/${habit.id}/complete`, { method: "POST", body: { value: completionApiValue, date: format(dateObj, "yyyy-MM-dd") }}); // Changed habit.habitId to habit.id
      toast({ title: "Success", description: `"${habit.title}" completion logged.` });
      await refreshHabitsList(false); // Use context's fetch function
    } catch (error: any) {
      console.error(`Failed to log completion for habit "${habit.title}":`, error);
      toast({ title: "Error", description: `Failed to log completion: ${error.message}`, variant: "destructive" });
    }
  };

  // isHabitCompletedOnDate now uses habits from context
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    // Assuming habitId parameter is the correct 'id'
    const habit = habits.find(h => h.id === habitId); // Changed h.habitId to h.id
    if (!habit || !habit.completions || habit.completions.length === 0) return false;
    const targetDateString = format(date, "yyyy-MM-dd");
    const completionEntry = habit.completions.find(c => c.date === targetDateString);
    if (!completionEntry) return false;
    if (habit.type === "binary") return completionEntry.value >= 1;
    if (habit.type === "quantitative") {
      if (typeof habit.targetValue === "number" && habit.targetValue > 0) return completionEntry.value >= habit.targetValue;
      return completionEntry.value > 0;
    }
    return false;
  };

  const addHabit = async (habitData: Omit<FirestoreHabit, "habitId" | "userId" | "createdAt" | "isActive" | "completions" | "streak">) => {
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in to add habits.", variant: "destructive" }); return; }
    setIsSubmittingHabit(true);
    setSubmitHabitError(null);
    try {
      const newHabitPayload: Partial<FirestoreHabit> = { ...habitData };
      await apiClient<FirestoreHabit>("/habits", { method: "POST", body: newHabitPayload });
      console.log('Habit submitted to API with title:', habitData.title); // DIAGNOSTIC LOG

      await refreshHabitsList(false); // Use context's fetch function

      toast({ title: "Success!", description: `Habit "${habitData.title}" creation submitted.` });
      setEditHabitDialogOpen(false);
    } catch (error: any) {
        setSubmitHabitError(error.message || "An unknown error occurred.");
        toast({ title: "Error adding habit", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingHabit(false);
    }
  };

  const editHabit = async (updatedHabitFull: FirestoreHabit) => {
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in to edit habits.", variant: "destructive" }); return; }
    // The updatedHabitFull.id should be the definitive ID from Firestore.
    // The FirestoreHabit type has habitId?: string, but we are now assuming 'id' is the actual field from DB.
    // For consistency, we should ensure updatedHabitFull uses 'id'.
    // If updatedHabitFull comes from a form that used 'habitId', it needs mapping first.
    // However, the selectedHabit passed to EditHabitDialog should already use 'id' if fetched data has 'id'.
    if (!updatedHabitFull.id) { toast({ title: "Error", description: "Cannot edit habit without an ID.", variant: "destructive" }); return; }
    setIsSubmittingHabit(true);
    setSubmitHabitError(null);
    // Destructure, assuming 'id' is the primary identifier. If 'habitId' also exists, decide which one to use or remove.
    // For now, assuming 'id' is what we want for API calls and 'habitId' might be redundant or a type artefact.
    const { id, userId, createdAt, completions, streak, habitId, ...editableFields } = updatedHabitFull;
    const payload = editableFields;
    try {
      await apiClient<FirestoreHabit>(`/habits/${id}`, { method: "PUT", body: payload }); // Use id for API call
      await refreshHabitsList(false); // Re-fetch after edit
      toast({ title: "Success!", description: `Habit "${editableFields.title}" updated.` });
      setEditHabitDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to edit habit:", error);
      setSubmitHabitError(error.message || "An unknown error occurred while editing the habit.");
      toast({ title: "Error Editing Habit", description: `${error.message}${error.status === 501 ? " (Edit endpoint may not be implemented on backend)" : ""}`, variant: "destructive"});
    } finally {
      setIsSubmittingHabit(false);
    }
  };

  const deleteHabit = async (habitIdToDelete: string) => { // Parameter renamed for clarity, it's an 'id'
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    const habitToDelete = habits.find(h => h.id === habitIdToDelete); // Changed h.habitId to h.id
    const habitTitle = habitToDelete ? habitToDelete.title : "Habit";
    try {
      await apiClient(`/habits/${habitIdToDelete}`, { method: "DELETE" }); // Use habitIdToDelete (which is an 'id')
      await refreshHabitsList(false); // Re-fetch after delete
      toast({ title: "Success", description: `Habit "${habitTitle}" archived.` });
      if (selectedHabit && selectedHabit.id === habitIdToDelete) { // Changed selectedHabit.habitId to selectedHabit.id
        setEditHabitDialogOpen(false);
        setSelectedHabit(null);
      }
    } catch (error: any) {
        toast({ title: "Error archiving habit", description: error.message, variant: "destructive" });
    }
   };

  // When a habit is clicked for editing, ensure the object passed to EditHabitDialog uses 'id'.
  // The 'habit' object here comes from the 'habits' array (from useHabits context), which should now have 'id'.
  const handleEditHabitClick = (habit: FirestoreHabit) => {
    // The 'habit' object from the list (context) should have 'id'.
    // The EditHabitDialog expects a prop 'habit' of type ClientHabitType.
    // ClientHabitType also uses 'id'.
    setSelectedHabit(habit);
    setEditHabitDialogOpen(true);
  };

  const handleCreateHabitClick = () => {
    const newHabitTemplate: Partial<FirestoreHabit> = {
        title: "", description: "", icon: "activity", iconColor: "gray", impact: 5, effort: 5,
        timeCommitment: "N/A", frequency: "daily", isAbsolute: true, category: "health",
        isBadHabit: false, completions: [], type: "binary", targetValue: undefined, targetUnit: undefined,
    };
    setSelectedHabit(newHabitTemplate);
    setEditHabitDialogOpen(true);
  };

  const handleSaveHabit = async (dialogHabitData: ClientHabitType) => {
    const { id, createdAt, streak, completions, ...restOfDialogData } = dialogHabitData;
    // FirestoreHabit uses habitId, but our actual data uses id.
    // Omit 'habitId' explicitly if it exists in FirestoreHabit type and we are using 'id'.
    const firestoreCompatibleData: Omit<FirestoreHabit, "id" | "habitId" | "userId" | "createdAt" | "isActive" | "completions" | "streak"> & { type: "binary" | "quantitative" } = {
      title: restOfDialogData.title,
      description: restOfDialogData.description || "",
      category: restOfDialogData.category as HabitCategory,
      icon: restOfDialogData.icon || "activity",
      iconColor: restOfDialogData.iconColor || "gray",
      impact: restOfDialogData.impact || 5,
      effort: restOfDialogData.effort || 2,
      timeCommitment: restOfDialogData.timeCommitment || "N/A",
      frequency: restOfDialogData.frequency as HabitFrequency,
      isAbsolute: typeof restOfDialogData.isAbsolute === 'boolean' ? restOfDialogData.isAbsolute : (restOfDialogData.frequency === 'daily'),
      isBadHabit: restOfDialogData.isBadHabit || false,
      trigger: restOfDialogData.trigger,
      replacementHabit: restOfDialogData.replacementHabit,
      type: restOfDialogData.type || "binary",
      targetValue: restOfDialogData.type === "quantitative" ? restOfDialogData.targetValue : undefined,
      targetUnit: restOfDialogData.type === "quantitative" ? restOfDialogData.targetUnit : undefined,
    };
    // selectedHabit from state should use 'id' as it comes from the context-fed 'habits' array
    if (selectedHabit && selectedHabit.id) {
      const habitToUpdate: FirestoreHabit = {
        ...(selectedHabit as FirestoreHabit), // This spread might bring habitId if it's on selectedHabit type
        ...firestoreCompatibleData, // This will not have habitId or id
        id: selectedHabit.id, // Ensure 'id' is correctly passed
      };
      // Remove habitId if it accidentally got included from selectedHabit spread and FirestoreHabit type definition
      delete (habitToUpdate as any).habitId;
      await editHabit(habitToUpdate);
    } else {
      // For new habits, the backend will assign an ID.
      // The payload `firestoreCompatibleData` does not and should not contain `id` or `habitId`.
      await addHabit(firestoreCompatibleData);
    }
  };

  const { setTheme } = useTheme();
  useEffect(() => { setTheme("light") }, [setTheme]);

  const mockStacks = [
    { id: "stack_morning_routine", name: "Morning Power Routine", habits: [ { id: "h1", title: "Make Bed" }, { id: "h2", title: "Hydrate (16oz Water)" }, { id: "h3", title: "Morning Sunlight (10 min)" }, { id: "h4", title: "Quick Meditation (5 min)" } ] },
    { id: "stack_evening_winddown", name: "Evening Wind-Down", habits: [ { id: "h5", title: "Plan Tomorrow" }, { id: "h6", title: "Read Fiction (20 min)" }, { id: "h7", title: "No Screens 1hr Before Bed" } ] }
  ];

  const handleCompleteStack = (stackId: string) => {
    const stack = mockStacks.find(s => s.id === stackId);
    alert(`Placeholder: Completing stack "${stack?.name || 'Unknown Stack'}"! This would mark all its habits as complete for today.`);
  };

  let habitContent;
  // Removed DIAGNOSTIC LOG for Render Check from DashboardPage

  if (isLoadingHabits) { habitContent = (<div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading habits...</p></div>); }
  else if (loadHabitsError) { habitContent = (<div className="flex flex-col items-center justify-center py-10 text-destructive"><AlertCircle className="h-8 w-8 mb-2" /><p className="font-semibold">Error loading habits</p><p className="text-sm">{loadHabitsError.message}</p></div>); } // Use loadHabitsError.message
  else if (habits.length === 0 && !userLoading && user) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>No habits added yet. Start building your optimal life!</p><Button onClick={handleCreateHabitClick} variant="outline" size="sm" className="mt-2"><Plus className="h-4 w-4 mr-1" />Add Your First Habit</Button></div>); }
  else if (!user && !userLoading) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>Please log in to manage and view your habits.</p></div>); }
  else {
    if (currentDashboardView === 'day') {
      // Ensure habits from context (which should use 'id') are correctly processed.
      // The 'id' field for SortableHabitViewModes items should come directly from habit.id
      const validHabitsForView = habits
        .filter(h => h && typeof h === 'object' && h.id) // Changed h.habitId to h.id
        // The map now directly uses h.id. ClientHabitType expects 'id'.
        .map(h => ({ ...h, id: h.id!, isCompletedToday: isHabitCompletedOnDate(h.id!, currentDate) })); // Changed h.habitId to h.id

      habitContent = (
        <SortableHabitViewModes
          habits={validHabitsForView} // This now passes habits with 'id'
          onToggleHabit={toggleCompletion} onAddHabit={handleCreateHabitClick}
          onEditHabit={handleEditHabitClick}
          onDeleteHabit={deleteHabit}
          onReorderHabits={(newOrderedHabits) => {
            console.warn("DND reorder visual update only, not persisted via context/backend yet.");
          }}
        />);
    } else if (currentDashboardView === 'week') {
      habitContent = <WeekView habits={habits} currentDate={currentDate} onToggleHabit={toggleCompletion} />;
    } else if (currentDashboardView === 'month') {
      const handleNavigateToDayFromMonth = (date: Date) => {
        setCurrentDate(date); // Set the main current date for the dashboard
        setCurrentDashboardView('day'); // Switch view to 'day'
      };
      habitContent = <MonthView
                        habits={habits}
                        currentDisplayMonth={currentDisplayMonth}
                        setCurrentDisplayMonth={setCurrentDisplayMonth}
                        onToggleHabit={toggleCompletion} // Still passing this in case it's used later or for consistency
                        onNavigateToDay={handleNavigateToDayFromMonth}
                     />;
    }
  }

  // dailyMotivationCard is now replaced by direct rendering of DailyMotivation and TodaysLog
  // const dailyMotivationCard = (
  //   <DailyMotivation /> // This was the old way
  // );

  return (
    <SettingsProvider>
      <PageContainer>
        {/* Ensure page title has high contrast against dark/glass background */}
        <h1 className="text-3xl font-bold mb-6 tracking-tight text-gray-100">Dashboard Overview</h1>
        <div className="flex justify-end items-center mb-4">
          <HeaderWithSettings />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-8">

            {/* Main Habit Tracker card - MOVED TO TOP, now using GlassCard */}
            <GlassCard>
              <GlassCardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  {/* Title size increased, text color will be handled by GlassCardTitle */}
                  <GlassCardTitle className="text-2xl">Habit Dashboard{!isLoadingHabits && !loadHabitsError && user && (<Badge variant="outline" className="ml-2 font-normal bg-white/10 border-white/20 text-white">{habits.length} habits</Badge>)}</GlassCardTitle>
                </div>
              </GlassCardHeader>
              <GlassCardContent>
                {/* View Toggle Buttons */}
                <div className="mb-4 flex justify-center sm:justify-start space-x-2">
                  {(['day', 'week', 'month'] as const).map((view) => (
                    <Button
                      key={view}
                      variant={currentDashboardView === view ? 'secondary' : 'outline'} // Using 'secondary' for active for better glass compatibility
                      onClick={() => setCurrentDashboardView(view)}
                      size="sm"
                      className={
                        currentDashboardView === view
                        ? "capitalize bg-white/20 hover:bg-white/30 text-white border-white/30" // Active glass style
                        : "capitalize text-gray-300 border-gray-600/70 hover:bg-white/10 hover:text-white hover:border-white/20" // Inactive: darker border, lighter on hover
                      }
                    >
                      {view}
                    </Button>
                  ))}
                </div>
                {habitContent}
              </GlassCardContent>
            </GlassCard>

            {/* Habit Stacks Section - REMOVED as per UIX-10 */}
            {/*
            {mockStacks.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Layers className="mr-2 h-6 w-6 text-primary" />
                  Your Habit Stacks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockStacks.map(stack => (
                    <HabitStackDisplayItem
                      key={stack.id}
                      stack={stack}
                      onCompleteStack={handleCompleteStack}
                    />
                  ))}
                </div>
              </section>
            )}
            */}

            {/* Original CardContent was here, now part of the moved Card above */}
            {/* <CardContent>
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
                {habitContent}
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-80 space-y-6">
            {/* Render DailyMotivation directly. TodaysLog removed as per UIX-10 */}
            <DailyMotivation />
            {/* <TodaysLog /> */}
          </div>
        </div>
      </PageContainer>
      <ConfettiCelebration trigger={showPerfectDayConfetti} type="perfectDay" onComplete={() => setShowPerfectDayConfetti(false)} />
      <ConfettiCelebration trigger={showPerfectWeekConfetti} type="perfectWeek" onComplete={() => setShowPerfectWeekConfetti(false)} />
      <EditHabitDialog
        open={editHabitDialogOpen}
        setOpen={setEditHabitDialogOpen}
        habit={selectedHabit as ClientHabitType | null}
        onSave={handleSaveHabit}
        onDelete={deleteHabit}
        isSaving={isSubmittingHabit}
        saveError={submitHabitError}
      />
    </SettingsProvider>
  );
}
