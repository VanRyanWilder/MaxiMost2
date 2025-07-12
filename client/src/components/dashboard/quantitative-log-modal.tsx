import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit, CompletionEntry } from '@/types/habit'; // Import CompletionEntry
import { format, isSameDay, parseISO } from 'date-fns'; // Import isSameDay, parseISO

interface QuantitativeLogModalProps {
  habit: Habit | null;
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (habitId: string, date: Date, value: number) => void;
  currentCompletions: CompletionEntry[]; // Correctly typed
}

export function QuantitativeLogModal({
  habit,
  date,
  isOpen,
  onClose,
  onLog,
  currentCompletions,
}: QuantitativeLogModalProps) {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (habit && date && isOpen) {
      // Find existing entry using date-fns/isSameDay and parseISO
      const existingEntry = currentCompletions.find(c =>
        c.date && isSameDay(parseISO(c.date), date)
      );
      if (existingEntry && typeof existingEntry.value === 'number') {
        setInputValue(String(existingEntry.value));
      } else {
        // Default to targetValue if no existing entry for the day, or empty string
        setInputValue(habit.targetValue !== undefined ? String(habit.targetValue) : "");
      }
    } else if (!isOpen) {
      setInputValue(""); // Reset when closed
    }
  }, [isOpen, habit, date, currentCompletions]); // habit.targetValue could be added if it changes

  if (!habit || !date) {
    return null; // Don't render if essential props are missing
  }

  const handleLog = () => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onLog(habit.id, date, numericValue);
      onClose();
    } else if (inputValue.trim() === "") { // Allow clearing the log by submitting empty
      onLog(habit.id, date, 0); // Or a specific value that means "cleared"
      onClose();
    }
    else {
      // Handle invalid input, e.g., show a toast or error message
      // Consider using toast hook if available and appropriate
      alert("Please enter a valid number, or leave empty to clear.");
    }
  };

  // Local isSameDay helper is removed, using imported one from date-fns

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* Apply glass styles to DialogContent */}
      <DialogContent className="bg-black/50 backdrop-blur-md border border-white/20 shadow-xl text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-white">Log Quantitative Habit</DialogTitle>
          <DialogDescription className="text-gray-300"> {/* Themed description */}
            Enter the value for "{habit.title}" on {format(date, "MMM d, yyyy")}.
            Target: {habit.targetValue || 'Not set'} {habit.targetUnit || ''}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantitativeValue" className="text-right text-gray-300"> {/* Themed label */}
              Value ({habit.targetUnit || 'units'})
            </Label>
            <Input
              id="quantitativeValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-3 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:ring-offset-0 focus:ring-primary/50" /* Themed input */
              placeholder={`Enter value (e.g., ${habit.targetValue || '50'})`}
            />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t border-white/10"> {/* Themed footer */}
          <Button variant="outline" onClick={onClose} className="text-gray-200 border-white/30 hover:bg-white/10 hover:text-white">Cancel</Button>
          <Button onClick={handleLog} className="bg-primary hover:bg-primary/90 text-white">Log Value</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
