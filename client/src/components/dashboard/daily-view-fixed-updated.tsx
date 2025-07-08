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
  habits: Habit[]; // Each Habit object should contain its own 'completions: HabitCompletionEntry[]'
  // completions prop removed
  currentDay: Date;
  onToggleHabit: (habitId: string, date: Date, value?: number) => void; // Updated signature
  onAddHabit: () => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  filterCategory: string;
}

export function DailyViewFixedUpdated({
  habits,
  // completions prop removed
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
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [loggingHabitInfo, setLoggingHabitInfo] = useState<{habit: Habit, date: Date} | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // Refactored to use habit.completions
  const isHabitCompletedOnDate = (habit: Habit, date: Date): boolean => {
    const habitCompletions = habit.completions || [];
    return habitCompletions.some(
      c => isSameDay(new Date(c.date), date) && c.value > 0
    );
  };
  
  // Handle confetti celebration after completing all absolute habits
  useEffect(() => {
    const absoluteHabitsToCheck = habits
      .filter(h => h.isAbsolute)
      .filter(h => 
        filterCategory === 'all' || 
        filterCategory === 'absolute' || 
        h.category === filterCategory
      );
    
    if (absoluteHabitsToCheck.length === 0) return;
    
    const allCompleted = absoluteHabitsToCheck.every(habit => 
      isHabitCompletedOnDate(habit, today) // Pass the whole habit object
    );
    
    if (allCompleted) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [habits, filterCategory, today]); // Removed completions from dependency array
  
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
  // This function might need context of which week if not just using all completions.
  // For daily view, this might be less relevant or needs clearer definition of "current week".
  // Assuming it refers to all-time completions for the habit for now, or needs to be adapted
  // if a specific week's count is needed here.
  // For simplicity, let's assume it means counting all completed entries for the habit.
  const countAllCompletedEntries = (habit: Habit): number => {
    const habitCompletions = habit.completions || [];
    return habitCompletions.filter(c => c.value > 0).length;
  };
  
  // Check if a habit has met its weekly frequency target
  // This is more relevant for a weekly view, but if needed here,
  // it would require knowing the week's start/end dates.
  // For now, this function might not be directly used or accurate in a "daily" view context
  // without further week context.
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    if (!habit.frequency || habit.frequency === 'daily') return false; // Daily habits always "meet" daily frequency
    
    // This is a placeholder, proper weekly frequency checking needs week context
    // For now, we'll just use the total count of completions against target.
    // This isn't accurate for "X times this specific week".
    const targetDays = getTargetDays(habit);
    const completedCount = countAllCompletedEntries(habit);
    
    return completedCount >= targetDays;
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
      {displayedAbsoluteHabits && displayedAbsoluteHabits.length > 0 && (
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
                            {habit.type === 'quantitative' && habit.targetValue && (
                              <span className="block text-xs mt-0.5">
                                Target: {habit.targetValue} {habit.targetUnit || ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={isHabitCompletedOnDate(habit.id, today) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (habit.type === 'quantitative') {
                              setLoggingHabitInfo({ habit, date: today });
                              setLogModalOpen(true);
                            } else {
                              onToggleHabit(habit.id, today); // Binary toggle
                            }
                          }}
                          className="min-w-[100px]"
                        >
                          {isHabitCompletedOnDate(habit.id, today) && habit.type !== 'quantitative'
                            ? <><Check className="mr-1 h-4 w-4" /> Completed</>
                            : habit.type === 'quantitative'
                              ? "Log Value"
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
      {displayedFrequencyHabits && displayedFrequencyHabits.length > 0 && (
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
                            <Badge variant="outline" className="text-[10px] ml-2 font-medium px-1 py-0 h-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                              {getFrequencyText(habit.frequency)}
                            </Badge>
                            {(() => {
                              const hasMetFrequency = habit.frequency && habit.frequency !== 'daily' && hasMetWeeklyFrequency(habit);
                              const targetDays = getTargetDays(habit);
                              const completedDays = countCompletedDaysInWeek(habit.id);
                              const isExceeding = completedDays > targetDays;
                              
                              return hasMetFrequency && (
                                <Badge className={`px-1.5 py-0.5 h-5 ${isExceeding ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white border-2 border-green-600'} ml-1`}>
                                  {isExceeding ? (
                                    <>
                                      <div className="flex items-center">
                                        <Check className="h-3.5 w-3.5 text-green-600" />
                                        {completedDays > targetDays && (
                                          <span className="text-xs text-green-600 font-semibold ml-0.5">+{completedDays - targetDays}</span>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center">
                                      <Check className="h-3.5 w-3.5 text-green-600" />
                                      <span className="text-xs text-green-600 font-semibold ml-0.5">Done</span>
                                    </div>
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
                            {habit.type === 'quantitative' && habit.targetValue && (
                              <span className="block text-xs mt-0.5">
                                Target: {habit.targetValue} {habit.targetUnit || ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant={isHabitCompletedOnDate(habit.id, today) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (habit.type === 'quantitative') {
                              setLoggingHabitInfo({ habit, date: today });
                              setLogModalOpen(true);
                            } else {
                              onToggleHabit(habit.id, today); // Binary toggle
                            }
                          }}
                          className="min-w-[100px]"
                        >
                          {isHabitCompletedOnDate(habit.id, today) && habit.type !== 'quantitative'
                            ? <><Check className="mr-1 h-4 w-4" /> Completed</>
                            : habit.type === 'quantitative'
                              ? "Log Value"
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

      {loggingHabitInfo && (
        <QuantitativeLogModal
          isOpen={logModalOpen}
          onClose={() => {
            setLogModalOpen(false);
            setLoggingHabitInfo(null);
          }}
          habit={loggingHabitInfo.habit}
          date={loggingHabitInfo.date}
          onLog={onToggleHabit} // onToggleHabit now accepts the value
          // Pass the specific habit's completions to the modal
          currentCompletions={loggingHabitInfo.habit.completions || []}
        />
      )}
    </div>
  );
}