import React, { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Pencil, Trash2, MoreHorizontal, PlusCircle, CheckSquare, Target } from "lucide-react";
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
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";

interface DailyViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type
  currentDay: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  filterCategory: string;
}

export function DailyViewFixedUpdated({
  habits,
  completions,
  currentDay,
  onToggleHabit,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  filterCategory
}: DailyViewProps) {
  const today = currentDay;
  const [showConfetti, setShowConfetti] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => 
        completion.habitId === habitId && 
        isSameDay(new Date(completion.date), date) && 
        completion.completed
    );
  };
  
  // Handle confetti celebration after completing all absolute habits
  useEffect(() => {
    // Get absolute habits based on the filter
    const absoluteHabitsToCheck = habits
      .filter(h => h.isAbsolute)
      .filter(h => 
        filterCategory === 'all' || 
        filterCategory === 'absolute' || 
        h.category === filterCategory
      );
    
    // If there are no absolute habits to track, don't show confetti
    if (absoluteHabitsToCheck.length === 0) return;
    
    // Check if all absolute habits are completed for today
    const allCompleted = absoluteHabitsToCheck.every(habit => 
      isHabitCompletedOnDate(habit.id, today)
    );
    
    if (allCompleted) {
      setShowConfetti(true);
      
      // Reset confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [habits, completions, filterCategory, today]);
  
  // Get target days from frequency
  const getTargetDays = (habit: Habit): number => {
    switch(habit.frequency) {
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
  
  // Count completed days in the current week for a habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return completions.filter(
      completion => 
        completion.habitId === habitId && 
        completion.completed
    ).length;
  };
  
  // This is the same function but renamed to match what's used in the component
  const completedDaysInCurrentWeek = (habitId: string): number => {
    return countCompletedDaysInWeek(habitId);
  };
  
  // Check if a habit has met its weekly frequency target
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    if (!habit.frequency || habit.frequency === 'daily') return false;
    
    const targetDays = getTargetDays(habit);
    const completedDays = countCompletedDaysInWeek(habit.id);
    
    return completedDays >= targetDays;
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
  
  // Split habits based on category
  const filteredHabits = filterCategory === 'all' 
    ? habits 
    : filterCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : filterCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits.filter(h => h.category === filterCategory);
  
  // Separate absolute and frequency-based habits from filtered habits
  const displayedAbsoluteHabits = filteredHabits.filter(h => h.isAbsolute);
  const displayedFrequencyHabits = filteredHabits.filter(h => !h.isAbsolute);
  
  // Create separate handlers for each section
  const handleAbsoluteDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeHabitId = String(active.id);
      const overHabitId = String(over.id);
      
      // Only allow reordering within absolute habits
      const activeIndex = displayedAbsoluteHabits.findIndex(h => h.id === activeHabitId);
      const overIndex = displayedAbsoluteHabits.findIndex(h => h.id === overHabitId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a map of habit positions in the overall array
        const habitPositions = new Map();
        habits.forEach((habit, index) => {
          habitPositions.set(habit.id, index);
        });
        
        // Create a new array with the moved item
        const reorderedHabits = [...habits];
        const oldIndex = habitPositions.get(activeHabitId);
        const newIndex = habitPositions.get(overHabitId);
        
        const [movedItem] = reorderedHabits.splice(oldIndex, 1);
        reorderedHabits.splice(newIndex, 0, movedItem);
        
        // Update habits array
        onReorderHabits(reorderedHabits);
      }
    }
  };
  
  const handleFrequencyDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeHabitId = String(active.id);
      const overHabitId = String(over.id);
      
      // Only allow reordering within frequency habits
      const activeIndex = displayedFrequencyHabits.findIndex(h => h.id === activeHabitId);
      const overIndex = displayedFrequencyHabits.findIndex(h => h.id === overHabitId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a map of habit positions in the overall array
        const habitPositions = new Map();
        habits.forEach((habit, index) => {
          habitPositions.set(habit.id, index);
        });
        
        // Create a new array with the moved item
        const reorderedHabits = [...habits];
        const oldIndex = habitPositions.get(activeHabitId);
        const newIndex = habitPositions.get(overHabitId);
        
        const [movedItem] = reorderedHabits.splice(oldIndex, 1);
        reorderedHabits.splice(newIndex, 0, movedItem);
        
        // Update habits array
        onReorderHabits(reorderedHabits);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Confetti celebration when all absolute habits are completed */}
      <ConfettiCelebration 
        trigger={showConfetti} 
        type="perfectDay"
        onComplete={() => setShowConfetti(false)}
      />
      {/* No habits state */}
      {filteredHabits.length === 0 && (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-3 text-gray-400">
            <CheckSquare className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">No habits found</h3>
          <p className="text-gray-500 mb-4">
            {filterCategory === 'all' 
              ? "You haven't created any habits yet." 
              : `No habits found in the "${filterCategory}" category.`}
          </p>
          <Button onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Habit
          </Button>
        </div>
      )}

      {/* Daily Absolute Habits section */}
      {displayedAbsoluteHabits.length > 0 && (
        <>
          <div className="font-medium text-sm mb-2 px-4 py-2 bg-blue-50 rounded-md text-blue-700">
            Absolute Habits (Daily)
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleAbsoluteDragEnd}
          >
            <SortableContext 
              items={displayedAbsoluteHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayedAbsoluteHabits.map(habit => (
                  <TableSortableItem key={habit.id} id={habit.id} habit={habit}>
                    <div className={`flex justify-between p-3 rounded-lg border ${
                        habit.iconColor === 'red' ? 'border-red-200 dark:border-red-900' :
                        habit.iconColor === 'orange' ? 'border-orange-200 dark:border-orange-900' :
                        habit.iconColor === 'amber' ? 'border-amber-200 dark:border-amber-900' :
                        habit.iconColor === 'yellow' ? 'border-yellow-200 dark:border-yellow-900' :
                        habit.iconColor === 'green' ? 'border-green-200 dark:border-green-900' :
                        habit.iconColor === 'indigo' ? 'border-indigo-200 dark:border-indigo-900' :
                        habit.iconColor === 'purple' ? 'border-purple-200 dark:border-purple-900' :
                        'border-blue-200 dark:border-blue-900'
                      }`}
                      style={{
                        backgroundColor: habit.iconColor === 'red' ? '#FEF2F2' :
                                         habit.iconColor === 'orange' ? '#FFF7ED' :
                                         habit.iconColor === 'amber' ? '#FFFBEB' :
                                         habit.iconColor === 'yellow' ? '#FEFCE8' :
                                         habit.iconColor === 'green' ? '#F0FDF4' :
                                         habit.iconColor === 'indigo' ? '#EEF2FF' :
                                         habit.iconColor === 'purple' ? '#FAF5FF' :
                                         '#EFF6FF'
                      }}>
                      <div className="flex items-center">
                        <div className="mr-3 p-1 rounded">
                          {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                        </div>
                        <div>
                          <div className={`font-medium flex items-center ${
                            habit.iconColor === 'red' ? 'text-red-600 dark:text-red-400' :
                            habit.iconColor === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                            habit.iconColor === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                            habit.iconColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                            habit.iconColor === 'green' ? 'text-green-600 dark:text-green-400' :
                            habit.iconColor === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                            habit.iconColor === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`}>
                            {habit.title}
{typeof habit.streak === "number" && habit.streak > 0 && (
                              <Badge variant="outline" className="text-amber-500 dark:text-amber-300 text-[10px] font-medium px-1 py-0 h-4 ml-1 dark:border-amber-700">
                                <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" /> {habit.streak}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {habit.description}
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
                  </TableSortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
      
      {/* Frequency-based Habits section */}
      {displayedFrequencyHabits.length > 0 && (
        <>
          <div className="font-medium text-sm mb-2 px-4 py-2 bg-green-50 rounded-md text-green-700 mt-6">
            Frequency-based Habits (Weekly Target)
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFrequencyDragEnd}
          >
            <SortableContext 
              items={displayedFrequencyHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {displayedFrequencyHabits.map(habit => (
                  <TableSortableItem key={habit.id} id={habit.id} habit={habit}>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <div className="flex items-center">
                        <div className={`mr-3 p-1 rounded ${habit.iconColor ? `bg-${habit.iconColor}-100` : 'bg-blue-100'}`}>
                          {getHabitIcon(habit.icon)}
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {habit.title}
                            {(() => {
                              const hasMetFrequency = habit.frequency && habit.frequency !== 'daily' && hasMetWeeklyFrequency(habit);
                              const targetDays = getTargetDays(habit);
                              const completedDays = countCompletedDaysInWeek(habit.id);
                              const isExceeding = completedDays > targetDays;
                              
                              return hasMetFrequency && (
                                <Badge className="bg-white px-1.5 py-0.5 h-5 border-2 border-red-600 ml-1">
                                  {isExceeding ? (
                                    <>
                                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <circle cx="12" cy="12" r="6"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                      </svg>
                                      {completedDays > targetDays && (
                                        <span className="text-xs text-red-600 font-semibold ml-0.5">+{completedDays - targetDays}</span>
                                      )}
                                    </>
                                  ) : (
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <circle cx="12" cy="12" r="6"></circle>
                                      <circle cx="12" cy="12" r="2"></circle>
                                    </svg>
                                  )}
                                </Badge>
                              );
                            })()}
{typeof habit.streak === "number" && habit.streak > 0 && (
                              <Badge variant="outline" className="text-amber-500 dark:text-amber-300 text-[10px] font-medium px-1 py-0 h-4 ml-1 dark:border-amber-700">
                                <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" /> {habit.streak}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {habit.description}
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
                  </TableSortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}

      {/* Add habit button */}
      {filteredHabits.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button onClick={onAddHabit} variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      )}
    </div>
  );
}