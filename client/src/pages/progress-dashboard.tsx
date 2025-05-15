import { useState } from "react";
import { format, addDays, startOfWeek, subDays, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressDashboard } from "@/components/dashboard/progress-dashboard";
import { BarChart3, Trophy, Target, FlameIcon, Award, TrendingUp, ChevronRight } from "lucide-react";
import type { Habit, HabitCompletion } from "@/types/habit";

// Mock data for the page (would be loaded from storage in a real app)
const mockHabits: Habit[] = [
  {
    id: "h1",
    title: "Morning Meditation",
    description: "10 minutes of mindfulness meditation",
    icon: "brain",
    iconColor: "#8b5cf6",
    impact: 8,
    effort: 4,
    timeCommitment: "10 min",
    frequency: "daily",
    isAbsolute: true,
    category: "mind",
    streak: 12,
    createdAt: new Date(2023, 5, 15)
  },
  {
    id: "h2",
    title: "Daily Exercise",
    description: "30 minutes of any physical activity",
    icon: "dumbbell",
    iconColor: "#3b82f6",
    impact: 9,
    effort: 6,
    timeCommitment: "30 min",
    frequency: "daily",
    isAbsolute: true,
    category: "fitness",
    streak: 5,
    createdAt: new Date(2023, 6, 1)
  },
  {
    id: "h3",
    title: "Read Non-Fiction",
    description: "Read at least one chapter",
    icon: "book",
    iconColor: "#f59e0b",
    impact: 7,
    effort: 3,
    timeCommitment: "20 min",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date(2023, 6, 15)
  },
  {
    id: "h4",
    title: "Take Supplements",
    description: "Daily vitamin and mineral supplements",
    icon: "pill",
    iconColor: "#10b981",
    impact: 6,
    effort: 2,
    timeCommitment: "1 min",
    frequency: "daily",
    isAbsolute: true,
    category: "health",
    streak: 20,
    createdAt: new Date(2023, 5, 1)
  },
  {
    id: "h5",
    title: "Weekly Deep Work Session",
    description: "3-hour focused work on important projects",
    icon: "zap",
    iconColor: "#6366f1",
    impact: 9,
    effort: 8,
    timeCommitment: "3 hours",
    frequency: "weekly",
    isAbsolute: false,
    category: "mind",
    streak: 2,
    createdAt: new Date(2023, 7, 1)
  }
];

// Generate mock completions for the last 30 days
const generateMockCompletions = (): HabitCompletion[] => {
  const completions: HabitCompletion[] = [];
  const today = new Date();
  const startDate = subDays(today, 30);
  
  mockHabits.forEach(habit => {
    let currentDate = new Date(startDate);
    
    while (currentDate <= today) {
      // Skip some days randomly to make the data more realistic
      const completed = Math.random() > 0.3;
      
      // For weekly habits, only generate completions on Mondays
      if (habit.frequency === "weekly" && currentDate.getDay() !== 1) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
      
      completions.push({
        id: `c-${habit.id}-${format(currentDate, 'yyyy-MM-dd')}`,
        habitId: habit.id,
        date: currentDate.toISOString(),
        completed
      });
      
      currentDate = addDays(currentDate, 1);
    }
  });
  
  return completions;
};

export default function ProgressDashboardPage() {
  const [habits] = useState<Habit[]>(mockHabits);
  const [completions] = useState<HabitCompletion[]>(generateMockCompletions());
  
  // Calculate some metrics for the achievement cards
  const totalCompletedHabits = completions.filter(c => c.completed).length;
  const longestStreak = Math.max(...habits.map(h => h.streak));
  const habitWithLongestStreak = habits.find(h => h.streak === longestStreak);
  const consistentHabits = habits.filter(h => h.streak > 5).length;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Progress Dashboard</h1>
        
        {/* Achievement Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Completions</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalCompletedHabits}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Longest Streak</p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">{longestStreak} days</p>
              </div>
              <div className="h-12 w-12 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center">
                <FlameIcon className="h-6 w-6 text-green-700 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Most Consistent</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300 truncate max-w-[120px]">
                  {habitWithLongestStreak?.title ?? 'None'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-700 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">Consistent Habits</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{consistentHabits}</p>
              </div>
              <div className="h-12 w-12 bg-amber-200 dark:bg-amber-700 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Dashboard */}
        <ProgressDashboard 
          habits={habits}
          completions={completions}
          timeframe="week"
        />
        
        {/* Achievements Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Milestones and badges you've earned through consistent habit tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Completed Achievement */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-2 border-2 border-amber-300">
                    <Trophy className="h-8 w-8 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">First Steps</span>
                  <span className="text-xs text-muted-foreground">Completed 10 habits</span>
                </div>
                
                {/* Completed Achievement */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-2 border-2 border-blue-300">
                    <FlameIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Streak Master</span>
                  <span className="text-xs text-muted-foreground">7-day streak</span>
                </div>
                
                {/* Completed Achievement */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-2 border-2 border-green-300">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Habit Builder</span>
                  <span className="text-xs text-muted-foreground">5 active habits</span>
                </div>
                
                {/* Locked Achievement */}
                <div className="flex flex-col items-center opacity-50">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-2 border-2 border-gray-300">
                    <Target className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">Commitment</span>
                  <span className="text-xs text-muted-foreground">30-day streak (locked)</span>
                </div>
                
                {/* Locked Achievement */}
                <div className="flex flex-col items-center opacity-50">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-2 border-2 border-gray-300">
                    <Award className="h-8 w-8 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">Habit Master</span>
                  <span className="text-xs text-muted-foreground">100% completion (locked)</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="text-sm">
                  View All Achievements
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}