import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';
import { 
  BarChart2, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Star,
  PlusCircle,
  MoveUp,
  Activity,
  Brain,
  LayoutGrid,
  Droplets,
  Heart,
  Dumbbell,
  BookOpen,
  Sun,
  ListChecks,
  Clock,
  Users,
  TrendingUp,
  BarChart
} from 'lucide-react';

// Types for habits
type Frequency = "daily" | "weekly" | "custom" | "2x-week" | "3x-week" | "4x-week";

type Habit = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: Frequency;
  isAbsolute: boolean;
  streak?: number;
  category?: "health" | "fitness" | "mind" | "social" | "custom";
};

type Completion = {
  id: string;
  date: Date;
};

export function StreakHabitTracker() {
  const [viewMode, setViewMode] = useState('calendar');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  
  // Sample habit data
  const habits: Habit[] = [
    {
      id: 'hydration',
      title: 'Drink 64oz Water',
      description: 'Stay hydrated throughout the day',
      icon: <Droplets />,
      impact: 8,
      effort: 2,
      timeCommitment: '1 min',
      frequency: 'daily',
      isAbsolute: true,
      streak: 12,
      category: 'health'
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Clear your mind and focus on your breath',
      icon: <Brain />,
      impact: 8,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: true,
      streak: 5,
      category: 'mind'
    },
    {
      id: 'exercise',
      title: 'Exercise',
      description: 'Get your body moving and blood pumping',
      icon: <Dumbbell />,
      impact: 10,
      effort: 6,
      timeCommitment: '30-60 min',
      frequency: '4x-week',
      isAbsolute: false,
      streak: 3,
      category: 'fitness'
    },
    {
      id: 'reading',
      title: 'Reading',
      description: 'Read books to expand your knowledge',
      icon: <BookOpen />,
      impact: 7,
      effort: 4,
      timeCommitment: '20 min',
      frequency: 'daily',
      isAbsolute: false,
      streak: 0,
      category: 'mind'
    },
    {
      id: 'social',
      title: 'Social Interaction',
      description: 'Connect with friends or family',
      icon: <Users />,
      impact: 8,
      effort: 5,
      timeCommitment: '15-30 min',
      frequency: '3x-week',
      isAbsolute: false,
      streak: 1,
      category: 'social'
    }
  ];
  
  // Sample completion data
  const completions: Completion[] = [
    { id: 'hydration', date: new Date() },
    { id: 'meditation', date: new Date() },
    { id: 'hydration', date: subDays(new Date(), 1) },
    { id: 'meditation', date: subDays(new Date(), 1) },
    { id: 'exercise', date: subDays(new Date(), 1) },
    { id: 'hydration', date: subDays(new Date(), 2) },
    { id: 'meditation', date: subDays(new Date(), 2) },
    { id: 'hydration', date: subDays(new Date(), 3) },
    { id: 'reading', date: subDays(new Date(), 3) },
    { id: 'exercise', date: subDays(new Date(), 4) },
    { id: 'hydration', date: subDays(new Date(), 4) },
  ];
  
  // Generate dates for the week view
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start with Monday
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });
  
  // Check if a habit was completed on a specific date
  const isCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => completion.id === habitId && isSameDay(completion.date, date)
    );
  };
  
  // Toggle completion status
  const toggleCompletion = (habitId: string, date: Date) => {
    console.log(`Toggling completion for ${habitId} on ${format(date, 'MMM d, yyyy')}`);
    // In a real app, this would update state and persist to backend
  };
  
  // Filter habits based on category
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const filteredHabits = habits.filter(habit => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'absolute') return habit.isAbsolute;
    return habit.category === filterCategory;
  });
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <MoveUp className="h-5 w-5 text-primary" /> 
            High-ROI Habit Tracker
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="calendar" className="text-xs px-3 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Calendar
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs px-3 flex items-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5" /> Stats
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 mt-3 overflow-x-auto pb-2">
          <Badge 
            variant={filterCategory === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setFilterCategory('all')}
          >
            All
          </Badge>
          <Badge 
            variant={filterCategory === 'absolute' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setFilterCategory('absolute')}
          >
            Must-Do
          </Badge>
          <Badge 
            variant={filterCategory === 'health' ? 'default' : 'outline'} 
            className="cursor-pointer bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-200"
            onClick={() => setFilterCategory('health')}
          >
            Health
          </Badge>
          <Badge 
            variant={filterCategory === 'fitness' ? 'default' : 'outline'} 
            className="cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border-blue-200"
            onClick={() => setFilterCategory('fitness')}
          >
            Fitness
          </Badge>
          <Badge 
            variant={filterCategory === 'mind' ? 'default' : 'outline'} 
            className="cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 border-purple-200"
            onClick={() => setFilterCategory('mind')}
          >
            Mind
          </Badge>
          <Badge 
            variant={filterCategory === 'social' ? 'default' : 'outline'} 
            className="cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border-amber-200"
            onClick={() => setFilterCategory('social')}
          >
            Social
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="calendar" className="mt-0">
          {/* Calendar Week Navigation */}
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="text-xs flex items-center gap-1"
            >
              ← Previous Week
            </Button>
            
            <span className="text-sm font-medium">
              {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="text-xs flex items-center gap-1"
              disabled={weekOffset >= 0}
            >
              Next Week →
            </Button>
          </div>
          
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-center"></div>
            {weekDates.map((date, index) => (
              <div 
                key={index} 
                className={`text-center text-xs p-1 font-medium ${
                  isSameDay(date, today) ? 'bg-primary/10 rounded-md' : ''
                }`}
              >
                {format(date, 'EEE')}
                <div className="text-[10px]">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
          
          {/* Habits with completion checkins */}
          <div className="space-y-1">
            {filteredHabits.map(habit => (
              <div 
                key={habit.id} 
                className={`grid grid-cols-8 gap-1 items-center border-b border-b-muted/60 py-1
                  ${habit.isAbsolute ? 'bg-primary/5' : ''}
                `}
              >
                <div className="flex flex-col justify-center gap-1">
                  <div className="flex items-center gap-1.5 ml-1 truncate">
                    {React.cloneElement(habit.icon as React.ReactElement, { className: 'h-3.5 w-3.5 shrink-0 text-primary' })}
                    <span className="text-xs font-medium truncate">{habit.title}</span>
                  </div>
                  <div className="flex ml-1 gap-1 items-center">
                    {habit.streak && habit.streak > 0 ? (
                      <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] flex items-center gap-0.5 bg-amber-500/10 text-amber-700 border-amber-200">
                        <Star className="h-2.5 w-2.5" /> {habit.streak}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{habit.timeCommitment}</span>
                    )}
                  </div>
                </div>
                
                {/* Week Day Checkins */}
                {weekDates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-center items-center h-10 rounded-md cursor-pointer transition-colors ${
                      isCompletedOnDate(habit.id, date) 
                        ? habit.isAbsolute ? 'bg-green-500/20' : 'bg-blue-500/20' 
                        : isSameDay(date, today) 
                          ? 'bg-primary/5 hover:bg-primary/10' 
                          : 'hover:bg-muted'
                    }`}
                    onClick={() => toggleCompletion(habit.id, date)}
                  >
                    {isCompletedOnDate(habit.id, date) ? (
                      <CheckCircle2 className={`h-5 w-5 ${habit.isAbsolute ? 'text-green-600' : 'text-blue-600'}`} />
                    ) : (
                      <div className={`h-5 w-5 rounded-full border ${
                        isSameDay(date, today) ? 'border-primary' : 'border-muted-foreground/30'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          {selectedHabit ? (
            // Individual habit stats
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedHabit(null)}
                  className="text-xs flex items-center gap-1"
                >
                  ← Back to Overview
                </Button>
                <h3 className="text-lg font-semibold">
                  {habits.find(h => h.id === selectedHabit)?.title || 'Habit Stats'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" /> Current Streak
                  </div>
                  <div className="text-2xl font-bold">
                    {habits.find(h => h.id === selectedHabit)?.streak || 0}
                  </div>
                  <div className="text-xs text-primary mt-1">days</div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" /> Longest Streak
                  </div>
                  <div className="text-2xl font-bold">14</div>
                  <div className="text-xs text-primary mt-1">days</div>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Success Rate
                  </div>
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-xs text-primary mt-1">completion rate</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <BarChart className="h-4 w-4 text-primary" /> Analytics
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Total Completions</span>
                        <span className="text-xs font-medium">67</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Consistency</span>
                        <span className="text-xs font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">ROI Score</span>
                        <span className="text-xs font-medium">
                          {(habits.find(h => h.id === selectedHabit)?.impact || 0) / 
                           (habits.find(h => h.id === selectedHabit)?.effort || 1) * 10
                          }
                        </span>
                      </div>
                      <Progress 
                        value={
                          (habits.find(h => h.id === selectedHabit)?.impact || 0) / 
                          (habits.find(h => h.id === selectedHabit)?.effort || 1) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Overview stats
            <div>
              <h3 className="text-sm font-semibold mb-4">
                Overall Progress
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center justify-center"
                  onClick={() => setSelectedHabit('hydration')}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Hydration</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">12 days</span>
                    </div>
                    <Progress value={80} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span>Top Performing Habit</span>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center justify-center"
                  onClick={() => setSelectedHabit('meditation')}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Meditation</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">5 days</span>
                    </div>
                    <Progress value={60} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3 text-primary" />
                      <span>High ROI Score: 8.5</span>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center justify-center"
                  onClick={() => setSelectedHabit('exercise')}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Exercise</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">3 days</span>
                    </div>
                    <Progress value={40} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>30-60 min, 4x per week</span>
                    </div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center justify-center"
                  onClick={() => setSelectedHabit('reading')}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium">Reading</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">0 days</span>
                    </div>
                    <Progress value={20} className="h-1.5 mb-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-rose-500" />
                      <span>Needs improvement</span>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
}