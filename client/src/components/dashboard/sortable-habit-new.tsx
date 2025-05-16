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
import { EnhancedHabitIcon } from "@/components/ui/enhanced-habit-icon";

interface SortableHabitProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: Date) => void;
  onEdit: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
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
  const getEnhancedColorScheme = (color: string) => {
    const baseScheme = colorSchemes.find(c => c.id === color);
    if (baseScheme) return baseScheme;
    
    // Fallback color schemes by color name
    const enhancedSchemes: Record<string, any> = {
      red: { id: 'red', primary: "text-red-600", bg: "bg-red-100", lightBg: "bg-red-50/50", border: "border-red-200", hover: "hover:bg-red-100/70" },
      orange: { id: 'orange', primary: "text-orange-600", bg: "bg-orange-100", lightBg: "bg-orange-50/50", border: "border-orange-200", hover: "hover:bg-orange-100/70" },
      amber: { id: 'amber', primary: "text-amber-600", bg: "bg-amber-100", lightBg: "bg-amber-50/50", border: "border-amber-200", hover: "hover:bg-amber-100/70" },
      yellow: { id: 'yellow', primary: "text-yellow-600", bg: "bg-yellow-100", lightBg: "bg-yellow-50/50", border: "border-yellow-200", hover: "hover:bg-yellow-100/70" },
      green: { id: 'green', primary: "text-green-600", bg: "bg-green-100", lightBg: "bg-green-50/50", border: "border-green-200", hover: "hover:bg-green-100/70" },
      emerald: { id: 'emerald', primary: "text-emerald-600", bg: "bg-emerald-100", lightBg: "bg-emerald-50/50", border: "border-emerald-200", hover: "hover:bg-emerald-100/70" },
      teal: { id: 'teal', primary: "text-teal-600", bg: "bg-teal-100", lightBg: "bg-teal-50/50", border: "border-teal-200", hover: "hover:bg-teal-100/70" },
      cyan: { id: 'cyan', primary: "text-cyan-600", bg: "bg-cyan-100", lightBg: "bg-cyan-50/50", border: "border-cyan-200", hover: "hover:bg-cyan-100/70" },
      blue: { id: 'blue', primary: "text-blue-600", bg: "bg-blue-100", lightBg: "bg-blue-50/50", border: "border-blue-200", hover: "hover:bg-blue-100/70" },
      indigo: { id: 'indigo', primary: "text-indigo-600", bg: "bg-indigo-100", lightBg: "bg-indigo-50/50", border: "border-indigo-200", hover: "hover:bg-indigo-100/70" },
      violet: { id: 'violet', primary: "text-violet-600", bg: "bg-violet-100", lightBg: "bg-violet-50/50", border: "border-violet-200", hover: "hover:bg-violet-100/70" },
      purple: { id: 'purple', primary: "text-purple-600", bg: "bg-purple-100", lightBg: "bg-purple-50/50", border: "border-purple-200", hover: "hover:bg-purple-100/70" },
      pink: { id: 'pink', primary: "text-pink-600", bg: "bg-pink-100", lightBg: "bg-pink-50/50", border: "border-pink-200", hover: "hover:bg-pink-100/70" },
      rose: { id: 'rose', primary: "text-rose-600", bg: "bg-rose-100", lightBg: "bg-rose-50/50", border: "border-rose-200", hover: "hover:bg-rose-100/70" },
    };
    
    return enhancedSchemes[color] || 
      { id: 'slate', primary: "text-slate-600", bg: "bg-slate-100", lightBg: "bg-slate-50/50", border: "border-slate-200", hover: "hover:bg-slate-100/70" };
  };
  
  const colorScheme = habit.iconColor ? 
    getEnhancedColorScheme(habit.iconColor) : 
    { primary: "text-slate-600", bg: "bg-slate-100", lightBg: "bg-slate-50/50", border: "border-slate-200", hover: "hover:bg-slate-100/70" };

  // Calculate statistics for the habit
  const today = new Date();
  const completedDays = completions.filter(
    c => c.habitId === habit.id && c.completed
  ).length;
  
  const targetDays = habit.frequency === 'daily' ? 7 : 
                   habit.frequency === '2x-week' ? 2 :
                   habit.frequency === '3x-week' ? 3 :
                   habit.frequency === '4x-week' ? 4 : 
                   habit.frequency === '5x-week' ? 5 :
                   habit.frequency === '6x-week' ? 6 : 1;
                   
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
      className={`grid grid-cols-[2fr_repeat(7,1fr)] mb-2 group rounded-md p-0.5 transition-all hover:shadow-sm ${
        weeklyGoalMet ? 'bg-green-50 border border-green-100' : `${colorScheme?.lightBg || "bg-transparent"} border ${colorScheme?.border || "border-gray-200"}`
      }`}
    >
      {/* Main habit info cell */}
      <div className={`px-2 py-2 flex items-center relative rounded-md ${colorScheme?.bg || "bg-transparent"}`}>
        {/* Drag handle */}
        <button
          className="cursor-grab active:cursor-grabbing mr-2 touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </button>
        
        <div className="flex items-center gap-2 min-w-0">
          <EnhancedHabitIcon 
            icon={habit.icon || "activity"} 
            category={habit.category || "health"}
            color={habit.iconColor}
            size="sm"
          />
          
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
              className={`w-6 h-6 rounded-full ${colorScheme.bg} flex items-center justify-center`}
            >
              <span className="sr-only">Edit</span>
              <Pencil className={`h-3 w-3 ${colorScheme.primary}`} />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(habit.id)}
                className={`w-6 h-6 rounded-full ${colorScheme.bg} flex items-center justify-center`}
              >
                <span className="sr-only">Delete</span>
                <X className={`h-3 w-3 ${colorScheme.primary}`} />
              </button>
            )}
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
        
        const uniformSquareStyle = "w-6 h-6 flex items-center justify-center"; 
        
        return (
          <div key={i} className="h-10">
            <div className="w-full h-full flex items-center justify-center">
              <button 
                onClick={() => onToggleCompletion(habit.id, date)}
                disabled={isFuture}
                className={`p-0 flex items-center justify-center transition duration-100 
                  ${completed 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : isPast 
                      ? 'text-muted-foreground hover:bg-red-50 hover:text-red-500' 
                      : `text-muted-foreground/50 hover:${colorScheme?.primary || "text-blue-500"} hover:${colorScheme?.bg || "bg-blue-50"}`
                  } w-7 h-7 rounded`}
              >
                {completed ? (
                  <div className={uniformSquareStyle}>
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <div className={uniformSquareStyle}>
                    <div className={`h-4 w-4 rounded-full border-2 ${colorScheme?.border || "border-gray-300"}`}></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}