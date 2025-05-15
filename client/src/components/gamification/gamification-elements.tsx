import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Trophy, 
  Award, 
  Star, 
  Flame, 
  Target, 
  Zap, 
  Medal, 
  LightbulbIcon, 
  HeartHandshake, 
  Timer,
  BadgePlus,
  Gift,
  Sparkles,
  CircleCheck,
  TrendingUp,
  Shield,
  Dumbbell
} from "lucide-react";
import type { Habit, HabitCompletion } from "@/types/habit";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number; // 0-100
  unlocked: boolean;
  category: 'beginner' | 'intermediate' | 'advanced' | 'master';
  xp: number;
}

interface Level {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

interface GamificationElementsProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

export function GamificationElements({ habits, completions }: GamificationElementsProps) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelTitle, setLevelTitle] = useState("Habit Novice");
  const [levelProgress, setLevelProgress] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
  // Define levels
  const levels: Level[] = [
    { level: 1, title: "Habit Novice", minXp: 0, maxXp: 100 },
    { level: 2, title: "Habit Apprentice", minXp: 100, maxXp: 250 },
    { level: 3, title: "Habit Enthusiast", minXp: 250, maxXp: 500 },
    { level: 4, title: "Habit Builder", minXp: 500, maxXp: 1000 },
    { level: 5, title: "Habit Expert", minXp: 1000, maxXp: 2000 },
    { level: 6, title: "Habit Master", minXp: 2000, maxXp: 3500 },
    { level: 7, title: "Habit Champion", minXp: 3500, maxXp: 5500 },
    { level: 8, title: "Habit Elite", minXp: 5500, maxXp: 8000 },
    { level: 9, title: "Habit Legend", minXp: 8000, maxXp: 12000 },
    { level: 10, title: "Habit Guru", minXp: 12000, maxXp: 20000 }
  ];
  
  useEffect(() => {
    // Calculate XP based on habits and completions
    calculateXp();
    // Generate achievements
    generateAchievements();
  }, [habits, completions]);
  
  // Update level and progress whenever XP changes
  useEffect(() => {
    updateLevelAndProgress();
  }, [xp]);
  
  const calculateXp = () => {
    // Base calculation - this would be more sophisticated in a real app
    let totalXp = 0;
    
    // XP for habit creation
    totalXp += habits.length * 10;
    
    // XP for habit completions
    totalXp += completions.filter(c => c.completed).length * 5;
    
    // XP for streaks
    habits.forEach(habit => {
      if (habit.streak > 0) {
        totalXp += habit.streak * 2; // 2 XP per day of streak
        
        // Bonus XP for streak milestones
        if (habit.streak >= 7) totalXp += 25;
        if (habit.streak >= 30) totalXp += 100;
        if (habit.streak >= 100) totalXp += 500;
      }
    });
    
    // Set the calculated XP
    setXp(totalXp);
  };
  
  const updateLevelAndProgress = () => {
    // Find the current level based on XP
    const currentLevel = levels.find(l => xp >= l.minXp && xp < l.maxXp) || levels[levels.length - 1];
    
    // Calculate progress percentage within the level
    const xpInCurrentLevel = xp - currentLevel.minXp;
    const xpRequiredForNextLevel = currentLevel.maxXp - currentLevel.minXp;
    const progressPercentage = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100));
    
    setLevel(currentLevel.level);
    setLevelTitle(currentLevel.title);
    setLevelProgress(progressPercentage);
  };
  
  const generateAchievements = () => {
    const achievements: Achievement[] = [
      // Beginner achievements
      {
        id: "first-habit",
        title: "First Steps",
        description: "Create your first habit",
        icon: <BadgePlus className="h-6 w-6 text-emerald-500" />,
        progress: habits.length > 0 ? 100 : 0,
        unlocked: habits.length > 0,
        category: "beginner",
        xp: 20
      },
      {
        id: "first-completion",
        title: "Getting Started",
        description: "Complete a habit for the first time",
        icon: <CircleCheck className="h-6 w-6 text-green-500" />,
        progress: completions.filter(c => c.completed).length > 0 ? 100 : 0,
        unlocked: completions.filter(c => c.completed).length > 0,
        category: "beginner",
        xp: 15
      },
      {
        id: "three-day-streak",
        title: "Momentum Builder",
        description: "Achieve a 3-day streak with any habit",
        icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
        progress: Math.min(100, (Math.max(...habits.map(h => h.streak), 0) / 3) * 100),
        unlocked: Math.max(...habits.map(h => h.streak), 0) >= 3,
        category: "beginner",
        xp: 25
      },
      
      // Intermediate achievements
      {
        id: "five-habits",
        title: "Habit Collector",
        description: "Track 5 different habits",
        icon: <Star className="h-6 w-6 text-amber-500" />,
        progress: Math.min(100, (habits.length / 5) * 100),
        unlocked: habits.length >= 5,
        category: "intermediate",
        xp: 50
      },
      {
        id: "week-streak",
        title: "Week Warrior",
        description: "Maintain a 7-day streak with any habit",
        icon: <Flame className="h-6 w-6 text-orange-500" />,
        progress: Math.min(100, (Math.max(...habits.map(h => h.streak), 0) / 7) * 100),
        unlocked: Math.max(...habits.map(h => h.streak), 0) >= 7,
        category: "intermediate",
        xp: 75
      },
      {
        id: "fifty-completions",
        title: "Half Century",
        description: "Complete 50 habit check-ins",
        icon: <Target className="h-6 w-6 text-red-500" />,
        progress: Math.min(100, (completions.filter(c => c.completed).length / 50) * 100),
        unlocked: completions.filter(c => c.completed).length >= 50,
        category: "intermediate",
        xp: 100
      },
      
      // Advanced achievements
      {
        id: "month-streak",
        title: "Monthly Master",
        description: "Maintain a 30-day streak with any habit",
        icon: <Medal className="h-6 w-6 text-yellow-500" />,
        progress: Math.min(100, (Math.max(...habits.map(h => h.streak), 0) / 30) * 100),
        unlocked: Math.max(...habits.map(h => h.streak), 0) >= 30,
        category: "advanced",
        xp: 300
      },
      {
        id: "all-categories",
        title: "Well Rounded",
        description: "Have at least one habit in each category",
        icon: <Shield className="h-6 w-6 text-indigo-500" />,
        progress: (() => {
          const categories = ['health', 'fitness', 'mind', 'social'];
          const uniqueCategories = new Set(habits.map(h => h.category));
          const coveredCategories = categories.filter(c => uniqueCategories.has(c as any));
          return Math.min(100, (coveredCategories.length / categories.length) * 100);
        })(),
        unlocked: (() => {
          const categories = ['health', 'fitness', 'mind', 'social'];
          const uniqueCategories = new Set(habits.map(h => h.category));
          return categories.every(c => uniqueCategories.has(c as any));
        })(),
        category: "advanced",
        xp: 250
      },
      {
        id: "ten-habits",
        title: "Habit Arsenal",
        description: "Track 10 different habits",
        icon: <Sparkles className="h-6 w-6 text-purple-500" />,
        progress: Math.min(100, (habits.length / 10) * 100),
        unlocked: habits.length >= 10,
        category: "advanced",
        xp: 200
      },
      
      // Master achievements
      {
        id: "hundred-day-streak",
        title: "Century Streak",
        description: "Maintain a 100-day streak with any habit",
        icon: <Trophy className="h-6 w-6 text-yellow-600" />,
        progress: Math.min(100, (Math.max(...habits.map(h => h.streak), 0) / 100) * 100),
        unlocked: Math.max(...habits.map(h => h.streak), 0) >= 100,
        category: "master",
        xp: 1000
      },
      {
        id: "all-daily-habits",
        title: "Perfect Week",
        description: "Complete all daily habits for 7 consecutive days",
        icon: <Award className="h-6 w-6 text-yellow-400" />,
        progress: 0, // This would require more complex logic to calculate
        unlocked: false, // Just placeholder for now
        category: "master",
        xp: 500
      },
      {
        id: "thousand-completions",
        title: "Millennium Milestone",
        description: "Complete 1000 habit check-ins",
        icon: <Gift className="h-6 w-6 text-pink-500" />,
        progress: Math.min(100, (completions.filter(c => c.completed).length / 1000) * 100),
        unlocked: completions.filter(c => c.completed).length >= 1000,
        category: "master",
        xp: 1500
      },
    ];
    
    setAchievements(achievements);
  };
  
  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'master': return 'Master';
      default: return category;
    }
  };
  
  const getNextLevelXp = (): number => {
    const currentLevel = levels.find(l => l.level === level);
    return currentLevel ? currentLevel.maxXp : 0;
  };
  
  const getXpForNextLevel = (): number => {
    const currentLevel = levels.find(l => l.level === level);
    return currentLevel ? currentLevel.maxXp - xp : 0;
  };
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const achievementProgress = achievements.length > 0 
    ? Math.round((unlockedAchievements.length / achievements.length) * 100) 
    : 0;
  
  return (
    <Card>
      <CardHeader>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Gamification & Achievements</CardTitle>
              <CardDescription>
                Boost your motivation through levels, XP, and achievements
              </CardDescription>
            </div>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Level and XP */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-100 dark:border-blue-900">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl">
                {level}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 rounded-full p-1">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">{levelTitle}</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  {xp.toLocaleString()} XP • {getXpForNextLevel().toLocaleString()} XP needed for Level {level + 1}
                </p>
              </div>
              <Progress value={levelProgress} className="h-2" />
              <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 text-right">{levelProgress}%</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completions</p>
                    <p className="text-xl font-semibold">{completions.filter(c => c.completed).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                    <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                    <p className="text-xl font-semibold">{unlockedAchievements.length}/{achievements.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                    <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-xl font-semibold">{Math.max(...habits.map(h => h.streak), 0)} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-xl font-semibold">{xp.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recently Unlocked</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlockedAchievements.length > 0 ? (
                unlockedAchievements.slice(0, 2).map(achievement => (
                  <Card key={achievement.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-4 rounded-full">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <Badge variant="secondary" className="mt-2">+{achievement.xp} XP</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 p-6 text-center border rounded-lg">
                  <p className="text-muted-foreground">No achievements unlocked yet. Keep going!</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Achievements</h3>
            <div className="flex items-center gap-2">
              <Progress value={achievementProgress} className="w-32 h-2" />
              <span className="text-sm">{achievementProgress}%</span>
            </div>
          </div>
          
          <ScrollArea className="h-[500px] pr-4">
            {['beginner', 'intermediate', 'advanced', 'master'].map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{getCategoryTitle(category)}</h4>
                <div className="space-y-3">
                  {achievements
                    .filter(a => a.category === category)
                    .map(achievement => (
                      <div 
                        key={achievement.id} 
                        className={`p-4 rounded-lg border flex items-start gap-4 ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800' 
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-green-100 dark:bg-green-900' 
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            <Badge className={
                              achievement.unlocked 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                                : ""
                            }>
                              {achievement.unlocked ? 'Unlocked' : `+${achievement.xp} XP`}
                            </Badge>
                          </div>
                          
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-1.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
                <Separator className="my-6" />
              </div>
            ))}
          </ScrollArea>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Keep building those habits to earn more XP and achievements!</p>
        <Button variant="outline" size="sm" className="text-xs">
          View All Rewards
        </Button>
      </CardFooter>
    </Card>
  );
}