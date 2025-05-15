import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Habit, HabitCompletion } from '@/types/habit';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { GripVertical } from 'lucide-react';
import { colorSchemes, iconMap as habitIconMap } from '@/components/dashboard/edit-habit-dialog';

interface SortableHabitProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: Date) => void;
  onEdit: (habit: Habit) => void;
  currentDate: Date;
}

export function SortableHabit({ 
  habit, 
  completions, 
  onToggleCompletion, 
  onEdit,
  currentDate
}: SortableHabitProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  // Generate week days starting from current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  
  // Check if habit is completed for a specific date
  const isCompletedOnDate = (date: Date): boolean => {
    return completions.some(
      c => c.habitId === habit.id && isSameDay(new Date(c.date), date)
    );
  };
  
  // Determine if the habit has met its weekly frequency requirement
  const weeklyCompletionCount = weekDays.filter(date => isCompletedOnDate(date)).length;
  const requiredCompletions = (() => {
    switch(habit.frequency) {
      case 'daily': return 7;
      case '2x-week': return 2;
      case '3x-week': return 3;
      case '4x-week': return 4;
      case '5x-week': return 5;
      case '6x-week': return 6;
      case 'weekly': return 1;
      default: return 1;
    }
  })();
  
  const hasMetWeeklyGoal = weeklyCompletionCount >= requiredCompletions;
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2 ${
        hasMetWeeklyGoal ? 'bg-gradient-to-r from-green-50 to-transparent rounded-lg shadow-sm border border-green-100' : ''
      }`}
    >
      <div className="flex items-center p-1.5 relative group">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab mr-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-md ${
            hasMetWeeklyGoal 
              ? 'bg-green-100 text-green-600' 
              : habit.iconColor 
                ? colorSchemes.find(c => c.id === habit.iconColor)?.bg || 'bg-slate-100'
                : 'bg-slate-100'
          }`}>
            {(() => {
              // Render icon component
              const colorScheme = habit.iconColor && !hasMetWeeklyGoal
                ? colorSchemes.find(c => c.id === habit.iconColor)
                : { primary: hasMetWeeklyGoal ? "text-green-600" : "text-slate-600" };
                
              if (habitIconMap[habit.icon]) {
                const IconComponent = habitIconMap[habit.icon].component;
                return <IconComponent className={`h-4 w-4 ${colorScheme?.primary || ""}`} />;
              }
              
              return <div className={`h-4 w-4 ${colorScheme?.primary || ""}`}>•</div>;
            })()}
          </div>
          
          <div className="min-w-0 flex flex-col">
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block">
              {habit.title}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{habit.timeCommitment}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★</span> 
                <span>{habit.impact}</span>
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => onEdit(habit)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <span className="sr-only">Edit</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-gray-500"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </button>
      </div>
      
      {/* Day checkboxes */}
      {weekDays.map((date, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-center p-2"
          onClick={() => onToggleCompletion(habit.id, date)}
        >
          <div 
            className={`
              w-5 h-5 rounded-full border 
              ${isCompletedOnDate(date) 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-gray-400'
              } 
              cursor-pointer flex items-center justify-center transition-colors
            `}
          >
            {isCompletedOnDate(date) && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}