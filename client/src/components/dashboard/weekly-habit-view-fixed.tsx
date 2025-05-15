import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, addDays, isSameDay, isBefore, isAfter } from 'date-fns';
import { 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  PlusCircle, 
  Settings,
  BarChart,
  CheckCircle2,
  Circle,
  Award,
  Zap,
  Activity,
  Dumbbell,
  Brain,
  Heart,
  Droplets,
  BookOpen,
  Users,
  Pencil,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { EditHabitDialog } from "./edit-habit-dialog";

// Types for habits - match with dashboard.tsx
type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean;
  category: HabitCategory;
  lastCompleted?: Date | null;
  streak: number;
  createdAt: Date;
  type?: "principle" | "custom" | "default";
  principle?: string;
}

interface HabitCompletion {
  habitId: string;
  date: Date;
  completed: boolean;
}

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

  // Function to get icon component
  const getIconComponent = (icon: string) => {
    switch(icon) {
      case 'dumbbell': return <Dumbbell className="h-4 w-4" />;
      case 'brain': return <Brain className="h-4 w-4" />;
      case 'heart': return <Heart className="h-4 w-4" />;
      case 'water': 
      case 'droplets': return <Droplets className="h-4 w-4" />;
      case 'book':
      case 'bookopen': return <BookOpen className="h-4 w-4" />;
      case 'check': return <Check className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'sparkle': return <Zap className="h-4 w-4" />;
      case 'medal': return <Award className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  // Function to handle editing a habit
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditDialogOpen(true);
  };
  
  // Function to save updated habit
  const handleSaveHabit = (updatedHabit: Habit) => {
    if (onUpdateHabit) {
      onUpdateHabit(updatedHabit);
    }
  };

  // Filter habits based on category
  const filteredHabits = habits.filter(habit => 
    filterCategory === 'all' || habit.category === filterCategory
  );

  // Group habits by absolute vs. optional
  const absoluteHabits = filteredHabits.filter(h => h.isAbsolute);
  const optionalHabits = filteredHabits.filter(h => !h.isAbsolute);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-medium">Weekly Habit Calendar</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(weekOffset - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}
          </span>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(weekOffset + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge 
          variant={filterCategory === 'all' ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilterCategory('all')}
        >
          All
        </Badge>
        <Badge 
          variant={filterCategory === 'health' ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilterCategory('health')}
        >
          Health
        </Badge>
        <Badge 
          variant={filterCategory === 'fitness' ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilterCategory('fitness')}
        >
          Fitness
        </Badge>
        <Badge 
          variant={filterCategory === 'mind' ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilterCategory('mind')}
        >
          Mind
        </Badge>
        <Badge 
          variant={filterCategory === 'social' ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setFilterCategory('social')}
        >
          Social
        </Badge>
      </div>
      
      {/* Week day headers */}
      <div className="grid grid-cols-8 gap-1 mb-3 bg-muted/20 rounded-lg p-3">
        <div className="text-sm font-medium text-muted-foreground pl-2">Habit</div>
        {weekDates.map((date, i) => (
          <div key={i} className="text-center">
            <div className="text-xs font-medium text-muted-foreground">
              {format(date, 'EEE')}
            </div>
            <div 
              className={`text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto
                ${isSameDay(date, today) ? 'bg-primary text-primary-foreground' : 'text-foreground'}
              `}
            >
              {format(date, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Absolute habits section */}
      {absoluteHabits.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">Daily Absolutes</Badge>
            <div className="text-xs text-muted-foreground">Must-do habits for maximum ROI</div>
          </div>
          
          <div className="space-y-2">
            {absoluteHabits.map(habit => (
              <div key={habit.id} className="grid grid-cols-8 gap-1 items-center p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-muted-foreground">{getIconComponent(habit.icon)}</span>
                  <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                    {habit.title}
                    {habit.streak && habit.streak > 0 && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] py-0 h-4 px-1">
                          {habit.streak}d
                        </Badge>
                      </span>
                    )}
                  </span>
                  
                  {/* Edit button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Habit
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
                        className={`rounded-full h-7 w-7 flex items-center justify-center transition-colors
                          ${completed 
                            ? 'bg-primary text-white hover:bg-primary/90' 
                            : isPast && !completed
                              ? 'border border-red-300 text-muted-foreground hover:border-red-500'
                              : 'border text-muted-foreground hover:border-primary/80'
                          }
                          ${isSameDay(date, today) ? 'ring-2 ring-offset-1 ring-primary/30' : ''}
                          ${isFuture ? 'opacity-40' : ''}
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

      {/* Additional habits section */}
      {optionalHabits.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">Additional Habits</Badge>
            <div className="text-xs text-muted-foreground">Flexible habits to enhance your routine</div>
          </div>
          
          <div className="space-y-2">
            {optionalHabits.map(habit => (
              <div key={habit.id} className="grid grid-cols-8 gap-1 items-center p-3 rounded-lg bg-muted/5 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-muted-foreground">{getIconComponent(habit.icon)}</span>
                  <div className="min-w-0 flex flex-col">
                    <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {habit.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {habit.frequency === 'weekly' ? 'Weekly' :
                      habit.frequency === '2x-week' ? '2× week' :
                      habit.frequency === '3x-week' ? '3× week' :
                      habit.frequency === '4x-week' ? '4× week' : 'Custom'}
                    </span>
                  </div>
                  
                  {/* Edit button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleEditHabit(habit)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Habit
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
                        className={`rounded-full h-7 w-7 flex items-center justify-center transition-colors
                          ${completed 
                            ? 'bg-primary text-white hover:bg-primary/90' 
                            : isPast && !completed
                              ? 'border border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/70'
                              : 'border text-muted-foreground hover:border-primary/50'
                          }
                          ${isSameDay(date, today) ? 'ring-2 ring-offset-1 ring-primary/30' : ''}
                          ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}
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
            ))}
          </div>
        </div>
      )}

      {/* Add new habit button */}
      <div className="mt-6">
        <Button 
          variant="default" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1.5 h-10"
          onClick={onAddHabit}
        >
          <PlusCircle className="h-4 w-4" />
          <span className="font-medium">Add New Habit</span>
        </Button>
        <div className="text-xs text-center text-muted-foreground mt-2">
          Build your habit stack one at a time for maximum consistency
        </div>
      </div>
      
      {/* Edit Habit Dialog */}
      <EditHabitDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        habit={selectedHabit}
        onSave={handleSaveHabit}
        onDelete={onDeleteHabit}
      />
    </div>
  );
};