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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { EditHabitDialog } from './edit-habit-dialog';
import {
  Activity,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  PlusCircle,
  Trash2,
  ChevronDown,
  CalendarDays,
  Zap,
  ListTodo,
  Award,
  Star
} from 'lucide-react';

// Import habit types
import type { Habit, HabitCompletion, HabitFrequency, HabitCategory } from '@/types/habit';

// Function to get icon component based on icon string
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ReactNode> = {
    activity: <Activity className="h-4 w-4" />,
    calendar: <Calendar className="h-4 w-4" />,
    zap: <Zap className="h-4 w-4" />,
    star: <Star className="h-4 w-4" />,
    award: <Award className="h-4 w-4" />,
    list: <ListTodo className="h-4 w-4" />,
    // Add more icons as needed
  };

  return iconMap[iconName.toLowerCase()] || <Activity className="h-4 w-4" />;
}

// Interface for the component props
interface WeeklyHabitViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onUpdateHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export const WeeklyHabitView: React.FC<WeeklyHabitViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
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

  // Function to count completed days in the current week for a habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.filter(date => isHabitCompletedOnDate(habitId, date)).length;
  };

  // Check if the habit has met its weekly frequency requirement
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedDays = countCompletedDaysInWeek(habit.id);
    const targetDays = habit.frequency === 'daily' ? 7 : 
                     habit.frequency === '2x-week' ? 2 :
                     habit.frequency === '3x-week' ? 3 :
                     habit.frequency === '4x-week' ? 4 : 
                     habit.frequency === '5x-week' ? 5 :
                     habit.frequency === '6x-week' ? 6 : 1;
    
    return completedDays >= targetDays;
  };

  // Handle edit habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditDialogOpen(true);
  };

  // Handle saving edited habit
  const handleSaveHabit = (updatedHabit: Habit) => {
    setEditDialogOpen(false);
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

  // Filter habits based on selected category
  const filteredHabits = habits.filter(habit => 
    filterCategory === "all" || 
    habit.category === filterCategory ||
    (filterCategory === "absolute" && habit.isAbsolute) ||
    (filterCategory === "optional" && !habit.isAbsolute)
  );

  // Separate absolute and optional habits
  const absoluteHabits = filteredHabits.filter(h => h.isAbsolute);
  const optionalHabits = filteredHabits.filter(h => !h.isAbsolute);

  return (
    <div className="space-y-6">
      {/* Week navigation and filter */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <span>{filterCategory === "all" ? "All Categories" : 
                      filterCategory === "absolute" ? "Absolute Habits" :
                      filterCategory === "optional" ? "Optional Habits" :
                      filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("absolute")}>
                Absolute Habits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("optional")}>
                Optional Habits
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("health")}>
                Health
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("fitness")}>
                Fitness
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("mind")}>
                Mind
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterCategory("social")}>
                Social
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Week days header */}
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
      
      {/* Absolute habits (always do) */}
      {absoluteHabits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium text-sm">Absolute Habits</h3>
            <span className="text-xs text-muted-foreground">(Do these every day)</span>
          </div>
          
          <div className="space-y-2">
            {absoluteHabits.map(habit => (
              <div 
                key={habit.id} 
                className={`grid grid-cols-8 gap-1 items-center p-3 rounded-lg border shadow-sm transition-colors
                  ${habit.streak > 0 ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-transparent' : 'border-slate-200'}
                `}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className={`p-1.5 rounded-md ${habit.streak > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {getIconComponent(habit.icon)}
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">{habit.title}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-gray-50">
                        {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                      </Badge>
                      
                      {habit.streak > 0 && (
                        <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] flex items-center gap-0.5 bg-blue-500/10 text-blue-700 border-blue-200">
                          <Award className="h-2.5 w-2.5" /> {habit.streak}
                        </Badge>
                      )}
                    </div>
                  </div>
                
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto opacity-70 hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Habit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Habit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {weekDates.map((date, i) => {
                  const completed = isHabitCompletedOnDate(habit.id, date);
                  const isPast = isBefore(date, today) && !isSameDay(date, today);
                  const isFuture = isAfter(date, today) && !isSameDay(date, today);
                  
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
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Optional habits (frequency-based) */}
      {optionalHabits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium text-sm">Additional Habits</h3>
            <span className="text-xs text-muted-foreground">(Based on your target frequency)</span>
          </div>
          
          <div className="space-y-3">
            {optionalHabits.map(habit => {
              // Calculate completion count for this habit
              const completedCount = countCompletedDaysInWeek(habit.id);
              const targetCount = habit.frequency === 'daily' ? 7 : 
                            habit.frequency === '2x-week' ? 2 :
                            habit.frequency === '3x-week' ? 3 :
                            habit.frequency === '4x-week' ? 4 : 1;
              const progressPercent = Math.min(100, Math.round((completedCount / targetCount) * 100));
              
              return (
                <div 
                  key={habit.id} 
                  className={`grid grid-cols-8 gap-1 items-center p-4 rounded-xl border shadow-sm transition-all duration-200
                    ${hasMetWeeklyFrequency(habit) 
                      ? 'bg-gradient-to-r from-green-50 to-transparent border-green-200' 
                      : 'bg-gradient-to-r from-blue-50/40 to-transparent border-blue-100/50 hover:from-blue-50/60'}
                  `}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`p-1.5 rounded-md flex-shrink-0 ${hasMetWeeklyFrequency(habit) ? 'bg-green-100 text-green-600' : 'bg-blue-100/50 text-blue-600'}`}>
                      {getIconComponent(habit.icon)}
                    </div>
                    <div className="min-w-0 flex flex-col">
                      <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
                        {habit.title}
                      </span>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border-${habit.category}-200 bg-${habit.category}-50/50`}>
                          {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {completedCount}/{targetCount} {habit.frequency} 
                        </span>
                      </div>
                    </div>
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-auto opacity-70 hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Habit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Habit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                
                  {weekDates.map((date, i) => {
                    const completed = isHabitCompletedOnDate(habit.id, date);
                    const isPast = isBefore(date, today) && !isSameDay(date, today);
                    const isFuture = isAfter(date, today) && !isSameDay(date, today);
                    
                    // For weekly habits, only enable the first day of the week
                    const isWeeklyHabit = habit.frequency === 'weekly';
                    const isFirstDayOfWeek = i === 0;
                    const isDisabled = isFuture || (isWeeklyHabit && !isFirstDayOfWeek);
                    
                    return (
                      <div key={i} className="flex justify-center">
                        <button 
                          onClick={() => onToggleHabit(habit.id, date)}
                          disabled={isDisabled}
                          className={`flex items-center justify-center transition-all duration-200 ease-in-out
                            ${completed 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-md shadow-sm rounded-full h-8 w-8 scale-105 border border-blue-400' 
                              : isPast && !completed
                                ? 'bg-white border border-muted-foreground/30 text-muted-foreground hover:border-blue-300 rounded-full h-7 w-7'
                                : isSameDay(date, today) && !isDisabled
                                  ? 'bg-white border-2 border-blue-300 text-muted-foreground hover:border-blue-400 rounded-full h-7 w-7'
                                  : 'bg-white border border-muted-foreground/20 text-muted-foreground hover:border-blue-300 rounded-full h-7 w-7'
                            }
                            ${isSameDay(date, today) && !isDisabled ? 'ring-2 ring-offset-1 ring-blue-200' : ''}
                            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                            ${(isWeeklyHabit && !isFirstDayOfWeek) ? 'opacity-20 cursor-not-allowed' : ''}
                          `}
                          title={`${format(date, 'EEEE, MMM d')} - ${isWeeklyHabit && !isFirstDayOfWeek ? 'Weekly habit - check only once per week' : completed ? 'Completed' : 'Not completed'}`}
                        >
                          {completed && <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add new habit button */}
      <div className="mt-6">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1.5 h-10"
          onClick={handleCreateHabit}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium">Add New Habit</span>
        </Button>
        <div className="text-xs text-center text-muted-foreground mt-2">
          Add your own habits or use our templates to get started
        </div>
      </div>
      
      {/* Edit habit dialog */}
      <EditHabitDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        habit={selectedHabit}
        onSave={handleSaveHabit}
        onDelete={handleDeleteHabit}
      />
    </div>
  );
};