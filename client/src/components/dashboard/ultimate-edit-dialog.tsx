import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';
import { Check } from 'lucide-react';

// Simple props interface with just what we need
interface UltimateEditDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
}

// Define color choices with consistent naming
const colorOptions = [
  { id: 'blue', label: 'Blue', value: 'blue', bg: 'bg-blue-100', text: 'text-blue-500' },
  { id: 'green', label: 'Green', value: 'green', bg: 'bg-green-100', text: 'text-green-500' },
  { id: 'red', label: 'Red', value: 'red', bg: 'bg-red-100', text: 'text-red-500' },
  { id: 'amber', label: 'Amber', value: 'amber', bg: 'bg-amber-100', text: 'text-amber-500' },
  { id: 'purple', label: 'Purple', value: 'purple', bg: 'bg-purple-100', text: 'text-purple-500' },
  { id: 'indigo', label: 'Indigo', value: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-500' },
  { id: 'pink', label: 'Pink', value: 'pink', bg: 'bg-pink-100', text: 'text-pink-500' },
  { id: 'cyan', label: 'Cyan', value: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-500' },
];

export function UltimateEditDialog({ open, setOpen, habit, onSave, onDelete }: UltimateEditDialogProps) {
  // Maintain all form data in a single state object
  const [formData, setFormData] = useState<Habit>({
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
  
  // Reset form when dialog opens/closes or habit changes
  useEffect(() => {
    if (habit && open) {
      // If editing existing habit, load its data
      console.log("Loading habit for editing:", habit.title, "Color:", habit.iconColor);
      setFormData({
        ...habit,
        // Ensure we have default values for any missing properties
        description: habit.description || '',
        iconColor: habit.iconColor || 'blue'
      });
    } else if (open) {
      // If creating new habit, set defaults
      setFormData({
        id: `habit-${Date.now()}`,
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
    }
  }, [habit, open]);

  // Handle form field changes
  const handleChange = (field: keyof Habit, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value 
    }));
  };

  // Handle color selection
  const handleColorChange = (color: string) => {
    console.log("Color selected:", color);
    setFormData(prev => ({
      ...prev,
      iconColor: color
    }));
  };

  // Handle form submission
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Please enter a title for your habit');
      return;
    }
    
    console.log("Saving habit:", formData.title, "Color:", formData.iconColor);
    
    // Call the parent's save function
    onSave(formData);
    setOpen(false);
  };

  // Handle deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      if (onDelete) {
        onDelete(formData.id);
      }
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
          <DialogDescription>
            {habit 
              ? 'Make changes to your existing habit.' 
              : 'Add a new habit to track in your dashboard.'}
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

          {/* Frequency selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={formData.frequency.toString()}
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
            <div className="col-span-3 flex items-center gap-2">
              <Select 
                value={formData.category.toString()}
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
                </SelectContent>
              </Select>
              <span className="text-xs text-amber-600 font-semibold">Coming Soon</span>
            </div>
          </div>

          {/* Color selection */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Color
            </Label>
            <div className="col-span-3 grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.id}
                  type="button"
                  className={`h-8 w-8 rounded-full ${color.bg} flex items-center justify-center transition-all
                    ${formData.iconColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                  onClick={() => handleColorChange(color.value)}
                >
                  {formData.iconColor === color.value && (
                    <Check className={`h-3 w-3 ${color.text}`} />
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