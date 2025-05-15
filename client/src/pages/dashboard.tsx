import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { DashboardHabits } from "@/components/dashboard/dashboard-habits";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { WeeklyHabitView } from "@/components/dashboard/weekly-habit-view-fixed";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { useUser } from "@/context/user-context";
import { format, addDays, startOfWeek, subDays, isSameDay } from 'date-fns';
import { 
  Activity, 
  Zap, 
  PlusCircle, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

// Sample data (same as in dashboard-habits.tsx)
const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
    impact: 8,
    effort: 2,
    timeCommitment: '5 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'health',
    streak: 12,
    createdAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
  },
  {
    id: 'h2',
    title: 'Morning Meditation',
    description: 'Start the day with a clear, focused mind',
    icon: 'brain',
    impact: 9,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 7,
    createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
  },
  {
    id: 'h3',
    title: 'Strength Training',
    description: 'Build strength and muscle mass',
    icon: 'dumbbell',
    impact: 9,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 2,
    createdAt: new Date(Date.now() - 86400000 * 21) // 21 days ago
  },
  {
    id: 'h4',
    title: 'Read Books',
    description: 'Feed your mind with quality information',
    icon: 'bookopen',
    impact: 8,
    effort: 4,
    timeCommitment: '30 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
    streak: 5,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  },
  {
    id: 'h5',
    title: 'Social Connection',
    description: 'Connect with friends or family',
    icon: 'users',
    impact: 7,
    effort: 3,
    timeCommitment: '30 min',
    frequency: '2x-week',
    isAbsolute: false,
    category: 'social',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
  }
];

