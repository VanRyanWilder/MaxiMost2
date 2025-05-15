import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfWeek, subDays, addDays, isSameDay, isBefore, isAfter } from 'date-fns';
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
  Users
} from 'lucide-react';

// Types from streak-habit-tracker
type Frequency = "daily" | "weekly" | "custom" | "2x-week" | "3x-week" | "4x-week";

type Habit = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode | string;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: string;
  frequency: Frequency;
  isAbsolute: boolean; // If true, this is a "must-do" activity
  lastCompleted?: Date | null;
  streak?: number;
  type?: "principle" | "custom" | "default"; // Used to identify types of habits
  principle?: string; // For daily principle activities
  category?: string; // Health, Fitness, Mind, Social
};

type HabitCompletion = {
  habitId: string;
  date: Date;
  completed: boolean;
};

type WeeklyHabitViewProps = {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
};

export const WeeklyHabitView: React.FC<WeeklyHabitViewProps> = ({
  habits,
  completions,
  onToggleHabit,
  onAddHabit
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
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
  const getIconComponent = (icon: React.ReactNode | string) => {
    if (React.isValidElement(icon)) return icon;
    
    switch(icon) {
      case 'dumbbell': return <Dumbbell className="h-4 w-4" />;
      case 'brain': return <Brain className="h-4 w-4" />;
      case 'heart': return <Heart className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'check': return <Check className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'sparkle': return <Zap className="h-4 w-4" />;
      case 'medal': return <Award className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
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
      <div className="grid grid-cols-8 gap-1 mb-3 text-center text-xs font-medium text-muted-foreground">
        <div className="text-left pl-2">Habit</div>
        {weekDates.map((date, i) => (
          <div key={i} className={`${isSameDay(date, today) ? 'text-primary font-bold' : ''}`}>
            {format(date, 'E')}
            <div>{format(date, 'd')}</div>
          </div>
        ))}
      </div>

      {/* Absolute habits section */}
      {absoluteHabits.length > 0 && (
        <>
          <div className="text-sm font-medium mb-2 text-muted-foreground">Daily Absolutes</div>
          {absoluteHabits.map(habit => (
            <div key={habit.id} className="grid grid-cols-8 gap-1 mb-3 items-center">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground">{getIconComponent(habit.icon)}</span>
                <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{habit.title}</span>
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
                      className={`rounded-full h-6 w-6 flex items-center justify-center 
                        ${completed 
                          ? 'bg-primary text-white' 
                          : isPast 
                            ? 'border border-red-300 text-muted-foreground' 
                            : 'border text-muted-foreground hover:border-primary/80'
                        }
                        ${isSameDay(date, today) ? 'ring-2 ring-offset-1 ring-primary/30' : ''}
                        ${isFuture ? 'opacity-40' : ''}
                      `}
                    >
                      {completed && <Check className="h-3 w-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}

      {/* Optional habits section */}
      {optionalHabits.length > 0 && (
        <>
          <div className="text-sm font-medium mb-2 mt-5 text-muted-foreground">Optional Habits</div>
          {optionalHabits.map(habit => (
            <div key={habit.id} className="grid grid-cols-8 gap-1 mb-3 items-center">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-muted-foreground">{getIconComponent(habit.icon)}</span>
                <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">{habit.title}</span>
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
                      className={`rounded-full h-6 w-6 flex items-center justify-center 
                        ${completed 
                          ? 'bg-primary text-white' 
                          : isPast 
                            ? 'border border-red-300 text-muted-foreground' 
                            : 'border text-muted-foreground hover:border-primary/80'
                        }
                        ${isSameDay(date, today) ? 'ring-2 ring-offset-1 ring-primary/30' : ''}
                        ${isDisabled ? 'opacity-40' : ''}
                        ${(isWeeklyHabit && !isFirstDayOfWeek) ? 'opacity-20' : ''}
                      `}
                    >
                      {completed && <Check className="h-3 w-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}

      {/* Add new habit button */}
      <div className="mt-5">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1"
          onClick={onAddHabit}
        >
          <PlusCircle className="h-4 w-4" />
          Add New Habit
        </Button>
      </div>
    </div>
  );
};