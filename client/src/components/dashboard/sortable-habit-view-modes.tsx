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
  subMonths,
  differenceInDays
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
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, MoreHorizontal, Calendar, CalendarDays, Grid, Grid3X3, Filter, Check } from "lucide-react";
import { Habit } from '@/types/habit';
import { getHabitIcon } from '@/components/ui/icons';
import { PlusCircle } from 'lucide-react';

interface SortableHabitViewProps {
  habits: Habit[]; // Each Habit object should contain its own 'completions: HabitCompletionEntry[]'
  // completions prop is removed
  onToggleHabit: (habitId: string, date: Date, value?: number) => void; // Updated signature
  onAddHabit: () => void;
  onUpdateHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  onEditHabit?: (habit: Habit) => void;
}

export const SortableHabitViewModes: React.FC<SortableHabitViewProps> = ({
  habits,
  // completions prop removed
  onToggleHabit,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onReorderHabits,
  onEditHabit,
}) => {
  // Internal viewMode state removed, as this component will now only render the "daily" view content.
  // The actual view (day, week, month) is controlled by DashboardPage.tsx.
  // const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dayOffset, setDayOffset] = useState(0); // Keep dayOffset for daily view navigation
  // weekOffset and monthOffset are removed as they are not relevant for a dedicated daily view component.
  // const [weekOffset, setWeekOffset] = useState(0);
  // const [monthOffset, setMonthOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Calculate current date based on offsets for the daily view
  const today = startOfToday();
  const currentDay = addDays(today, dayOffset); // For daily view
  
  // Removed calculations for weekDates and calendarDays as they are no longer needed
  // in this component, which is now dedicated to the daily view.
  // const startOfCurrentWeekForWeeklyView = startOfWeek(currentDay, { weekStartsOn: 1 });
  // const startOfVisibleWeek = addDays(startOfCurrentWeekForWeeklyView, weekOffset * 7);
  // const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfVisibleWeek, i));
  // const monthToDisplay = addMonths(startOfMonth(today), monthOffset);
  // const firstDayOfMonthForCalendar = startOfMonth(monthToDisplay);
  // const lastDayOfMonthForCalendar = endOfMonth(monthToDisplay);
  // const firstDayOfGrid = startOfWeek(firstDayOfMonthForCalendar, { weekStartsOn: 1 });
  // const daysInLastWeekOfGrid = getDay(lastDayOfMonthForCalendar) === 0 ? 0 : 7 - getDay(lastDayOfMonthForCalendar);
  // const lastDayOfGrid = addDays(lastDayOfMonthForCalendar, daysInLastWeekOfGrid);
  // const calendarDays = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });
  
  // Filter habits based on category
  const filteredHabits = filterCategory === 'all' 
    ? habits 
    : filterCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : filterCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits.filter(h => h.category === filterCategory);
  
  // Removed isHabitCompletedOnDate function, as completion data is now nested in each habit object.
  // Child components like SortableHabit will use habit.completions directly.
  
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
    // Call onAddHabit with no parameters to trigger the enhanced dialog
    onAddHabit();
    console.log("Triggering add habit dialog from sortable habit view");
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
        {/* The Day/Week/Month toggle buttons were here. Removed as they are now controlled by DashboardPage.tsx */}
        {/* The filter and Add Habit button are kept as they are specific to this component's context when it's rendered (as the 'day' view) */}
        <div className="flex items-center justify-end"> {/* Changed justify-between to justify-end since left side (toggles) is gone */}
          {/* Removed the div that wrapped the "join" button group */}
          
          <div className="flex items-center gap-2"> {/* This div now takes full width or aligns right */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass theme style
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {filterCategory === 'all' ? 'All Categories' : 
                   filterCategory === 'absolute' ? 'Absolute Habits' :
                   filterCategory === 'frequency' ? 'Frequency Habits' : 
                   filterCategory}
                </Button>
              </DropdownMenuTrigger>
              {/* Assuming DropdownMenuContent will be themed globally or separately if it uses a Portal */}
              <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-sm border-white/20 text-gray-200">
                <DropdownMenuItem onClick={() => setFilterCategory('all')} className="focus:bg-white/10 focus:text-white">
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('absolute')} className="focus:bg-white/10 focus:text-white">
                  Absolute Habits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('frequency')} className="focus:bg-white/10 focus:text-white">
                  Frequency
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              onClick={handleCreateHabit}
              variant="default"
              size="sm"
              className="bg-blue-500/80 hover:bg-blue-500 text-white" // Glass theme friendly primary button
            >
              <Plus className="h-4 w-4 mr-1" /> Add Habit
            </Button>
          </div>
        </div>

        {/* This component now only renders the "Daily View" content.
            The weekly and monthly views are handled directly by DashboardPage.tsx */}
        <div className="bg-transparent rounded-lg p-0"> {/* Adjusted container: transparent, no explicit border/padding here */}
          <div className="flex items-center justify-between mb-4">
            {/* Title for the daily view section - can be styled or removed if not needed */}
            <h3 className="text-lg font-semibold text-gray-200">Today's Focus</h3> {/* Updated text color */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDayOffset(prev => prev - 1)}
                className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass theme style
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDayOffset(0)}
                className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass theme style
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDayOffset(prev => prev + 1)}
                className="text-gray-300 border-white/30 hover:bg-white/10 hover:text-white" // Glass theme style
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-400 mb-4"> {/* Updated text color */}
            {format(currentDay, 'MMM d, yyyy')}
          </div>
          {habits.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400">No habits yet. Add some from the Habit Library.</p> {/* Updated text color */}
            </div>
          ) : (
            <DailyViewFixedUpdated
              habits={filteredHabits}
              currentDay={currentDay}
              onToggleHabit={onToggleHabit}
              onAddHabit={onAddHabit}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
              onReorderHabits={onReorderHabits}
              filterCategory={filterCategory}
            />
          )}
        </div>
        {/* Weekly and Monthly view sections are removed from this component */}
      </div>
    </div>
  );
};