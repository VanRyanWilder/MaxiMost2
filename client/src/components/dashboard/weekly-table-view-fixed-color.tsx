import React, { useState } from "react";
import { format, isFuture, addDays, startOfWeek, endOfWeek, isSameDay, startOfDay, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, PlusCircle, Pencil, Trash2, MoreVertical, Star, StarHalf, CheckCircle, Check as CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function WeeklyTableViewFixedColor({
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
  // Sort habits by absolute vs frequency-based
  const absoluteHabits = habits.filter(h => h.isAbsolute);
  const frequencyHabits = habits.filter(h => !h.isAbsolute);

  const isHabitCompletedOnDate = (habitId: string, date: Date) => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = habits.findIndex(habit => habit.id === active.id);
      const newIndex = habits.findIndex(habit => habit.id === over.id);
      
      const reorderedHabits = [...habits];
      const [movedHabit] = reorderedHabits.splice(oldIndex, 1);
      reorderedHabits.splice(newIndex, 0, movedHabit);
      
      onReorderHabits(reorderedHabits);
    }
  };

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Function to check if a date is in the future
  const isFutureDate = (date: Date) => {
    return isFuture(date);
  };

  // Handlers for date navigation
  const handlePrevWeek = () => {
    // Implementation would go here
  };

  const handleNextWeek = () => {
    // Implementation would go here
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Weekly View</h2>
          <p className="text-sm text-muted-foreground">
            Track your habits for the week
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePrevWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-[2fr_repeat(7,1fr)] border-b">
            <div className="p-2 font-medium text-sm">Habit</div>
            {weekDates.map((date, i) => {
              const isCurrentDay = isSameDay(date, currentDay);
              return (
                <div 
                  key={i} 
                  className={`text-center p-2 flex flex-col items-center justify-center ${isCurrentDay ? 'bg-blue-50 font-medium' : ''}`}
                >
                  <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
                  <div className={`text-sm ${isCurrentDay ? 'text-blue-600 font-medium' : ''}`}>{format(date, 'd')}</div>
                </div>
              );
            })}
          </div>
          
          {/* All habits section */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* Absolute habits */}
            {absoluteHabits.length > 0 && (
              <div className="mb-4">
                <SortableContext 
                  items={absoluteHabits.map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="border-b py-2 px-4 bg-blue-50 dark:bg-blue-900/10 font-medium">
                    Daily Habits
                  </div>
                  {absoluteHabits.map(habit => {
                    const Icon = getHabitIcon(habit.icon);
                    
                    return (
                      <TableSortableItem 
                        key={habit.id} 
                        id={habit.id}
                        className="grid grid-cols-[2fr_repeat(7,1fr)] border-b hover:bg-slate-50 dark:hover:bg-slate-900/10"
                      >
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full p-1.5 ${habit.iconColor || 'bg-blue-100'}`}>
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{habit.title}</span>
                              {habit.frequency && (
                                <span className="text-xs text-gray-500">
                                  Daily
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEditHabit && onEditHabit(habit)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteHabit && onDeleteHabit(habit.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {/* Render a button for each day of the week */}
                          {weekDates.map((date, i) => {
                            const completed = isHabitCompletedOnDate(habit.id, date);
                            const isCurrentDay = isSameDay(date, currentDay);
                            
                            return (
                              <div 
                                key={`${habit.id}-day-${i}`} 
                                className={`text-center py-2 flex items-center justify-center ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                              >
                                <HabitButton
                                  isCompleted={completed}
                                  date={date}
                                  habitId={habit.id}
                                  onToggle={onToggleHabit}
                                  size="md"
                                />
                              </div>
                            );
                          })}
                        </TableSortableItem>
                      );
                    })}
                </SortableContext>
              </div>
            )}
            
            {/* Frequency-based habits */}
            {frequencyHabits.length > 0 && (
              <div>
                <SortableContext 
                  items={frequencyHabits.map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="border-b py-2 px-4 bg-blue-50 dark:bg-blue-900/10 font-medium">
                    Frequency-Based Habits
                  </div>
                  {frequencyHabits.map(habit => {
                    const Icon = getHabitIcon(habit.icon);
                    const weeklyTarget = parseInt(habit.frequency.split('x')[0]);
                    const completedCount = weekDates.filter(date => 
                      isHabitCompletedOnDate(habit.id, date)
                    ).length;
                    
                    const progressPercentage = Math.min(100, (completedCount / weeklyTarget) * 100);
                    const isCompleted = completedCount >= weeklyTarget;
                    
                    return (
                      <TableSortableItem 
                        key={habit.id} 
                        id={habit.id}
                        className="grid grid-cols-[2fr_repeat(7,1fr)] border-b hover:bg-slate-50 dark:hover:bg-slate-900/10"
                      >
                        <div className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full p-1.5 ${habit.iconColor || 'bg-blue-100'}`}>
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{habit.title}</span>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span>{completedCount}/{weeklyTarget}x per week</span>
                                {isCompleted && (
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                )}
                              </div>
                              
                              {/* Progress bar */}
                              <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                                <div 
                                  className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                                  style={{ width: `${progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onEditHabit && onEditHabit(habit)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDeleteHabit && onDeleteHabit(habit.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Render a button for each day of the week */}
                        {weekDates.map((date, i) => {
                          const completed = isHabitCompletedOnDate(habit.id, date);
                          const isCurrentDay = isSameDay(date, currentDay);
                          
                          return (
                            <div 
                              key={`${habit.id}-day-${i}`} 
                              className={`text-center py-2 flex items-center justify-center ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                              <HabitButton
                                isCompleted={completed}
                                date={date}
                                habitId={habit.id}
                                onToggle={onToggleHabit}
                                size="md"
                              />
                            </div>
                          );
                        })}
                      </TableSortableItem>
                    );
                  })}
                </SortableContext>
              </div>
            )}
          </DndContext>

          {/* Add habit button */}
          <div className="flex justify-center py-4">
            <Button onClick={onAddHabit} variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Habit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}