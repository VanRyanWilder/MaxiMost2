import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check } from 'lucide-react';

type HabitEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Color options
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
  { value: 'physical', label: 'Physical Training', description: 'Building a stronger, more resilient body' },
  { value: 'nutrition', label: 'Nutrition & Fueling', description: 'Nourishing your system with optimal foods' },
  { value: 'sleep', label: 'Sleep & Hygiene', description: 'Prioritizing rest and rejuvenation' },
  { value: 'mental', label: 'Mental Acuity & Growth', description: 'Sharpening focus and cultivating discipline' },
  { value: 'relationships', label: 'Relationships & Community', description: 'Nurturing strong connections' },
  { value: 'financial', label: 'Financial Habits', description: 'Building financial stability and freedom' },
];

export function MaximostHabitEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: HabitEditorProps) {
  // Form state with better initialization
  const [formState, setFormState] = useState({
    title: '',
    frequency: 'daily',
    color: 'blue',
    id: '',
    isInitialized: false
  });
  
  // Reset initialization flag when dialog closes
  useEffect(() => {
    if (!open) {
      setFormState(prev => ({...prev, isInitialized: false}));
    }
  }, [open]);
  
  // Initialize form only when dialog opens or habit changes
  useEffect(() => {
    // Only process when dialog is open and not yet initialized
    if (!open || formState.isInitialized) {
      return;
    }
    
    // Now safe to initialize
    if (habit) {
      // Editing existing habit
      console.log('Loading existing habit for editing:', habit.title);
      setFormState({
        title: habit.title || '',
        frequency: habit.frequency || 'daily',
        color: habit.iconColor || 'blue',
        id: habit.id,
        isInitialized: true
      });
    } else {
      // Creating new habit
      const newId = `habit-${Date.now()}`;
      console.log('Creating new habit with ID:', newId);
      setFormState({
        title: '',
        frequency: 'daily',
        color: 'blue',
        id: newId,
        isInitialized: true
      });
    }
  }, [open, habit, formState.isInitialized]);
  
  // Update form field handlers
  const updateTitle = (value: string) => {
    setFormState(prev => ({ ...prev, title: value }));
  };
  
  const updateFrequency = (value: string) => {
    setFormState(prev => ({ ...prev, frequency: value }));
  };
  
  const updateColor = (value: string) => {
    setFormState(prev => ({ ...prev, color: value }));
  };
  
  const handleSave = () => {
    if (!formState.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Create the habit object with better defaults
    const updatedHabit: Habit = {
      id: formState.id,
      title: formState.title,
      description: habit?.description || '',
      icon: habit?.icon || 'check-square',
      iconColor: formState.color,
      impact: habit?.impact || 8,
      effort: habit?.effort || 4,
      timeCommitment: habit?.timeCommitment || '5 min',
      frequency: formState.frequency as HabitFrequency,
      isAbsolute: formState.frequency === 'daily',
      category: habit?.category || 'physical',
      streak: habit?.streak || 0,
      createdAt: habit?.createdAt || new Date()
    };
    
    console.log('Saving habit with data:', updatedHabit.title);
    
    // Important: Close dialog BEFORE calling save to prevent re-renders
    onOpenChange(false);
    
    // Add a small delay to ensure state updates are processed
    setTimeout(() => {
      onSave(updatedHabit);
    }, 50);
  };
  
  const handleDelete = () => {
    if (!formState.id) return;
    
    if (window.confirm('Are you sure you want to delete this habit?')) {
      // First close the dialog to prevent state issues
      onOpenChange(false);
      
      // Then handle the delete with a small delay to avoid state conflicts
      setTimeout(() => {
        if (onDelete) onDelete(formState.id);
      }, 50);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              value={formState.title}
              onChange={e => updateTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select 
              value={formState.frequency}
              onValueChange={updateFrequency}
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
          
          {/* Category - disabled with "coming soon" */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select disabled value="physical">
                <SelectTrigger className="w-full">
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
              <span className="text-xs font-semibold text-amber-500">Coming Soon</span>
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
                    ${formState.color === option.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => updateColor(option.value)}
                >
                  {formState.color === option.value && (
                    <Check className={`h-4 w-4 ${option.textClass}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {habit && onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="space-x-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}