import React, { useState, useEffect } from "react";
import { format, isFuture, addDays, startOfWeek, endOfWeek, isSameDay, startOfDay, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, PlusCircle, Pencil, Trash2, MoreVertical, Star, StarHalf, CheckCircle, Check as CheckIcon, CheckSquare, Target } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { HabitButton } from "./habit-button";
import { ConfettiCelebration } from "@/components/ui/confetti-celebration";

// Color utility functions for habits
const getColorStyle = (color: string, type: 'text' | 'bg' | 'border' | 'textMuted' = 'text') => {
  const colorMap: Record<string, Record<string, string>> = {
    red: { 
      text: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-100 dark:bg-red-950/30', 
      border: 'border-red-200 dark:border-red-900',
      textMuted: 'text-red-700/80 dark:text-red-400/80'
    },
    orange: { 
      text: 'text-orange-600 dark:text-orange-400', 
      bg: 'bg-orange-100 dark:bg-orange-950/30', 
      border: 'border-orange-200 dark:border-orange-900',
      textMuted: 'text-orange-700/80 dark:text-orange-400/80'
    },
    amber: { 
      text: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-100 dark:bg-amber-950/30', 
      border: 'border-amber-200 dark:border-amber-900',
      textMuted: 'text-amber-700/80 dark:text-amber-400/80'
    },
    yellow: { 
      text: 'text-yellow-600 dark:text-yellow-400', 
      bg: 'bg-yellow-100 dark:bg-yellow-950/30', 
      border: 'border-yellow-200 dark:border-yellow-900',
      textMuted: 'text-yellow-700/80 dark:text-yellow-400/80'
    },
    green: { 
      text: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-100 dark:bg-green-950/30', 
      border: 'border-green-200 dark:border-green-900',
      textMuted: 'text-green-700/80 dark:text-green-400/80'
    },
    blue: { 
      text: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-100 dark:bg-blue-950/30', 
      border: 'border-blue-200 dark:border-blue-900',
      textMuted: 'text-blue-700/80 dark:text-blue-400/80'
    },
    indigo: { 
      text: 'text-indigo-600 dark:text-indigo-400', 
      bg: 'bg-indigo-100 dark:bg-indigo-950/30', 
      border: 'border-indigo-200 dark:border-indigo-900',
      textMuted: 'text-indigo-700/80 dark:text-indigo-400/80'
    },
    purple: { 
      text: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-100 dark:bg-purple-950/30', 
      border: 'border-purple-200 dark:border-purple-900',
      textMuted: 'text-purple-700/80 dark:text-purple-400/80'
    }
  };
  
  // Default color if not found
  if (!color || !colorMap[color]) {
    return colorMap.blue[type];
  }
  
  return colorMap[color][type];
};

// Get background color style for habits
const getColorBgStyle = (color: string) => {
  // Safer approach that works in both browser and SSR
  const prefersDark = false; // Default to light mode
  
  const colorMap: Record<string, { light: string, dark: string }> = {
    red: { light: '#FEF2F2', dark: '#450A0A' },
    orange: { light: '#FFF7ED', dark: '#431407' },
    amber: { light: '#FFFBEB', dark: '#451A03' },
    yellow: { light: '#FEFCE8', dark: '#422006' },
    green: { light: '#F0FDF4', dark: '#052E16' },
    blue: { light: '#EFF6FF', dark: '#172554' },
    indigo: { light: '#EEF2FF', dark: '#1E1B4B' },
    purple: { light: '#FAF5FF', dark: '#3B0764' }
  };
  
  if (!color || !colorMap[color]) {
    return prefersDark ? '#0F172A' : '#FFFFFF';
  }
  
  return prefersDark ? colorMap[color].dark : colorMap[color].light;
};

