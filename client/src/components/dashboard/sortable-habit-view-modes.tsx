import React, { useState } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  isSameDay, 
  isBefore, 
  isAfter, 
  startOfToday, 
  endOfToday, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay 
} from 'date-fns';
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
import { SortableHabit } from './sortable-habit';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  ChevronDown,
  CalendarDays,
  Zap,
  Award,
  Star
} from 'lucide-react';

// Import habit types
import type { Habit } from '@/types/habit';
import type { HabitCompletion } from '@/types/habit-completion';

// Function to get icon component based on icon string
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    activity: <Activity className="h-4 w-4" />,
    calendar: <Calendar className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
    award: <Award className="h-4 w-4" />,
    // Add more icons as needed
  };

  return iconMap[iconName.toLowerCase()] || <Activity className="h-4 w-4" />;
}

// Interface for the component props
interface SortableHabitViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onUpdateHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  onEditHabit?: (habit: Habit) => void;
}

export const SortableHabitViewModes: React.FC<SortableHabitViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onReorderHabits,
  onEditHabit
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Generate dates for the week and month
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });

  // Get current month for the monthly view
  const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get all days in the current month
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Create calendar grid (with empty cells for proper grid alignment)
  const calendarDays = () => {
    const firstDayOfMonth = getDay(monthStart);
    
    // Add empty cells before the first day (Sunday is 0)
    const emptyDaysBefore = Array(firstDayOfMonth).fill(null);
    
    // Create the full calendar grid
    return [...emptyDaysBefore, ...monthDays];
  };

  // Function to check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date) && 
      c.completed
    );
  };

  // Filter habits based on selected category
  let filteredHabits = [...habits];
  
  if (filterCategory === "absolute") {
    filteredHabits = habits.filter(h => h.isAbsolute);
  } else if (filterCategory === "frequency") {
    filteredHabits = habits.filter(h => !h.isAbsolute);
  } else if (filterCategory !== "all") {
    filteredHabits = habits.filter(h => h.category === filterCategory);
  } else {
    // For "All Categories", sort so absolute habits appear first
    filteredHabits = [
      ...habits.filter(h => h.isAbsolute),
      ...habits.filter(h => !h.isAbsolute)
    ];
  }

  // Count completed habits for today
  const todayCompletedCount = habits.filter(h => 
    isHabitCompletedOnDate(h.id, new Date())
  ).length;

  // Count total absolute habits
  const absoluteHabitsCount = habits.filter(h => h.isAbsolute).length;

  // Function to check if a habit has met its weekly frequency goal
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    // For daily habits, check if completed every day this week
    if (habit.frequency === 'daily') {
      return weekDates.every(date => isHabitCompletedOnDate(habit.id, date));
    }
    
    // For X-per-week habits, extract the number from the frequency string
    const frequencyMatch = habit.frequency.match(/(\d+)x-week/);
    if (!frequencyMatch) return false;
    
    const targetFrequency = parseInt(frequencyMatch[1], 10);
    const completedDaysThisWeek = weekDates.filter(date => 
      isHabitCompletedOnDate(habit.id, date)
    ).length;
    
    return completedDaysThisWeek >= targetFrequency;
  };

  // Handle editing a habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    // Use the onEditHabit prop if available, otherwise fallback to onUpdateHabit
    if (onEditHabit) {
      onEditHabit(habit);
    } else if (onUpdateHabit) {
      onUpdateHabit(habit);
    }
  };

  // Handle saving a habit after editing
  const handleSaveHabit = (updatedHabit: Habit) => {
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabit);
    }
    setSelectedHabit(null);
  };

  // Handle deleting a habit
  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };

  // Helper to get a more readable frequency label
  function getFrequencyLabel(frequency: string): string {
    switch (frequency) {
      case 'daily': return 'Every day';
      case '2x-week': return '2 times per week';
      case '3x-week': return '3 times per week';
      case '4x-week': return '4 times per week';
      case '5x-week': return '5 times per week';
      case '6x-week': return '6 times per week';
      default: return frequency;
    }
  }

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }
    
    const oldIndex = filteredHabits.findIndex(h => h.id === active.id);
    const newIndex = filteredHabits.findIndex(h => h.id === over.id);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedFilteredHabits = arrayMove(filteredHabits, oldIndex, newIndex);
      
      // Maintain the original ordering for any habits that aren't in the filtered view
      const reorderedHabits = [...habits];
      
      // Update the positions of the habits that were reordered
      for (let i = 0; i < reorderedFilteredHabits.length; i++) {
        const habitIndex = reorderedHabits.findIndex(h => h.id === reorderedFilteredHabits[i].id);
        if (habitIndex !== -1) {
          reorderedHabits[habitIndex] = reorderedFilteredHabits[i];
        }
      }
      
      onReorderHabits(reorderedHabits);
    }
  };

  return (
    <div className="space-y-6">
      {/* View mode and filter controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* View mode selector */}
          <Button
            onClick={() => setViewMode("daily")}
            variant={viewMode === "daily" ? "default" : "outline"}
            size="sm"
            className="gap-1"
          >
            <Calendar className="h-4 w-4" /> Daily
          </Button>
          <Button
            onClick={() => setViewMode("weekly")}
            variant={viewMode === "weekly" ? "default" : "outline"}
            size="sm"
            className="gap-1"
          >
            <CalendarDays className="h-4 w-4" /> Weekly
          </Button>
          <Button
            onClick={() => setViewMode("monthly")}
            variant={viewMode === "monthly" ? "default" : "outline"}
            size="sm"
            className="gap-1"
          >
            <Activity className="h-4 w-4" /> Monthly
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                {filterCategory === "all" && "All Categories"}
                {filterCategory === "absolute" && "Absolute Daily Habits"}
                {filterCategory === "frequency" && "Frequency Habits"}
                {filterCategory !== "all" && filterCategory !== "absolute" && filterCategory !== "frequency" && 
                  filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)
                }
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("absolute")}>
                Absolute Daily Habits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("frequency")}>
                Frequency Habits
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Add new habit button */}
          <Button onClick={onAddHabit} size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>
      </div>
      
      {/* Progress summary for today */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="text-sm font-medium">
          Today's progress: <span className="text-blue-600">{todayCompletedCount}</span> / {habits.length} habits completed
        </div>
        <div className="text-sm font-medium">
          <span className="text-blue-600">{absoluteHabitsCount}</span> absolute daily habits
        </div>
        <div className="text-sm font-medium">
          <span className="text-blue-600">
            {habits.filter(h => hasMetWeeklyFrequency(h)).length}
          </span> / {habits.length} weekly goals met
        </div>
      </div>
      
      {/* Week navigation (for weekly view) */}
      {viewMode === "weekly" && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset(weekOffset - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous Week
          </Button>
          
          <div className="text-sm font-medium">
            Week of {format(weekDates[0], 'MMM d')} to {format(weekDates[6], 'MMM d, yyyy')}
            {weekOffset === 0 && <span className="ml-2 text-blue-600">(Current Week)</span>}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setWeekOffset(weekOffset + 1)}
          >
            Next Week <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
      
      {/* Habit list with weekly view headers */}
      {viewMode === "weekly" && (
        <div className="bg-white rounded-lg border p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-3 pr-1">
            <div className="px-2 py-1 font-medium text-sm">Habit</div>
            {weekDates.map((date, i) => (
              <div 
                key={i} 
                className={`text-center font-medium text-xs py-1 ${
                  isSameDay(date, today) ? 'bg-blue-50 text-blue-600 rounded-md' : ''
                }`}
              >
                <div>{format(date, 'EEE')}</div>
                <div>{format(date, 'd')}</div>
              </div>
            ))}
          </div>
          
          {/* Sortable habit list */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredHabits.map(habit => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredHabits.length > 0 ? (
                <div className="space-y-1">
                  {filterCategory === "all" ? (
                    // When "All Categories" is selected, we show a separator between absolute and frequency habits
                    <>
                      {/* Absolute habits section */}
                      {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
                        <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
                          Absolute Daily Habits
                        </div>
                      )}
                      {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                        <SortableHabit
                          key={habit.id}
                          habit={habit}
                          completions={completions}
                          onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                          onEdit={handleEditHabit}
                          onDelete={handleDeleteHabit}
                          currentDate={weekDates[0]}
                        />
                      ))}
                      
                      {/* Frequency habits section */}
                      {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
                        <div className="font-medium text-sm mt-4 mb-2 px-2 py-1 bg-sky-50 rounded-md text-sky-700">
                          Frequency-Based Habits
                        </div>
                      )}
                      {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                        <SortableHabit
                          key={habit.id}
                          habit={habit}
                          completions={completions}
                          onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                          onEdit={handleEditHabit}
                          onDelete={handleDeleteHabit}
                          currentDate={weekDates[0]}
                        />
                      ))}
                    </>
                  ) : (
                    // For other filter categories, show normally
                    filteredHabits.map(habit => (
                      <SortableHabit
                        key={habit.id}
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                        currentDate={weekDates[0]}
                      />
                    ))
                  )}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No habits found. Add your first habit to get started!</p>
                  <Button onClick={onAddHabit} variant="outline" className="mt-4 gap-1">
                    <Plus className="h-4 w-4" /> Add Habit
                  </Button>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Daily view */}
      {viewMode === "daily" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="text-center mb-4">
            <div className="text-xl font-bold mb-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-sm text-muted-foreground">
              Focus on completing today's habits
            </div>
          </div>
          
          {/* Sortable habit list - daily view */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredHabits.map(habit => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredHabits.length > 0 ? (
                <div className="space-y-3">
                  {filteredHabits.map(habit => {
                    const isCompleted = isHabitCompletedOnDate(habit.id, new Date());
                    return (
                      <div 
                        key={habit.id} 
                        className={`p-3 rounded-lg border transition-all ${
                          isCompleted ? 'bg-green-50 border-green-200' : ''
                        }`}
                      >
                        <SortableHabit
                          habit={habit}
                          completions={completions}
                          onToggleCompletion={(habitId) => onToggleHabit(habitId, new Date())}
                          onEdit={handleEditHabit}
                          onDelete={handleDeleteHabit}
                          currentDate={new Date()}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No habits found. Add your first habit to get started!</p>
                  <Button onClick={onAddHabit} variant="outline" className="mt-4 gap-1">
                    <Plus className="h-4 w-4" /> Add Habit
                  </Button>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Monthly view */}
      {viewMode === "monthly" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="text-center mb-4">
            <div className="text-xl font-bold mb-1">
              {format(new Date(), 'MMMM yyyy')}
            </div>
            <div className="text-sm text-muted-foreground">
              View habit performance for the entire month
            </div>
          </div>
          
          {/* Sortable habit list - monthly view */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredHabits.map(habit => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredHabits.length > 0 ? (
                <div className="space-y-3">
                  {filteredHabits.map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <SortableHabit
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                        currentDate={new Date()}
                      />
                      <div className="mt-2 pt-2 border-t">
                        <div className="text-xs text-muted-foreground mb-1">
                          Monthly Progress: 
                          {habit.frequency === 'daily' ? (
                            <span className="ml-1">
                              {(() => {
                                const daysInMonth = new Date(
                                  today.getFullYear(), 
                                  today.getMonth() + 1, 
                                  0
                                ).getDate();
                                const completedDays = completions.filter(
                                  c => c.habitId === habit.id && 
                                  new Date(c.date).getMonth() === today.getMonth() && 
                                  c.completed
                                ).length;
                                return `${completedDays}/${daysInMonth} days (${Math.round((completedDays/daysInMonth)*100)}%)`;
                              })()}
                            </span>
                          ) : (
                            <span className="ml-1">
                              {(() => {
                                const frequencyMatch = habit.frequency.match(/(\d+)x-week/);
                                if (!frequencyMatch) return 'N/A';
                                
                                const targetFrequency = parseInt(frequencyMatch[1], 10);
                                const weeksInMonth = 4; // Approximation
                                const targetCompletions = targetFrequency * weeksInMonth;
                                
                                const completedDays = completions.filter(
                                  c => c.habitId === habit.id && 
                                  new Date(c.date).getMonth() === today.getMonth() && 
                                  c.completed
                                ).length;
                                
                                return `${completedDays}/${targetCompletions} times (${Math.round((completedDays/targetCompletions)*100)}%)`;
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground">No habits found. Add your first habit to get started!</p>
                  <Button onClick={onAddHabit} variant="outline" className="mt-4 gap-1">
                    <Plus className="h-4 w-4" /> Add Habit
                  </Button>
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};