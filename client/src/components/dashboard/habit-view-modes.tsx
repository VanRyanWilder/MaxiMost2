import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, isBefore, isAfter } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Star
} from 'lucide-react';

// Import habit types
import type { Habit } from '@/types/habit';
import type { HabitCompletion } from '@/types/habit-completion';

// Function to get icon component based on icon string
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    activity: <Activity className="h-4 w-4" />,
    calendar: <Calendar className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
    award: <Award className="h-4 w-4" />,
    // Add more icons as needed
  };

  return iconMap[iconName.toLowerCase()] || <Activity className="h-4 w-4" />;
}

// Interface for the component props
interface HabitViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onUpdateHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export const HabitViewModes: React.FC<HabitViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // Generate dates for the week
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });

  // Function to check if a habit is completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date) && 
      c.completed
    );
  };

  // Filter habits based on selected category
  let filteredHabits = [...habits];
  
  if (filterCategory === "absolute") {
    filteredHabits = habits.filter(h => h.isAbsolute);
  } else if (filterCategory === "optional") {
    filteredHabits = habits.filter(h => !h.isAbsolute);
  } else if (filterCategory !== "all") {
    filteredHabits = habits.filter(h => h.category === filterCategory);
  }

  // Count completed days in the current week for a habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.reduce((count, date) => {
      return count + (isHabitCompletedOnDate(habitId, date) ? 1 : 0);
    }, 0);
  };

  // Check if a habit has met its weekly frequency target
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedCount = countCompletedDaysInWeek(habit.id);
    const targetCount = habit.frequency === 'daily' ? 7 : 
                       habit.frequency === '2x-week' ? 2 :
                       habit.frequency === '3x-week' ? 3 :
                       habit.frequency === '4x-week' ? 4 :
                       habit.frequency === '5x-week' ? 5 :
                       habit.frequency === '6x-week' ? 6 : 1;
    
    return completedCount >= targetCount;
  };

  // Handle editing a habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
  };

  // Handle saving edited habit
  const handleSaveHabit = (updatedHabit: Habit) => {
    setSelectedHabit(null);
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabit);
    }
  };

  // Handle deleting a habit
  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };

  // Handle creating a new habit
  const handleCreateHabit = () => {
    onAddHabit();
  };

  // Combine all habits into a single list with appropriate badges to show their type/frequency
  const allHabits = filteredHabits.map(habit => ({
    ...habit,
    displayBadge: habit.isAbsolute 
      ? <Badge variant="default" className="px-1 py-0 h-4 text-[10px] bg-blue-500 hover:bg-blue-500">Daily</Badge>
      : <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] bg-gray-50">{getFrequencyLabel(habit.frequency)}</Badge>
  }));

  // Helper to get a readable frequency label
  function getFrequencyLabel(frequency: string): string {
    switch(frequency) {
      case 'daily': return 'Daily';
      case '2x-week': return '2x Week';
      case '3x-week': return '3x Week';
      case '4x-week': return '4x Week';
      case '5x-week': return '5x Week';
      case '6x-week': return '6x Week';
      default: return frequency;
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="h-8 w-8"
            disabled={weekOffset >= 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {weekOffset !== 0 && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setWeekOffset(0)}
              className="h-8 px-2"
            >
              Today
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-0.5 border rounded-md bg-background p-0.5">
            <Button 
              variant={viewMode === "daily" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("daily")}
              className="h-7 rounded-sm px-2"
            >
              <Calendar className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "weekly" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("weekly")}
              className="h-7 rounded-sm px-2"
            >
              <CalendarDays className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant={viewMode === "monthly" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setViewMode("monthly")}
              className="h-7 rounded-sm px-2"
            >
              <Calendar className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {/* Filter menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <span>{filterCategory === "all" ? "All Categories" : 
                      filterCategory === "absolute" ? "Absolute Daily Habits" :
                      filterCategory === "optional" ? "Frequency Habits" :
                      filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("absolute")}>
                Absolute Daily Habits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("optional")}>
                Frequency Habits
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Add Habit button */}
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleCreateHabit}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </Button>
        </div>
      </div>
      
      {/* Week days header - only display in weekly view */}
      {viewMode === "weekly" && (
        <div className="grid grid-cols-8 gap-1 text-center border-b pb-2">
          <div className="font-medium text-sm">Habits</div>
          {weekDates.map((date, i) => (
            <div
              key={i}
              className={`text-xs font-medium ${isSameDay(date, today) ? 'text-primary' : ''}`}
            >
              <div>{format(date, 'EEE')}</div>
              <div className={`text-[11px] ${isSameDay(date, today) ? 'bg-primary text-white rounded-full px-1.5 -mx-0.5' : 'text-muted-foreground'}`}>
                {format(date, 'd')}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Unified Habit List - No visual separation between absolute and optional habits */}
      <div className="space-y-2">
        {allHabits.map(habit => (
          <div 
            key={habit.id} 
            className={`grid ${viewMode === 'weekly' ? 'grid-cols-8' : 'grid-cols-1'} gap-1 items-center p-3 rounded-lg border shadow-sm transition-colors
              ${habit.streak > 0 ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-transparent' : 'border-slate-200'}
            `}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className={`p-1.5 rounded-md ${habit.streak > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {getIconComponent(habit.icon)}
              </div>
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">{habit.title}</span>
                  {habit.displayBadge}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {habit.streak > 0 && (
                    <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] flex items-center gap-0.5 bg-blue-500/10 text-blue-700 border-blue-200">
                      <Award className="h-2.5 w-2.5" /> {habit.streak}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Weekly view checkboxes */}
            {viewMode === "weekly" && weekDates.map((date, i) => {
              const completed = isHabitCompletedOnDate(habit.id, date);
              const isPast = isBefore(date, today) && !isSameDay(date, today);
              const isFuture = isAfter(date, today);
              
              return (
                <div key={i} className="flex justify-center">
                  <button 
                    onClick={() => onToggleHabit(habit.id, date)}
                    disabled={isFuture}
                    className={`flex items-center justify-center transition-all duration-200 ease-in-out
                      ${completed 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md shadow-sm rounded-full h-8 w-8 scale-105 border border-blue-400' 
                        : isPast && !completed
                          ? 'bg-white border border-muted-foreground/30 text-muted-foreground hover:border-blue-300 rounded-full h-7 w-7'
                          : isSameDay(date, today) && !isFuture
                            ? 'bg-white border-2 border-blue-300 text-muted-foreground hover:border-blue-400 rounded-full h-7 w-7'
                            : 'bg-white border border-muted-foreground/20 text-muted-foreground hover:border-blue-300 rounded-full h-7 w-7'
                      }
                      ${isSameDay(date, today) && !isFuture ? 'ring-2 ring-offset-1 ring-blue-200' : ''}
                      ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    title={`${format(date, 'EEEE, MMM d')} - ${completed ? 'Completed' : 'Not completed'}`}
                  >
                    {completed && <Check className="h-4 w-4" />}
                  </button>
                </div>
              );
            })}
            
            {/* Daily view completion toggle */}
            {viewMode === "daily" && (
              <div className="flex justify-end mt-2">
                <Button
                  variant={isHabitCompletedOnDate(habit.id, today) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleHabit(habit.id, today)}
                  className="gap-1"
                >
                  {isHabitCompletedOnDate(habit.id, today) ? (
                    <>
                      <Check className="h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Monthly view */}
            {viewMode === "monthly" && (
              <div className="flex flex-col mt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {!habit.isAbsolute && `${countCompletedDaysInWeek(habit.id)}/${habit.frequency === 'daily' ? 7 : 
                      habit.frequency === '2x-week' ? 2 :
                      habit.frequency === '3x-week' ? 3 :
                      habit.frequency === '4x-week' ? 4 :
                      habit.frequency === '5x-week' ? 5 :
                      habit.frequency === '6x-week' ? 6 : 1} this week`}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditHabit(habit)}
                      className="h-7 w-7 p-0"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {allHabits.length === 0 && (
          <div className="text-center py-8 border rounded-lg bg-muted/20">
            <div className="text-muted-foreground">No habits found</div>
            <Button variant="link" onClick={handleCreateHabit} className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              Add your first habit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};