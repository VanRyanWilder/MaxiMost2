import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { 
  format, 
  addDays, 
  startOfWeek, 
  subDays, 
  isSameDay, 
  isBefore, 
  isAfter,
  startOfToday,
  endOfToday
} from 'date-fns';
import { iconMap as habitIconMap, colorSchemes } from "@/components/dashboard/edit-habit-dialog";
import { 
  Activity, 
  AlertTriangle,
  Apple,
  BookOpen,
  Brain,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell, 
  Footprints,
  ListChecks,
  Pencil,
  Plus,
  PlusCircle, 
  Star,
  Trophy,
  X,
  Zap
} from 'lucide-react';

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
function getIconComponent(iconName: string, iconColor?: string, className: string = "h-4 w-4") {
  // Get color scheme classes
  const colorScheme = iconColor ? 
    colorSchemes.find(c => c.id === iconColor) : 
    { primary: "text-slate-600", bg: "bg-slate-100" };
  
  // If the icon exists in our shared icon map from edit-habit-dialog
  if (habitIconMap[iconName]) {
    const IconComponent = habitIconMap[iconName].component;
    return <IconComponent className={`${className} ${colorScheme?.primary || ""}`} />;
  }
  
  // Fallback icons for backward compatibility
  const fallbackMap: Record<string, React.ReactNode> = {
    activity: <Activity className={`${className} ${colorScheme?.primary || ""}`} />,
    "book-open": <BookOpen className={`${className} ${colorScheme?.primary || ""}`} />,
    apple: <Apple className={`${className} ${colorScheme?.primary || ""}`} />,
    star: <Star className={`${className} ${colorScheme?.primary || ""}`} />,
    "check-square": <CheckSquare className={`${className} ${colorScheme?.primary || ""}`} />,
  };
  
  // Return from fallback map or default to activity icon
  return fallbackMap[iconName.toLowerCase()] || <Activity className={`${className} ${colorScheme?.primary || ""}`} />;
}