interface WeeklyTableViewProps {
  habits: Habit[];
  completions: any[]; // Replace with proper type
  weekDates: Date[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onEditHabit?: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
  onReorderHabits: (reorderedHabits: Habit[]) => void;
  selectedCategory: string;
  currentDay: Date;
}

export function WeeklyTableViewColor({ 
  habits, 
  completions, 
  weekDates,
  onToggleHabit,
  onAddHabit,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  selectedCategory,
  currentDay
}: WeeklyTableViewProps) {
  const today = startOfToday();
  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : selectedCategory === 'absolute'
      ? habits.filter(h => h.isAbsolute)
      : selectedCategory === 'frequency'
        ? habits.filter(h => !h.isAbsolute)
        : habits.filter(h => h.category === selectedCategory);
    
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
      const activeHabitId = String(active.id);
      const overHabitId = String(over.id);
      
      // Find indices in the full habits array, not filtered
      const oldIndex = habits.findIndex(h => h.id === activeHabitId);
      const newIndex = habits.findIndex(h => h.id === overHabitId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a new array with the moved item
        const reorderedHabits = [...habits];
        const [movedItem] = reorderedHabits.splice(oldIndex, 1);
        reorderedHabits.splice(newIndex, 0, movedItem);
        
        // Call the reorder callback with the new array
        onReorderHabits(reorderedHabits);
      }
    }
  };
  
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      new Date(c.date).toDateString() === date.toDateString() && 
      c.completed
    );
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
  
  // Count completed days in the week for a habit
  const countCompletedDaysInWeek = (habitId: string): number => {
    return weekDates.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
  };
  
  // Get target completion count based on habit frequency
  const getTargetDays = (habit: Habit): number => {
    switch (habit.frequency) {
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
  
  // Check if habit has met its weekly frequency
  const hasMetWeeklyFrequency = (habit: Habit): boolean => {
    const completedDays = countCompletedDaysInWeek(habit.id);
    return completedDays >= getTargetDays(habit);
  };
  
  const handleEditHabit = (habit: Habit) => {
    console.log("Weekly table view - Edit habit clicked:", habit);
    
    // Make sure we have the required color and icon for MaxiMost categories
    let iconColor = habit.iconColor || "blue";
    let icon = habit.icon || "zap";
    
    // Ensure appropriate colors for MaxiMost categories
    switch (habit.category) {
      case "physical": 
        iconColor = "red"; 
        icon = icon === "zap" ? "dumbbell" : icon;
        break;
      case "nutrition": 
        iconColor = "orange"; 
        icon = icon === "zap" ? "utensils" : icon;
        break;
      case "sleep": 
        iconColor = "indigo"; 
        icon = icon === "zap" ? "moon" : icon;
        break;
      case "mental": 
        iconColor = "yellow"; 
        icon = icon === "zap" ? "brain" : icon;
        break;
      case "relationships": 
        iconColor = "green"; 
        icon = icon === "zap" ? "users" : icon;
        break;
      case "financial": 
        iconColor = "emerald"; 
        icon = icon === "zap" ? "circleDollarSign" : icon;
        break;
    }
    
    // Ensure we have required fields for the enhanced dialog
    const enrichedHabit = {
      ...habit,
      iconColor,
      icon,
      description: habit.description || "",
      impact: habit.impact || 8,
      effort: habit.effort || 4,
      timeCommitment: habit.timeCommitment || "10 min"
    };
    
    console.log("Weekly table view - Calling onEditHabit with:", enrichedHabit);
    
    if (onEditHabit) {
      onEditHabit(enrichedHabit);
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    if (onDeleteHabit) {
      onDeleteHabit(habitId);
    }
  };
  
  const handleAddHabit = () => {
    console.log("Weekly table view - Triggering add habit dialog");
    // Call onAddHabit with no parameters to trigger enhanced dialog
    onAddHabit();
  };

  // Split habits into absolute and frequency-based
  const absoluteHabits = filteredHabits.filter(h => h.isAbsolute);
  const frequencyHabits = filteredHabits.filter(h => !h.isAbsolute);

  // Function to get cell background color based on habit color
  const getCellBgColor = (habit: Habit, isCurrentDay: boolean) => {
    if (isCurrentDay) {
      switch (habit.iconColor) {
        case 'red': return '#FEF2F2';
        case 'orange': return '#FFF7ED';
        case 'amber': return '#FFFBEB';
        case 'yellow': return '#FEFCE8';
        case 'green': return '#F0FDF4';
        case 'indigo': return '#EEF2FF';
        case 'purple': return '#FAF5FF';
        default: return '#EFF6FF'; // blue
      }
    } else {
      switch (habit.iconColor) {
        case 'red': return 'rgba(254, 242, 242, 0.4)';
        case 'orange': return 'rgba(255, 247, 237, 0.4)';
        case 'amber': return 'rgba(255, 251, 235, 0.4)';
        case 'yellow': return 'rgba(254, 252, 232, 0.4)';
        case 'green': return 'rgba(240, 253, 244, 0.4)';
        case 'indigo': return 'rgba(238, 242, 255, 0.4)';
        case 'purple': return 'rgba(250, 245, 255, 0.4)';
        default: return 'rgba(239, 246, 255, 0.4)'; // blue
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-[1.2fr,80px,80px,80px,80px,80px,80px,80px] border-b py-2">
            <div className="px-4 py-2 font-medium text-base flex items-center">
              <span className="text-gray-700">{format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d')}</span>
            </div>
            {weekDates.map((date, i) => {
              const isCurrentDay = isSameDay(date, currentDay);
              return (
                <div 
                  key={i} 
                  className={`text-center p-2 flex flex-col items-center justify-center ${isCurrentDay ? 'bg-blue-50 font-medium' : ''}`}
                >
                  <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
                  <div className={`text-sm ${isCurrentDay ? 'text-blue-600 font-medium' : ''}`}>{format(date, 'd')}</div>
                </div>
              );
            })}
          </div>
          
          {/* All habits section */}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* Absolute habits */}
            {absoluteHabits.length > 0 && (
              <div className="mb-4">
                <div className="font-medium text-sm mb-2 px-4 py-2 bg-blue-50 rounded-md text-blue-700">
                  Absolute Habits (Daily)
                </div>
                <SortableContext 
                  items={absoluteHabits.map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {absoluteHabits.map(habit => {
                    const completedDaysCount = countCompletedDaysInWeek(habit.id);
                    const allDaysCompleted = completedDaysCount === 7;
                    
                    return (
                      <TableSortableItem key={habit.id} id={habit.id} habit={habit}>
                        <div className="border-t py-2 grid grid-cols-[1.2fr,80px,80px,80px,80px,80px,80px,80px] items-center">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-sm mx-1 min-h-[80px] border ${
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
                            <div className="flex-shrink-0">
                              {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                            </div>
                            <div className="flex-1">
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
                                {habit.title ? habit.title.replace(/\u004F$/, "") : ""}
                                <div className="ml-2 flex items-center">
                                  {habit.streak && habit.streak > 0 && (
                                    <Badge variant="outline" className="text-amber-500 dark:text-amber-300 text-[10px] font-medium px-1 py-0 h-4 ml-1 dark:border-amber-700">
                                      <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" /> {habit.streak}
                                    </Badge>
                                  )}
                                  {allDaysCompleted && (
                                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-medium px-1.5 py-0 h-4 ml-1">
                                      <CheckIcon className="h-3 w-3 mr-0.5 text-white" /> Perfect Week
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-xs flex items-center">
                                <span className={`truncate max-w-[150px] ${
                                  habit.iconColor === 'red' ? 'text-red-700/80 dark:text-red-400/80' :
                                  habit.iconColor === 'orange' ? 'text-orange-700/80 dark:text-orange-400/80' :
                                  habit.iconColor === 'amber' ? 'text-amber-700/80 dark:text-amber-400/80' :
                                  habit.iconColor === 'yellow' ? 'text-yellow-700/80 dark:text-yellow-400/80' :
                                  habit.iconColor === 'green' ? 'text-green-700/80 dark:text-green-400/80' :
                                  habit.iconColor === 'indigo' ? 'text-indigo-700/80 dark:text-indigo-400/80' :
                                  habit.iconColor === 'purple' ? 'text-purple-700/80 dark:text-purple-400/80' :
                                  'text-blue-700/80 dark:text-blue-400/80'
                                }`}>
                                  {habit.description || "Daily habit"}
                                </span>
                              </div>
                            </div>
                            <div className="ml-auto flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={() => handleEditHabit(habit)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDeleteHabit(habit.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          {/* Days of the week checkboxes */}
                          {weekDates.map((date, i) => {
                            const completed = isHabitCompletedOnDate(habit.id, date);
                            const isCurrentDay = isSameDay(date, currentDay);
                            
                            return (
                              <div 
                                key={`${habit.id}-day-${i}`} 
                                className="text-center h-full flex items-center justify-center min-w-[40px] py-1.5"
                                style={{
                                  backgroundColor: getCellBgColor(habit, isCurrentDay)
                                }}
                              >
                                <HabitButton
                                  isCompleted={completed}
                                  date={date}
                                  habitId={habit.id}
                                  onToggle={onToggleHabit}
                                  habitColor={habit.iconColor}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </TableSortableItem>
                    );
                  })}
                </SortableContext>
              </div>
            )}
            
            {/* Frequency habits */}
            {frequencyHabits.length > 0 && (
              <div className="mb-4">
                <div className="font-medium text-sm mb-2 px-4 py-2 bg-green-50 rounded-md text-green-700">
                  Frequency-based Habits (Weekly Target)
                </div>
                <SortableContext 
                  items={frequencyHabits.map(h => h.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {frequencyHabits.map(habit => {
                    const targetDays = getTargetDays(habit);
                    const completedDaysCount = countCompletedDaysInWeek(habit.id);
                    const percentComplete = Math.min(100, Math.round((completedDaysCount / targetDays) * 100));
                    const isCompleted = completedDaysCount >= targetDays;
                    const isExceeding = completedDaysCount > targetDays;
                    
                    return (
                      <TableSortableItem key={habit.id} id={habit.id} habit={habit}>
                        <div className="border-t py-2 grid grid-cols-[1.2fr,80px,80px,80px,80px,80px,80px,80px] items-center">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-md shadow-sm mx-1 min-h-[80px] border ${
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
                            <div className="flex-shrink-0">
                              {getHabitIcon(habit.icon, "h-5 w-5", habit.iconColor)}
                            </div>
                            <div className="flex-1">
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
                                {habit.title ? habit.title.replace(/\u004F$/, "") : ""}
                                <Badge variant="outline" className="text-[10px] ml-2 font-medium px-1 py-0 h-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700">
                                  {getFrequencyText(habit.frequency)}
                                </Badge>
                                
                                {/* Target achievement indicator */}
                                {isCompleted && (
                                  <Badge className="bg-white px-1.5 py-0.5 h-5 border-2 border-red-600 ml-1">
                                    {isExceeding ? (
                                      <>
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                          <circle cx="12" cy="12" r="10"></circle>
                                          <circle cx="12" cy="12" r="6"></circle>
                                          <circle cx="12" cy="12" r="2"></circle>
                                        </svg>
                                        {completedDaysCount > targetDays && (
                                          <span className="text-xs text-red-600 font-semibold ml-0.5">+{completedDaysCount - targetDays}</span>
                                        )}
                                      </>
                                    ) : (
                                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <circle cx="12" cy="12" r="6"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                      </svg>
                                    )}
                                  </Badge>
                                )}
                                {habit.streak && habit.streak > 0 && (
                                  <Badge variant="outline" className="text-amber-500 dark:text-amber-300 text-[10px] font-medium px-1 py-0 h-4 ml-1 dark:border-amber-700">
                                    <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500 text-amber-500 dark:fill-amber-300 dark:text-amber-300" /> {habit.streak}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs flex items-center">
                                <span className={`truncate max-w-[150px] ${
                                  habit.iconColor === 'red' ? 'text-red-700/80 dark:text-red-400/80' :
                                  habit.iconColor === 'orange' ? 'text-orange-700/80 dark:text-orange-400/80' :
                                  habit.iconColor === 'amber' ? 'text-amber-700/80 dark:text-amber-400/80' :
                                  habit.iconColor === 'yellow' ? 'text-yellow-700/80 dark:text-yellow-400/80' :
                                  habit.iconColor === 'green' ? 'text-green-700/80 dark:text-green-400/80' :
                                  habit.iconColor === 'indigo' ? 'text-indigo-700/80 dark:text-indigo-400/80' :
                                  habit.iconColor === 'purple' ? 'text-purple-700/80 dark:text-purple-400/80' :
                                  'text-blue-700/80 dark:text-blue-400/80'
                                }`}>
                                  {habit.description || `${getFrequencyText(habit.frequency)} habit`}
                                </span>
                                <div className="flex items-center ml-2">
                                  <span className="text-xs font-medium mr-1">
                                    {completedDaysCount}/{targetDays}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-auto flex items-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7" 
                                onClick={() => handleEditHabit(habit)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDeleteHabit(habit.id)}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          {/* Days of the week checkboxes */}
                          {weekDates.map((date, i) => {
                            const completed = isHabitCompletedOnDate(habit.id, date);
                            const isCurrentDay = isSameDay(date, currentDay);
                            
                            return (
                              <div 
                                key={`${habit.id}-day-${i}`} 
                                className="text-center h-full flex items-center justify-center min-w-[40px] py-1.5"
                                style={{
                                  backgroundColor: getCellBgColor(habit, isCurrentDay)
                                }}
                              >
                                <HabitButton
                                  isCompleted={completed}
                                  date={date}
                                  habitId={habit.id}
                                  onToggle={onToggleHabit}
                                  habitColor={habit.iconColor}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </TableSortableItem>
                    );
                  })}
                </SortableContext>
              </div>
            )}

            {/* No habits message */}
            {filteredHabits.length === 0 && (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-3 text-gray-400">
                  <CheckSquare className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium mb-2">No habits found</h3>
                <p className="text-gray-500 mb-4">
                  {selectedCategory === 'all' 
                    ? "You haven't created any habits yet." 
                    : `No ${selectedCategory} habits found.`}
                </p>
                <Button onClick={handleAddHabit}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Habit
                </Button>
              </div>
            )}
          </DndContext>
        </div>
      </div>
    </div>
  );
}