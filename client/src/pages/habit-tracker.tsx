import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import WeeklyCalendarView from "@/components/dashboard/weekly-calendar-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, Trophy, Calendar, List } from "lucide-react";
import { Habit } from "@/types/habit";
import { HabitCompletion } from "@/types/habit-completion";
import { habitSuggestions } from "@/data/habit-data";

// Demo data for habits - ensure all required properties are set
const demoHabits: Habit[] = [
  ...habitSuggestions.health.slice(0, 3).map(habit => ({
    ...habit,
    iconColor: habit.iconColor || 'blue' // Default color if missing
  })),
  ...habitSuggestions.fitness.slice(0, 2).map(habit => ({
    ...habit,
    iconColor: habit.iconColor || 'red' // Default color if missing
  })),
  ...habitSuggestions.mind.slice(0, 2).map(habit => ({
    ...habit,
    iconColor: habit.iconColor || 'purple' // Default color if missing
  }))
];

// Generate some sample habit completions for the demo
const generateSampleCompletions = (habits: Habit[]): HabitCompletion[] => {
  const completions: HabitCompletion[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  habits.forEach(habit => {
    // Add some random completions in the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Randomly determine if this habit was completed on this day
      // More likely to be completed if it's an "absolute" habit
      const completed = Math.random() < (habit.isAbsolute ? 0.8 : 0.6);
      
      if (completed) {
        completions.push({
          id: `completion-${habit.id}-${date.toISOString()}`,
          habitId: habit.id,
          date: date,
          completed: true
        });
      }
    }
  });
  
  return completions;
};

export default function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>(demoHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [activeView, setActiveView] = useState<string>("calendar");
  
  // Generate sample completions when the component mounts
  useEffect(() => {
    setCompletions(generateSampleCompletions(habits));
  }, []);
  
  // Handle toggling habit completion status
  const handleToggleCompletion = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if there's already a completion for this habit on this date
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date.toISOString().split('T')[0] === dateStr
    );
    
    if (existingIndex >= 0) {
      // Remove the completion if it exists
      setCompletions(prev => {
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        return updated;
      });
    } else {
      // Add a new completion
      const newCompletion: HabitCompletion = {
        id: `completion-${habitId}-${dateStr}`,
        habitId: habitId,
        date: date,
        completed: true
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };
  
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Habit Tracker</h1>
            <p className="text-gray-500 mt-1">
              Track your daily habits and build consistency
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button className="ml-2 bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-1" />
              New Habit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column - Stats */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Total Habits</span>
                    <span className="text-lg font-bold">{habits.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Completed Today</span>
                    <span className="text-lg font-bold">
                      {completions.filter(c => 
                        new Date(c.date).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Weekly Completion</span>
                    <span className="text-lg font-bold">
                      {Math.round(completions.length / (habits.length * 7) * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Absolute Habits</span>
                    <span className="text-lg font-bold">
                      {habits.filter(h => h.isAbsolute).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Unique categories in the habits array */}
                  {Array.from(new Set(habits.map(h => h.category))).map(category => (
                    <div key={category} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full bg-${category === 'health' ? 'green' : category === 'fitness' ? 'red' : 'blue'}-500 mr-2`} />
                        <span className="capitalize text-sm font-medium">{category}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {habits.filter(h => h.category === category).length} habits
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeView} onValueChange={setActiveView}>
              <div className="mb-4">
                <TabsList className="grid grid-cols-2 w-[300px]">
                  <TabsTrigger value="calendar" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Calendar View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <List className="h-4 w-4" />
                    List View
                  </TabsTrigger>
                </TabsList>
              </div>
            
              <TabsContent value="calendar" className="mt-0">
                <WeeklyCalendarView
                  habits={habits}
                  completions={completions}
                  onToggleCompletion={handleToggleCompletion}
                  days={7}
                  showPreviousDays={3}
                />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Habit List View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">
                      This is a simplified view where the list view would go. It would show all habits
                      in a more compact format with checkboxes for today's completion.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}