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
  setHabitsDirectly: (newHabits: FirestoreHabit[]) => void; // For direct state manipulation like reordering
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
      console.log("HabitContext: Fetching habits...");
      const fetchedHabits = await apiClient<FirestoreHabit[]>("/habits", { method: "GET" });
      console.log('HabitContext - Raw fetched data from /api/habits:', JSON.stringify(fetchedHabits)); // DETAILED LOG 1

      if (Array.isArray(fetchedHabits)) {
        fetchedHabits.forEach((h, index) => {
          if (!h || typeof h !== 'object') {
            console.warn(`HabitContext: Fetched item at index ${index} is not an object or is null/undefined.`);
            return; // Skip further checks for this item
          }
          // It's an object, check for id and title
          if (!h.id) { // Changed habitId to id
            console.warn(`HabitContext: Fetched habit (index ${index}, title: "${h.title || 'N/A'}") is missing id. Object:`, JSON.stringify(h));
          }
          if (typeof h.title !== 'string') {
            console.warn(`HabitContext: Fetched habit (index ${index}, id: "${h.id || 'N/A'}") has a non-string title (or title is missing). Object:`, JSON.stringify(h)); // Changed habitId to id
          }
        });
      } else {
        console.error("HabitContext: Fetched habits response is not an array. Data:", fetchedHabits);
        setHabits([]); // Clear habits if response is not an array
        // Avoid throwing error here to let finally block execute, error is already logged
        // Consider setting loadHabitsError state here if not already handled by catch
        setLoadHabitsError(new Error("Invalid data format: Expected an array for habits."));
        setIsLoadingHabits(false); // Ensure loading is stopped
        return; // Exit early if data format is incorrect
      }

      const validHabits = fetchedHabits.filter(h =>
        h && typeof h === 'object' && typeof h.title === 'string' && h.id // Changed habitId to id
      );
      console.log('HabitContext - Filtered valid habits (count):', validHabits.length); // DETAILED LOG 2a
      console.log('HabitContext - Filtered valid habits (titles):', JSON.stringify(validHabits.map(h => h.title))); // DETAILED LOG 2b


      const habitsWithEnsuredCompletions = validHabits.map(h => ({
        ...h,
        completions: (h.completions || []).map(c => ({ ...c }))
      }));

      // This log shows what's about to be set to state
      console.log('HabitContext - Processed habits passed to setHabits (titles):', JSON.stringify(habitsWithEnsuredCompletions.map(h=>h.title))); // DETAILED LOG 3
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

  // Function to allow direct setting of habits, e.g., for reordering
  const setHabitsDirectly = (newHabits: FirestoreHabit[]) => {
    setHabits(newHabits);
  };

  return (
    <HabitContext.Provider value={{ habits, isLoadingHabits, loadHabitsError, fetchHabits, setHabitsDirectly }}>
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
