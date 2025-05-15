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
import { WeeklyTableView } from './weekly-table-view';
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
  Circle,
  CheckCircle
} from "lucide-react";
import { Habit, HabitCategory } from '@/types/habit';
import { EditHabitDialog } from './edit-habit-dialog';
import { Icons, getHabitIcon } from '@/components/ui/icons';

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
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly'); // Default to weekly view
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  // Separate offsets for cleaner implementation
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  // Handle week navigation through the props
  const handleWeekChange = (changeAmount: number) => {
    // Reset day offset when changing weeks for clean transitions
    setDayOffset(0);
    setWeekOffset(prev => prev + changeAmount);
  };

  // Handle day navigation
  const handleDayChange = (changeAmount: number) => {
    // Increment or decrement the day offset
    setDayOffset(prev => prev + changeAmount);
  };

  // Get current date as reference point
  const baseDate = startOfToday();
  
  // Calculate adjusted dates based on separate offsets
  const totalDayOffset = (weekOffset * 7) + dayOffset;
  
  // Calculate today for daily view
  const today = addDays(baseDate, totalDayOffset);
  
  // Calculate week start with Monday as first day
  const startOfCurrentWeek = startOfWeek(addDays(baseDate, totalDayOffset), { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const currentMonth = addMonths(today, monthOffset);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calendar days with padding for the month view
  const startDayOfWeek = getDay(monthStart);
  const endDayOfWeek = getDay(monthEnd);
  
  // Add days from previous month to start
  const prevMonthDays = startDayOfWeek > 0 
    ? Array.from({ length: startDayOfWeek }, (_, i) => 
        subDays(monthStart, startDayOfWeek - i))
    : [];
  
  // Add days from next month to end
  const nextMonthDays = 6 - endDayOfWeek > 0 
    ? Array.from({ length: 6 - endDayOfWeek }, (_, i) => 
        addDays(monthEnd, i + 1))
    : [];
  
  // Create calendar grid with all days
  const calendarDays = [
    ...prevMonthDays.reverse(),
    ...monthDays,
    ...nextMonthDays
  ];

  const filteredHabits = filterCategory === 'all' 
    ? habits 
    : filterCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : filterCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(completion => 
      completion.habitId === habitId && 
      isSameDay(new Date(completion.date), date)
    );
  };

  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
  };

  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    if (!habit.frequency || habit.frequency === 'daily') return false;
    
    const targetFrequency = parseInt(habit.frequency.charAt(0));
    const completed = countCompletedDaysInWeek(habit.id);
    
    return completed >= targetFrequency;
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditDialogOpen(true);
  };

  const handleCreateHabit = () => {
    onAddHabit();
  };

  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };

  const handleSaveHabit = (updatedHabit: Habit) => {
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabit);
    }
    setEditDialogOpen(false);
  };

  function getFrequencyLabel(frequency: string): string {
    switch(frequency) {
      case 'daily':
        return 'Every day';
      case '2x':
        return '2 times per week';
      case '3x':
        return '3 times per week';
      case '4x':
        return '4 times per week';
      case '5x':
        return '5 times per week';
      case '6x':
        return '6 times per week';
      default:
        return frequency;
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredHabits.findIndex(habit => habit.id === active.id);
      const newIndex = filteredHabits.findIndex(habit => habit.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedHabits = arrayMove(filteredHabits, oldIndex, newIndex);
        
        // Find the indices of the moved habits in the complete habits array
        const oldIndexInAllHabits = habits.findIndex(habit => habit.id === active.id);
        const newIndexInAllHabits = habits.findIndex(habit => habit.id === over.id);
        
        // Create a new array with the habit moved
        const allReorderedHabits = [...habits];
        const [movedHabit] = allReorderedHabits.splice(oldIndexInAllHabits, 1);
        allReorderedHabits.splice(newIndexInAllHabits, 0, movedHabit);
        
        onReorderHabits(allReorderedHabits);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="join">
              <Button 
                onClick={() => {
                  setViewMode("daily");
                  // Reset offsets when changing view mode for consistent behavior
                  setDayOffset(0);
                  setWeekOffset(0);
                }} 
                variant={viewMode === "daily" ? "default" : "outline"}
                className="rounded-none"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Daily
              </Button>
              <Button 
                onClick={() => {
                  setViewMode("weekly");
                  // Reset offsets when changing view mode for consistent behavior
                  setDayOffset(0);
                  setWeekOffset(0);
                }} 
                variant={viewMode === "weekly" ? "default" : "outline"}
                className="rounded-none"
              >
                <Activity className="h-4 w-4 mr-1" />
                Weekly
              </Button>
              <Button 
                onClick={() => {
                  setViewMode("monthly");
                  // Reset offsets when changing view mode for consistent behavior
                  setDayOffset(0);
                  setWeekOffset(0);
                  setMonthOffset(0);
                }} 
                variant={viewMode === "monthly" ? "default" : "outline"}
                className="rounded-none"
              >
                <CalendarDays className="h-4 w-4 mr-1" />
                Monthly
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterCategory === 'all' ? 'All' : 
                   filterCategory === 'absolute' ? 'Absolute' : 
                   filterCategory === 'frequency' ? 'Frequency' : filterCategory}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('absolute')}>
                  Absolute
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterCategory('frequency')}>
                  Frequency
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleCreateHabit} variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Habit
            </Button>
          </div>
        </div>

        {viewMode === "daily" && (
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Today's Habits</h3>
              <div className="text-sm text-gray-500">
                {format(today, 'EEEE, MMMM d, yyyy')}
              </div>
            </div>
            
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={filteredHabits.map(habit => habit.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
                      Absolute Daily Habits
                    </div>
                  )}
                  
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                    <SortableHabit key={habit.id} habit={habit}>
                      <div className="flex justify-between p-3 rounded-lg border">
                        <div className="flex items-center">
                          <div className={`mr-3 p-1 rounded ${habit.iconColor || 'bg-blue-100'}`}>
                            {getHabitIcon(habit.icon)}
                          </div>
                          <div>
                            <div className="font-medium">{habit.title}</div>
                            <div className="text-sm text-gray-500">{habit.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant={isHabitCompletedOnDate(habit.id, today) ? "default" : "outline"}
                            size="sm"
                            onClick={() => onToggleHabit(habit.id, today)}
                            className="min-w-[100px]"
                          >
                            {isHabitCompletedOnDate(habit.id, today) 
                              ? <><Check className="mr-1 h-4 w-4" /> Completed</>
                              : "Mark Done"
                            }
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteHabit(habit.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </SortableHabit>
                  ))}
                  
                  {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
                    <div className="font-medium text-sm mb-2 px-2 py-1 bg-green-50 rounded-md text-green-700 mt-4">
                      Frequency-based Habits
                    </div>
                  )}
                  
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                    <SortableHabit key={habit.id} habit={habit}>
                      <div className="flex justify-between p-3 rounded-lg border">
                        <div className="flex items-center">
                          <div className={`mr-3 p-1 rounded ${habit.iconColor || 'bg-blue-100'}`}>
                            {getHabitIcon(habit.icon)}
                          </div>
                          <div>
                            <div className="font-medium">{habit.title}</div>
                            <div className="text-sm text-gray-500">
                              {habit.description}
                              <span className="ml-2 text-blue-600">{getFrequencyLabel(habit.frequency)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant={isHabitCompletedOnDate(habit.id, today) ? "default" : "outline"}
                            size="sm"
                            onClick={() => onToggleHabit(habit.id, today)}
                            className="min-w-[100px]"
                          >
                            {isHabitCompletedOnDate(habit.id, today) 
                              ? <><Check className="mr-1 h-4 w-4" /> Completed</>
                              : "Mark Done"
                            }
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteHabit(habit.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </SortableHabit>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      
        {/* Weekly view */}
        {viewMode === "weekly" && (
          <WeeklyTableView
            habits={filteredHabits}
            weekDates={weekDates}
            weekOffset={weekOffset}
            dayOffset={dayOffset}
            filterCategory={filterCategory}
            isHabitCompletedOnDate={isHabitCompletedOnDate}
            countCompletedDaysInWeek={countCompletedDaysInWeek}
            onToggleHabit={onToggleHabit}
            onChangeWeek={handleWeekChange}
            onChangeDay={handleDayChange}
            onReorderHabits={onReorderHabits}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />
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
                  <ChevronLeft className="h-4 w-4 mr-1" /> 
                  Prev Month
                </Button>
                <h3 className="text-lg font-medium text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMonthOffset(prev => prev + 1)}
                >
                  Next Month
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                const isToday = isSameDay(day, today);
                
                // Get completions for this day
                const dayCompletions = completions.filter(c => 
                  isSameDay(new Date(c.date), day)
                );
                
                // Calculate completion rates for each type of habit
                const absoluteHabitsCompleted = filteredHabits
                  .filter(h => h.isAbsolute)
                  .filter(h => 
                    dayCompletions.some(c => c.habitId === h.id)
                  ).length;
                  
                const absoluteHabitsTotal = filteredHabits
                  .filter(h => h.isAbsolute)
                  .length;
                  
                const optionalHabitsCompleted = filteredHabits
                  .filter(h => !h.isAbsolute)
                  .filter(h => 
                    dayCompletions.some(c => c.habitId === h.id)
                  ).length;
                  
                const optionalHabitsTotal = filteredHabits
                  .filter(h => !h.isAbsolute)
                  .length;
                
                const absoluteCompletionRate = absoluteHabitsTotal > 0 
                  ? absoluteHabitsCompleted / absoluteHabitsTotal
                  : 0;
                  
                const optionalCompletionRate = optionalHabitsTotal > 0
                  ? optionalHabitsCompleted / optionalHabitsTotal
                  : 0;
                
                // Determine the background color based on completion rates
                let backgroundClass = '';
                
                if (isCurrentMonth) {
                  if (absoluteHabitsTotal > 0 && absoluteCompletionRate === 1) {
                    backgroundClass = 'bg-blue-100';
                  }
                  
                  if (optionalHabitsTotal > 0 && optionalCompletionRate > 0.6) {
                    backgroundClass = 'bg-green-100';
                  }
                  
                  if (absoluteHabitsTotal > 0 && absoluteCompletionRate === 1 && 
                      optionalHabitsTotal > 0 && optionalCompletionRate > 0.6) {
                    backgroundClass = 'bg-gradient-to-br from-blue-100 to-green-100';
                  }
                  
                  if (absoluteHabitsTotal > 0 && absoluteCompletionRate < 1 &&
                      optionalHabitsTotal > 0 && optionalCompletionRate < 0.6) {
                    backgroundClass = 'bg-gray-100';
                  }
                }
                
                return (
                  <div 
                    key={index}
                    className={`
                      p-1 h-20 border rounded flex flex-col relative
                      ${isCurrentMonth ? backgroundClass || 'bg-white' : 'bg-gray-50 text-gray-400'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                    onClick={() => {
                      // Only allow interactions for current month days
                      if (isCurrentMonth) {
                        // Handle month day click
                      }
                    }}
                  >
                    <div className="text-right text-sm">{format(day, 'd')}</div>
                    
                    {/* For absolute habits, show a circle with color if ALL are completed */}
                    {isCurrentMonth && absoluteHabitsTotal > 0 && (
                      <div className="mt-1 flex items-center">
                        {absoluteCompletionRate === 1 ? (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        ) : absoluteHabitsCompleted > 0 ? (
                          <Circle className="h-4 w-4 text-gray-400" />
                        ) : null}
                        
                        {absoluteCompletionRate === 1 && (
                          <span className="text-xs ml-1 text-blue-500">
                            {absoluteHabitsCompleted}/{absoluteHabitsTotal}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* For optional habits, show a progress indicator */}
                    {isCurrentMonth && optionalHabitsTotal > 0 && (
                      <div className="mt-1 flex items-center">
                        {optionalCompletionRate > 0.6 ? (
                          <Badge variant="success" className="text-xs px-1 py-0 h-5">
                            {optionalHabitsCompleted}/{optionalHabitsTotal}
                          </Badge>
                        ) : optionalHabitsCompleted > 0 ? (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                            {optionalHabitsCompleted}/{optionalHabitsTotal}
                          </Badge>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Habit Completion Legend:</div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-blue-100 mr-1"></div>
                  <span>All daily habits completed</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-green-100 mr-1"></div>
                  <span>Most frequency habits met</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-gradient-to-br from-blue-100 to-green-100 mr-1"></div>
                  <span>Perfect day</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Edit habit dialog */}
      {editDialogOpen && (
        <EditHabitDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          habit={selectedHabit}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
        />
      )}
    </div>
  );
};