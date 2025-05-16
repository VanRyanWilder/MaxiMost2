import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { DashboardHabits } from "@/components/dashboard/dashboard-habits";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitViewModes } from "@/components/dashboard/habit-view-modes";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { SortableHabitViewModes } from "@/components/dashboard/sortable-habit-view-modes";
import { FixHabitDialog } from "@/components/dashboard/fix-habit-dialog";
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
  Trash,
  Sun,
  Clock,
  CheckSquare
} from 'lucide-react';
import {
  calculateCompletionRate,
  calculateCurrentStreak,
  calculateConsistencyScore,
  getCompletionTrend
} from "@/utils/dashboard-stats";

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

// Sample data (same as in dashboard-habits.tsx)
const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
    iconColor: '#3b82f6',
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
    iconColor: '#8b5cf6',
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
    iconColor: '#ef4444',
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
    iconColor: '#f59e0b',
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
    iconColor: '#10b981',
    impact: 7,
    effort: 3,
    timeCommitment: '30 min',
    frequency: '2x-week',
    isAbsolute: false,
    category: 'social',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
  }
];

// Sample completions data
const initialCompletions: HabitCompletion[] = [
  // Today
  { id: 'c1', habitId: 'h1', date: new Date(), completed: true },
  { id: 'c2', habitId: 'h2', date: new Date(), completed: true },
  
  // Yesterday
  { id: 'c3', habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { id: 'c4', habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { id: 'c5', habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  
  // 2 days ago
  { id: 'c6', habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { id: 'c7', habitId: 'h2', date: subDays(new Date(), 2), completed: false },
  { id: 'c8', habitId: 'h4', date: subDays(new Date(), 2), completed: true },
  { id: 'c9', habitId: 'h5', date: subDays(new Date(), 2), completed: true },
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [showCustomHabitDialog, setShowCustomHabitDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const { user } = useUser();
  
  // Get selected date range for Weekly View - starts on Monday of current week
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // Function to handle habit completion toggle
  const toggleCompletion = (habitId: string, date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Only allow toggling if date is today or earlier
    if (date > today) return;
    
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(c.date, date)
    );
    
    if (existingCompletionIndex >= 0) {
      const newCompletions = [...completions];
      newCompletions[existingCompletionIndex].completed = !newCompletions[existingCompletionIndex].completed;
      setCompletions(newCompletions);
    } else {
      setCompletions([
        ...completions,
        { 
          id: `c-${Date.now()}`, 
          habitId, 
          date: new Date(date), 
          completed: true 
        }
      ]);
    }
  };
  
  // Function to add a new habit
  const addHabit = (habit?: Habit) => {
    if (habit) {
      // If we have a habit object, add it directly
      setHabits([...habits, habit]);
    } else {
      // If no habit provided, open the dialog for creating a new one
      setShowCustomHabitDialog(true);
    }
  };
  
  // Function to edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
  };
  
  // Function to delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    setCompletions(completions.filter(completion => completion.habitId !== habitId));
  };
  
  return (
    <>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col min-h-screen">
        <MobileHeader 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          pageTitle="Habit Dashboard"
        />
        
        <PageContainer>
          <div className="pt-4 pb-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                Your Habit Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track, measure, and optimize your daily habits for maximum ROI on your time.
              </p>
            </div>
            
            {/* Progress Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <ProgressCard 
                title="Completion Rate" 
                value={calculateCompletionRate(habits, completions)} 
                trend={getCompletionTrend(habits, completions)}
                description="Last 7 days"
                icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
              />
              
              <ProgressCard 
                title="Current Streak" 
                value={calculateCurrentStreak(habits, completions)} 
                description="Days in a row"
                icon={<Activity className="h-5 w-5 text-green-500" />}
              />
              
              <ProgressCard 
                title="Active Habits" 
                value={habits.length} 
                description="Total habits"
                icon={<Zap className="h-5 w-5 text-amber-500" />}
              />
              
              <ProgressCard 
                title="Consistency Score" 
                value={calculateConsistencyScore(habits, completions)} 
                description="Based on activity"
                icon={<Activity className="h-5 w-5 text-purple-500" />}
              />
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Unified habit tracker (left column) */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-blue-500" /> Habit Tracker
                      </CardTitle>
                      <Button 
                        onClick={() => {
                          // Open the enhanced dialog
                          setShowCustomHabitDialog(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600"
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Add New Habit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="space-y-6">
                      <SortableHabitViewModes 
                        habits={habits}
                        completions={completions}
                        onToggleHabit={toggleCompletion}
                        onAddHabit={() => {
                          // This should open the enhanced dialog without passing a habit
                          setShowCustomHabitDialog(true);
                        }}
                        onUpdateHabit={editHabit}
                        onDeleteHabit={deleteHabit}
                        onReorderHabits={(reorderedHabits) => setHabits(reorderedHabits)}
                        onEditHabit={(habit) => setEditingHabit(habit)}
                      />
                      
                      <div className="mt-8">
                        <DashboardHabits 
                          habits={habits}
                          completions={completions.filter(c => isSameDay(c.date, new Date()))}
                          onToggleCompletion={(habitId) => toggleCompletion(habitId, new Date())}
                          onAddHabit={() => setShowCustomHabitDialog(true)}
                          onEditHabit={setEditingHabit}
                          onDeleteHabit={deleteHabit}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column with habit library and other elements */}
              <div className="space-y-6">
                {/* Habit Library Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-blue-500" /> Habit Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quick Add Habits Section */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Quick Add Individual Habits</h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {[
                            { title: "Make Bed", icon: <CheckSquare className="h-4 w-4 text-blue-500" />, description: "Start the day right", category: "mind" },
                            { title: "Pray", icon: <Sun className="h-4 w-4 text-blue-500" />, description: "Daily prayer practice", category: "mind" },
                            { title: "Lift Weights", icon: <Dumbbell className="h-4 w-4 text-blue-500" />, description: "Strength training", category: "fitness" },
                            { title: "Brush Teeth", icon: <Activity className="h-4 w-4 text-blue-500" />, description: "Oral hygiene", category: "health" },
                            { title: "Wash Face", icon: <Droplets className="h-4 w-4 text-blue-500" />, description: "Skincare", category: "health" },
                            { title: "Meditate", icon: <Brain className="h-4 w-4 text-blue-500" />, description: "Mental clarity", category: "mind" },
                            { title: "Call Friend", icon: <Activity className="h-4 w-4 text-blue-500" />, description: "Social connection", category: "social" },
                            { title: "Drink Water", icon: <Droplets className="h-4 w-4 text-blue-500" />, description: "Stay hydrated", category: "health" },
                            { title: "Journal", icon: <BookOpen className="h-4 w-4 text-blue-500" />, description: "Express thoughts", category: "mind" },
                            { title: "Brain Dump", icon: <Brain className="h-4 w-4 text-blue-500" />, description: "Clear your mind", category: "mind" },
                            { title: "Eat That Frog", icon: <Activity className="h-4 w-4 text-blue-500" />, description: "Do hardest task first", category: "mind" },
                            { title: "Cardio", icon: <Activity className="h-4 w-4 text-blue-500" />, description: "Heart health", category: "fitness" },
                            { title: "Supplements", icon: <Activity className="h-4 w-4 text-blue-500" />, description: "Daily vitamins", category: "health" },
                            { title: "Custom", icon: <PlusCircle className="h-4 w-4 text-blue-500" />, description: "Create custom habit", category: "other" }
                          ].map((habit, index) => (
                            <div key={index} className="border rounded-md bg-gray-50/50 p-2 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {habit.icon}
                                  <span className="text-sm font-medium">{habit.title}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    if (habit.title === "Custom") {
                                      setShowCustomHabitDialog(true);
                                    } else {
                                      const newHabit = {
                                        id: `h-${Date.now()}-q${index}`,
                                        title: habit.title,
                                        description: habit.description,
                                        icon: habit.icon.type.name.toLowerCase(),
                                        iconColor: 'blue',
                                        impact: 8,
                                        effort: 3,
                                        timeCommitment: '5 min',
                                        frequency: 'daily',
                                        isAbsolute: true,
                                        category: habit.category,
                                        streak: 0,
                                        createdAt: new Date()
                                      };
                                      setHabits([...habits, newHabit]);
                                      alert(`Added "${habit.title}" to your habits!`);
                                    }
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <PlusCircle className="h-4 w-4 text-blue-500" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{habit.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Habit Stacks Section */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Expert Habit Stacks</h4>
                        
                        {/* Morning Routine Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                Morning Routine Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
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
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Meditation</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">10 minutes of focused breathing</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Hydration</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Drink 16oz water</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Gratitude Journal</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Write 3 things you're grateful for</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Huberman Lab Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Brain className="h-4 w-4 text-blue-500" />
                                Huberman Lab Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={() => {
                                  const hubermanHabits = [
                                    {
                                      id: `h-${Date.now()}-h1`,
                                      title: "Morning Sunlight",
                                      description: "Get 2-10 minutes of morning sunlight exposure within 30-60 minutes of waking",
                                      icon: "sun",
                                      impact: 9,
                                      effort: 1,
                                      timeCommitment: '5 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: true,
                                      category: "health" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    },
                                    {
                                      id: `h-${Date.now()}-h2`,
                                      title: "Delay Caffeine",
                                      description: "Wait 90-120 minutes after waking before consuming caffeine",
                                      icon: "clock",
                                      impact: 7,
                                      effort: 3,
                                      timeCommitment: '0 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: true,
                                      category: "health" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    },
                                    {
                                      id: `h-${Date.now()}-h3`,
                                      title: "Cold Exposure",
                                      description: "Brief cold exposure via shower or cold plunge",
                                      icon: "droplets",
                                      impact: 8,
                                      effort: 6,
                                      timeCommitment: '2 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: false,
                                      category: "health" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    }
                                  ];
                                  
                                  setHabits([...habits, ...hubermanHabits]);
                                  alert("Added Huberman Lab stack successfully!");
                                }}
                              >
                                Add All 3 Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Sunlight</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">5 min daily</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Delay Caffeine</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">90+ min after waking</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Cold Exposure</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">2 min cold shower</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Jocko Stack */}
                        <div className="border rounded-md mb-4 hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <CheckSquare className="h-4 w-4 text-blue-500" />
                                Jocko Willink Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={() => {
                                  const jockoHabits = [
                                    {
                                      id: `h-${Date.now()}-j1`,
                                      title: "4:30 AM Wake-Up",
                                      description: "Wake up at 4:30 AM for early start advantage",
                                      icon: "sun",
                                      impact: 8,
                                      effort: 8,
                                      timeCommitment: '0 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: true,
                                      category: "mind" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    },
                                    {
                                      id: `h-${Date.now()}-j2`,
                                      title: "Morning Workout",
                                      description: "Intense workout (weight training or calisthenics)",
                                      icon: "dumbbell",
                                      impact: 9,
                                      effort: 7,
                                      timeCommitment: '45 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: false,
                                      category: "fitness" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    },
                                    {
                                      id: `h-${Date.now()}-j3`,
                                      title: "Strategic Planning",
                                      description: "Plan your day with strategic priorities",
                                      icon: "bookopen",
                                      impact: 8,
                                      effort: 3,
                                      timeCommitment: '10 min',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: true,
                                      category: "mind" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    }
                                  ];
                                  
                                  setHabits([...habits, ...jockoHabits]);
                                  alert("Added Jocko Willink stack successfully!");
                                }}
                              >
                                Add All 3 Habits
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">4:30 AM Wake-Up</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Daily discipline</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Morning Workout</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">45-60 min daily</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Strategic Planning</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">10 min daily</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Fitness Stack */}
                        <div className="border rounded-md hover:border-blue-200 transition-colors">
                          <div className="p-3 border-b bg-gray-50">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                Fitness Stack
                              </h5>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-3 text-xs border-blue-200 hover:border-blue-300 hover:bg-blue-50/50"
                                onClick={() => {
                                  const fitnessHabits = [
                                    {
                                      id: `h-${Date.now()}-f1`,
                                      title: "Strength Training",
                                      description: "Resistance training for muscle growth and strength",
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
                                      id: `h-${Date.now()}-f2`,
                                      title: "Protein Intake",
                                      description: "Consume adequate protein (1g per lb of bodyweight)",
                                      icon: "apple",
                                      impact: 8,
                                      effort: 5,
                                      timeCommitment: 'All day',
                                      frequency: 'daily' as HabitFrequency,
                                      isAbsolute: true,
                                      category: "health" as HabitCategory,
                                      streak: 0,
                                      createdAt: new Date()
                                    },
                                    {
                                      id: `h-${Date.now()}-f3`,
                                      title: "Post-workout Stretch",
                                      description: "5-10 minutes of stretching after workout",
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
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Dumbbell className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Strength Training</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">3× per week</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">Protein Intake</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Daily nutrition</p>
                            </div>
                            
                            <div className="p-2 border rounded-md bg-gray-50/50">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" />
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

                {/* Daily Motivation */}
                <DailyMotivation />
              </div>
            </div>
          </div>
        </PageContainer>
        
        {/* Unified Habit Dialog for both adding and editing habits */}
        <FixHabitDialog 
          open={!!editingHabit || showCustomHabitDialog} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingHabit(null);
              setShowCustomHabitDialog(false);
            }
          }}
          habit={editingHabit || {
            id: `h-${Date.now()}`,
            title: "New Habit",
            description: "Description of your new habit",
            icon: "activity",
            iconColor: "#3b82f6",
            impact: 8,
            effort: 4,
            timeCommitment: '10 min',
            frequency: 'daily' as HabitFrequency,
            isAbsolute: true,
            category: "health" as HabitCategory,
            streak: 0,
            createdAt: new Date()
          }}
          onSave={(updatedHabit) => {
            if (editingHabit) {
              // If we're editing an existing habit
              editHabit(updatedHabit);
            } else {
              // If we're adding a new habit
              addHabit(updatedHabit);
            }
            setEditingHabit(null);
            setShowCustomHabitDialog(false);
          }}
          onDelete={deleteHabit}
        />
      </div>
    </>
  );
}