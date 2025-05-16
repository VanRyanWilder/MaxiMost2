import React from "react";
import { format, isFuture } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Circle, CheckCircle, Pencil, Trash2, MoreVertical, Star, StarHalf } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Habit } from "@/types/habit";
import { getHabitIcon } from "@/components/ui/icons";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TableSortableItem } from './table-sortable-item';
import { HabitButton } from "./habit-button";

interface WeeklyTableViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type
  weekDates: Date[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  selectedCategory: string;
  currentDay: Date;
}

export function WeeklyTableView({ 
  habits, 
  completions, 
  weekDates,
  onToggleHabit,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  selectedCategory,
  currentDay
}: WeeklyTableViewProps) {
  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);
    
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredHabits.findIndex(h => h.id === active.id);
      const newIndex = filteredHabits.findIndex(h => h.id === over.id);
      
      const reorderedFilteredHabits = [...filteredHabits];
      const [movedItem] = reorderedFilteredHabits.splice(oldIndex, 1);
      reorderedFilteredHabits.splice(newIndex, 0, movedItem);
      
      // Create a new habits array with the reordered items
      const reorderedHabits = [...habits];
      
      // Replace the corresponding items in the original array
      filteredHabits.forEach((oldHabit, index) => {
        const habitIndex = reorderedHabits.findIndex(h => h.id === oldHabit.id);
        if (habitIndex !== -1) {
          reorderedHabits[habitIndex] = reorderedFilteredHabits[index];
        }
      });
      
      onReorderHabits(reorderedHabits);
    }
  };
  
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      new Date(c.date).toDateString() === date.toDateString() && 
      c.completed
    );
  };
  
  // Get appropriate frequency text
  const getFrequencyText = (frequency: string) => {
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
  
  // Count completed days in the current week for this habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return completions.filter(c => 
      c.habitId === habitId && 
      weekDates.some(date => new Date(c.date).toDateString() === date.toDateString()) &&
      c.completed
    ).length;
  };
  
  // Get target completion count based on habit frequency
  const getTargetDays = (habit: Habit): number => {
    switch (habit.frequency) {
      case 'daily': return 7;
      case '2x-week': return 2;
      case '3x-week': return 3;
      case '4x-week': return 4;
      case '5x-week': return 5;
      case '6x-week': return 6;
      case 'weekly': return 1;
      default: return 1;
    }
  };
  
  // Check if habit has met its weekly frequency
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedDays = countCompletedDaysInWeek(habit.id);
    return completedDays >= getTargetDays(habit);
  };
  
  const handleEditHabit = (habit: Habit) => {
    if (onEditHabit) {
      onEditHabit(habit);
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };
  
  // Check if this is a mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
  return (
    <div className="w-full">
      {/* Week header */}
      <div className="grid grid-cols-[2fr_repeat(7,1fr)] bg-muted/20 rounded-t-md">
        <div className="px-3 py-3 font-semibold">Habit</div>
        {weekDates.map((date, i) => (
          <div 
            key={i} 
            className={`text-center py-3 text-xs font-medium ${
              date.toDateString() === new Date().toDateString() ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <div className="uppercase tracking-wider">{format(date, 'EEE')}</div>
            <div className="text-sm">{format(date, 'd')}</div>
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredHabits.length === 0 ? (
        <div className="py-8 text-center border-t">
          <p className="text-muted-foreground mb-4">No habits found in this category.</p>
          <Button onClick={onAddHabit} size="sm">Add Your First Habit</Button>
        </div>
      ) : (
        <>
          {/* Absolute (daily) habits section with sortable functionality */}
          {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
            <>
              <div className="border-t py-2 px-3 bg-blue-50 text-sm text-blue-700 font-medium">
                Absolute Daily Habits
              </div>
                
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                
                <SortableContext 
                  items={filteredHabits.filter(h => h.isAbsolute).map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                    <TableSortableItem key={habit.id} habit={habit}>
                      <div className="border-t py-2 grid grid-cols-[2fr_repeat(7,1fr)] items-center">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="flex-shrink-0">
                            {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {habit.title}
                              <div className="ml-2 flex items-center">
                                {habit.streak > 0 && (
                                  <Badge variant="outline" className="text-amber-500 text-[10px] font-medium px-1 py-0 h-4 ml-1">
                                    <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500" /> {habit.streak}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {habit.description}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
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
                        
                        {/* Render a button for each day of the week */}
                        {weekDates.map((date, i) => {
                          const completed = isHabitCompletedOnDate(habit.id, date);
                          const isCurrentDay = date.toDateString() === currentDay.toDateString();
                          
                          return (
                            <div 
                              key={i} 
                              className={`text-center ${isCurrentDay ? 'bg-blue-50/60' : ''}`}
                            >
                              <HabitButton
                                isCompleted={completed}
                                date={date}
                                habitId={habit.id}
                                onToggle={onToggleHabit}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </TableSortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          )}
          
          {/* Frequency-based habits section */}
          {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
            <>
              <div className="border-t py-2 px-3 bg-green-50 text-sm text-green-700 font-medium">
                Frequency-based Habits 
              </div>
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={filteredHabits.filter(h => !h.isAbsolute).map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                    <TableSortableItem key={habit.id} habit={habit}>
                      <div className="border-t py-2 grid grid-cols-[2fr_repeat(7,1fr)] items-center">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="flex-shrink-0">
                            {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {habit.title}
                              <Badge variant="outline" className="text-[10px] ml-2 font-medium px-1 py-0 h-4">
                                {getFrequencyText(habit.frequency)}
                              </Badge>
                              {habit.streak > 0 && (
                                <Badge variant="outline" className="text-amber-500 text-[10px] font-medium px-1 py-0 h-4 ml-1">
                                  <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500" /> {habit.streak}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center">
                              <span className={`font-medium ${hasMetWeeklyFrequency(habit) ? 'text-green-600' : ''}`}>
                                {countCompletedDaysInWeek(habit.id)}/{getTargetDays(habit)}
                              </span>
                              <span className="text-slate-400 ml-1">days this week</span>
                              {hasMetWeeklyFrequency(habit) && <span className="text-green-600 ml-1">✓</span>}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
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
                        
                        {/* Render a button for each day of the week */}
                        {weekDates.map((date, i) => {
                          const completed = isHabitCompletedOnDate(habit.id, date);
                          const isCurrentDay = date.toDateString() === currentDay.toDateString();
                          
                          return (
                            <div 
                              key={i} 
                              className={`text-center ${isCurrentDay ? 'bg-blue-50/60' : ''}`}
                            >
                              <HabitButton
                                isCompleted={completed}
                                date={date}
                                habitId={habit.id}
                                onToggle={onToggleHabit}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </TableSortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </>
          )}
          
          {/* Add habit button at the bottom */}
          <div className="border-t py-4 text-center">
            <Button onClick={onAddHabit} variant="outline" size="sm">
              Add Habit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}