export default function SortableDashboard() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate dates for the week
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });

  // Handle drag end events for reordering habits
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setHabits((habits) => {
        const oldIndex = habits.findIndex(h => h.id === active.id);
        const newIndex = habits.findIndex(h => h.id === over.id);
        
        const reorderedHabits = arrayMove(habits, oldIndex, newIndex);
        
        // Persist the order in localStorage
        localStorage.setItem('habits', JSON.stringify(reorderedHabits));
        
        // Show a confirmation toast
        toast({
          title: "Habit order updated",
          description: "Your habits have been reordered successfully.",
          variant: "default",
        });
        
        return reorderedHabits;
      });
    }
  };

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
  const addQuickHabit = (
    title: string, 
    icon: string, 
    category: string, 
    description: string, 
    impact = 7, 
    effort = 4, 
    timeCommitment = '10 min', 
    frequency: HabitFrequency = 'daily', 
    isAbsolute?: boolean,
    iconColor?: string
  ) => {
    // Determine a suitable default color if none provided
    let defaultColor = iconColor;
    if (!defaultColor) {
      // Choose color based on category
      switch (category) {
        case 'health': defaultColor = 'green'; break;
        case 'fitness': defaultColor = 'red'; break;
        case 'mind': defaultColor = 'purple'; break;
        case 'social': defaultColor = 'blue'; break;
        default: defaultColor = 'blue';
      }
    }
    
    // Determine if this is an "absolute" (daily must-do) habit based on frequency
    // if isAbsolute is explicitly provided, use that value, otherwise infer from frequency
    const shouldBeAbsolute = isAbsolute !== undefined 
      ? isAbsolute 
      : frequency === 'daily';
    
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      title,
      description,
      icon,
      iconColor: defaultColor,
      impact,
      effort,
      timeCommitment,
      frequency,
      isAbsolute: shouldBeAbsolute,
      category: category as HabitCategory,
      streak: 0,
      createdAt: new Date()
    };
    
    addHabit(newHabit);
    
    // Show a confirmation toast
    toast({
      title: "Habit Added",
      description: `"${title}" was added to your habits!`,
      variant: "default",
    });
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
            <MobileHeader pageTitle="MaxiMost Habit AI" />
            
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
                        <Activity className="w-4 h-4 text-blue-500" /> MaxiMost Habit Tracker
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
                          <span className="inline-block mx-2 text-sm font-medium">
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
                          size="sm"
                          variant="default"
                          onClick={() => setWeekOffset(0)}
                          className="h-8"
                        >
                          Today
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={createNewHabit}
                          className="h-8"
                        >
                          <PlusCircle className="mr-1 h-3.5 w-3.5" />
                          Add New Habit
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
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={absoluteHabits.map(habit => habit.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {absoluteHabits.map((habit) => (
                              <SortableHabit
                                key={habit.id}
                                habit={habit}
                                completions={completions}
                                onToggleCompletion={toggleCompletion}
                                onEdit={handleEditHabit}
                                currentDate={weekDates[0]}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                    
                    {/* Additional habits */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 px-3">
                        <div className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center text-blue-500">
                          <Plus className="h-3 w-3" />
                        </div>
                        <span className="font-medium">Weekly Goals</span>
                      </div>
                      
                      {additionalHabits.length === 0 ? (
                        <div className="text-sm text-center py-4 text-muted-foreground italic">
                          No weekly habit goals added yet. Click "Add New Habit" to create one.
                        </div>
                      ) : (
                        <DndContext 
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext 
                            items={additionalHabits.map(habit => habit.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {additionalHabits.map((habit) => (
                              <SortableHabit
                                key={habit.id}
                                habit={habit}
                                completions={completions}
                                onToggleCompletion={toggleCompletion}
                                onEdit={handleEditHabit}
                                currentDate={weekDates[0]}
                              />
                            ))}
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Bottom section - recently completed habits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-green-500" /> Suggested Habits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-start gap-2 h-auto py-2" 
                        onClick={() => addQuickHabit(
                          "Walk 10,000 steps", 
                          "footprints", 
                          "fitness", 
                          "Improve cardiovascular health and metabolism with walking",
                          7,
                          4,
                          "30 min",
                          "daily",
                          true,
                          "purple"
                        )}
                      >
                        <div className="p-1.5 rounded bg-purple-100">
                          <Footprints className="h-3.5 w-3.5 text-purple-600" />
                        </div>
                        <span className="text-sm">Walk 10,000 steps</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-start gap-2 h-auto py-2" 
                        onClick={() => addQuickHabit(
                          "Intermittent Fasting", 
                          "clock", 
                          "health", 
                          "Practice 16:8 intermittent fasting for metabolic health",
                          8,
                          6,
                          "All Day",
                          "daily",
                          true,
                          "green"
                        )}
                      >
                        <div className="p-1.5 rounded bg-green-100">
                          <Clock className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <span className="text-sm">Intermittent Fasting</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-start gap-2 h-auto py-2" 
                        onClick={() => addQuickHabit(
                          "No Processed Sugar", 
                          "cookie", 
                          "health", 
                          "Avoid processed sugars for better health and stable energy levels",
                          9,
                          7,
                          "All Day",
                          "daily",
                          true,
                          "red"
                        )}
                      >
                        <div className="p-1.5 rounded bg-red-100">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                        </div>
                        <span className="text-sm">No Processed Sugar</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - user info and widgets */}
              <div className="space-y-6">
                {/* Daily Motivation */}
                <DailyMotivation />
                
                {/* Recommended Supplements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-blue-500" /> Quick Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Core Principles</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Explore the foundations of optimal living
                          </span>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">Mental Clarity</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Tips for improved focus and cognition
                          </span>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-2">
                            <Dumbbell className="h-4 w-4 text-red-600" />
                            <span className="font-medium">Strength Plan</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Effective resistance training protocols
                          </span>
                        </div>
                      </Button>
                      
                      <Button variant="outline" className="justify-start h-auto p-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 mb-2">
                            <Apple className="h-4 w-4 text-green-600" />
                            <span className="font-medium">Nutrition</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Strategies for optimal fueling
                          </span>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PageContainer>
        </main>
      </div>
      
      {/* Edit Habit Dialog */}
      <EditHabitDialog 
        open={editHabitDialogOpen}
        setOpen={setEditHabitDialogOpen}
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