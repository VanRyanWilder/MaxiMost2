import React, { useState } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  subDays,
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
import { WeeklyTableViewFixedUpdated } from './weekly-table-view-fixed-updated';
import { WeeklyTableViewFixedColor } from './weekly-table-view-fixed-color';
import { WeeklyTableViewImproved } from './weekly-table-view-improved';
import { MonthlyCalendarGrid } from './monthly-calendar-grid';
import { WeeklyTableViewColor } from './weekly-table-view-color';
import { DailyViewFixedUpdated } from './daily-view-fixed-updated';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { SortableHabit } from './sortable-habit';
import { TableSortableItem } from './table-sortable-item';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, MoreHorizontal, Calendar, CalendarDays, Grid, Grid3X3, Filter, Check, Circle, CheckCircle2 } from "lucide-react";
import { Habit } from '@/types/habit';
import { getHabitIcon } from '@/components/ui/icons';
import { PlusCircle } from 'lucide-react';

interface SortableHabitViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type
  onToggleHabit: (habitId: string, date: Date) => void;
  onOpenAddHabitDialog: () => void; // Changed to be more explicit
  onUpdateHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  onEditHabit?: (habit: Habit) => void;
}

export const SortableHabitViewModesFixed: React.FC<SortableHabitViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onOpenAddHabitDialog, // Renamed for clarity 
  onUpdateHabit,
  onDeleteHabit,
  onReorderHabits,
  onEditHabit,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dayOffset, setDayOffset] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Calculate current date based on offsets
  const today = new Date();
  
  // Calculate current day (affected by dayOffset)
  const currentDay = dayOffset === 0 
    ? today 
    : dayOffset > 0 
      ? addDays(today, dayOffset)
      : subDays(today, Math.abs(dayOffset));
  
  // Calculate which week the current day belongs to
  const currentDayWeek = startOfWeek(currentDay, { weekStartsOn: 1 });
  
  // Calculate current week based on both day and week offsets
  const startOfCurrentWeek = addDays(currentDayWeek, weekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // Calculate current month
  const currentMonth = addMonths(today, monthOffset);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const firstDayOfGrid = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const lastDayOfGrid = addDays(
    endOfMonth(currentMonth),
    7 - getDay(endOfMonth(currentMonth)) === 0 ? 7 : getDay(endOfMonth(currentMonth))
  );
  const calendarDays = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });
  
  // Filter habits based on category
  const filteredHabits = filterCategory === 'all' 
    ? habits 
    : filterCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : filterCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits.filter(h => h.category === filterCategory);
  
  // For completed status
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date) &&
      completion.completed
    );
  };
  
  // Get appropriate frequency text
  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case '2x-week': return '2x / week';
      case '3x-week': return '3x / week';
      case '4x-week': return '4x / week';
      case '5x-week': return '5x / week';
      case '6x-week': return '6x / week';
      case 'weekly': return 'Weekly';
      default: return frequency;
    }
  };
  
  // For edit habit dialog
  const handleEditHabit = (habit: Habit) => {
    console.log("SortableHabitViewModes - Edit habit clicked:", habit);
    
    // Use the parent component's edit handler
    if (onEditHabit) {
      onEditHabit(habit);
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };
  
  const handleCreateHabit = () => {
    // Call parent component function to show dialog
    onOpenAddHabitDialog();
    console.log("Triggering enhanced add habit dialog from sortable habit view");
  };
  
  // DnD handlers
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
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find indices in the filtered habits array
      const activeIndex = filteredHabits.findIndex(h => h.id === active.id);
      const overIndex = filteredHabits.findIndex(h => h.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // First reorder in the filtered array
        const newFilteredHabits = arrayMove(filteredHabits, activeIndex, overIndex);
        
        // Then update the entire habits array while preserving the order of non-filtered habits
        const allReorderedHabits = [...habits];
        
        // Find indices in the full habits array
        const oldIndexInAllHabits = habits.findIndex(h => h.id === active.id);
        const newIndexInAllHabits = habits.findIndex(h => h.id === over.id);
        
        const [movedHabit] = allReorderedHabits.splice(oldIndexInAllHabits, 1);
        allReorderedHabits.splice(newIndexInAllHabits, 0, movedHabit);
        
        onReorderHabits(allReorderedHabits);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="join">
              <Button
                variant={viewMode === "daily" ? "default" : "outline"}
                className={viewMode === "daily" ? "bg-blue-600 hover:bg-blue-700" : ""}
                size="sm"
                onClick={() => setViewMode("daily")}
              >
                <Calendar className="h-4 w-4 mr-1" /> Daily
              </Button>
              <Button
                variant={viewMode === "weekly" ? "default" : "outline"}
                className={viewMode === "weekly" ? "bg-blue-600 hover:bg-blue-700" : ""}
                size="sm"
                onClick={() => setViewMode("weekly")}
              >
                <CalendarDays className="h-4 w-4 mr-1" /> Weekly
              </Button>
              <Button
                variant={viewMode === "monthly" ? "default" : "outline"}
                className={viewMode === "monthly" ? "bg-blue-600 hover:bg-blue-700" : ""}
                size="sm"
                onClick={() => setViewMode("monthly")}
              >
                <Grid3X3 className="h-4 w-4 mr-1" /> Monthly
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  {filterCategory === 'all' ? 'All Categories' : 
                   filterCategory === 'absolute' ? 'Absolute Habits' :
                   filterCategory === 'frequency' ? 'Frequency Habits' : 
                   filterCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('absolute')}>
                  Absolute Habits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('frequency')}>
                  Frequency
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleCreateHabit} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" /> Add Habit
            </Button>
          </div>
        </div>

        {/* Daily view */}
        {viewMode === "daily" && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Daily View</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDayOffset(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDayOffset(0)}
                >
                  Today
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setDayOffset(prev => prev + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {format(currentDay, 'MMM d, yyyy')}
            </div>
            {habits.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No habits yet. Add some from the Habit Library.</p>
              </div>  
            ) : (
              <DailyViewFixedUpdated
                habits={filteredHabits}
                completions={completions}
                currentDay={currentDay}
                onToggleHabit={onToggleHabit}
                onAddHabit={onOpenAddHabitDialog}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
                onReorderHabits={onReorderHabits}
                filterCategory={filterCategory}
              />
            )}
          </div>
        )}
      
        {/* Weekly view */}
        {viewMode === "weekly" && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Weekly View</h3>
              <div className="flex items-center space-x-2">
                {/* Week navigation */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWeekOffset(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWeekOffset(0)}
                >
                  This Week
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWeekOffset(prev => prev + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
            </div>
            
            {habits.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No habits yet. Add some from the Habit Library.</p>
              </div>  
            ) : (
              <WeeklyTableViewFixedUpdated
                habits={filteredHabits}
                completions={completions}
                weekDates={weekDates}
                onToggleHabit={onToggleHabit}
                onAddHabit={onOpenAddHabitDialog}
                onEditHabit={handleEditHabit}
                onDeleteHabit={handleDeleteHabit}
                onReorderHabits={onReorderHabits}
                selectedCategory={filterCategory}
                currentDay={currentDay}
              />
            )}
          </div>
        )}
        
        {/* Monthly view */}
        {viewMode === "monthly" && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Monthly View - {format(currentMonth, 'MMMM yyyy')}</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setMonthOffset(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setMonthOffset(0)}
                >
                  This Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setMonthOffset(prev => prev + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            {habits.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No habits yet. Add some from the Habit Library.</p>
              </div>  
            ) : (
              <MonthlyCalendarGrid
                habits={filteredHabits}
                completions={completions}
                currentMonth={currentMonth}
                onToggleHabit={onToggleHabit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};