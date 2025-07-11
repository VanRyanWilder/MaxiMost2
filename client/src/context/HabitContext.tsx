import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useUser } from '@/context/user-context';
import { FirestoreHabit } from '../../../shared/types/firestore'; // Assuming this path is correct from DashboardPage
import { toast } from "@/hooks/use-toast"; // For error notifications

interface HabitContextType {
  habits: FirestoreHabit[];
  isLoadingHabits: boolean;
  loadHabitsError: Error | null;
  fetchHabits: (showLoadingIndicator?: boolean) => Promise<void>;
  // addHabit, editHabit, deleteHabit could also be here if we want full CRUD in context
  // For now, focusing on fetch/re-fetch as per FIX-27
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser(); // Get user from UserContext
  const [habits, setHabits] = useState<FirestoreHabit[]>([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState<boolean>(false); // Don't set to true initially, let fetchHabits handle
  const [loadHabitsError, setLoadHabitsError] = useState<Error | null>(null);

  const fetchHabits = useCallback(async (showLoadingIndicator = true) => {
    if (!user) {
      setHabits([]); // Clear habits if no user
      // setIsLoadingHabits(false); // Already false or will be set by finally
      return;
    }

    if (showLoadingIndicator) {
      setIsLoadingHabits(true);
    }
    setLoadHabitsError(null);

    try {
      console.log("HabitContext: Fetching habits..."); // Context specific log
      const fetchedHabits = await apiClient<FirestoreHabit[]>("/habits", { method: "GET" });
      // Assuming diagnostic logs for apiClient itself are now active for token/header checks.

      if (!Array.isArray(fetchedHabits)) {
        console.error("HabitContext: Fetched habits response is not an array:", fetchedHabits);
        throw new Error("Invalid data format received for habits from context.");
      }

      const validHabits = fetchedHabits.filter(h =>
        h && typeof h === 'object' && typeof h.title === 'string' && h.habitId
      );

      const habitsWithEnsuredCompletions = validHabits.map(h => ({
        ...h,
        completions: (h.completions || []).map(c => ({ ...c })) // Basic completion mapping
        // More robust date transformation for completions might be needed here if API returns raw timestamps
      }));

      console.log("HabitContext: Setting habits:", JSON.stringify(habitsWithEnsuredCompletions.map(h=>h.title))); // Log titles
      setHabits(habitsWithEnsuredCompletions);

    } catch (error: any) {
      console.error("HabitContext: Failed to fetch habits:", error);
      setLoadHabitsError(error);
      // Avoid toast here if DashboardPage also toasts, or make it conditional
      // toast({ title: "Error loading habits (Context)", description: error.message, variant: "destructive" });
    } finally {
      if (showLoadingIndicator) {
        setIsLoadingHabits(false);
      }
    }
  }, [user]); // Dependency on user ensures fetchHabits is redefined if user changes

  // Effect to fetch habits when user logs in or out
  useEffect(() => {
    if (user) {
      console.log("HabitContext: User detected, fetching initial habits.");
      fetchHabits(true); // Show loading indicator for initial fetch
    } else {
      console.log("HabitContext: No user, clearing habits.");
      setHabits([]); // Clear habits if user logs out
      setIsLoadingHabits(false); // Ensure loading is false if no user
      setLoadHabitsError(null); // Clear any previous errors
    }
  }, [user, fetchHabits]); // fetchHabits is stable due to its own useCallback wrapping

  return (
    <HabitContext.Provider value={{ habits, isLoadingHabits, loadHabitsError, fetchHabits }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
