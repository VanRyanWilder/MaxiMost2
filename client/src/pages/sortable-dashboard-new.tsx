import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditHabitDialog } from '@/components/dashboard/edit-habit-dialog';
import { SortableHabit } from "@/components/dashboard/sortable-habit";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HabitLibrary } from "@/components/dashboard/habit-library-new";
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
  Flame,
  Dumbbell,
  Brain,
  Droplets,
  BookOpen,
  Pill
} from 'lucide-react';

// Import shared types
import { Habit, HabitCompletion, HabitFrequency, HabitCategory } from "@/types/habit";

export default function SortableDashboard() {
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Habit and completion state
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "h-1",
      title: "Drink water",
      description: "Drink 8 glasses of water daily",
      icon: "droplet",
      iconColor: "blue",
      impact: 8,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 7,
      createdAt: new Date(2023, 0, 1)
    },
    {
      id: "h-2",
      title: "Read",
      description: "Read 10 pages daily",
      icon: "book-open",
      iconColor: "purple",
      impact: 9,
      effort: 4,
      timeCommitment: "15 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 5,
      createdAt: new Date(2023, 0, 5)
    },
    {
      id: "h-3",
      title: "Meditate",
      description: "Meditate for 10 minutes",
      icon: "brain",
      iconColor: "green",
      impact: 9,
      effort: 3,
      timeCommitment: "10 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 3,
      createdAt: new Date(2023, 0, 10)
    },
    {
      id: "h-4",
      title: "Exercise",
      description: "30 minutes exercise",
      icon: "dumbbell",
      iconColor: "red",
      impact: 10,
      effort: 7,
      timeCommitment: "30 min",
      frequency: "3x-week",
      isAbsolute: false,
      category: "fitness",
      streak: 2,
      createdAt: new Date(2023, 0, 15)
    },
    {
      id: "h-5",
      title: "Stretch",
      description: "Morning stretching routine",
      icon: "activity",
      iconColor: "orange",
      impact: 7,
      effort: 3,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: false,
      category: "fitness",
      streak: 0,
      createdAt: new Date(2023, 0, 20)
    }
  ]);
  
  const [completions, setCompletions] = useState<HabitCompletion[]>([
    { id: "c-1", habitId: "h-1", date: new Date(), completed: true },
    { id: "c-2", habitId: "h-2", date: new Date(), completed: true },
    { id: "c-3", habitId: "h-3", date: subDays(new Date(), 1), completed: true },
    { id: "c-4", habitId: "h-1", date: subDays(new Date(), 1), completed: true },
    { id: "c-5", habitId: "h-2", date: subDays(new Date(), 1), completed: true }
  ]);
  
  // Edit/Create habit dialog state
  const [editHabitDialogOpen, setEditHabitDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Setup drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits(habits => {
        const oldIndex = habits.findIndex(h => h.id === active.id);
        const newIndex = habits.findIndex(h => h.id === over?.id);
        
        return arrayMove(habits, oldIndex, newIndex);
      });
    }
  };
  
  // Check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      c => c.habitId === habitId && 
           c.completed && 
           isSameDay(new Date(c.date), date)
    );
  };
  
  // Toggle habit completion for a specific date
  const toggleCompletion = (habitId: string, date: Date) => {
    const existingCompletionIndex = completions.findIndex(
      c => c.habitId === habitId && isSameDay(new Date(c.date), date)
    );
    
    if (existingCompletionIndex !== -1) {
      // Toggle existing completion
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
      isAbsolute: true,
      category: 'health',
      streak: 0,
      createdAt: new Date()
    };
    
    setSelectedHabit(newHabit);
    setEditHabitDialogOpen(true);
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

  // Handle adding a habit from the library
  const handleAddFromLibrary = (habitTemplate: any) => {
    // Check if this is a habit stack with multiple habits
    if (habitTemplate.isStack && habitTemplate.habits && Array.isArray(habitTemplate.habits)) {
      // Create a copy of the habits array to prevent modifications during iteration
      const habitsToAdd = [...habitTemplate.habits];
      
      // Add all habits synchronously in a for loop instead of forEach
      for (let i = 0; i < habitsToAdd.length; i++) {
        const habitItem = habitsToAdd[i];
        
        // Generate a new unique ID for the habit
        const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}-${i}`;
        
        // Create the new habit from the template
        const newHabit = {
          id: newId,
          title: habitItem.title,
          description: habitItem.description,
          icon: habitItem.icon,
          iconColor: habitItem.iconColor,
          impact: habitItem.impact,
          effort: habitItem.effort,
          timeCommitment: habitItem.timeCommitment,
          frequency: habitItem.frequency,
          isAbsolute: habitItem.isAbsolute,
          category: habitItem.category,
          streak: 0,
          createdAt: new Date()
        };
        
        // Add it directly to the habits array
        setHabits(prevHabits => [...prevHabits, newHabit]);
      }
    } else if (habitTemplate.habits && Array.isArray(habitTemplate.habits)) {
      // It's a stack but called from an individual habit in the stack
      addHabitFromTemplate(habitTemplate);
    } else {
      // It's a single habit, add it
      addHabitFromTemplate(habitTemplate);
    }
  };
  
  // Helper function to add a single habit from a template
  const addHabitFromTemplate = (template: any) => {
    // Generate a new unique ID for the habit
    const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a new habit from the template
    const newHabit: Habit = {
      id: newId,
      title: template.title,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor,
      impact: template.impact,
      effort: template.effort,
      timeCommitment: template.timeCommitment,
      frequency: template.frequency,
      isAbsolute: template.isAbsolute,
      category: template.category,
      streak: 0,
      createdAt: new Date()
    };
    
    // Add the new habit to the list
    addHabit(newHabit);
    
    // Show success feedback
    console.log('Added habit from library:', newHabit.title);
  };

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
            
            {/* Two-column layout for desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Main content */}
              <div className="flex-1">
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </Button>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="font-medium">
                        {format(currentDate, 'EEEE, MMMM d')}
                      </span>
                    </div>
                    <Button variant="outline" size="icon" onClick={goToNextDay}>
                      <span className="sr-only">Next day</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
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
                            onDelete={deleteHabit}
                            currentDate={currentDate}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                    
                    {absoluteHabits.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No daily absolute habits added yet.</p>
                        <p className="text-sm">These are your non-negotiable habits that you commit to doing every day.</p>
                        <Button onClick={handleCreateHabit} variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Your First Absolute Habit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Additional Habits Section */}
                <Card className="mb-6">
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
                            onDelete={deleteHabit}
                            currentDate={currentDate}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                    
                    {additionalHabits.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No additional habits added yet.</p>
                        <p className="text-sm">These are habits you're working on implementing but aren't daily necessities.</p>
                        <Button onClick={handleCreateHabit} variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Your First Additional Habit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column - Additional features */}
              <div className="w-full lg:w-80 space-y-6">
                {/* Daily Motivation Card */}
                <DailyMotivation />
                
                {/* Habit Library Card */}
                <HabitLibrary onAddHabit={handleAddFromLibrary} />
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
        onSave={(updatedHabit) => {
          if (habits.some(h => h.id === updatedHabit.id)) {
            editHabit(updatedHabit);
          } else {
            addHabit(updatedHabit);
          }
        }}
      />
    </>
  );
}