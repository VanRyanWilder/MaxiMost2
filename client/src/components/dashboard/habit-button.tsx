import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { isFuture } from "date-fns";

interface HabitButtonProps {
  habitId: string;
  date: Date;
  isCompleted: boolean;
  onToggle: (habitId: string, date: Date) => void;
}

export const HabitButton: React.FC<HabitButtonProps> = ({
  habitId,
  date,
  isCompleted,
  onToggle
}) => {
  const isFutureDate = isFuture(date);
  
  return (
    <Button 
      variant={isCompleted ? "default" : "outline"}
      size="sm"
      onClick={() => !isFutureDate && onToggle(habitId, date)}
      className={`min-w-[40px] h-[30px] p-1 
        ${isFutureDate ? 'opacity-50 cursor-not-allowed' : ''}
        ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-md scale-105 transition-all' : ''}
      `}
      disabled={isFutureDate}
      title={isFutureDate ? "Cannot complete future habits" : isCompleted ? "Mark as incomplete" : "Mark as complete"}
    >
      {isCompleted ? (
        <div className="flex items-center justify-center animate-pulse">
          <Check className="h-4 w-4" />
        </div>
      ) : null}
    </Button>
  );
};