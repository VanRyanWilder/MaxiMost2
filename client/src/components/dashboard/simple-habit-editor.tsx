import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check } from 'lucide-react';

type SimpleHabitEditorProps = {
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

// Frequency options with labels
const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: '2x-week', label: '2x per week' },
  { value: '3x-week', label: '3x per week' },
  { value: '4x-week', label: '4x per week' },
  { value: '5x-week', label: '5x per week' },
  { value: '6x-week', label: '6x per week' },
];

export function SimpleHabitEditor({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: SimpleHabitEditorProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [color, setColor] = useState('blue');
  const [id, setId] = useState('');
  
  // Load habit data when dialog opens
  useEffect(() => {
    if (open && habit) {
      // Editing existing habit
      setTitle(habit.title);
      setFrequency(typeof habit.frequency === 'string' ? habit.frequency : 'daily');
      setColor(habit.iconColor || 'blue');
      setId(habit.id);
      console.log('Loading habit for edit:', habit.title, habit.iconColor);
    } else if (open) {
      // Creating new habit
      setTitle('');
      setFrequency('daily');
      setColor('blue');
      setId(`habit-${Date.now()}`);
      console.log('Creating new habit');
    }
  }, [open, habit]);
  
  // Handle save
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a habit title');
      return;
    }
    
    // Create final habit object
    const updatedHabit: Habit = {
      id: id,
      title: title,
      description: '',
      icon: 'check-square',
      iconColor: color,
      impact: 8,
      effort: 4,
      timeCommitment: '5 min',
      frequency: frequency as HabitFrequency,
      isAbsolute: frequency === 'daily',
      category: 'health' as HabitCategory,
      streak: habit?.streak || 0,
      createdAt: habit?.createdAt || new Date()
    };
    
    console.log('Saving habit:', updatedHabit);
    
    // Close dialog first
    onOpenChange(false);
    
    // Call parent save function
    onSave(updatedHabit);
  };
  
  // Handle delete
  const handleDelete = () => {
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
              <SelectTrigger className="col-span-3">
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
              <Select disabled value="health">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Training</SelectItem>
                  <SelectItem value="nutrition">Nutrition & Fueling</SelectItem>
                  <SelectItem value="sleep">Sleep & Hygiene</SelectItem>
                  <SelectItem value="mental">Mental Acuity & Growth</SelectItem>
                  <SelectItem value="relationships">Relationships & Community</SelectItem>
                  <SelectItem value="financial">Financial Habits</SelectItem>
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