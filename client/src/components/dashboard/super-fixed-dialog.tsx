import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check } from 'lucide-react';

type SuperFixedDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Define color choices for habit icons - we'll use a completely different approach
const colorOptions = [
  { id: 'blue', name: 'Blue', value: 'blue', bgClass: 'bg-blue-100', textClass: 'text-blue-500' },
  { id: 'green', name: 'Green', value: 'green', bgClass: 'bg-green-100', textClass: 'text-green-500' },
  { id: 'red', name: 'Red', value: 'red', bgClass: 'bg-red-100', textClass: 'text-red-500' },
  { id: 'amber', name: 'Amber', value: 'amber', bgClass: 'bg-amber-100', textClass: 'text-amber-500' },
  { id: 'purple', name: 'Purple', value: 'purple', bgClass: 'bg-purple-100', textClass: 'text-purple-500' },
  { id: 'indigo', name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-500' },
  { id: 'pink', name: 'Pink', value: 'pink', bgClass: 'bg-pink-100', textClass: 'text-pink-500' },
  { id: 'cyan', name: 'Cyan', value: 'cyan', bgClass: 'bg-cyan-100', textClass: 'text-cyan-500' },
];

export function SuperFixedDialog({ open, setOpen, habit, onSave, onDelete }: SuperFixedDialogProps) {
  // Store form data in plain variables instead of more complex state
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    frequency: 'daily' as HabitFrequency,
    icon: 'check-square',
    iconColor: 'blue',
    isAbsolute: true,
    category: 'health' as HabitCategory,
    impact: 8,
    effort: 3,
    timeCommitment: '5 min',
    streak: 0,
    createdAt: new Date()
  });
  
  // Using a simple boolean flag for tracking if this is a new habit
  const [isNewHabit, setIsNewHabit] = useState(true);
  
  // Initialize form when a habit is loaded
  useEffect(() => {
    if (habit && open) {
      // Log the habit being loaded
      console.log("🔍 DIALOG LOADING HABIT:", {
        id: habit.id, 
        title: habit.title,
        color: habit.iconColor
      });
      
      // Set all form data from the habit object
      setFormData({
        id: habit.id,
        title: habit.title,
        description: habit.description || '',
        frequency: habit.frequency,
        icon: habit.icon,
        iconColor: habit.iconColor || 'blue',
        isAbsolute: habit.isAbsolute,
        category: habit.category,
        impact: habit.impact || 8,
        effort: habit.effort || 3,
        timeCommitment: habit.timeCommitment || '5 min',
        streak: habit.streak || 0,
        createdAt: habit.createdAt || new Date()
      });
      
      setIsNewHabit(false);
    } else if (open) {
      // Set defaults for a new habit
      setFormData({
        id: `habit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: '',
        description: '',
        frequency: 'daily',
        icon: 'check-square',
        iconColor: 'blue',
        isAbsolute: true,
        category: 'health',
        impact: 8,
        effort: 3,
        timeCommitment: '5 min',
        streak: 0,
        createdAt: new Date()
      });
      
      setIsNewHabit(true);
    }
  }, [habit, open]);
  
  // Simple field change handler
  const handleChange = (field: string, value: any) => {
    // Update form data
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
    
    // Special case for frequency - daily habits are always absolute
    if (field === 'frequency' && value === 'daily') {
      setFormData(prev => ({ 
        ...prev, 
        isAbsolute: true 
      }));
    }
  };
  
  // Handle the save button click
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your habit');
      return;
    }
    
    console.log("💾 ABOUT TO SAVE HABIT:", {
      id: formData.id,
      title: formData.title,
      color: formData.iconColor
    });
    
    // Get the right icon for this category
    const icon = getCategoryIcon(formData.category);
    
    // Prepare the complete habit object
    const updatedHabit: Habit = {
      ...formData,
      icon,
      isAbsolute: formData.frequency === 'daily' ? true : formData.isAbsolute
    };
    
    console.log("📤 RETURNING HABIT FROM DIALOG:", {
      id: updatedHabit.id,
      title: updatedHabit.title,
      color: updatedHabit.iconColor
    });
    
    // Pass the habit to the parent component
    onSave(updatedHabit);
    
    // Close the dialog
    setOpen(false);
  };
  
  // Handle delete button click
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      if (onDelete) {
        console.log("🗑️ DELETING HABIT:", formData.id);
        onDelete(formData.id);
      }
      setOpen(false);
    }
  };
  
  // Get an appropriate icon based on category
  const getCategoryIcon = (cat: HabitCategory): string => {
    switch (cat) {
      case 'health': return 'heart';
      case 'fitness': return 'dumbbell';
      case 'mind': return 'brain';
      case 'social': return 'users';
      case 'productivity': return 'zap';
      default: return 'check-square';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isNewHabit ? 'Create New Habit' : 'Edit Habit'}
          </DialogTitle>
          <DialogDescription>
            {isNewHabit 
              ? 'Add a new habit to track in your dashboard.'
              : 'Make changes to your existing habit.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="col-span-3"
              placeholder="Habit name"
            />
          </div>

          {/* Description field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="col-span-3"
              placeholder="Brief description"
            />
          </div>

          {/* Frequency selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={formData.frequency}
              onValueChange={(value) => handleChange('frequency', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (every day)</SelectItem>
                <SelectItem value="2x-week">2x per week</SelectItem>
                <SelectItem value="3x-week">3x per week</SelectItem>
                <SelectItem value="4x-week">4x per week</SelectItem>
                <SelectItem value="5x-week">5x per week</SelectItem>
                <SelectItem value="6x-week">6x per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category selection - disabled with "coming soon" message */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Select 
                  value={formData.category}
                  disabled
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mind">Mind</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-amber-600 font-semibold">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Color selection - completely new approach with direct DOM manipulation */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Color
            </Label>
            <div className="col-span-3 grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.id}
                  type="button"
                  className={`h-8 w-8 rounded-full ${color.bgClass} flex items-center justify-center transition-all
                    ${formData.iconColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                  onClick={() => handleChange('iconColor', color.value)}
                >
                  {formData.iconColor === color.value && (
                    <Check className={`h-3 w-3 ${color.textClass}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {!isNewHabit && onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
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