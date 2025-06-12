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
import { auth, onAuthStateChange } from "../lib/firebase";
import type { User } from "firebase/auth";

// Helper functions
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

  // Settings states
  const [activeTab, setActiveTab] = useState<string>("tracker");
  const [daysVisible, setDaysVisible] = useState<number>(7);
  const [showAbsoluteHabits, setShowAbsoluteHabits] = useState<boolean>(true);
  const [showAdditionalHabits, setShowAdditionalHabits] = useState<boolean>(true);
  const [compactView, setCompactView] = useState<boolean>(false);
  
  const [viewDates, setViewDates] = useState<Date[]>(() => getViewDates(3, 4));

  useEffect(() => {
    const pastDays = Math.floor(daysVisible / 2);
    const futureDays = daysVisible - pastDays;
    setViewDates(getViewDates(pastDays, futureDays));
  }, [daysVisible]);

  // Fetch real data from the backend
  useEffect(() => {
    const unsubscribe = onAuthStateChange(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        setError(null);
        try {
          const token = await currentUser.getIdToken();
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/habits`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}`);
          }

          const fetchedHabits = await response.json();
          
          if (Array.isArray(fetchedHabits)) {
            setHabits(fetchedHabits);
          } else {
            setHabits([]);
            console.error("API response for habits is not an array:", fetchedHabits);
            throw new Error("Invalid data format received from server.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
          setHabits([]);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setHabits([]);
        setCompletions([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggleCompletion = (habitId: string, date: Date) => {
      console.log("Toggling completion for", habitId, "on", date);
      // Placeholder for backend update
  };
  
  const isHabitCompleted = (habitId: string, date: Date) => {
    return completions.some(
      (c) => c.habitId === habitId && formatDate(new Date(c.date)) === formatDate(date) && c.completed
    );
  };

  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);

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

  return (
    <PageContainer>
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between mb-6">
                <Logo size="medium" />
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Add Habit
                </Button>
            </header>

            <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="tracker">Habit Tracker</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="tracker" className="mt-0">
                    {error && (
                        <Card className="bg-red-50 border-red-200 text-red-800 p-4 mb-4">
                           <CardTitle>Error Loading Habits</CardTitle>
                           <CardContent className="pt-2">
                             <p>{error}</p>
                             <p className="text-xs mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
                           </CardContent>
                        </Card>
                    )}

                    {!error && habits.length === 0 ? (
                        <Card className="text-center p-8">
                            <CardTitle>Welcome to MaxiMost!</CardTitle>
                            <CardContent className="mt-4">
                                <p>You haven't added any habits yet. Let's add one!</p>
                                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Habit
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {showAbsoluteHabits && absoluteHabits.length > 0 && (
                              <Card className="mb-6">
                                <CardHeader className="py-4 px-6 border-b">
                                  <CardTitle className="text-lg font-semibold">Daily Absolute Habits</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="text-left text-xs text-gray-500 bg-gray-50">
                                          <th className="py-3 px-6 font-medium w-[200px]">Habit</th>
                                          {viewDates.map((date, i) => (
                                            <th key={i} className={`py-3 px-2 text-center font-medium ${formatDate(date) === formatDate(today) ? 'bg-blue-50' : ''}`}>
                                              <div className="flex flex-col items-center">
                                                <span>{getDayName(date)}</span>
                                                <span>{date.getDate()}</span>
                                              </div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {absoluteHabits.map((habit) => (
                                          <tr key={habit.id} className={`${compactView ? 'h-10' : ''} border-b border-gray-100`}>
                                            <td className={`${compactView ? 'py-1' : 'py-3'} px-6`}>
                                               <div className="font-medium">{habit.title}</div>
                                            </td>
                                            {viewDates.map((date, i) => {
                                              const isPast = date <= today;
                                              const isCompleted = isHabitCompleted(habit.id, date);
                                              return (
                                                <td key={i} className={`${compactView ? 'py-1' : 'py-3'} px-2 text-center`}>
                                                  <button
                                                    onClick={() => isPast && handleToggleCompletion(habit.id, date)}
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-colors ${ isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400' } ${!isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}
                                                    disabled={!isPast}
                                                  >
                                                    {isCompleted && <Check className="h-4 w-4" />}
                                                  </button>
                                                </td>
                                              );
                                            })}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            {showAdditionalHabits && additionalHabits.length > 0 && ( <Card> {/* Table for additional habits */} </Card> )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  {/* Settings UI */}
                </TabsContent>
            </Tabs>
        </div>
    </PageContainer>
  );
}
