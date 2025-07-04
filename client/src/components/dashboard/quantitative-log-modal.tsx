import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from '@/types/habit';
import { format } from 'date-fns';

interface QuantitativeLogModalProps {
  habit: Habit | null;
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onLog: (habitId: string, date: Date, value: number) => void;
  currentCompletions: any[]; // To find existing value for the day
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
      const existingEntry = currentCompletions.find(
        c => c.habitId === habit.id && date && isSameDay(new Date(c.date), date)
      );
      if (existingEntry && typeof existingEntry.value === 'number') {
        setInputValue(String(existingEntry.value));
      } else {
        setInputValue(String(habit.targetValue || ""));
      }
    } else if (!isOpen) {
      setInputValue(""); // Reset when closed
    }
  }, [isOpen, habit, date, currentCompletions]);

  if (!habit || !date) {
    return null;
  }

  const handleLog = () => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onLog(habit.id, date, numericValue);
      onClose();
    } else {
      // Handle invalid input, e.g., show a toast or error message
      alert("Please enter a valid number.");
    }
  };

  // Helper to check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Quantitative Habit</DialogTitle>
          <DialogDescription>
            Enter the value for "{habit.title}" on {format(date, "MMM d, yyyy")}.
            Target: {habit.targetValue || 'Not set'} {habit.targetUnit || ''}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantitativeValue" className="text-right">
              Value ({habit.targetUnit || 'units'})
            </Label>
            <Input
              id="quantitativeValue"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="col-span-3"
              placeholder={`Enter value (e.g., ${habit.targetValue || '50'})`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleLog}>Log Value</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
