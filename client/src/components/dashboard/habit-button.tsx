import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { isFuture, isSameDay, startOfToday } from "date-fns";

interface HabitButtonProps {
  habitId: string;
  date: Date;
  isCompleted: boolean;
  onToggle: (habitId: string, date: Date) => void;
  size?: 'sm' | 'md';
  habitColor?: string;
}

// Function to get gradient color based on habit color
const getColorGradient = (color?: string) => {
  switch (color) {
    case 'red': return 'from-red-500 to-red-600';
    case 'orange': return 'from-orange-500 to-orange-600';
    case 'amber': return 'from-amber-500 to-amber-600';
    case 'yellow': return 'from-yellow-500 to-yellow-600';
    case 'green': return 'from-green-500 to-green-600';
    case 'indigo': return 'from-indigo-500 to-indigo-600';
    case 'purple': return 'from-purple-500 to-purple-600';
    default: return 'from-blue-500 to-blue-600';
  }
};

// Function to get border color based on habit color
const getBorderColor = (color?: string, isToday = false) => {
  if (!isToday) return '';
  
  switch (color) {
    case 'red': return 'border-red-300 hover:border-red-500';
    case 'orange': return 'border-orange-300 hover:border-orange-500';
    case 'amber': return 'border-amber-300 hover:border-amber-500';
    case 'yellow': return 'border-yellow-300 hover:border-yellow-500';
    case 'green': return 'border-green-300 hover:border-green-500';
    case 'indigo': return 'border-indigo-300 hover:border-indigo-500';
    case 'purple': return 'border-purple-300 hover:border-purple-500';
    default: return 'border-blue-300 hover:border-blue-500';
  }
};

// Function to get ping indicator color
const getPingColor = (color?: string) => {
  switch (color) {
    case 'red': return 'bg-red-400';
    case 'orange': return 'bg-orange-400';
    case 'amber': return 'bg-amber-400';
    case 'yellow': return 'bg-yellow-400';
    case 'green': return 'bg-green-400';
    case 'indigo': return 'bg-indigo-400';
    case 'purple': return 'bg-purple-400';
    default: return 'bg-blue-400';
  }
};

export const HabitButton: React.FC<HabitButtonProps> = ({
  habitId,
  date,
  isCompleted,
  onToggle,
  size = 'sm',
  habitColor
}) => {
  const isFutureDate = isFuture(date);
  const isToday = isSameDay(date, startOfToday());
  const colorGradient = getColorGradient(habitColor);
  const todayBorderColor = getBorderColor(habitColor, isToday);
  const pingColor = getPingColor(habitColor);
  
  return (
    <Button 
      variant={isCompleted ? "default" : "outline"}
      size={size === 'md' ? 'default' : 'sm'}
      onClick={() => !isFutureDate && onToggle(habitId, date)}
      className={`w-[35px] h-[35px] p-1 mx-auto 
        ${isFutureDate ? 'opacity-50 cursor-not-allowed' : ''}
        ${isCompleted ? `bg-gradient-to-br ${colorGradient} shadow-md scale-105 transition-all` : ''}
        ${isToday && !isCompleted ? `border-2 border-dashed ${todayBorderColor}` : ''}
        ${isCompleted ? 'transform transition-transform hover:scale-110 duration-150 text-white' : ''}
        transition-all duration-200
      `}
      disabled={isFutureDate}
      title={isFutureDate 
        ? "Cannot complete future habits" 
        : isCompleted 
          ? "Click to mark as incomplete" 
          : isToday 
            ? "Click to complete for today" 
            : "Click to mark as complete"
      }
    >
      {isCompleted ? (
        <div className="flex items-center justify-center animate-pulse">
          <Check className="h-3.5 w-3.5" />
        </div>
      ) : isToday ? (
        <div className="flex items-center justify-center">
          <div className={`h-2.5 w-2.5 rounded-full ${pingColor} animate-ping`}></div>
        </div>
      ) : null}
    </Button>
  );
};