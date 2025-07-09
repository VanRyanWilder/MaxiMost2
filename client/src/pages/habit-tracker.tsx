import { useState, useEffect } from "react";
import { PageContainer } from "../components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Check, Plus, Calendar, Trophy, Settings, Bell, Eye, Paintbrush, Loader2 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Habit } from "../types/habit";
import { HabitCompletion } from "../types/habit-completion";
import { formatDate } from "../lib/utils";
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Label } from "../components/ui/label";
import { Logo } from "../components/ui/logo";
import { auth, listenToAuthChanges } from "../lib/firebase"; // Updated to listenToAuthChanges
import type { User } from "firebase/auth";

// Helper functions (getDayName, formatDateByPreference, getViewDates) remain the same
// ... (You can keep your existing helper functions here)

function getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getViewDates(daysBack: number = 3, daysForward: number = 4): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = daysBack; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
    }

    for (let i = 1; i <= daysForward - 1; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        dates.push(date);
    }
    return dates;
}


// --- Main Component ---
export default function HabitTrackerPage() {
  // State for real data
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);

  // State for UI management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Settings states (remain the same)
  const [activeTab, setActiveTab] = useState<string>("tracker");
  const [daysVisible, setDaysVisible] = useState<number>(7);
  // ... other settings states

  // -- THE CORE FIX: Fetch real data from the backend ---
  useEffect(() => {
    // Listen for authentication changes to get the user
    const unsubscribe = listenToAuthChanges((user) => { // Use listenToAuthChanges and pass only callback
      setUser(user);
      if (user) {
        // User is signed in, fetch their data
        const fetchHabitData = async () => {
          setLoading(true);
          setError(null);
          try {
            const token = await user.getIdToken();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (!response.ok) {
              throw new Error(`Failed to fetch habits. Status: ${response.status}`);
            }

            const fetchedHabits = await response.json();

            // Ensure the response is an array before setting state
            if (Array.isArray(fetchedHabits)) {
                setHabits(fetchedHabits);
                // Here you would also fetch completions, or they might be included with habits
                // For now, we'll clear completions when habits are fetched
                setCompletions([]);
            } else {
                // If the response isn't an array, set habits to an empty array to prevent map errors
                setHabits([]);
                console.error("API response for habits is not an array:", fetchedHabits);
                throw new Error("Invalid data format from server.");
            }

          } catch (err) {
            console.error("Failed to fetch habits:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setHabits([]); // Clear habits on error to avoid rendering stale data
          } finally {
            setLoading(false);
          }
        };

        fetchHabitData();
      } else {
        // User is signed out, clear data and stop loading
        setUser(null);
        setHabits([]);
        setCompletions([]);
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // This effect runs once on mount

  // ... (Your other useEffects and handler functions like handleToggleCompletion can remain)
  // Note: You will need to adapt them to work with the real, fetched data.

  // Filter habits for display
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);

  // Loading and Error State UI
  if (loading) {
    return (
        <PageContainer>
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="ml-4 text-lg">Loading your habits...</p>
            </div>
        </PageContainer>
    );
  }

  if (error) {
     return (
        <PageContainer>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <h2 className="font-bold text-xl mb-2">Error loading habits</h2>
                    <p>We couldn't fetch your data. Please try refreshing the page.</p>
                    <p className="text-sm mt-2">Details: {error}</p>
                </div>
            </div>
        </PageContainer>
    );
  }

  // --- Render the main component ---
  // The rest of your return() JSX can remain largely the same,
  // as it will now use the 'habits' state which is populated from the API.
  return (
    <PageContainer>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Logo size="medium" />
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Habit Dashboard</Badge>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Habit
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="tracker">Habit Tracker</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="tracker" className="mt-0">
                    {/* ... Your existing JSX for the tracker tab ... */}
                    {/* This will now use the real `absoluteHabits` and `additionalHabits` state */}
                    {habits.length === 0 ? (
                        <Card className="text-center p-8">
                            <CardTitle>Welcome to MaxiMost!</CardTitle>
                            <CardContent className="mt-4">
                                <p>You don't have any habits yet.</p>
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Habit
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* ... (paste your existing tables for absolute and additional habits here) */}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    {/* ... Your existing JSX for the settings tab ... */}
                </TabsContent>
            </Tabs>
        </div>
    </PageContainer>
  );
}
