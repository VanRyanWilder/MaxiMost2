import React from "react";
import { format } from "date-fns";
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
import { SortableHabit } from './table-sortable-item';

interface WeeklyTableViewProps {
  habits: Habit[];
  weekDates: Date[];
  weekOffset: number;
  filterCategory: string;
  isHabitCompletedOnDate: (habitId: string, date: Date) => boolean;
  countCompletedDaysInWeek: (habitId: string) => number;
  onToggleHabit: (habitId: string, date: Date) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  setWeekOffset: (cb: (prev: number) => number) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
}



export const WeeklyTableView: React.FC<WeeklyTableViewProps> = ({
  habits,
  weekDates,
  weekOffset,
  filterCategory,
  isHabitCompletedOnDate,
  countCompletedDaysInWeek,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  setWeekOffset,
  onReorderHabits
}) => {
  // Current date for future date checking
  const currentDate = new Date();
  
  // Filter habits based on category
  const filteredHabits = 
    filterCategory === "all" 
      ? habits 
      : habits.filter(habit => habit.category === filterCategory);

  // Function to check if a date is in the future
  const isFutureDate = (date: Date) => {
    return date > currentDate;
  };
  
  // Reusable habit button component to handle future dates
  const HabitButton = ({ habitId, date, isCompleted }: { habitId: string, date: Date, isCompleted: boolean }) => {
    const disabled = isFutureDate(date);
    
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full w-8 h-8 ${
          isCompleted ? 'text-blue-500' : 'text-slate-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onToggleHabit(habitId, date)}
        disabled={disabled}
        title={disabled ? "Can't complete future habits" : ""}
      >
        {isCompleted ? (
          <CheckCircle className="h-6 w-6 fill-blue-500 text-white" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </Button>
    );
  };

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
      const oldIndex = filteredHabits.findIndex((habit) => habit.id === active.id);
      const newIndex = filteredHabits.findIndex((habit) => habit.id === over.id);
      
      const reorderedHabits = [...habits];
      const [removed] = reorderedHabits.splice(oldIndex, 1);
      reorderedHabits.splice(newIndex, 0, removed);
      
      onReorderHabits(reorderedHabits);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex flex-col items-center gap-1 mr-2">
            <div className="text-xs text-muted-foreground">Week</div>
            <div className="flex">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 rounded-r-none border-r-0"
                onClick={() => setWeekOffset((prev) => {
                  // Ensure we're at a whole number before subtracting
                  const wholePart = Math.floor(prev);
                  const fractionPart = prev - wholePart;
                  return wholePart - 1 + fractionPart;
                })}
                title="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 rounded-l-none"
                onClick={() => setWeekOffset((prev) => {
                  // Ensure we're at a whole number before adding
                  const wholePart = Math.floor(prev);
                  const fractionPart = prev - wholePart;
                  return wholePart + 1 + fractionPart;
                })}
                title="Next week"
                disabled={weekOffset >= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-muted-foreground">Day</div>
            <div className="flex">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 rounded-r-none border-r-0"
                onClick={() => setWeekOffset((prev) => {
                  return parseFloat((prev - 1/7).toFixed(6));
                })}
                title="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 rounded-l-none"
                onClick={() => setWeekOffset((prev) => {
                  return parseFloat((prev + 1/7).toFixed(6));
                })}
                title="Next day"
                disabled={weekOffset >= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold">
            {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
          </div>
          <div className="text-sm text-muted-foreground">
            Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="text-xs"
          >
            Today
          </Button>
        </div>
      </div>
      
      {/* Sortable habit list - weekly view (table style) */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {filterCategory === "all" ? (
          <div className="space-y-8">
            {/* Absolute habits section */}
            {filteredHabits.filter(h => h.isAbsolute).length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-lg">
                    Daily Absolute Habits
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {filteredHabits.filter(h => h.isAbsolute).length} habits
                  </Badge>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                  <div className="px-3">Habit</div>
                  {weekDates.map((date, i) => (
                    <div key={i} className="text-center">
                      {format(date, 'EEE')}
                      <span className="block">{format(date, 'd')}</span>
                    </div>
                  ))}
                </div>
                
                <SortableContext 
                  items={filteredHabits.filter(h => h.isAbsolute).map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredHabits.filter(h => h.isAbsolute).map(habit => (
                    <SortableHabit key={habit.id} habit={habit}>
                      <div className="border-t py-2 grid grid-cols-[2fr_repeat(7,1fr)] items-center">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="flex-shrink-0">
                            {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {habit.title}
                              <div className="ml-2 flex items-center">
                                {Array.from({ length: Math.floor(habit.impact / 2) }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                {habit.impact % 2 === 1 && (
                                  <StarHalf className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-1">
                              {habit.category && (
                                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                  {habit.category}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">
                                {countCompletedDaysInWeek(habit.id)}/7 daily
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
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
                        
                        {/* Weekday cells */}
                        {weekDates.map((date, i) => {
                          const isCompleted = isHabitCompletedOnDate(habit.id, date);
                          return (
                            <div key={i} className="flex justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full w-8 h-8 ${
                                  isCompleted ? 'text-blue-500' : 'text-slate-300'
                                }`}
                                onClick={() => onToggleHabit(habit.id, date)}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-6 w-6 fill-blue-500 text-white" />
                                ) : (
                                  <Circle className="h-6 w-6" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </SortableHabit>
                  ))}
                </SortableContext>
              </div>
            )}
            
            {/* Frequency-based habits section */}
            {filteredHabits.filter(h => !h.isAbsolute).length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-lg">
                    Frequency-based Habits
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {filteredHabits.filter(h => !h.isAbsolute).length} habits
                  </Badge>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
                  <div className="px-3">Habit</div>
                  {weekDates.map((date, i) => (
                    <div key={i} className="text-center">
                      {format(date, 'EEE')}
                      <span className="block">{format(date, 'd')}</span>
                    </div>
                  ))}
                </div>
                
                <SortableContext 
                  items={filteredHabits.filter(h => !h.isAbsolute).map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredHabits.filter(h => !h.isAbsolute).map(habit => (
                    <SortableHabit key={habit.id} habit={habit}>
                      <div className="border-t py-2 grid grid-cols-[2fr_repeat(7,1fr)] items-center">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="flex-shrink-0">
                            {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium flex items-center">
                              {habit.title}
                              <div className="ml-2 flex items-center">
                                {Array.from({ length: Math.floor(habit.impact / 2) }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                {habit.impact % 2 === 1 && (
                                  <StarHalf className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-1">
                              {habit.category && (
                                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                                  {habit.category}
                                </span>
                              )}
                              <span className="px-1.5 py-0.5 bg-green-50 rounded text-green-600">
                                {countCompletedDaysInWeek(habit.id)}/{habit.frequency.split('x')[0]} {habit.frequency.split('-')[1]}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
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
                        
                        {/* Weekday cells */}
                        {weekDates.map((date, i) => {
                          const isCompleted = isHabitCompletedOnDate(habit.id, date);
                          return (
                            <div key={i} className="flex justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`rounded-full w-8 h-8 ${
                                  isCompleted ? 'text-blue-500' : 'text-slate-300'
                                }`}
                                onClick={() => onToggleHabit(habit.id, date)}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-6 w-6 fill-blue-500 text-white" />
                                ) : (
                                  <Circle className="h-6 w-6" />
                                )}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </SortableHabit>
                  ))}
                </SortableContext>
              </div>
            )}
          </div>
        ) : (
          // For other filter categories, show all habits without sections
          <div>
            {/* Table header */}
            <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-xs font-medium text-muted-foreground mb-2">
              <div className="px-3">Habit</div>
              {weekDates.map((date, i) => (
                <div key={i} className="text-center">
                  {format(date, 'EEE')}
                  <span className="block">{format(date, 'd')}</span>
                </div>
              ))}
            </div>
            
            <SortableContext 
              items={filteredHabits.map(h => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredHabits.map(habit => (
                <SortableHabit key={habit.id} habit={habit}>
                  <div className="border-t py-2 grid grid-cols-[2fr_repeat(7,1fr)] items-center">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex-shrink-0">
                        {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-center">
                          {habit.title}
                          <div className="ml-2 flex items-center">
                            {Array.from({ length: Math.floor(habit.impact / 2) }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            {habit.impact % 2 === 1 && (
                              <StarHalf className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-1">
                          {habit.category && (
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                              {habit.category}
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">
                            {countCompletedDaysInWeek(habit.id)}/
                            {habit.isAbsolute ? '7 daily' : `${habit.frequency.split('x')[0]} ${habit.frequency.split('-')[1]}`}
                          </span>
                          <span className="px-1.5 py-0.5 bg-gray-50 rounded text-gray-600">
                            {habit.timeCommitment}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Weekday cells */}
                    {weekDates.map((date, i) => {
                      const isCompleted = isHabitCompletedOnDate(habit.id, date);
                      return (
                        <div key={i} className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full w-8 h-8 ${
                              isCompleted ? 'text-blue-500' : 'text-slate-300'
                            }`}
                            onClick={() => onToggleHabit(habit.id, date)}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-6 w-6 fill-blue-500 text-white" />
                            ) : (
                              <Circle className="h-6 w-6" />
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </SortableHabit>
              ))}
            </SortableContext>
          </div>
        )}
      </DndContext>
    </div>
  );
};