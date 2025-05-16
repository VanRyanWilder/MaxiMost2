import React from "react";
import { format, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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

export function DailyViewFixedNew({
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
  
  // Separate absolute and frequency-based habits
  const absoluteHabits = filteredHabits.filter(h => h.isAbsolute);
  const frequencyHabits = filteredHabits.filter(h => !h.isAbsolute);
  
  // Create separate handlers for each section
  const handleAbsoluteDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeHabitId = String(active.id);
      const overHabitId = String(over.id);
      
      // Only allow reordering within absolute habits
      const activeIndex = absoluteHabits.findIndex(h => h.id === activeHabitId);
      const overIndex = absoluteHabits.findIndex(h => h.id === overHabitId);
      
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
      const activeIndex = frequencyHabits.findIndex(h => h.id === activeHabitId);
      const overIndex = frequencyHabits.findIndex(h => h.id === overHabitId);
      
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
      {/* Daily Absolute Habits section */}
      {absoluteHabits.length > 0 && (
        <>
          <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
            Daily Absolute Habits
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleAbsoluteDragEnd}
          >
            <SortableContext 
              items={absoluteHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {absoluteHabits.map(habit => (
                  <TableSortableItem key={habit.id} habit={habit}>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <div className="flex items-center">
                        <div className={`mr-3 p-1 rounded ${habit.iconColor ? `bg-${habit.iconColor}-100` : 'bg-blue-100'}`}>
                          {getHabitIcon(habit.icon)}
                        </div>
                        <div>
                          <div className="font-medium">{habit.title}</div>
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
      {frequencyHabits.length > 0 && (
        <>
          <div className="font-medium text-sm mb-2 px-2 py-1 bg-green-50 rounded-md text-green-700 mt-6">
            Frequency-based Habits
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleFrequencyDragEnd}
          >
            <SortableContext 
              items={frequencyHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {frequencyHabits.map(habit => (
                  <TableSortableItem key={habit.id} habit={habit}>
                    <div className="flex justify-between p-3 rounded-lg border">
                      <div className="flex items-center">
                        <div className={`mr-3 p-1 rounded ${habit.iconColor ? `bg-${habit.iconColor}-100` : 'bg-blue-100'}`}>
                          {getHabitIcon(habit.icon)}
                        </div>
                        <div>
                          <div className="font-medium">{habit.title}</div>
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
      <div className="flex justify-center mt-4">
        <Button onClick={onAddHabit} variant="outline">
          Add Habit
        </Button>
      </div>
    </div>
  );
}