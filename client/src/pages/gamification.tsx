import { useState } from "react";
import { format, addDays, startOfWeek, subDays, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GamificationElements } from "@/components/gamification/gamification-elements";
import { Trophy, Target, Award, Zap, LightbulbIcon, ChevronRight } from "lucide-react";
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

export default function GamificationPage() {
  const [habits] = useState<Habit[]>(mockHabits);
  const [completions] = useState<HabitCompletion[]>(generateMockCompletions());
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Gamification & Rewards</h1>
        
        {/* Motivational Banner */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none overflow-hidden">
            <CardContent className="p-8">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Gamify Your Habit Journey</h2>
                <p className="text-indigo-100 text-lg max-w-2xl mb-4">
                  Turn your habit building into an exciting game. Earn XP, unlock achievements, and level up as you progress towards your goals.
                </p>
                <Button className="bg-white text-indigo-700 hover:bg-indigo-100">Start Earning Rewards</Button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-30 -mt-12 -mr-12"></div>
              <div className="absolute bottom-0 left-20 w-32 h-32 bg-purple-300 rounded-full filter blur-2xl opacity-30 -mb-10"></div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Gamification Elements */}
        <GamificationElements 
          habits={habits}
          completions={completions}
        />
        
        {/* Benefits Section */}
        <div className="mt-10 mb-6">
          <h2 className="text-xl font-bold mb-6">Benefits of Gamification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="h-5 w-5 text-indigo-500 mr-2" />
                  Increased Motivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gamification taps into your brain's reward system, making it easier to stay motivated and consistent with your habits.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Target className="h-5 w-5 text-rose-500 mr-2" />
                  Measurable Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualize your growth with levels, points, and achievements, giving you clear milestones to celebrate.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <LightbulbIcon className="h-5 w-5 text-amber-500 mr-2" />
                  Psychological Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Releases dopamine when you complete tasks and earn rewards, creating a positive feedback loop for healthy behaviors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Additional Features - Coming Soon Section */}
        <div className="mt-10 mb-6">
          <Card className="bg-gray-50 dark:bg-gray-900 border-dashed">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                These exciting features are in development and will be added to our gamification system soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="p-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </Badge>
                  <div>
                    <h3 className="font-medium text-sm">Leaderboards</h3>
                    <p className="text-xs text-muted-foreground">Compete with friends and see who can maintain the best streak.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="p-1">
                    <Award className="h-4 w-4 text-indigo-500" />
                  </Badge>
                  <div>
                    <h3 className="font-medium text-sm">Custom Badges</h3>
                    <p className="text-xs text-muted-foreground">Design and earn your own badges for personal achievements.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="p-1">
                    <Zap className="h-4 w-4 text-pink-500" />
                  </Badge>
                  <div>
                    <h3 className="font-medium text-sm">Power-Ups</h3>
                    <p className="text-xs text-muted-foreground">Special abilities to help you during difficult periods.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="p-1">
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  </Badge>
                  <div>
                    <h3 className="font-medium text-sm">Daily Challenges</h3>
                    <p className="text-xs text-muted-foreground">Special missions to earn bonus XP and rewards.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}