import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { useUser } from "@/context/user-context";
import { format, addDays, startOfWeek, subDays, isSameDay, isBefore, isAfter } from 'date-fns';
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
  CheckSquare,
  MoreHorizontal,
  Check,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

// Sample data
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
    title: 'Read 10 Pages',
    description: 'Daily reading for continuous learning and growth',
    icon: 'book-open',
    impact: 7,
    effort: 4,
    timeCommitment: '15 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 8,
    createdAt: new Date(Date.now() - 86400000 * 15) // 15 days ago
  },
  {
    id: 'h3',
    title: 'Meditate',
    description: 'Mindfulness practice for mental clarity and stress reduction',
    icon: 'brain',
    impact: 9,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 3,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  },
  {
    id: 'h4',
    title: 'Strength Training',
    description: 'Build muscle, increase metabolism, and improve overall fitness',
    icon: 'dumbbell',
    impact: 8,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
  },
  {
    id: 'h5',
    title: 'Journal',
    description: 'Document thoughts and growth for reflection and self-awareness',
    icon: 'pencil',
    impact: 6,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
    streak: 0,
    createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
  }
];

// Dummy completion data
const initialCompletions: HabitCompletion[] = [
  { id: 'c1', habitId: 'h1', date: new Date(), completed: true },
  { id: 'c2', habitId: 'h2', date: new Date(), completed: true },
  { id: 'c3', habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { id: 'c4', habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { id: 'c5', habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  { id: 'c6', habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { id: 'c7', habitId: 'h2', date: subDays(new Date(), 2), completed: true },
  { id: 'c8', habitId: 'h4', date: subDays(new Date(), 2), completed: true },
  { id: 'c9', habitId: 'h1', date: subDays(new Date(), 3), completed: true },
];

// Function to get icon component based on icon string
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    activity: <Activity className="h-4 w-4" />,
    "book-open": <BookOpen className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    brain: <Brain className="h-4 w-4" />,
    dumbbell: <Dumbbell className="h-4 w-4" />,
    droplets: <Droplets className="h-4 w-4" />,
    apple: <Apple className="h-4 w-4" />,
    pencil: <Pencil className="h-4 w-4" />,
    sun: <Sun className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
    "check-square": <CheckSquare className="h-4 w-4" />,
  };

  return iconMap[iconName.toLowerCase()] || <Activity className="h-4 w-4" />;
}

export default function Dashboard() {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Generate dates for the week
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });

  // Toggle habit completion for a specific date
  const toggleCompletion = (habitId: string, date: Date) => {
    const isCompleted = completions.some(c => 
      c.habitId === habitId && 
      isSameDay(c.date, date) && 
      c.completed
    );
    
    if (isCompleted) {
      // Remove completion if it exists
      setCompletions(completions.filter(c => 
        !(c.habitId === habitId && isSameDay(c.date, date))
      ));
    } else {
      // Add completion
      const newCompletion: HabitCompletion = {
        id: `c-${Date.now()}`,
        habitId,
        date,
        completed: true
      };
      setCompletions([...completions, newCompletion]);
    }
  };

  // Function to add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  // Function to edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };

  // Function to delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
    setCompletions(completions.filter(c => c.habitId !== habitId));
  };
  
  // Handle habit editing
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  // Function to add a quick habit from the library
  const addQuickHabit = (title: string, icon: string, category: string, description: string) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title,
      description,
      icon,
      impact: 7,
      effort: 4,
      timeCommitment: '10 min',
      frequency: 'daily' as HabitFrequency,
      isAbsolute: true,
      category: category as HabitCategory,
      streak: 0,
      createdAt: new Date()
    };
    
    addHabit(newHabit);
    
    // Show a confirmation toast or dialog here
    alert(`Added "${title}" to your habits!`);
  };

  // Function to check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date) && 
      c.completed
    );
  };

  // Function to count completed days in the current week for a habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.filter(date => isHabitCompletedOnDate(habitId, date)).length;
  };

  // Check if the habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedDays = countCompletedDaysInWeek(habit.id);
    const targetDays = habit.frequency === 'daily' ? 7 : 
                     habit.frequency === '2x-week' ? 2 :
                     habit.frequency === '3x-week' ? 3 :
                     habit.frequency === '4x-week' ? 4 : 1;
    
    return completedDays >= targetDays;
  };
  
  // Create a new habit
  const createNewHabit = () => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title: "New Habit",
      description: "Description of your new habit",
      icon: "activity",
      impact: 8,
      effort: 4,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: true,
      category: "health",
      streak: 0,
      createdAt: new Date()
    };
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
  };

  // Get absolute (must-do) and additional habits
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Main content area */}
        <main className="flex-1">
          <PageContainer>
            {/* Mobile Header */}
            <MobileHeader pageTitle="Dashboard" />
            
            {/* Profile and Stats Summary */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
              {/* Progress Cards */}
              <ProgressCard 
                number={28} 
                label="Day Streak" 
                icon={<Zap className="h-4 w-4 text-yellow-500" />} 
                tooltipText="Your current unbroken streak for completing daily habits"
              />
              
              <ProgressCard 
                number={75} 
                label="Completion %" 
                icon={<CheckSquare className="h-4 w-4 text-green-500" />}
                tooltipText="Your average habit completion rate for the last 7 days"
              />
              
              <ProgressCard 
                number={5} 
                label="Active Habits" 
                icon={<Activity className="h-4 w-4 text-blue-500" />}
                tooltipText="The number of habits you're currently tracking"
              />
              
              <ProgressCard 
                number={185} 
                label="Total Completions" 
                icon={<Trophy className="h-4 w-4 text-orange-500" />}
                tooltipText="The total number of habit completions you've logged"
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
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(weekOffset - 1)}
                            className="h-8 px-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          
                          <span className="mx-2 text-sm">
                            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(weekOffset + 1)}
                            className="h-8 px-2"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          onClick={createNewHabit}
                          className="bg-blue-500 hover:bg-blue-600"
                          size="sm"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" /> Add New Habit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-6">
                    {/* Week day header */}
                    <div className="grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2">
                      <div className="px-3 py-1 text-muted-foreground text-sm font-medium">
                        Habit
                      </div>
                      {weekDates.map((date, i) => (
                        <div 
                          key={i}
                          className={`text-center text-xs font-medium py-1 ${
                            isSameDay(date, today) ? 'text-blue-500 bg-blue-50 rounded-md' : 'text-muted-foreground'
                          }`}
                        >
                          <div>{format(date, 'EEE')}</div>
                          <div>{format(date, 'd')}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Must-do habits section */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Must-Do Habits</h3>
                      
                      {absoluteHabits.length === 0 ? (
                        <div className="text-sm text-center py-4 text-muted-foreground italic">
                          No must-do habits added yet. Click "Add New Habit" to create one.
                        </div>
                      ) : (
                        absoluteHabits.map(habit => (
                          <div key={habit.id} className="grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2">
                            <div className="flex items-center p-1.5 relative">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`p-1.5 rounded-md flex-shrink-0 ${hasMetWeeklyFrequency(habit) ? 'bg-green-100 text-green-600' : 'bg-blue-100/50 text-blue-600'}`}>
                                  {getIconComponent(habit.icon)}
                                </div>
                                <div className="min-w-0 flex flex-col">
                                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
                                    {habit.title}
                                  </span>
                                  <div className="flex items-center justify-between gap-1 mt-0.5">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 border-blue-200">
                                      {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                      {habit.streak > 0 && (
                                        <span className="inline-flex items-center">
                                          <Star className="h-2.5 w-2.5 text-amber-500 mr-0.5" /> 
                                          {habit.streak}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto opacity-70 hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Habit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => deleteHabit(habit.id)}
                                      className="text-red-600"
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete Habit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            {weekDates.map((date, i) => {
                              const completed = isHabitCompletedOnDate(habit.id, date);
                              const isPast = isBefore(date, today) && !isSameDay(date, today);
                              const isFuture = isAfter(date, today) && !isSameDay(date, today);
                              
                              return (
                                <div key={i} className="flex justify-center">
                                  <button 
                                    onClick={() => toggleCompletion(habit.id, date)}
                                    disabled={isFuture}
                                    className={`flex items-center justify-center transition-all duration-200 ease-in-out
                                      ${completed 
                                        ? 'bg-green-100 text-green-600 hover:bg-green-200 rounded-md' 
                                        : isPast 
                                          ? 'text-muted-foreground hover:bg-red-50 hover:text-red-500' 
                                          : 'text-muted-foreground/50 hover:text-blue-500 hover:bg-blue-50'
                                      } w-full h-10`}
                                  >
                                    {completed ? (
                                      <Check className="h-5 w-5" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border-2 border-current"></div>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Additional habits section */}
                    {additionalHabits.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Additional Habits</h3>
                        
                        {additionalHabits.map(habit => (
                          <div key={habit.id} className="grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2">
                            <div className="flex items-center p-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                                  {getIconComponent(habit.icon)}
                                </div>
                                <div className="min-w-0 flex flex-col">
                                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
                                    {habit.title}
                                  </span>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 border-blue-200">
                                      {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">
                                      {habit.frequency}
                                    </span>
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto opacity-70 hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit Habit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => deleteHabit(habit.id)}
                                      className="text-red-600"
                                    >
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete Habit
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            
                            {weekDates.map((date, i) => {
                              const completed = isHabitCompletedOnDate(habit.id, date);
                              const isPast = isBefore(date, today) && !isSameDay(date, today);
                              const isFuture = isAfter(date, today) && !isSameDay(date, today);
                              
                              return (
                                <div key={i} className="flex justify-center">
                                  <button 
                                    onClick={() => toggleCompletion(habit.id, date)}
                                    disabled={isFuture}
                                    className={`flex items-center justify-center transition-all duration-200 ease-in-out
                                      ${completed 
                                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md' 
                                        : isPast 
                                          ? 'text-muted-foreground hover:bg-red-50 hover:text-red-500' 
                                          : 'text-muted-foreground/50 hover:text-blue-500 hover:bg-blue-50'
                                      } w-full h-10`}
                                  >
                                    {completed ? (
                                      <Check className="h-5 w-5" />
                                    ) : (
                                      <div className="h-5 w-5 rounded-full border-2 border-current"></div>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column with habit library and other elements */}
              <div className="space-y-6">
                {/* Habit Library Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Habit Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-sm font-medium">Expert Habit Stacks</h3>
                    
                    {/* Morning Routine Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Morning Routine</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs" 
                            onClick={() => {
                              addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment");
                              addQuickHabit("Drink Water", "droplets", "health", "Hydrate first thing in the morning");
                              addQuickHabit("Meditate", "brain", "mind", "5-minute mindfulness practice");
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Sun className="text-amber-500 h-4 w-4" />
                            <span>Make your bed</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Make Bed", "sun", "health", "Start the day with a small accomplishment")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Droplets className="text-blue-500 h-4 w-4" />
                            <span>Drink 16oz water</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Drink Water", "droplets", "health", "Hydrate first thing in the morning")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Brain className="text-violet-500 h-4 w-4" />
                            <span>5-min meditation</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Meditate", "brain", "mind", "5-minute mindfulness practice")}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Huberman Lab Stack */}
                    <Card>
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Huberman Lab</CardTitle>
                          <Button 
                            variant="outline" 
                            className="h-8 text-xs" 
                            onClick={() => {
                              addQuickHabit("Morning Sunlight", "sun", "health", "Get morning sun exposure for circadian rhythm");
                              addQuickHabit("Consistent Sleep Schedule", "clock", "health", "Go to bed and wake up at consistent times");
                              addQuickHabit("Zone 2 Cardio", "activity", "fitness", "Moderate-intensity cardio for 30-45 minutes");
                            }}
                          >
                            Add All 3 Habits
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <ul className="space-y-2">
                          <li className="flex gap-2 items-center text-sm">
                            <Sun className="text-amber-500 h-4 w-4" />
                            <span>Morning sunlight</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Morning Sunlight", "sun", "health", "Get sun exposure for circadian rhythm")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Clock className="text-blue-500 h-4 w-4" />
                            <span>Consistent sleep</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Consistent Sleep", "clock", "health", "Go to bed and wake up at consistent times")}
                            >
                              Add
                            </Button>
                          </li>
                          <li className="flex gap-2 items-center text-sm">
                            <Dumbbell className="text-red-500 h-4 w-4" />
                            <span>Zone 2 cardio</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-6 px-2 text-xs"
                              onClick={() => addQuickHabit("Zone 2 Cardio", "activity", "fitness", "Moderate-intensity cardio for 30-45 minutes")}
                            >
                              Add
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-between items-center pt-2">
                      <h3 className="text-sm font-medium">Quick Add Individual Habits</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            More <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem onClick={() => addQuickHabit("Cold Shower", "brain", "mind", "Boost circulation and mental resilience")}>
                            <Brain className="mr-2 h-4 w-4 text-blue-500" /> Cold Shower
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addQuickHabit("Walk 10K Steps", "activity", "fitness", "Improve daily movement and cardiovascular health")}>
                            <Activity className="mr-2 h-4 w-4 text-green-500" /> Walk 10K Steps
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addQuickHabit("No Sugar", "apple", "health", "Avoid added sugar for better metabolic health")}>
                            <Apple className="mr-2 h-4 w-4 text-red-500" /> No Sugar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addQuickHabit("Sleep 8 Hours", "moon", "health", "Prioritize quality sleep for recovery and cognition")}>
                            <Sun className="mr-2 h-4 w-4 text-amber-500" /> Sleep 8 Hours
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addQuickHabit("Journal", "pencil", "mind", "Write thoughts and reflections for mental clarity")}>
                            <Pencil className="mr-2 h-4 w-4 text-purple-500" /> Journal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addQuickHabit("Green Smoothie", "apple", "health", "Nutrient-dense breakfast for health and energy")}>
                            <Apple className="mr-2 h-4 w-4 text-green-500" /> Green Smoothie
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        className="justify-start gap-2 text-sm" 
                        onClick={() => addQuickHabit("Drink Water", "droplets", "health", "Stay hydrated for optimal body function")}
                      >
                        <Droplets className="h-4 w-4 text-blue-500" />
                        Drink Water <Badge className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200">1.2k</Badge>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start gap-2 text-sm" 
                        onClick={() => addQuickHabit("Read", "book-open", "mind", "Daily reading for continuous growth")}
                      >
                        <BookOpen className="h-4 w-4 text-amber-500" />
                        Read <Badge className="ml-auto bg-amber-100 text-amber-700 hover:bg-amber-200">856</Badge>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start gap-2 text-sm" 
                        onClick={() => addQuickHabit("Meditate", "brain", "mind", "Mindfulness practice for clarity")}
                      >
                        <Brain className="h-4 w-4 text-violet-500" />
                        Meditate <Badge className="ml-auto bg-violet-100 text-violet-700 hover:bg-violet-200">721</Badge>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="justify-start gap-2 text-sm" 
                        onClick={() => addQuickHabit("Exercise", "dumbbell", "fitness", "Move your body for health and energy")}
                      >
                        <Dumbbell className="h-4 w-4 text-red-500" />
                        Exercise <Badge className="ml-auto bg-red-100 text-red-700 hover:bg-red-200">695</Badge>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Motivation Card */}
                <DailyMotivation />
              </div>
            </div>
          </PageContainer>
        </main>
      </div>
      
      {/* Edit Habit Dialog */}
      <EditHabitDialog
        open={editHabitDialogOpen}
        onOpenChange={setEditHabitDialogOpen}
        habit={selectedHabit}
        onSave={(habit) => {
          if (habits.some(h => h.id === habit.id)) {
            editHabit(habit);
          } else {
            addHabit(habit);
          }
          setEditHabitDialogOpen(false);
        }}
      />
    </>
  );
}