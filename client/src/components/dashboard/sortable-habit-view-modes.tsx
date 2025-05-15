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
  getDay,
  addMonths,
  subMonths
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
import { Progress } from "@/components/ui/progress";
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
  Filter,
  ListFilter
} from 'lucide-react';

// Import Habit type
import { Habit } from '@/types/habit';

interface SortableHabitViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type
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
  
  // Function to count completed days in the current week
  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
  };
  
  // Function to check if a habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    if (habit.frequency === 'daily') {
      return countCompletedDaysInWeek(habit.id) === 7;
    } else {
      const requiredDays = parseInt(habit.frequency.split('x')[0]);
      return countCompletedDaysInWeek(habit.id) >= requiredDays;
    }
  };
  
  // Filter habits based on the selected category
  const filteredHabits = filterCategory === "all" 
    ? habits 
    : habits.filter(habit => habit.category === filterCategory);
  
  // Extract unique categories from habits
  const categories = Array.from(new Set(habits.map(habit => habit.category)));
  
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
      
      // Map the reordered filtered habits back to their original positions in the full habits array
      const reorderedHabits = [...habits];
      
      reorderedFilteredHabits.forEach((habit, newFilteredIndex) => {
        const oldFullIndex = reorderedHabits.findIndex(h => h.id === habit.id);
        if (oldFullIndex !== -1) {
          reorderedHabits[oldFullIndex] = habit;
        }
      });
      
      // Call the onReorderHabits callback with the new order
      onReorderHabits(reorderedHabits);
    }
  };

  return (
    <div className="space-y-6 mb-6">
      {/* View mode switcher */}
      <div className="flex items-center space-x-2">
        <div className="flex border rounded-lg overflow-hidden">
          <Button 
            onClick={() => setViewMode("daily")} 
            variant={viewMode === "daily" ? "default" : "outline"}
            className="rounded-none"
          >
            <ListFilter className="h-4 w-4 mr-1" />
            Daily
          </Button>
          <Button 
            onClick={() => setViewMode("weekly")} 
            variant={viewMode === "weekly" ? "default" : "outline"}
            className="rounded-none"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Weekly
          </Button>
          <Button 
            onClick={() => setViewMode("monthly")} 
            variant={viewMode === "monthly" ? "default" : "outline"}
            className="rounded-none"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Monthly
          </Button>
        </div>
        
        {/* Filter dropdown */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {filterCategory === "all" ? "All Categories" : filterCategory}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category} 
                  onClick={() => setFilterCategory(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Add habit button */}
        <Button onClick={onAddHabit}>
          <Plus className="h-4 w-4 mr-1" />
          Add Habit
        </Button>
      </div>
      
      {/* Daily view */}
      {viewMode === "daily" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="text-center mb-4">
            <div className="text-xl font-bold">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-sm text-muted-foreground">
              Today's habit tracker
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
              {filterCategory === "all" ? (
                <div className="space-y-4">
                  {/* Absolute habits section */}
                  {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
                      Absolute Daily Habits
                    </div>
                  )}
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <SortableHabit
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                        currentDate={new Date()}
                      />
                    </div>
                  ))}
                  
                  {/* Frequency habits section */}
                  {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mt-4 mb-2 px-2 py-1 bg-sky-50 rounded-md text-sky-700">
                      Frequency-Based Habits
                    </div>
                  )}
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <SortableHabit
                        habit={habit}
                        completions={completions}
                        onToggleCompletion={(habitId, date) => onToggleHabit(habitId, date)}
                        onEdit={handleEditHabit}
                        onDelete={handleDeleteHabit}
                        currentDate={new Date()}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // For other filter categories, show normally
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
                    </div>
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Weekly view */}
      {viewMode === "weekly" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(prev => prev - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <div className="text-xl font-bold">
                {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
              </div>
              <div className="text-sm text-muted-foreground">
                Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(prev => prev + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sortable habit list - weekly view */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredHabits.map(habit => habit.id)}
              strategy={verticalListSortingStrategy}
            >
              {filterCategory === "all" ? (
                <div className="space-y-4">
                  {/* Absolute habits section */}
                  {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
                      Absolute Daily Habits
                    </div>
                  )}
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {countCompletedDaysInWeek(habit.id)}/7 days
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDates.map((date, i) => {
                          const isCompleted = isHabitCompletedOnDate(habit.id, date);
                          const isPast = isBefore(date, startOfToday());
                          const isFuture = isAfter(date, endOfToday());
                          const isToday = isSameDay(date, today);
                          
                          return (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className={`p-2 h-12 w-full ${
                                isCompleted 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600' 
                                  : isToday
                                    ? 'border-blue-300 bg-blue-50'
                                    : ''
                              }`}
                              onClick={() => onToggleHabit(habit.id, date)}
                            >
                              <div className="flex flex-col items-center text-xs">
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'EEE')}
                                </div>
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'd')}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditHabit(habit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHabit(habit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Frequency habits section */}
                  {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mt-4 mb-2 px-2 py-1 bg-sky-50 rounded-md text-sky-700">
                      Frequency-Based Habits
                    </div>
                  )}
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {countCompletedDaysInWeek(habit.id)}/{habit.frequency.split('x')[0]} days
                          <Badge className="ml-2" variant={hasMetWeeklyFrequency(habit) ? "success" : "outline"}>
                            {hasMetWeeklyFrequency(habit) ? 'Goal Met' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDates.map((date, i) => {
                          const isCompleted = isHabitCompletedOnDate(habit.id, date);
                          const isPast = isBefore(date, startOfToday());
                          const isFuture = isAfter(date, endOfToday());
                          const isToday = isSameDay(date, today);
                          
                          return (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className={`p-2 h-12 w-full ${
                                isCompleted 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600' 
                                  : isToday
                                    ? 'border-blue-300 bg-blue-50'
                                    : ''
                              }`}
                              onClick={() => onToggleHabit(habit.id, date)}
                            >
                              <div className="flex flex-col items-center text-xs">
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'EEE')}
                                </div>
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'd')}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditHabit(habit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHabit(habit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHabits.map(habit => (
                    <div key={habit.id} className="p-3 rounded-lg border">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {countCompletedDaysInWeek(habit.id)}/{habit.frequency === 'daily' ? '7' : habit.frequency.split('x')[0]} days
                          {!habit.isAbsolute && (
                            <Badge className="ml-2" variant={hasMetWeeklyFrequency(habit) ? "success" : "outline"}>
                              {hasMetWeeklyFrequency(habit) ? 'Goal Met' : 'In Progress'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDates.map((date, i) => {
                          const isCompleted = isHabitCompletedOnDate(habit.id, date);
                          const isPast = isBefore(date, startOfToday());
                          const isFuture = isAfter(date, endOfToday());
                          const isToday = isSameDay(date, today);
                          
                          return (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className={`p-2 h-12 w-full ${
                                isCompleted 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600' 
                                  : isToday
                                    ? 'border-blue-300 bg-blue-50'
                                    : ''
                              }`}
                              onClick={() => onToggleHabit(habit.id, date)}
                            >
                              <div className="flex flex-col items-center text-xs">
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'EEE')}
                                </div>
                                <div className={isToday ? 'font-bold' : ''}>
                                  {format(date, 'd')}
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditHabit(habit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHabit(habit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      )}
      
      {/* Monthly view */}
      {viewMode === "monthly" && (
        <div className="bg-white rounded-lg border p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMonthOffset(prev => prev - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-xl font-bold">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setMonthOffset(prev => prev + 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-1 text-center">
              View habit completion for the entire month
            </div>
          </div>
          
          {/* Monthly calendar view */}
          <div className="mb-6">
            {/* Calendar header - days of week */}
            <div className="grid grid-cols-7 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-medium text-sm py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays().map((day, index) => {
                const isCurrentMonth = day ? day.getMonth() === currentMonth.getMonth() : false;
                const isToday = day ? isSameDay(day, today) : false;
                
                // Filter completions for this day
                const dayCompletions = day ? completions.filter(c => 
                  isSameDay(new Date(c.date), day) && c.completed
                ) : [];
                
                // Calculate completion stats for this day
                const absoluteHabits = filteredHabits.filter(h => h.isAbsolute);
                const absoluteCompletions = day ? dayCompletions.filter(c => 
                  absoluteHabits.some(h => h.id === c.habitId)
                ).length : 0;
                
                const frequencyHabits = filteredHabits.filter(h => !h.isAbsolute);
                const frequencyCompletions = day ? dayCompletions.filter(c => 
                  frequencyHabits.some(h => h.id === c.habitId)
                ).length : 0;
                
                // Color coding for completion status
                let absoluteColor = 'bg-gray-200';
                if (absoluteHabits.length > 0) {
                  const completion = absoluteCompletions / absoluteHabits.length;
                  if (completion === 1) absoluteColor = 'bg-green-500';
                  else if (completion > 0) absoluteColor = 'bg-yellow-400';
                }
                
                let frequencyColor = 'bg-gray-200';
                if (frequencyHabits.length > 0) {
                  const completion = frequencyCompletions / frequencyHabits.length;
                  if (completion > 0.5) frequencyColor = 'bg-green-500';
                  else if (completion > 0) frequencyColor = 'bg-yellow-400';
                }
                
                return (
                  <div
                    key={day ? day.toISOString() : `empty-${index}`}
                    className={`
                      p-2 aspect-square border rounded-md flex flex-col
                      ${!day ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}
                      ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                      ${isCurrentMonth ? '' : 'text-gray-400'}
                    `}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <div className={`font-medium ${isToday ? 'text-blue-700' : ''}`}>
                            {format(day, 'd')}
                          </div>
                          {dayCompletions.length > 0 && (
                            <div className="flex space-x-1">
                              {absoluteHabits.length > 0 && (
                                <div className={`w-2 h-2 rounded-full ${absoluteColor}`} />
                              )}
                              {frequencyHabits.length > 0 && (
                                <div className={`w-2 h-2 rounded-full ${frequencyColor}`} />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Habit indicators */}
                        <div className="flex-1 overflow-hidden relative">
                          {day && dayCompletions.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-xs text-muted-foreground hover:underline">
                                    {dayCompletions.length}/{filteredHabits.length}
                                  </div>
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-56">
                                <div className="p-2 text-xs font-medium border-b">
                                  Habits for {format(day, 'MMM d, yyyy')}
                                </div>
                                {filteredHabits.map(habit => {
                                  const isCompleted = isHabitCompletedOnDate(habit.id, day);
                                  return (
                                    <DropdownMenuItem 
                                      key={habit.id}
                                      onClick={() => onToggleHabit(habit.id, day)}
                                      className={`flex items-center justify-between ${isCompleted ? 'bg-green-50' : ''}`}
                                    >
                                      <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${habit.isAbsolute ? 'bg-blue-500' : 'bg-purple-500'} ${isCompleted ? 'opacity-100' : 'opacity-30'}`} />
                                        {habit.title}
                                        {habit.isAbsolute && <Badge variant="outline" className="ml-2 text-[9px]">ABSOLUTE</Badge>}
                                      </div>
                                      {isCompleted ? <Check className="h-3 w-3 text-green-600" /> : null}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Monthly Stats Summary */}
          <div className="mt-8">
            <div className="text-sm font-medium mb-3">Monthly Habit Completion Summary</div>
            
            <div className="space-y-4">
              {/* Absolute Habits */}
              {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
                <div>
                  <div className="text-sm font-medium px-2 py-1 bg-blue-50 rounded text-blue-700 mb-3">
                    Absolute Daily Habits
                  </div>
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => {
                    const daysInMonth = monthDays.length;
                    const completedDays = completions.filter(
                      c => c.habitId === habit.id && 
                      c.completed &&
                      new Date(c.date).getMonth() === currentMonth.getMonth()
                    ).length;
                    
                    const completionRate = Math.round((completedDays / daysInMonth) * 100);
                    
                    return (
                      <div key={habit.id} className="p-3 rounded-lg border mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{habit.title}</div>
                          <Badge variant={completionRate >= 80 ? "success" : completionRate >= 50 ? "warning" : "destructive"}>
                            {completionRate}%
                          </Badge>
                        </div>
                        <Progress value={completionRate} className="h-2 mb-1" />
                        <div className="text-xs text-muted-foreground">
                          {completedDays}/{daysInMonth} days completed
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Frequency-based Habits */}
              {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
                <div>
                  <div className="text-sm font-medium px-2 py-1 bg-purple-50 rounded text-purple-700 mb-3">
                    Frequency-Based Habits
                  </div>
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => {
                    const frequencyNumber = parseInt(habit.frequency.split('x')[0]);
                    const weeksInMonth = Math.ceil(monthDays.length / 7);
                    const requiredCompletions = frequencyNumber * weeksInMonth;
                    const actualCompletions = completions.filter(
                      c => c.habitId === habit.id && 
                      c.completed &&
                      new Date(c.date).getMonth() === currentMonth.getMonth()
                    ).length;
                    
                    const completionRate = Math.round((actualCompletions / requiredCompletions) * 100);
                    
                    return (
                      <div key={habit.id} className="p-3 rounded-lg border mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{habit.title}</div>
                          <Badge variant={completionRate >= 80 ? "success" : completionRate >= 50 ? "warning" : "destructive"}>
                            {completionRate}%
                          </Badge>
                        </div>
                        <Progress value={completionRate} className="h-2 mb-1" />
                        <div className="text-xs text-muted-foreground">
                          {actualCompletions}/{requiredCompletions} times ({getFrequencyLabel(habit.frequency)})
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};