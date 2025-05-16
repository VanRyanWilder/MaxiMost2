import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { isFuture, isSameDay, startOfToday } from "date-fns";

interface HabitButtonProps {
  habitId: string;
  date: Date;
  isCompleted: boolean;
  onToggle: (habitId: string, date: Date) => void;
  size?: 'sm' | 'md';
}

export const HabitButton: React.FC<HabitButtonProps> = ({
  habitId,
  date,
  isCompleted,
  onToggle,
  size = 'sm'
}) => {
  const isFutureDate = isFuture(date);
  const isToday = isSameDay(date, startOfToday());
  
  return (
    <Button 
      variant={isCompleted ? "default" : "outline"}
      size={size === 'md' ? 'default' : 'sm'}
      onClick={() => !isFutureDate && onToggle(habitId, date)}
      className={`min-w-[40px] h-[30px] p-1 
        ${isFutureDate ? 'opacity-50 cursor-not-allowed' : ''}
        ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md scale-105 transition-all' : ''}
        ${isToday && !isCompleted ? 'border-2 border-dashed border-blue-300 hover:border-blue-500' : ''}
        ${isCompleted ? 'transform transition-transform hover:scale-110 duration-150' : ''}
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
          <Check className="h-4 w-4" />
        </div>
      ) : isToday ? (
        <div className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></div>
        </div>
      ) : null}
    </Button>
  );
};