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
  ChevronDown,
  BookOpen,
  Pencil,
  Apple,
  Brain,
  Dumbbell,
  Droplets,
  Trash
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
                  <div className="space-y-4">
                    {/* Habit Stacks Section */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Quick Add Habit Stacks</h4>
                      
                      {/* Morning Routine Stack */}
                      <div className="border p-3 rounded-md mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Morning Routine Stack</h5>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-xs"
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
                              alert("Added 3 morning routine habits successfully!");
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium">Morning Meditation</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">10 minutes of focused breathing</p>
                          </div>
                          
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Morning Hydration</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Drink 16oz water</p>
                          </div>
                          
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-amber-500" />
                              <span className="text-sm font-medium">Gratitude Journal</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Write 3 things you're grateful for</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fitness Stack */}
                      <div className="border p-3 rounded-md mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Fitness Stack</h5>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-xs"
                            onClick={() => {
                              const fitnessHabits = [
                                {
                                  id: `h-${Date.now()}-str`,
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
                                  id: `h-${Date.now()}-prot`,
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
                                  id: `h-${Date.now()}-str`,
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
                              alert("Added 3 fitness habits successfully!");
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Dumbbell className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">Strength Training</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">3× per week</p>
                          </div>
                          
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Protein Intake</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Daily nutrition</p>
                          </div>
                          
                          <div className="p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-pink-500" />
                              <span className="text-sm font-medium">Post-workout Stretch</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Improve recovery</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Core Principles Habits */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" /> Principle-Based Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center"
                      onClick={() => {
                        // Toggle visibility of principles
                        const principlesSection = document.getElementById('principles-list');
                        if (principlesSection) {
                          principlesSection.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span className="font-medium">Core Stoic Principles</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    <div id="principles-list" className="space-y-2 hidden pl-2 pr-2 pt-2">
                      {[
                        { title: "Practice Negative Visualization", description: "Contemplate what you'd do if you lost what you value", icon: "brain" },
                        { title: "Focus on What You Can Control", description: "Distinguish between what is and isn't in your power", icon: "activity" },
                        { title: "Take the View From Above", description: "Consider problems from a broader perspective", icon: "brain" },
                        { title: "Practice Voluntary Discomfort", description: "Deliberately forgo comfort occasionally", icon: "zap" },
                        { title: "Apply the Dichotomy of Control", description: "Accept what you cannot change, focus on your responses", icon: "activity" }
                      ].map((principle, i) => (
                        <div key={i} className="flex flex-col p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{principle.title}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => {
                                const newHabit: Habit = {
                                  id: `h-${Date.now()}-principle-${i}`,
                                  title: principle.title,
                                  description: principle.description,
                                  icon: principle.icon,
                                  impact: 10,
                                  effort: 5,
                                  timeCommitment: '15 min',
                                  frequency: 'daily',
                                  isAbsolute: true,
                                  category: 'mind',
                                  streak: 0,
                                  createdAt: new Date(),
                                  type: "principle"
                                };
                                setHabits([...habits, newHabit]);
                              }}
                            >
                              <PlusCircle className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">{principle.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between items-center"
                      onClick={() => {
                        // Toggle visibility 
                        const sugarSection = document.getElementById('sugar-principles');
                        if (sugarSection) {
                          sugarSection.classList.toggle('hidden');
                        }
                      }}
                    >
                      <span className="font-medium">Sugar Avoidance</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    <div id="sugar-principles" className="space-y-2 hidden pl-2 pr-2 pt-2">
                      {[
                        { title: "Read Food Labels", description: "Check for hidden sugars in packaged foods", icon: "activity" },
                        { title: "No Liquid Calories", description: "Avoid sugar-sweetened beverages completely", icon: "droplets" },
                        { title: "Eat Whole Foods", description: "Focus on unprocessed foods without added sugar", icon: "apple" },
                        { title: "Sugar-Free Breakfast", description: "Start your day without any added sugar", icon: "activity" }
                      ].map((principle, i) => (
                        <div key={i} className="flex flex-col p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{principle.title}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => {
                                const newHabit: Habit = {
                                  id: `h-${Date.now()}-sugar-${i}`,
                                  title: principle.title,
                                  description: principle.description,
                                  icon: principle.icon,
                                  impact: 9,
                                  effort: 6,
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
                              <PlusCircle className="w-4 h-4" />
                            </Button>
                          </div>
                          <span className="text-xs text-muted-foreground">{principle.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create Custom Habit */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5">
                    <Pencil className="w-4 h-4" /> Create Custom Habit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Habit Name</label>
                      <input
                        id="custom-habit-title"
                        className="w-full p-2 mt-1 border rounded-md"
                        placeholder="E.g., Daily Meditation"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <input
                        id="custom-habit-description"
                        className="w-full p-2 mt-1 border rounded-md"
                        placeholder="Brief description of your habit"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <div className="relative">
                          <select 
                            id="custom-habit-category"
                            className="w-full p-2 mt-1 border rounded-md appearance-none"
                            onChange={(e) => {
                              const customOption = document.getElementById('custom-category-option');
                              const customInput = document.getElementById('custom-category-input');
                              
                              if (e.target.value === 'new-category' && customInput) {
                                customInput.classList.remove('hidden');
                                customInput.focus();
                              } else if (customInput) {
                                customInput.classList.add('hidden');
                              }
                            }}
                          >
                            <option value="health">Health</option>
                            <option value="fitness">Fitness</option>
                            <option value="mind">Mind</option>
                            <option value="social">Social</option>
                            <option value="work">Work</option>
                            <option value="study">Study</option>
                            <option value="hobby">Hobby</option>
                            <option value="finance">Finance</option>
                            <option value="spiritual">Spiritual</option>
                            <option id="custom-category-option" value="new-category">+ Create New Category</option>
                          </select>
                          <input 
                            id="custom-category-input"
                            className="w-full p-2 mt-1 border rounded-md hidden absolute top-0 left-0"
                            placeholder="Enter custom category name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Frequency</label>
                        <select 
                          id="custom-habit-frequency"
                          className="w-full p-2 mt-1 border rounded-md"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="2x-week">2x per week</option>
                          <option value="3x-week">3x per week</option>
                          <option value="4x-week">4x per week</option>
                          <option value="5x-week">5x per week</option>
                          <option value="6x-week">6x per week</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Icon</label>
                        <select 
                          id="custom-habit-icon"
                          className="w-full p-2 mt-1 border rounded-md"
                        >
                          <option value="activity">Activity</option>
                          <option value="brain">Brain</option>
                          <option value="droplets">Droplets</option>
                          <option value="dumbbell">Dumbbell</option>
                          <option value="apple">Apple</option>
                          <option value="bookopen">Book</option>
                          <option value="users">Social</option>
                          <option value="zap">Energy</option>
                          <option value="pill">Pill</option>
                          <option value="heart">Heart</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Time Commitment</label>
                        <input
                          id="custom-habit-time"
                          className="w-full p-2 mt-1 border rounded-md"
                          placeholder="E.g., 10 min, 1 hour"
                          defaultValue="15 min"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Impact (1-10)</label>
                        <input
                          id="custom-habit-impact"
                          type="number"
                          min="1"
                          max="10"
                          className="w-full p-2 mt-1 border rounded-md"
                          defaultValue="8"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Effort (1-10)</label>
                        <input
                          id="custom-habit-effort"
                          type="number"
                          min="1"
                          max="10"
                          className="w-full p-2 mt-1 border rounded-md"
                          defaultValue="5"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="is-absolute" 
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="is-absolute" className="text-sm font-medium">
                        Mark as Daily Absolute
                      </label>
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => {
                        const titleInput = document.getElementById('custom-habit-title') as HTMLInputElement;
                        const descriptionInput = document.getElementById('custom-habit-description') as HTMLInputElement;
                        const categorySelect = document.getElementById('custom-habit-category') as HTMLSelectElement;
                        const customCategoryInput = document.getElementById('custom-category-input') as HTMLInputElement;
                        const frequencySelect = document.getElementById('custom-habit-frequency') as HTMLSelectElement;
                        const iconSelect = document.getElementById('custom-habit-icon') as HTMLSelectElement;
                        const timeInput = document.getElementById('custom-habit-time') as HTMLInputElement;
                        const impactInput = document.getElementById('custom-habit-impact') as HTMLInputElement;
                        const effortInput = document.getElementById('custom-habit-effort') as HTMLInputElement;
                        const isAbsoluteCheck = document.getElementById('is-absolute') as HTMLInputElement;
                        
                        if (titleInput && titleInput.value.trim()) {
                          // Determine actual category - either selected or custom input
                          let category: HabitCategory = categorySelect.value as HabitCategory;
                          
                          if (category === 'new-category' && customCategoryInput && customCategoryInput.value.trim()) {
                            // Use the custom category name directly - type system will see this as a valid category
                            // since we'll have validated it by this point
                            category = customCategoryInput.value.trim() as HabitCategory;
                          }
                          
                          const newHabit: Habit = {
                            id: `h-${Date.now()}-custom`,
                            title: titleInput.value.trim(),
                            description: descriptionInput?.value?.trim() || `Custom habit: ${titleInput.value.trim()}`,
                            icon: iconSelect?.value || "activity",
                            impact: parseInt(impactInput?.value || "8"),
                            effort: parseInt(effortInput?.value || "5"),
                            timeCommitment: timeInput?.value?.trim() || '15 min',
                            frequency: frequencySelect.value as HabitFrequency,
                            isAbsolute: isAbsoluteCheck.checked,
                            category: category,
                            streak: 0,
                            createdAt: new Date(),
                            type: "custom"
                          };
                          
                          setHabits([...habits, newHabit]);
                          
                          // Reset form
                          titleInput.value = '';
                          if (descriptionInput) descriptionInput.value = '';
                          if (customCategoryInput) customCategoryInput.value = '';
                          if (timeInput) timeInput.value = '15 min';
                          isAbsoluteCheck.checked = false;
                          
                          // Show confirmation
                          alert(`Custom habit "${newHabit.title}" added successfully!`);
                        }
                      }}
                    >
                      Add Custom Habit
                    </Button>
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