import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check, CheckCircle2 } from 'lucide-react';

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
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-500' },
  { name: 'Cyan', value: 'cyan', bgClass: 'bg-cyan-100', textClass: 'text-cyan-500' },
  { name: 'Orange', value: 'orange', bgClass: 'bg-orange-100', textClass: 'text-orange-500' },
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
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<string>('daily');
  const [color, setColor] = useState('blue');
  const [id, setId] = useState('');
  const [isAbsolute, setIsAbsolute] = useState(true);
  const [category, setCategory] = useState<HabitCategory>('physical');
  const [impact, setImpact] = useState(8); // Default high impact
  const [effort, setEffort] = useState(4); // Default medium effort
  
  // Reset form when the dialog opens/closes or the habit changes
  useEffect(() => {
    if (!open) {
      return;
    }
    
    if (habit) {
      // We're editing an existing habit
      setTitle(habit.title);
      setDescription(habit.description || '');
      setFrequency(habit.frequency);
      setColor(habit.iconColor || 'blue');
      setId(habit.id);
      setIsAbsolute(habit.isAbsolute);
      setImpact(habit.impact || 8);
      setEffort(habit.effort || 4);
      // Ensure we properly set the category for existing habits
      // Default to 'physical' if no category exists
      if (habit.category) {
        setCategory(habit.category as HabitCategory);
      } else {
        setCategory('physical');
      }
      console.log('Editing habit:', habit.title, 'with color:', habit.iconColor, 'and category:', habit.category);
    } else {
      // Creating a new habit
      setTitle('');
      setDescription('');
      setFrequency('daily');
      setColor('blue');
      setId(`habit-${Date.now()}`);
      setIsAbsolute(true);
      setCategory('physical');
      setImpact(8);
      setEffort(4);
    }
  }, [open, habit]);
  
  // Update isAbsolute when frequency changes
  useEffect(() => {
    setIsAbsolute(frequency === 'daily');
  }, [frequency]);
  
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Ensure we have the correct icon and color
    const selectedIcon = getCategoryIcon(category);
    const selectedColor = color || 'blue';
    
    // Create the habit object with our selected category, icon, and color
    const updatedHabit: Habit = {
      id: id,
      title: title,
      description: description,
      icon: selectedIcon, // Get icon based on category
      iconColor: selectedColor,
      impact: habit?.impact || 8,
      effort: habit?.effort || 4,
      timeCommitment: habit?.timeCommitment || '5 min',
      frequency: frequency as HabitFrequency,
      isAbsolute: frequency === 'daily',
      category: category, // Use the selected category 
      streak: habit?.streak || 0,
      createdAt: habit?.createdAt || new Date()
    };
    
    console.log('MAXIMOST EDITOR - Saving habit with details:', {
      title: updatedHabit.title,
      category: updatedHabit.category,
      icon: updatedHabit.icon,
      iconColor: updatedHabit.iconColor,
      impact: updatedHabit.impact,
      effort: updatedHabit.effort
    });
    
    // First close the dialog to prevent state interference
    onOpenChange(false);
    
    // Then use setTimeout to ensure dialog closing completes before saving
    setTimeout(() => {
      // Call parent's save function
      onSave(updatedHabit);
    }, 50);
  };
  
  // Get an appropriate icon based on category
  const getCategoryIcon = (cat: HabitCategory): string => {
    switch (cat) {
      // MaxiMost categories
      case 'physical': return 'dumbbell';
      case 'nutrition': return 'utensils';
      case 'sleep': return 'moon';
      case 'mental': return 'lightbulb';
      case 'relationships': return 'users';
      case 'financial': return 'dollar-sign';
      
      // Legacy categories
      case 'health': return 'droplets';
      case 'fitness': return 'dumbbell';
      case 'mind': return 'brain';
      case 'social': return 'users';
      case 'productivity': return 'zap';
      case 'finance': return 'dollar-sign';
      
      default: return 'check-square';
    }
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
          
          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
          
          {/* Category selector */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select 
                value={category}
                onValueChange={(value) => setCategory(value as HabitCategory)}
              >
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
            </div>
          </div>
          
          {/* Display whether habit is absolute based on frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <div className="col-span-3 flex items-center gap-2">
              {isAbsolute ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Absolute</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-600">
                  <span className="text-sm font-medium">Frequency-based</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Impact Rating */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="impact" className="text-right">Impact</Label>
            <div className="col-span-3">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Low</span>
                  <span className="text-sm font-medium">{impact}/10</span>
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={impact} 
                  onChange={(e) => setImpact(parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
          
          {/* Effort Rating */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="effort" className="text-right">Effort</Label>
            <div className="col-span-3">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Low</span>
                  <span className="text-sm font-medium">{effort}/10</span>
                  <span className="text-sm text-muted-foreground">High</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={effort} 
                  onChange={(e) => setEffort(parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
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