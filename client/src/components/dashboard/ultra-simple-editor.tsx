import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check, Trash2 } from 'lucide-react';

type UltraSimpleEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Color options with visual indicators
const colorOptions = [
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-100', textClass: 'text-blue-500' },
  { name: 'Green', value: 'green', bgClass: 'bg-green-100', textClass: 'text-green-500' },
  { name: 'Red', value: 'red', bgClass: 'bg-red-100', textClass: 'text-red-500' },
  { name: 'Amber', value: 'amber', bgClass: 'bg-amber-100', textClass: 'text-amber-500' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-100', textClass: 'text-purple-500' },
];

// Frequency options
const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: '2x-week', label: '2x per week' },
  { value: '3x-week', label: '3x per week' },
  { value: '4x-week', label: '4x per week' },
  { value: '5x-week', label: '5x per week' },
  { value: '6x-week', label: '6x per week' },
];

// Category options with descriptions
const categoryOptions = [
  { value: 'physical', label: 'Physical Training', icon: 'dumbbell', color: 'red' },
  { value: 'nutrition', label: 'Nutrition & Fueling', icon: 'utensils', color: 'orange' },
  { value: 'sleep', label: 'Sleep & Hygiene', icon: 'moon', color: 'indigo' },
  { value: 'mental', label: 'Mental Acuity & Growth', icon: 'lightbulb', color: 'yellow' },
  { value: 'relationships', label: 'Relationships & Community', icon: 'users', color: 'green' },
  { value: 'financial', label: 'Financial Habits', icon: 'dollar-sign', color: 'emerald' },
];

/**
 * An ultra-simple habit editor with minimal state changes to avoid infinite re-renders
 */
export function UltraSimpleEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: UltraSimpleEditorProps) {
  // Local form state
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [category, setCategory] = useState<HabitCategory>('physical');
  const [iconColor, setIconColor] = useState('blue');
  const [habitId, setHabitId] = useState('');
  const [isNew, setIsNew] = useState(true);

  // Initialize form when dialog opens with a habit
  useEffect(() => {
    if (!open) return;
    
    if (habit) {
      // Editing existing habit
      setTitle(habit.title);
      setFrequency(habit.frequency);
      setCategory(habit.category);
      setIconColor(habit.iconColor);
      setHabitId(habit.id);
      setIsNew(false);
    } else {
      // Creating new habit
      const newId = `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setTitle('');
      setFrequency('daily');
      setCategory('physical');
      setIconColor('blue');
      setHabitId(newId);
      setIsNew(true);
    }
  }, [open, habit]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Construct the habit object
    const habitToSave: Habit = {
      id: habitId,
      title: title.trim(),
      description: '',
      icon: 'check-square',
      iconColor: iconColor,
      impact: 8,
      effort: 4,
      timeCommitment: '5 min',
      frequency: frequency,
      isAbsolute: frequency === 'daily',
      category: category,
      streak: isNew ? 0 : (habit?.streak || 0),
      createdAt: isNew ? new Date() : (habit?.createdAt || new Date())
    };
    
    // Close the dialog first
    onOpenChange(false);
    
    // Then save after a short delay
    setTimeout(() => {
      onSave(habitToSave);
    }, 100);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this habit?')) {
      // Close dialog
      onOpenChange(false);
      
      // Delete after delay
      setTimeout(() => {
        onDelete(habitId);
      }, 100);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create New Habit' : 'Edit Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Habit name"
              />
            </div>
            
            {/* Frequency */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">Frequency</Label>
              <Select 
                value={frequency}
                onValueChange={(value) => setFrequency(value as HabitFrequency)}
              >
                <SelectTrigger id="frequency" className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Category */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <div className="col-span-3">
                <Select 
                  value={category}
                  onValueChange={(value) => setCategory(value as HabitCategory)}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Color */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Color</Label>
              <div className="col-span-3 flex flex-wrap gap-3">
                {colorOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${option.bgClass} flex items-center justify-center
                      ${iconColor === option.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    onClick={() => setIconColor(option.value)}
                  >
                    {iconColor === option.value && (
                      <Check className={`h-4 w-4 ${option.textClass}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            {!isNew && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <div className="space-x-2 ml-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}