import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check, Trash2 } from 'lucide-react';

type CompleteHabitEditorProps = {
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
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-500' },
  { name: 'Pink', value: 'pink', bgClass: 'bg-pink-100', textClass: 'text-pink-500' },
  { name: 'Cyan', value: 'cyan', bgClass: 'bg-cyan-100', textClass: 'text-cyan-500' },
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

// Time commitment options
const timeCommitmentOptions = [
  { value: '5 min', label: '5 minutes' },
  { value: '10 min', label: '10 minutes' },
  { value: '15 min', label: '15 minutes' },
  { value: '20 min', label: '20 minutes' },
  { value: '30 min', label: '30 minutes' },
  { value: '45 min', label: '45 minutes' },
  { value: '60 min', label: '60 minutes' },
  { value: 'variable', label: 'Variable' },
];

// Category options with descriptions
const categoryOptions = [
  { value: 'physical', label: 'Physical Training', icon: 'dumbbell', color: 'red' },
  { value: 'nutrition', label: 'Nutrition & Fueling', icon: 'utensils', color: 'orange' },
  { value: 'sleep', label: 'Sleep & Hygiene', icon: 'moon', color: 'indigo' },
  { value: 'mental', label: 'Mental Acuity & Growth', icon: 'lightbulb', color: 'yellow' },
  { value: 'relationships', label: 'Relationships & Community', icon: 'users', color: 'blue' },
  { value: 'financial', label: 'Financial Habits', icon: 'dollar-sign', color: 'green' },
];

/**
 * A complete habit editor that properly handles all habit fields
 */
export function CompleteHabitEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: CompleteHabitEditorProps) {
  // Complete form state with all habit properties
  const [formState, setFormState] = useState<Habit>({
    id: '',
    title: '',
    description: '',
    icon: 'check-square',
    iconColor: 'blue',
    impact: 5,
    effort: 5,
    timeCommitment: '5 min',
    frequency: 'daily' as HabitFrequency,
    isAbsolute: true,
    category: 'physical' as HabitCategory,
    streak: 0,
    createdAt: new Date()
  });
  
  // Track if this is a new habit
  const [isNew, setIsNew] = useState(true);
  
  // Reset form when dialog opens or habit changes
  useEffect(() => {
    if (open && habit) {
      // Editing existing habit
      setFormState({
        ...habit,
        // Ensure we have defaults for missing values
        description: habit.description || '',
        timeCommitment: habit.timeCommitment || '5 min',
        iconColor: habit.iconColor || 'blue',
        impact: habit.impact || 5,
        effort: habit.effort || 5
      });
      setIsNew(false);
    } else if (open && !habit) {
      // Creating new habit
      const newId = `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setFormState({
        id: newId,
        title: '',
        description: '',
        icon: 'check-square',
        iconColor: 'blue',
        impact: 5,
        effort: 5,
        timeCommitment: '5 min',
        frequency: 'daily',
        isAbsolute: true,
        category: 'physical',
        streak: 0,
        createdAt: new Date()
      });
      setIsNew(true);
    }
  }, [open, habit]);

  // Handler for form field changes
  const updateField = (field: keyof Habit, value: any) => {
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
    
    // Close dialog first
    onOpenChange(false);
    
    // Save after slight delay to prevent animation glitches
    setTimeout(() => {
      onSave({
        ...formState,
        title: formState.title.trim()
      });
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create New Habit' : 'Edit Habit'}</DialogTitle>
          <DialogDescription>
            {isNew ? 'Add a new habit to track' : 'Make changes to your habit'}
          </DialogDescription>
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
          
          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="col-span-3"
              placeholder="What's this habit about?"
              rows={2}
            />
          </div>
          
          {/* Time Commitment */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeCommitment" className="text-right">Time</Label>
            <Select 
              value={formState.timeCommitment.toString()}
              onValueChange={(value) => updateField('timeCommitment', value)}
            >
              <SelectTrigger id="timeCommitment" className="col-span-3">
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                {timeCommitmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select 
              value={formState.frequency.toString()}
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
          
          {/* Must-Do Switch */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAbsolute" className="text-right">Must-Do</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="isAbsolute"
                checked={formState.isAbsolute}
                onCheckedChange={(checked) => updateField('isAbsolute', checked)}
              />
              <Label htmlFor="isAbsolute">Make this a highest-priority habit</Label>
            </div>
          </div>
          
          {/* Impact */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="impact" className="text-right">Impact (1-10)</Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                id="impact"
                type="range"
                min="1"
                max="10"
                value={formState.impact}
                onChange={(e) => updateField('impact', parseInt(e.target.value))}
                className="flex-grow"
              />
              <span className="text-sm font-medium w-5 text-center">{formState.impact}</span>
            </div>
          </div>
          
          {/* Effort */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="effort" className="text-right">Effort (1-10)</Label>
            <div className="col-span-3 flex items-center gap-2">
              <input
                id="effort"
                type="range"
                min="1"
                max="10"
                value={formState.effort}
                onChange={(e) => updateField('effort', parseInt(e.target.value))}
                className="flex-grow"
              />
              <span className="text-sm font-medium w-5 text-center">{formState.effort}</span>
            </div>
          </div>
          
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select 
                value={formState.category.toString()}
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