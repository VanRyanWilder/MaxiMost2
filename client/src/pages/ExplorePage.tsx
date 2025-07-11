import React, { useState } from 'react'; // Added useState
import { PageContainer } from "@/components/layout/page-container";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitLibrary } from "@/components/dashboard/habit-library-new"; // Import HabitLibrary
import { apiClient } from "@/lib/apiClient"; // Import apiClient
import { useUser } from "@/context/user-context"; // Import useUser
import { toast } from "@/hooks/use-toast"; // Import toast
import { FirestoreHabit, HabitCategory, HabitFrequency } from "../../../shared/types/firestore"; // Import types
import { Button } from '@/components/ui/button'; // Import Button for toast action

// Commented out as file not found
// import { TopSupplementsSection } from "@/components/dashboard/top-supplements-section";


const ExplorePage: React.FC = () => {
  const { user } = useUser(); // Get user from context
  const [isSubmittingHabit, setIsSubmittingHabit] = useState<boolean>(false);
  const [submitHabitError, setSubmitHabitError] = useState<string | null>(null);

  const addHabitFromExplorePageLibrary = async (habitTemplate: any) => {
    if (!user) { // This check should now work correctly as ExplorePage is a PrivateRoute
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
    };

    try {
      const createdHabit = await apiClient<FirestoreHabit>("/habits", {
        method: "POST",
        body: newHabitPayload,
      });
      toast({
        title: "Habit Added!",
        description: `"${createdHabit.title}" has been added. You might need to refresh your dashboard to see it immediately.`,
        // TODO: Ideally, trigger a global habit refresh here if HabitContext is available or via an event.
        // action: (
        //   <Button variant="outline" size="sm" onClick={() => { /* Navigate to dashboard */ }}>
        //     View Dashboard
        //   </Button>
        // )
      });
    } catch (error: any) {
      setSubmitHabitError(error.message || "An unknown error occurred.");
      toast({ title: "Error adding habit", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmittingHabit(false);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Explore</h1>
          <p className="text-gray-300">Discover new insights, tools, and resources to enhance your journey.</p>
        </div>

        <DailyMotivation /> {/* Already uses GlassCard */}

        {/* Render HabitLibrary */}
        <HabitLibrary onAddHabit={addHabitFromExplorePageLibrary} />

        {submitHabitError && (
          <p className="text-sm text-destructive text-center">{submitHabitError}</p>
        )}
        {isSubmittingHabit && (
          <p className="text-sm text-gray-300 text-center">Adding habit...</p>
        )}

        {/* <TopSupplementsSection /> */} {/* Commented out */}

        {/* Other potential sections for Explore page could be:
          - Community Highlights
          - Featured Articles or Research
          - New Program Announcements
          - Challenges or Events
        */}
      </div>
    </PageContainer>
  );
};

export default ExplorePage;