const initialCompletions: HabitCompletion[] = [
  { habitId: 'h1', date: new Date(), completed: true },
  { habitId: 'h2', date: new Date(), completed: true },
  { habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { habitId: 'h2', date: subDays(new Date(), 2), completed: true },
  { habitId: 'h4', date: subDays(new Date(), 2), completed: true },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userLoading } = useUser();
  
  // Unified state for habit tracking
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  
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
    const isCompleted = isHabitCompletedOnDate(habitId, date);
    
    if (isCompleted) {
      // Remove completion
      setCompletions(completions.filter(
        c => !(c.habitId === habitId && isSameDay(c.date, date))
      ));
    } else {
      // Add completion
      setCompletions([...completions, { habitId, date, completed: true }]);
    }
  };
  
  // Navigate to the habits page for adding new habits
  const handleAddHabit = () => {
    window.location.href = "/habits";
  };
  
  // Calculate metrics for the habit completion stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => isHabitCompletedOnDate(h.id, new Date())).length;
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  // Weekly metrics
  const weeklyCompletionRate = habits.reduce((total, habit) => {
    const completed = weekDates.filter(date => isHabitCompletedOnDate(habit.id, date)).length;
    const target = habit.frequency === 'daily' ? 7 : 
                  habit.frequency === '2x-week' ? 2 :
                  habit.frequency === '3x-week' ? 3 :
                  habit.frequency === '4x-week' ? 4 : 1;
    return total + (completed / (target * habits.length) * 100);
  }, 0);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <PageContainer title="Habit Dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <div className="lg:col-span-2 space-y-6">
              {/* Main habit tracker component */}
              <Card>
                <CardContent className="pt-6">
                  <WeeklyHabitView 
                    habits={habits}
                    completions={completions}
                    onToggleHabit={toggleHabitCompletion}
                    onAddHabit={handleAddHabit}
                    onUpdateHabit={(updatedHabit) => {
                      // Ensure updatedHabit has all required properties
                      const completeHabit = {
                        ...updatedHabit,
                        createdAt: updatedHabit.createdAt || new Date()
                      };
                      
                      setHabits(habits.map(h => 
                        h.id === updatedHabit.id ? completeHabit : h
                      ));
                    }}
                    onDeleteHabit={(habitId) => {
                      setHabits(habits.filter(h => h.id !== habitId));
                      setCompletions(completions.filter(c => c.habitId !== habitId));
                    }}
                  />
                </CardContent>
              </Card>
              
              {/* Habit performance metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProgressCard 
                  title="Today's Habits" 
                  value={`${completedToday}/${totalHabits}`} 
                  trend={completedToday > 0 ? `${Math.round((completedToday / totalHabits) * 100)}%` : "0%"}
                  description="completed" 
                />
                <ProgressCard 
                  title="Weekly Streak" 
                  value={habits.reduce((max, h) => Math.max(max, h.streak || 0), 0) + " days"}
                  description="longest active streak"
                />
                <ProgressCard 
                  title="Weekly Completion" 
                  value={`${Math.round(weeklyCompletionRate)}%`}
                  description="this week" 
                />
              </div>
              
              {/* Habit Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Habit Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Your top performing habits and areas for improvement.</p>
                  <div className="space-y-4">
                    {habits.map(habit => {
                      // Calculate completion rate for this habit
                      const completedDays = weekDates.filter(date => 
                        isHabitCompletedOnDate(habit.id, date)
                      ).length;
                      
                      const target = habit.frequency === 'daily' ? 7 : 
                                    habit.frequency === '2x-week' ? 2 :
                                    habit.frequency === '3x-week' ? 3 :
                                    habit.frequency === '4x-week' ? 4 : 1;
                                    
                      const completionRate = Math.min(100, Math.round((completedDays / target) * 100));
                      
                      return (
                        <div key={habit.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{habit.title}</span>
                            <span className="text-sm font-medium">{completionRate}%</span>
                          </div>
                          <div className="w-full bg-primary/20 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full" 
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column with motivation and other elements */}
            <div className="space-y-6">
              <DailyMotivation />
              
              {/* Habit Library Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Habit Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Individual Habits Section */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Quick Add Habits</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['Drink water', 'Take vitamins', 'Stretch', 'Cold shower', 'Journal', 'Meditate', 'Walk 10k steps', 'Read 30 min'].map((item, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          className="flex justify-start items-center text-sm h-10 px-2" 
                          onClick={() => {
                            const newHabit: Habit = {
                              id: `h-${Date.now()}-${i}`,
                              title: item,
                              description: `Quick-added habit: ${item}`,
                              icon: item.toLowerCase().includes('water') ? 'droplets' : 
                                    item.toLowerCase().includes('vitamin') ? 'pill' : 
                                    item.toLowerCase().includes('stretch') ? 'activity' : 
                                    item.toLowerCase().includes('shower') ? 'droplets' :
                                    item.toLowerCase().includes('journal') ? 'bookopen' :
                                    item.toLowerCase().includes('meditate') ? 'brain' :
                                    item.toLowerCase().includes('walk') ? 'activity' :
                                    item.toLowerCase().includes('read') ? 'bookopen' : 'zap',
                              impact: 8,
                              effort: 3,
                              timeCommitment: '5-15 min',
                              frequency: 'daily',
                              isAbsolute: true,
                              category: 'health',
                              streak: 0,
                              createdAt: new Date()
                            };
                            setHabits([...habits, newHabit]);
                          }}
                        >
                          <PlusCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Morning Routine Stack */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Morning Routine Stack</h4>
                    <div className="space-y-2">
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Morning Meditation</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => {
                              const newHabit: Habit = {
                                id: `h-${Date.now()}-meditation`,
                                title: "Morning Meditation",
                                description: "10 minutes of focused breathing",
                                icon: "brain",
                                impact: 9,
                                effort: 2,
                                timeCommitment: '10 min',
                                frequency: 'daily',
                                isAbsolute: true,
                                category: 'mind',
                                streak: 0,
                                createdAt: new Date()
                              };
                              setHabits([...habits, newHabit]);
                            }}
                          >
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">10 minutes of focused breathing</span>
                      </div>
                      
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Morning Hydration</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => {
                              const newHabit: Habit = {
                                id: `h-${Date.now()}-hydration`,
                                title: "Morning Hydration",
                                description: "Drink 16oz of water immediately after waking",
                                icon: "droplets",
                                impact: 9,
                                effort: 1,
                                timeCommitment: '2 min',
                                frequency: 'daily',
                                isAbsolute: true,
                                category: 'health',
                                streak: 0,
                                createdAt: new Date()
                              };
                              setHabits([...habits, newHabit]);
                            }}
                          >
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">Drink 16oz of water immediately after waking</span>
                      </div>
                      
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Gratitude Journaling</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => {
                              const newHabit: Habit = {
                                id: `h-${Date.now()}-journal`,
                                title: "Gratitude Journaling",
                                description: "Write down 3 things you're grateful for",
                                icon: "bookopen",
                                impact: 9,
                                effort: 3,
                                timeCommitment: '10 min',
                                frequency: 'daily',
                                isAbsolute: true,
                                category: 'mind',
                                streak: 0,
                                createdAt: new Date()
                              };
                              setHabits([...habits, newHabit]);
                            }}
                          >
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">Write down 3 things you're grateful for</span>
                      </div>
                      
                      <Button 
                        className="w-full flex justify-center items-center text-sm h-8"
                        variant="default" 
                        onClick={() => {
                          const morningHabits = [
                            {
                              id: `h-${Date.now()}-1`,
                              title: "Morning Meditation",
                              description: "10 minutes of focused breathing",
                              icon: "brain",
                              impact: 9,
                              effort: 2,
                              timeCommitment: '10 min',
                              frequency: 'daily' as HabitFrequency,
                              isAbsolute: true,
                              category: "mind" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            },
                            {
                              id: `h-${Date.now()}-2`,
                              title: "Morning Hydration",
                              description: "Drink 16oz of water immediately after waking",
                              icon: "droplets",
                              impact: 9,
                              effort: 1,
                              timeCommitment: '2 min',
                              frequency: 'daily' as HabitFrequency,
                              isAbsolute: true,
                              category: "health" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            },
                            {
                              id: `h-${Date.now()}-3`,
                              title: "Gratitude Journaling",
                              description: "Write down 3 things you're grateful for",
                              icon: "bookopen",
                              impact: 9,
                              effort: 3,
                              timeCommitment: '10 min',
                              frequency: 'daily' as HabitFrequency,
                              isAbsolute: true,
                              category: "mind" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            }
                          ];
                          
                          setHabits([...habits, ...morningHabits]);
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add All Morning Habits
                      </Button>
                    </div>
                  </div>
                  
                  {/* Fitness Stack with collapsible */}
                  <div className="mb-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center mb-2"
                      onClick={() => {
                        // Toggle visibility of fitness habits
                        const fitnessSection = document.getElementById('fitness-stack');
                        if (fitnessSection) {
                          fitnessSection.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span className="font-medium">Fitness Stack</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    <div id="fitness-stack" className="space-y-2 hidden">
                      <div className="flex flex-col p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">Strength Training</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => {
                              const newHabit: Habit = {
                                id: `h-${Date.now()}-strength`,
                                title: "Strength Training",
                                description: "Build muscle with resistance exercises",
                                icon: "dumbbell",
                                impact: 9,
                                effort: 7,
                                timeCommitment: '45 min',
                                frequency: '3x-week',
                                isAbsolute: false,
                                category: 'fitness',
                                streak: 0,
                                createdAt: new Date()
                              };
                              setHabits([...habits, newHabit]);
                            }}
                          >
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground">Build muscle with resistance exercises, 3x per week</span>
                      </div>
                      
                      <Button 
                        className="w-full"
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          const fitnessHabits = [
                            {
                              id: `h-${Date.now()}-strength`,
                              title: "Strength Training",
                              description: "Build muscle with resistance exercises",
                              icon: "dumbbell",
                              impact: 9,
                              effort: 7,
                              timeCommitment: '45 min',
                              frequency: '3x-week' as HabitFrequency,
                              isAbsolute: false,
                              category: "fitness" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            },
                            {
                              id: `h-${Date.now()}-protein`,
                              title: "Protein Intake",
                              description: "Consume enough protein daily",
                              icon: "activity",
                              impact: 8,
                              effort: 4,
                              timeCommitment: 'All day',
                              frequency: 'daily' as HabitFrequency,
                              isAbsolute: true,
                              category: "health" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            },
                            {
                              id: `h-${Date.now()}-stretch`,
                              title: "Post-workout Stretch",
                              description: "Increase flexibility and recovery",
                              icon: "activity",
                              impact: 7,
                              effort: 3,
                              timeCommitment: '15 min',
                              frequency: '3x-week' as HabitFrequency,
                              isAbsolute: false,
                              category: "fitness" as HabitCategory,
                              streak: 0,
                              createdAt: new Date()
                            }
                          ];
                          
                          setHabits([...habits, ...fitnessHabits]);
                        }}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add All Fitness Habits
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Break Bad Habits Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Break Bad Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {['No alcohol', 'No smoking', 'No porn', 'No junk food', 'No social media', 'No sugar', 'No procrastination', 'No late nights'].map((item, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        className="flex justify-start items-center text-sm h-10 border-red-200 hover:border-red-300 hover:bg-red-50/10 px-2" 
                        onClick={() => {
                          const newHabit: Habit = {
                            id: `h-${Date.now()}-${i}`,
                            title: item,
                            description: `Break this harmful habit for health and wellbeing`,
                            icon: "activity",
                            impact: 9,
                            effort: 7,
                            timeCommitment: 'All day',
                            frequency: 'daily',
                            isAbsolute: true,
                            category: 'health',
                            streak: 0,
                            createdAt: new Date()
                          };
                          setHabits([...habits, newHabit]);
                        }}
                      >
                        <PlusCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* High ROI message */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>High ROI Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">Focus on these activities for maximum gains:</p>
                  <ul className="space-y-3">
                    {habits
                      .filter(h => h.isAbsolute)
                      .sort((a, b) => b.impact - a.impact)
                      .slice(0, 3)
                      .map(habit => (
                        <li key={habit.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                          <div className="bg-primary/10 p-2 rounded-md text-primary">
                            {habit.icon === 'brain' && '🧠'}
                            {habit.icon === 'droplets' && '💧'}
                            {habit.icon === 'dumbbell' && '💪'}
                            {habit.icon === 'bookopen' && '📚'}
                            {habit.icon === 'users' && '👥'}
                          </div>
                          <div>
                            <div className="font-medium">{habit.title}</div>
                            <div className="text-xs text-muted-foreground">{habit.timeCommitment} • Impact: {habit.impact}/10</div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}