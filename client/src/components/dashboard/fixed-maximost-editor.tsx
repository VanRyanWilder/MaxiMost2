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
  // Form state
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [color, setColor] = useState('blue');
  const [id, setId] = useState('');
  
  // Clear form state when dialog closes
  useEffect(() => {
    if (!open) {
      return;
    }
    
    if (habit) {
      // We're editing an existing habit
      setTitle(habit.title);
      setFrequency(habit.frequency as string);
      setColor(habit.iconColor || 'blue');
      setId(habit.id);
      console.log('Loading existing habit for editing:', habit);
    } else {
      // Creating a new habit
      setTitle('');
      setFrequency('daily');
      setColor('blue');
      setId(`habit-${Date.now()}`);
      console.log('Creating new habit');
    }
  }, [open, habit]);
  
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Create the habit object
    const updatedHabit: Habit = {
      id: id,
      title: title,
      description: habit?.description || '',
      icon: habit?.icon || 'check-square',
      iconColor: color,
      impact: habit?.impact || 8,
      effort: habit?.effort || 4,
      timeCommitment: habit?.timeCommitment || '5 min',
      frequency: frequency as HabitFrequency,
      isAbsolute: frequency === 'daily',
      category: habit?.category || 'health',
      streak: habit?.streak || 0,
      createdAt: habit?.createdAt || new Date()
    };
    
    console.log('Saving habit with data:', updatedHabit);
    
    // Close dialog first
    onOpenChange(false);
    
    // Call parent's save function
    onSave(updatedHabit);
  };
  
  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this habit?')) {
      onOpenChange(false);
      if (onDelete) onDelete(id);
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
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">Frequency</Label>
            <Select 
              value={frequency}
              onValueChange={setFrequency}
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
                    ${color === option.value ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => setColor(option.value)}
                >
                  {color === option.value && (
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