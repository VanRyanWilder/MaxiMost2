import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Check, 
  GripVertical,
  Pencil,
  Star, 
  X
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isBefore, isAfter, startOfToday, endOfToday } from 'date-fns';
import { Habit, HabitCompletion } from '@/types/habit';
import { iconMap, colorSchemes } from './edit-habit-dialog';
import { EnhancedHabitIcon } from "@/components/ui/habit-icon";

interface SortableHabitProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: Date) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  currentDate: Date;
}

export function SortableHabit({ 
  habit, 
  completions, 
  onToggleCompletion, 
  onEdit,
  onDelete,
  currentDate
}: SortableHabitProps) {
  // Set up sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  // Get appropriate color scheme for the habit icon
  const colorScheme = habit.iconColor ? 
    colorSchemes.find(c => c.id === habit.iconColor) || 
    { primary: "text-blue-600", bg: "bg-blue-100", lightBg: "bg-blue-50/50", border: "border-blue-200" } : 
    { primary: "text-slate-600", bg: "bg-slate-100", lightBg: "bg-slate-50/50", border: "border-slate-200" };

  // Render appropriate icon based on the habit's icon property
  const renderIcon = () => {
    return (
      <EnhancedHabitIcon 
        icon={habit.icon} 
        category={habit.category}
        size="sm"
      />
    );
  };

  // Calculate statistics for the habit
  const today = new Date();
  const completedDays = completions.filter(
    c => c.habitId === habit.id && c.completed
  ).length;
  
  const targetDays = habit.frequency === 'daily' ? 7 : 
                   habit.frequency === '2x-week' ? 2 :
                   habit.frequency === '3x-week' ? 3 :
                   habit.frequency === '4x-week' ? 4 : 1;
                   
  const weeklyGoalMet = completedDays >= targetDays;
  
  // Check if today's completion is done
  const isTodayCompleted = completions.some(c => 
    c.habitId === habit.id && 
    isSameDay(new Date(c.date), today) && 
    c.completed
  );

  // Generate dates for the week (7 days starting from the currentDate)
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`grid grid-cols-[2fr_repeat(7,1fr)] gap-1 mb-2 group rounded-md p-0.5 transition-all hover:shadow-sm ${
        weeklyGoalMet ? 'bg-green-50' : `${colorScheme?.lightBg || "bg-transparent"}`
      }`}
    >
      {/* Main habit info cell */}
      <div className="px-2 py-2 flex items-center relative">
        {/* Drag handle */}
        <button
          className="cursor-grab active:cursor-grabbing mr-2 touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </button>
        
        <div className="flex items-center gap-2 min-w-0">
          {renderIcon()}
          
          <div className="min-w-0 flex flex-col">
            <span className={`font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis block ${colorScheme?.primary || ""}`}>
              {habit.title}
            </span>
            <div className="flex items-center justify-between gap-1 mt-0.5">
              <Badge 
                variant="outline" 
                className={`text-[10px] px-1.5 py-0 h-4 ${colorScheme?.lightBg || "bg-blue-50/50"} ${colorScheme?.border || "border-blue-200"} ${colorScheme?.primary || ""}`}
              >
                {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
              </Badge>
              <div className="flex items-center space-x-1">
                <span className={`text-[10px] ${weeklyGoalMet ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                  {completedDays}/{targetDays} {habit.frequency} 
                  {weeklyGoalMet && " ✓"}
                </span>
                {habit.streak > 0 && (
                  <span className="inline-flex items-center text-[10px] text-amber-500">
                    <Star className="h-2.5 w-2.5 text-amber-500 mr-0.5" /> 
                    {habit.streak}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit buttons (visible on hover) */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(habit)}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <span className="sr-only">Edit</span>
              <Pencil className="h-3 w-3 text-gray-500" />
            </button>
            <button
              onClick={() => onDelete(habit.id)}
              className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <span className="sr-only">Delete</span>
              <X className="h-3 w-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Render the weekday checkboxes */}
      {weekDays.map((date, i) => {
        const dayOfWeek = format(date, 'EEE');
        const dayNumber = format(date, 'd');
        const completed = completions.some(c => 
          c.habitId === habit.id && 
          isSameDay(new Date(c.date), date) && 
          c.completed
        );
        const isPast = isBefore(date, startOfToday());
        const isFuture = isAfter(date, endOfToday());
        
        return (
          <div key={i} className="flex justify-center">
            <button 
              onClick={() => onToggleCompletion(habit.id, date)}
              disabled={isFuture}
              className={`flex items-center justify-center transition-all duration-200 ease-in-out
                ${completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 rounded-md' 
                  : isPast 
                    ? 'text-muted-foreground hover:bg-red-50 hover:text-red-500' 
                    : `text-muted-foreground/50 hover:${colorScheme?.primary || "text-blue-500"} hover:${colorScheme?.bg || "bg-blue-50"}`
                } w-full h-10`}
            >
              {completed ? (
                <Check className="h-5 w-5" />
              ) : (
                <div className={`h-5 w-5 rounded-full border-2 ${colorScheme?.border || "border-current"}`}></div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}