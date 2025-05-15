import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  isSameDay
} from 'date-fns';
import { 
  Activity, 
  CheckSquare,
  Calendar,
  Plus,
  Zap,
  Flame
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
    iconColor: 'blue',
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
    iconColor: 'purple',
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
    iconColor: 'indigo',
    impact: 9,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 15,
    createdAt: new Date(Date.now() - 86400000 * 45) // 45 days ago
  },
  {
    id: 'h4',
    title: 'Resistance Training',
    description: 'Build and maintain muscle mass and strength',
    icon: 'dumbbell',
    iconColor: 'green',
    impact: 10,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 4,
    createdAt: new Date(Date.now() - 86400000 * 60) // 60 days ago
  },
  {
    id: 'h5',
    title: 'Take Supplements',
    description: 'Daily vitamin and mineral supplementation',
    icon: 'pill',
    iconColor: 'amber',
    impact: 6,
    effort: 1,
    timeCommitment: '1 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'health',
    streak: 32,
    createdAt: new Date(Date.now() - 86400000 * 32) // 32 days ago
  },
  {
    id: 'h6',
    title: 'Stretch/Mobility',
    description: 'Maintain flexibility and prevent injuries',
    icon: 'activity',
    iconColor: 'teal',
    impact: 8,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'fitness',
    streak: 3,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  }
];

const initialCompletions: HabitCompletion[] = [
  // Add some sample completions for today and past days
  {
    id: 'c1',
    habitId: 'h1',
    date: new Date(),
    completed: true
  },
  {
    id: 'c2',
    habitId: 'h2',
    date: new Date(),
    completed: true
  },
  {
    id: 'c3',
    habitId: 'h5',
    date: new Date(),
    completed: true
  }
];

export default function SortableDashboard() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  
  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end event to reorder habits
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Toggle habit completion for the selected date
  const toggleCompletion = (habitId: string, date: Date) => {
    // Check if we already have a completion for this habit on this date
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(new Date(c.date), date)
    );
    
    if (existingCompletionIndex >= 0) {
      // Toggle the existing completion
      const updatedCompletions = [...completions];
      updatedCompletions[existingCompletionIndex] = {
        ...updatedCompletions[existingCompletionIndex],
        completed: !updatedCompletions[existingCompletionIndex].completed
      };
      setCompletions(updatedCompletions);
    } else {
      // Create a new completion
      const newCompletion: HabitCompletion = {
        id: `c-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
        habitId,
        date,
        completed: true
      };
      setCompletions([...completions, newCompletion]);
    }
  };
  
  // Add a new habit
  const addHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };
  
  // Edit an existing habit
  const editHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h));
  };
  
  // Delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
    setCompletions(completions.filter(c => c.habitId !== habitId));
  };
  
  // Shortcut to open edit dialog for a habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditHabitDialogOpen(true);
  };
  
  // Open dialog to create a new habit
  const handleCreateHabit = () => {
    const frequency: HabitFrequency = 'daily'; 
    
    const newHabit: Habit = {
      id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: '',
      description: '',
      icon: 'check-square',
      iconColor: 'blue',
      impact: 5,
      effort: 5,
      timeCommitment: '5 min',
      frequency,
      isAbsolute: frequency === 'daily',
      category: 'health',
      streak: 0,
      createdAt: new Date()
    };
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
  };
  
  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      c => c.habitId === habitId && 
           isSameDay(new Date(c.date), date) && 
           c.completed
    );
  };
  
  // Calculate whether a habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const lastWeekCompletions = completions.filter(
      c => c.habitId === habit.id && 
           c.completed && 
           new Date(c.date) >= subDays(new Date(), 7)
    );
    
    const targetDays = habit.frequency === 'daily' ? 7 : 
                     habit.frequency === '2x-week' ? 2 :
                     habit.frequency === '3x-week' ? 3 :
                     habit.frequency === '4x-week' ? 4 : 
                     habit.frequency === '5x-week' ? 5 :
                     habit.frequency === '6x-week' ? 6 : 1;
                     
    return lastWeekCompletions.length >= targetDays;
  };
  
  // Navigate to previous/next day
  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };
  
  // Get absolute (must-do) and additional habits
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const additionalHabits = habits.filter(h => !h.isAbsolute);

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main content area */}
        <main className="flex-1">
          <PageContainer>
            {/* Mobile Header */}
            <MobileHeader onMenuClick={() => setIsSidebarOpen(true)} />
            
            {/* Progress Summary */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-6">
              {/* Progress Cards */}
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Zap className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion %</p>
                    <p className="text-2xl font-bold">75</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Habits</p>
                    <p className="text-2xl font-bold">{habits.length}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Streak</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Date selector and add habit button */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                  <span className="sr-only">Previous day</span>
                  <Calendar className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {format(currentDate, 'EEEE, MMMM d')}
                </span>
                <Button variant="outline" size="icon" onClick={goToNextDay}>
                  <span className="sr-only">Next day</span>
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={handleCreateHabit} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Habit
              </Button>
            </div>
            
            {/* Daily Habits Section */}
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Daily Absolute Habits
                  <Badge variant="outline" className="ml-2 font-normal">
                    {absoluteHabits.length} habits
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                  <div className="px-3">Habit</div>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date(currentDate);
                    date.setDate(date.getDate() + i);
                    return (
                      <div key={i} className="text-center">
                        {format(date, 'EEE')}
                        <span className="block">{format(date, 'd')}</span>
                      </div>
                    );
                  })}
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={absoluteHabits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {absoluteHabits.map(habit => (
                      <SortableHabit
                        key={habit.id}
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={toggleCompletion}
                        onEdit={handleEditHabit}
                        currentDate={currentDate}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
            
            {/* Additional Habits Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Additional Habits
                  <Badge variant="outline" className="ml-2 font-normal">
                    {additionalHabits.length} habits
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                  <div className="px-3">Habit</div>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = new Date(currentDate);
                    date.setDate(date.getDate() + i);
                    return (
                      <div key={i} className="text-center">
                        {format(date, 'EEE')}
                        <span className="block">{format(date, 'd')}</span>
                      </div>
                    );
                  })}
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={additionalHabits.map(h => h.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {additionalHabits.map(habit => (
                      <SortableHabit
                        key={habit.id}
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={toggleCompletion}
                        onEdit={handleEditHabit}
                        currentDate={currentDate}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
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
        onDelete={(habitId) => {
          deleteHabit(habitId);
          setEditHabitDialogOpen(false);
        }}
      />
    </>
  );
}