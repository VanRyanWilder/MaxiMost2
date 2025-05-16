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
  today: Date;
  onToggleHabit: (habitId: string, date: Date) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  filterCategory: string;
}

export function DailyViewFixed({ 
  habits, 
  completions, 
  today,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  filterCategory
}: DailyViewProps) {
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
      const oldIndex = habits.findIndex(h => h.id === active.id);
      const newIndex = habits.findIndex(h => h.id === over.id);
      
      const reorderedHabits = [...habits];
      const [movedItem] = reorderedHabits.splice(oldIndex, 1);
      reorderedHabits.splice(newIndex, 0, movedItem);
      
      onReorderHabits(reorderedHabits);
    }
  };
  
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date) &&
      c.completed
    );
  };
  
  // Get appropriate frequency text
  const getFrequencyLabel = (frequency: string) => {
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
  
  // Filter habits based on category if needed
  const filteredHabits = filterCategory === 'all' 
    ? habits 
    : filterCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : filterCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits.filter(h => h.category === filterCategory);

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={filteredHabits.map(h => h.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
              <div className="font-medium text-sm mb-2 px-2 py-1 bg-blue-50 rounded-md text-blue-700">
                Daily Absolute Habits
              </div>
            )}
            
            {filteredHabits.filter(h => h.isAbsolute).map(habit => (
              <TableSortableItem key={habit.id} habit={habit}>
                <div className="flex justify-between p-3 rounded-lg border">
                  <div className="flex items-center">
                    <div className={`mr-3 p-1 rounded ${habit.iconColor || 'bg-blue-100'}`}>
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
                        <DropdownMenuItem onClick={() => onEditHabit(habit)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableSortableItem>
            ))}
            
            {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
              <div className="font-medium text-sm mb-2 px-2 py-1 bg-green-50 rounded-md text-green-700 mt-4">
                Frequency-based Habits
              </div>
            )}
            
            {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
              <TableSortableItem key={habit.id} habit={habit}>
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
                        <DropdownMenuItem onClick={() => onEditHabit(habit)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteHabit(habit.id)}>
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
    </div>
  );
}