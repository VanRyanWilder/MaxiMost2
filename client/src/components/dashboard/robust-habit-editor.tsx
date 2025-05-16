import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check, Trash2 } from 'lucide-react';

type RobustHabitEditorProps = {
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
 * A completely rewritten habit editor to resolve state management issues
 */
export function RobustHabitEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: RobustHabitEditorProps) {
  // Form state
  const [formState, setFormState] = useState({
    id: '',
    title: '',
    frequency: 'daily' as HabitFrequency,
    category: 'physical' as HabitCategory,
    iconColor: 'blue',
    isNew: true
  });
  
  // Reset form when dialog opens or habit changes
  useEffect(() => {
    if (open && habit) {
      // Editing existing habit
      setFormState({
        id: habit.id,
        title: habit.title,
        frequency: habit.frequency as HabitFrequency,
        category: habit.category as HabitCategory,
        iconColor: habit.iconColor || 'blue',
        isNew: false
      });
    } else if (open && !habit) {
      // Creating new habit
      const newId = `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setFormState({
        id: newId,
        title: '',
        frequency: 'daily',
        category: 'physical',
        iconColor: 'blue',
        isNew: true
      });
    }
  }, [open, habit]);

  // Handler for form field changes
  const updateField = (field: string, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Create complete habit object from form state
    const habitToSave: Habit = {
      id: formState.id,
      title: formState.title.trim(),
      description: habit?.description || '',
      icon: habit?.icon || 'check-square',
      iconColor: formState.iconColor,
      impact: habit?.impact || 8,
      effort: habit?.effort || 4,
      timeCommitment: habit?.timeCommitment || '5 min',
      frequency: formState.frequency,
      isAbsolute: formState.frequency === 'daily',
      category: formState.category,
      streak: formState.isNew ? 0 : (habit?.streak || 0),
      createdAt: formState.isNew ? new Date() : (habit?.createdAt || new Date())
    };
    
    // Close first, then save
    onOpenChange(false);
    
    // Save after slight delay to prevent re-opening
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
        onDelete(formState.id);
      }, 100);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{formState.isNew ? 'Create New Habit' : 'Edit Habit'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              value={formState.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="col-span-3"
              placeholder="Habit name"
            />
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select 
              value={formState.frequency}
              onValueChange={(value) => updateField('frequency', value)}
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
                value={formState.category}
                onValueChange={(value) => updateField('category', value)}
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
                    ${formState.iconColor === option.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => updateField('iconColor', option.value)}
                >
                  {formState.iconColor === option.value && (
                    <Check className={`h-4 w-4 ${option.textClass}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            {!formState.isNew && onDelete && (
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