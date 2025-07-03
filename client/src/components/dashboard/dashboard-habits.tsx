import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, CheckSquare, Award, Plus, Check, Clock, AlertCircle } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";

// Import the shared types
import { Habit, HabitCompletion } from "@/types/habit";
import { WeeklyHabitView } from "./weekly-habit-view";

// Map icon strings to components (Unchanged)
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'brain': return <span className="bg-purple-100 text-purple-600 p-1 rounded-md">🧠</span>;
    case 'activity': return <span className="bg-red-100 text-red-600 p-1 rounded-md">📈</span>;
    case 'dumbbell': return <span className="bg-green-100 text-green-600 p-1 rounded-md">💪</span>;
    case 'bookopen': return <span className="bg-blue-100 text-blue-600 p-1 rounded-md">📚</span>;
    case 'heart': return <span className="bg-pink-100 text-pink-600 p-1 rounded-md">❤️</span>;
    case 'droplets': return <span className="bg-cyan-100 text-cyan-600 p-1 rounded-md">💧</span>;
    case 'sun': return <span className="bg-amber-100 text-amber-600 p-1 rounded-md">☀️</span>;
    case 'users': return <span className="bg-indigo-100 text-indigo-600 p-1 rounded-md">👥</span>;
    case 'checkcircle': return <span className="bg-teal-100 text-teal-600 p-1 rounded-md">✓</span>;
    default: return <span className="bg-gray-100 text-gray-600 p-1 rounded-md">📝</span>;
  }
};


export function DashboardHabits() {
  const { toast } = useToast();
  // State for habits, completions, loading, and errors
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'weekly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // --- START: REVISED DATA FETCHING LOGIC ---
  useEffect(() => {
    const auth = getAuth();
    
    // Use onAuthStateChanged to listen for the user's sign-in state.
    // This is more reliable than checking auth.currentUser directly on load.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, let's fetch their data.
        setIsLoading(true);
        setError(null);
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/habits', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
          }

          const data = await response.json();
          // Assuming the API returns an object like { habits: [], completions: [] }
          setHabits(data.habits || []);
          setCompletions(data.completions || []);

        } catch (err: any) {
          console.error("Error loading habits:", err);
          setError(err.message || "Failed to load habits. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // User is signed out.
        setError("You must be logged in to view habits.");
        setIsLoading(false);
        // A protected route component will likely handle the redirect to /login
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once.
  // --- END: REVISED DATA FETCHING LOGIC ---

  // Filter to show only top 5 habits
  const sortedHabits = [...habits]
    .sort((a, b) => {
      if (a.isAbsolute && !b.isAbsolute) return -1;
      if (!a.isAbsolute && b.isAbsolute) return 1;
      return b.impact - a.impact;
    })
    .slice(0, 5);

  // Generate dates for this week (used in weekly view)
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => completion.habitId === habitId &&
        isSameDay(completion.date, date) &&
        completion.completed
    );
  };

  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId: string, date: Date) => {
    // NOTE: This function should also be updated to make an API call
    // to persist the change in the database. For now, it only updates local state.
    const isCompleted = isHabitCompletedOnDate(habitId, date);

    if (isCompleted) {
      setCompletions(completions.filter(
        c => !(c.habitId === habitId && isSameDay(c.date, date))
      ));
    } else {
      setCompletions([...completions, { habitId, date, completed: true }]);
    }

    toast({
      title: isCompleted ? "Habit marked as incomplete" : "Habit completed!",
      description: isCompleted ? "Your progress has been updated" : "Great job! Keep building that streak!",
      variant: isCompleted ? "destructive" : "default",
    });
  };

  // Handle adding a new habit
  const handleAddHabit = () => {
    window.location.href = "/habits";
  };

  // --- START: NEW LOADING AND ERROR UI ---
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">Authenticating & loading habits...</div>;
    }

    if (error) {
      return (
        <div className="text-center p-8 text-red-500">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p className="font-semibold">Could not load habits</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    
    // The existing views are returned if there's no loading or error
    return (
      <>
        {/* Weekly View */}
        {activeView === 'weekly' && (
          <WeeklyHabitView
            habits={habits}
            completions={completions}
            onToggleHabit={toggleHabitCompletion}
            onAddHabit={handleAddHabit}
          />
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="space-y-2">
            {sortedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                <Checkbox
                  checked={isHabitCompletedOnDate(habit.id, new Date())}
                  onCheckedChange={() => toggleHabitCompletion(habit.id, new Date())}
                  className="mr-2"
                />
                <div className="flex items-center gap-2 flex-1">
                  {getIconComponent(habit.icon)}
                  <span className={`font-medium text-sm ${isHabitCompletedOnDate(habit.id, new Date()) ? 'line-through opacity-60' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                {habit.streak > 0 && (
                  <Badge variant="outline" className="ml-2 gap-1 text-xs">
                    <Award className="h-3 w-3" />
                    {habit.streak}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div>
            {/* Calendar view content remains the same */}
          </div>
        )}
      </>
    );
  };
  // --- END: NEW LOADING AND ERROR UI ---

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {/* View toggle buttons remain the same */}
            <Button variant={activeView === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('list')} className="h-8 px-3">
              <CheckSquare className="h-4 w-4 mr-1" /> List
            </Button>
            <Button variant={activeView === 'weekly' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('weekly')} className="h-8 px-3">
              <Calendar className="h-4 w-4 mr-1" /> Weekly
            </Button>
            <Button variant={activeView === 'calendar' ? 'default' : 'outline'} size="sm" onClick={() => setActiveView('calendar')} className="h-8 px-3">
              <CalendarIcon className="h-4 w-4 mr-1" /> Calendar
            </Button>
          </div>
          <a href="/habits" className="text-xs text-primary hover:underline flex items-center">
            <Plus className="h-3 w-3 mr-1" /> Add habit
          </a>
        </div>

        {renderContent()}
        
      </CardContent>
    </Card>
  );
}
