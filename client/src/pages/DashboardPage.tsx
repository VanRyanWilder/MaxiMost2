// client/src/pages/sortable-dashboard-new.tsx
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/theme-provider";
import { PageContainer } from "@/components/layout/page-container";
import { HeaderWithSettings } from "@/components/layout/header-with-settings";
import { SettingsProvider } from "@/components/settings/settings-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "@/hooks/use-toast";

export default function SortableDashboard() {
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
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(new Date());

  const { user, userLoading } = useUser();

  const fetchHabitsAsync = useCallback(async (showLoadingIndicator = true) => {
    if (!user) return;
    if(showLoadingIndicator) setIsLoadingHabits(true);
    setLoadHabitsError(null);
    try {
      const fetchedHabits = await apiClient<FirestoreHabit[]>("/habits", { method: "GET" });

      if (!Array.isArray(fetchedHabits)) {
        console.error("Fetched habits response is not an array:", fetchedHabits);
        throw new Error("Invalid data format received for habits.");
      }

      // Filter for valid habit objects before further processing
      const validHabits = fetchedHabits.filter(h =>
        h && typeof h === 'object' && typeof h.title === 'string' && h.habitId
      );

      const habitsWithEnsuredCompletions = validHabits.map(h => ({
        ...h,
        // habitId is already asserted as present by the filter
        completions: (h.completions || []).map(c => ({ ...c }))
      }));
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

  const toggleCompletion = async (habitId: string, date: Date | string, quantValue?: number) => {
     if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    const habit = habits.find(h => h.habitId === habitId);
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
      await apiClient(`/habits/${habit.habitId}/complete`, { method: "POST", body: { value: completionApiValue, date: format(dateObj, "yyyy-MM-dd") }});
      toast({ title: "Success", description: `"${habit.title}" completion logged.` });
      await fetchHabitsAsync(false);
    } catch (error: any) {
      console.error(`Failed to log completion for habit "${habit.title}":`, error);
      toast({ title: "Error", description: `Failed to log completion: ${error.message}`, variant: "destructive" });
    }
  };

  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    const habit = habits.find(h => h.habitId === habitId);
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
      // const createdHabit = await apiClient<FirestoreHabit>("/habits", { method: "POST", body: newHabitPayload }); // API call is still made
      await apiClient<FirestoreHabit>("/habits", { method: "POST", body: newHabitPayload }); // Make the API call
      // Instead of manually adding, re-fetch the habits list
      await fetchHabitsAsync(false); // Re-fetch habits without full loading indicator
      // Toast message can be more generic or use data from the re-fetched list if needed, for now, use habitData
      toast({ title: "Success!", description: `Habit "${habitData.title}" submitted.` });
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
    if (!updatedHabitFull.habitId) { toast({ title: "Error", description: "Cannot edit habit without an ID.", variant: "destructive" }); return; }
    setIsSubmittingHabit(true);
    setSubmitHabitError(null);
    const { habitId, userId, createdAt, completions, streak, ...editableFields } = updatedHabitFull;
    const payload = editableFields;
    try {
      const savedHabit = await apiClient<FirestoreHabit>(`/habits/${habitId}`, { method: "PUT", body: payload });
      setHabits(prevHabits => prevHabits.map(h => (h.habitId === savedHabit.habitId ? savedHabit : h)));
      toast({ title: "Success!", description: `Habit "${savedHabit.title}" updated.` });
      setEditHabitDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to edit habit:", error);
      setSubmitHabitError(error.message || "An unknown error occurred while editing the habit.");
      toast({ title: "Error Editing Habit", description: `${error.message}${error.status === 501 ? " (Edit endpoint may not be implemented on backend)" : ""}`, variant: "destructive"});
    } finally {
      setIsSubmittingHabit(false);
    }
  };

  const deleteHabit = async (habitId: string) => {
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
    const firestoreCompatibleData: Omit<FirestoreHabit, "habitId" | "userId" | "createdAt" | "isActive" | "completions" | "streak"> & { type: "binary" | "quantitative" } = {
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
    if (selectedHabit && selectedHabit.habitId) {
      const habitToUpdate: FirestoreHabit = {
        ...(selectedHabit as FirestoreHabit),
        ...firestoreCompatibleData,
        habitId: selectedHabit.habitId,
      };
      await editHabit(habitToUpdate);
    } else {
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
  if (isLoadingHabits) { habitContent = (<div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading habits...</p></div>); }
  else if (loadHabitsError) { habitContent = (<div className="flex flex-col items-center justify-center py-10 text-destructive"><AlertCircle className="h-8 w-8 mb-2" /><p className="font-semibold">Error loading habits</p><p className="text-sm">{loadHabitsError}</p></div>); }
  else if (habits.length === 0 && !userLoading && user) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>No habits added yet. Start building your optimal life!</p><Button onClick={handleCreateHabitClick} variant="outline" size="sm" className="mt-2"><Plus className="h-4 w-4 mr-1" />Add Your First Habit</Button></div>); }
  else if (!user && !userLoading) { habitContent = (<div className="text-center py-8 text-muted-foreground"><p>Please log in to manage and view your habits.</p></div>); }
  else {
    if (currentDashboardView === 'day') {
      const validHabitsForView = habits
        .filter(h => h && typeof h === 'object' && h.habitId) // Ensure h and h.habitId are valid
        .map(h => ({ ...h, id: h.habitId!, isCompletedToday: isHabitCompletedOnDate(h.habitId!, currentDate) }));

      habitContent = (
        <SortableHabitViewModes
          habits={validHabitsForView}
          onToggleHabit={toggleCompletion} onAddHabit={handleCreateHabitClick}
          onEditHabit={handleEditHabitClick}
          onDeleteHabit={deleteHabit}
          onReorderHabits={(newOrderedHabits) => setHabits(newOrderedHabits.map(h => ({...h, habitId: h.id})))}
        />);
    } else if (currentDashboardView === 'week') {
      habitContent = <WeekView habits={habits} currentDate={currentDate} />;
    } else if (currentDashboardView === 'month') {
      habitContent = <MonthView habits={habits} currentDisplayMonth={currentDisplayMonth} setCurrentDisplayMonth={setCurrentDisplayMonth} />;
    }
  }

  // dailyMotivationCard is now replaced by direct rendering of DailyMotivation and TodaysLog
  // const dailyMotivationCard = (
  //   <DailyMotivation /> // This was the old way
  // );

  return (
    <SettingsProvider>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6 tracking-tight">Dashboard Overview</h1>
        <div className="flex justify-end items-center mb-4">
          <HeaderWithSettings />
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-8">

            {/* Main Habit Tracker card - MOVED TO TOP */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  {/* Title size increased */}
                  <CardTitle className="text-2xl font-semibold">Habit Dashboard{!isLoadingHabits && !loadHabitsError && user && (<Badge variant="outline" className="ml-2 font-normal">{habits.length} habits</Badge>)}</CardTitle>
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
                {habitContent}
              </CardContent>
            </Card>

            {/* Habit Stacks Section - NOW BELOW HABIT DASHBOARD */}
            {mockStacks.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center"> {/* Adjusted title size for hierarchy */}
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
            {/* Render DailyMotivation directly, then TodaysLog below it */}
            <DailyMotivation />
            <TodaysLog />
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
