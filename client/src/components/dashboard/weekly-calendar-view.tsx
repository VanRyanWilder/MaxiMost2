import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Habit } from "../../types/habit";
import { HabitCompletion } from "../../types/habit-completion";
import { formatDate, getDayName, getWeekDates, formatDateShort } from "../../lib/utils";

interface WeeklyCalendarViewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: Date) => void;
  days?: number;
  showPreviousDays?: number;
}

export default function WeeklyCalendarView({
  habits,
  completions,
  onToggleCompletion,
  days = 7,
  showPreviousDays = 3,
}: WeeklyCalendarViewProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // State for the currently viewed week's start date
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const date = new Date(today);
    // Start from Sunday of current week
    date.setDate(date.getDate() - date.getDay());
    return date;
  });

  // Generate the dates for the current week view
  const weekDates = useMemo(() => {
    return getWeekDates(currentWeekStart, days);
  }, [currentWeekStart, days]);

  // Check if the current view includes today
  const viewIncludesToday = useMemo(() => {
    return weekDates.some(date => {
      return formatDate(date) === formatDate(today);
    });
  }, [weekDates, today]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - days);
    setCurrentWeekStart(newStart);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + days);
    setCurrentWeekStart(newStart);
  };

  // Navigate to current week
  const goToCurrentWeek = () => {
    const current = new Date(today);
    current.setDate(current.getDate() - current.getDay());
    setCurrentWeekStart(current);
  };

  // Function to check if a habit is completed on a specific date
  const isHabitCompleted = (habitId: string, date: Date) => {
    return completions.some(
      (completion) =>
        completion.habitId === habitId &&
        formatDate(new Date(completion.date)) === formatDate(date) &&
        completion.completed
    );
  };

  // Function to determine if a date is in the past, today, or future
  const getDateStatus = (date: Date) => {
    const dateStr = formatDate(date);
    const todayStr = formatDate(today);
    
    if (dateStr === todayStr) return 'today';
    if (date < today) return 'past';
    return 'future';
  };

  // Get the most recent 2-3 days leading up to the current week view
  const previousDays = useMemo(() => {
    if (showPreviousDays <= 0) return [];
    
    const prevDays = [];
    const firstDayOfWeek = new Date(weekDates[0]);
    
    for (let i = showPreviousDays; i > 0; i--) {
      const prevDay = new Date(firstDayOfWeek);
      prevDay.setDate(prevDay.getDate() - i);
      prevDays.push(prevDay);
    }
    
    return prevDays;
  }, [weekDates, showPreviousDays]);

  // All dates to display (previous days + week dates)
  const allDisplayDates = useMemo(() => {
    return [...previousDays, ...weekDates];
  }, [previousDays, weekDates]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
          Weekly Habit Tracker
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewIncludesToday ? "default" : "outline"} 
            size="sm" 
            onClick={goToCurrentWeek}
            className={viewIncludesToday ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[180px] min-w-[180px] text-left font-medium py-2 px-4 bg-gray-50 rounded-l-md">
                  Habit
                </th>
                {allDisplayDates.map((date, index) => {
                  const isPreviousDay = index < showPreviousDays;
                  const status = getDateStatus(date);
                  
                  return (
                    <th 
                      key={formatDate(date)} 
                      className={`text-center py-2 px-4 font-medium ${
                        isPreviousDay ? 'bg-gray-100' : 'bg-gray-50'
                      } ${status === 'today' ? 'bg-blue-50' : ''} ${
                        index === allDisplayDates.length - 1 ? 'rounded-r-md' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className={`text-xs uppercase ${
                          status === 'today' ? 'text-blue-600 font-semibold' : 
                          isPreviousDay ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {getDayName(date).slice(0, 3)}
                        </span>
                        <span className={`text-sm ${
                          status === 'today' ? 'text-blue-700 font-semibold' : 
                          isPreviousDay ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {formatDateShort(date)}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr 
                  key={habit.id} 
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${habit.iconColor}-500 flex-shrink-0`} />
                      <span className="text-sm font-medium">{habit.title}</span>
                      {habit.isAbsolute && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                variant="outline" 
                                className="ml-1 border-blue-200 bg-blue-50 text-blue-700 text-[10px] px-1 py-0"
                              >
                                must-do
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">This is a must-do habit that should be completed daily.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </td>
                  {allDisplayDates.map((date, index) => {
                    const isPreviousDay = index < showPreviousDays;
                    const isCompleted = isHabitCompleted(habit.id, date);
                    const status = getDateStatus(date);
                    const isPast = status === 'past' || status === 'today';
                    const habitFrequency = habit.frequency;
                    
                    // Determine if this date requires completion based on frequency
                    let shouldComplete = true;
                    
                    if (habitFrequency.includes('x-week')) {
                      const timesPerWeek = parseInt(habitFrequency.split('x')[0]);
                      // Just a simplified example, in a real app you'd have logic to track
                      // how many times per week the habit has been completed
                      shouldComplete = date.getDay() < timesPerWeek;
                    } else if (habitFrequency === 'weekdays') {
                      const day = date.getDay();
                      shouldComplete = day !== 0 && day !== 6; // Not weekend
                    } else if (habitFrequency === 'weekends') {
                      const day = date.getDay();
                      shouldComplete = day === 0 || day === 6; // Weekend
                    }
                    
                    return (
                      <td 
                        key={formatDate(date)} 
                        className={`text-center py-3 px-4 ${
                          isPreviousDay ? 'bg-gray-50/50' : ''
                        } ${status === 'today' ? 'bg-blue-50/50' : ''}`}
                      >
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => {
                              if (isPast) onToggleCompletion(habit.id, date);
                            }}
                            className={`h-5 w-5 ${
                              isCompleted 
                                ? `bg-${habit.iconColor}-500 text-white border-${habit.iconColor}-500` 
                                : 'border-gray-300'
                            } ${!shouldComplete ? 'opacity-50' : ''} ${
                              !isPast ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
                            }`}
                            disabled={!isPast}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}