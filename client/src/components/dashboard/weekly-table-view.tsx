import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Circle, CheckCircle, Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Habit } from "@/types/habit";

// Map of habit icons to their emoji representations
const habitIcons: { [key: string]: string } = {
  "water": "💧",
  "food": "🍎",
  "exercise": "🏃‍♂️",
  "sleep": "😴",
  "meditation": "🧘‍♂️",
  "reading": "📚",
  "writing": "✍️",
  "coding": "💻",
  "cleaning": "🧹",
  "learning": "🎓",
  "social": "👥",
  "health": "❤️",
  "work": "💼",
  "finance": "💰",
  "creative": "🎨",
  "music": "🎵",
  "cooking": "🍳",
  "family": "👨‍👩‍👧‍👦",
  "gratitude": "🙏",
  "journal": "📓",
  "stretching": "🤸‍♂️",
  "vitamins": "💊",
  "skincare": "✨",
  "phone": "📱",
  "sunny": "☀️",
  "walk": "🚶‍♂️",
  "gym": "🏋️‍♂️",
  "supplements": "💊",
  "protein": "🥩",
  "nosnack": "🚫"
};
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
  // Filter habits based on category
  const filteredHabits = 
    filterCategory === "all" 
      ? habits 
      : habits.filter(habit => habit.category === filterCategory);

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
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setWeekOffset(prev => prev - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <div className="text-xl font-bold">
            {format(weekDates[0], 'MMMM d')} - {format(weekDates[6], 'MMMM d, yyyy')}
          </div>
          <div className="text-sm text-muted-foreground">
            Week {weekOffset === 0 ? '(Current)' : weekOffset > 0 ? `+${weekOffset}` : weekOffset}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setWeekOffset(prev => prev + 1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
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
                          <span className="text-lg" style={{ color: habit.iconColor || '#4299e1' }}>
                            {habitIcons[habit.icon] || '⚪'}
                          </span>
                          <div>
                            <div className="font-medium">{habit.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {habit.category && (
                                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 mr-1">
                                  {habit.category}
                                </span>
                              )}
                              <span>{countCompletedDaysInWeek(habit.id)}/7 daily</span>
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
                          <span className="text-lg" style={{ color: habit.iconColor || '#4299e1' }}>
                            {habitIcons[habit.icon] || '⚪'}
                          </span>
                          <div>
                            <div className="font-medium">{habit.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {habit.category && (
                                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 mr-1">
                                  {habit.category}
                                </span>
                              )}
                              <span>{countCompletedDaysInWeek(habit.id)}/{habit.frequency.split('x')[0]} {habit.frequency.split('-')[1]}</span>
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
                      <span className="text-lg" style={{ color: habit.iconColor || '#4299e1' }}>
                        {habitIcons[habit.icon] || '⚪'}
                      </span>
                      <div>
                        <div className="font-medium">{habit.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {habit.category && (
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 mr-1">
                              {habit.category}
                            </span>
                          )}
                          <span>
                            {countCompletedDaysInWeek(habit.id)}/
                            {habit.isAbsolute ? '7 daily' : `${habit.frequency.split('x')[0]} ${habit.frequency.split('-')[1]}`}
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