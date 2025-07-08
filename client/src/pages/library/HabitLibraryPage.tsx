import { useState, useCallback } from 'react';
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
import { apiClient } from "@/lib/apiClient";
import { useUser } from "@/context/user-context";
import { toast } from "@/hooks/use-toast";
import { FirestoreHabit, HabitCategory, HabitFrequency } from "../../../shared/types/firestore"; // Adjusted path
import { Button } from '@/components/ui/button'; // For potential "view my habits" button

// This page will allow users to browse pre-defined habits and add them to their list.

export default function HabitLibraryPage() {
  const { user } = useUser();
  // Minimal state for this page, as actual habit list is managed on Dashboard
  const [isSubmittingHabit, setIsSubmittingHabit] = useState<boolean>(false);
  const [submitHabitError, setSubmitHabitError] = useState<string | null>(null);

  // Simplified addHabit specifically for adding from library.
  // This assumes the main habit list is managed elsewhere (e.g. Dashboard or a global state)
  // and this function just sends the new habit to the backend.
  // For a fully integrated experience, this might need to trigger a refresh/update on the dashboard.
  const addHabitFromLibrary = async (habitTemplate: any) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to add habits.", variant: "destructive" });
      return;
    }

    setIsSubmittingHabit(true);
    setSubmitHabitError(null);

    const newHabitPayload: Partial<FirestoreHabit> = {
      title: habitTemplate.title,
      description: habitTemplate.description || "",
      category: habitTemplate.category as HabitCategory,
      type: habitTemplate.type || "binary",
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
      frequency: habitTemplate.frequency as HabitFrequency || "daily",
      isAbsolute: typeof habitTemplate.isAbsolute === 'boolean' ? habitTemplate.isAbsolute : (habitTemplate.frequency === 'daily'),
      // userId will be set by the backend
      // createdAt will be set by the backend
      // isActive will be set by the backend (true by default)
      // completions: [], // Will be empty initially
      // streak: 0, // Will be 0 initially
    };

    try {
      // We are calling the main /habits endpoint to create a new habit
      const createdHabit = await apiClient<FirestoreHabit>("/habits", {
        method: "POST",
        body: newHabitPayload,
      });
      toast({
        title: "Habit Added!",
        description: `"${createdHabit.title}" has been added to your dashboard.`,
        action: (
          <Button variant="outline" size="sm" onClick={() => {
            // Potential navigation to dashboard or refresh
            // For now, just a console log
            console.log("Navigate to dashboard or refresh data");
            // router.push("/dashboard"); // If using wouter's router directly
          }}>
            View Dashboard
          </Button>
        )
      });
      // Potentially trigger a global state update or event to refresh dashboard habits
    } catch (error: any) {
      setSubmitHabitError(error.message || "An unknown error occurred.");
      toast({ title: "Error adding habit", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingHabit(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Habit Library</h2>
        <p className="text-muted-foreground">
          Browse suggestions and proven habits to kickstart your journey.
        </p>
      </div>
      <HabitLibrary
        onAddHabit={addHabitFromLibrary}
        // Pass any other necessary props to HabitLibrary if its internal behavior changes
      />
      {submitHabitError && (
        <p className="text-sm text-destructive">{submitHabitError}</p>
      )}
      {isSubmittingHabit && (
        <p className="text-sm text-muted-foreground">Adding habit...</p>
      )}
    </div>
  );
}
