import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check, Trash2 } from 'lucide-react';

type SimpleHabitEditorProps = {
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
 * A simplified habit editor dialog with improved state management
 */
export function SimpleHabitEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: SimpleHabitEditorProps) {
  // Create a local copy of the habit being edited
  const [habitData, setHabitData] = useState<Habit | null>(null);
  const [isNew, setIsNew] = useState(false);
  
  // Reset the form data when the dialog opens or habit changes
  useEffect(() => {
    if (!open) {
      // Ensure we clear the state when dialog closes
      return;
    }
    
    // Creating a new habit
    if (!habit) {
      const newId = `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setHabitData({
        id: newId,
        title: '',
        description: '',
        icon: 'check-square',
        iconColor: 'blue',
        impact: 8,
        effort: 4,
        timeCommitment: '5 min',
        frequency: 'daily' as HabitFrequency,
        isAbsolute: true,
        category: 'physical' as HabitCategory,
        streak: 0,
        createdAt: new Date()
      });
      setIsNew(true);
      return;
    }
    
    // Editing an existing habit - make a deep copy to avoid mutation
    setHabitData({...habit});
    setIsNew(false);
  }, [open, habit]);
  
  // Handle field updates
  const updateField = <K extends keyof Habit>(field: K, value: Habit[K]) => {
    if (!habitData) return;
    
    setHabitData(prev => {
      if (!prev) return prev;
      
      // Special handling for frequency to update isAbsolute automatically
      if (field === 'frequency') {
        return {
          ...prev,
          [field]: value,
          isAbsolute: value === 'daily'
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  // Handle save
  const handleSave = () => {
    if (!habitData || !habitData.title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Create a clean copy of the habit data for saving
    const habitToSave: Habit = {
      ...habitData,
      title: habitData.title.trim(),
      // Ensure these related fields are consistent
      isAbsolute: habitData.frequency === 'daily'
    };
    
    // Close the dialog first
    onOpenChange(false);
    
    // Add a small delay to ensure dialog is closed before state updates
    setTimeout(() => {
      onSave(habitToSave);
    }, 50);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (!habitData || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this habit?')) {
      // Close dialog first
      onOpenChange(false);
      
      // Small delay to prevent state update conflicts
      setTimeout(() => {
        onDelete(habitData.id);
      }, 50);
    }
  };
  
  // Don't render anything if habit data is not loaded yet
  if (!habitData) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create New Habit' : 'Edit Habit'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input
              id="title"
              value={habitData.title}
              onChange={e => updateField('title', e.target.value)}
              className="col-span-3"
              placeholder="Habit name"
            />
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select 
              value={habitData.frequency}
              onValueChange={val => updateField('frequency', val as HabitFrequency)}
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
              <Select disabled value={habitData.category}>
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
                    ${habitData.iconColor === option.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => updateField('iconColor', option.value)}
                >
                  {habitData.iconColor === option.value && (
                    <Check className={`h-4 w-4 ${option.textClass}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {!isNew && onDelete && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              <Trash2 className="h-4 w-4 mr-2" />
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