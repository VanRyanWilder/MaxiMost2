import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Input 
} from '@/components/ui/input';
import { 
  Label 
} from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Habit 
} from '@/types/habit';
import { Check } from 'lucide-react';

// Props for the dialog component
type OneHabitEditProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSaveHabit: (habit: Habit) => void;
  onDeleteHabit?: (habitId: string) => void;
};

// Color options for habits
const colorOptions = [
  { name: 'Blue', value: 'blue', bgClass: 'bg-blue-100', textClass: 'text-blue-500' },
  { name: 'Green', value: 'green', bgClass: 'bg-green-100', textClass: 'text-green-500' },
  { name: 'Red', value: 'red', bgClass: 'bg-red-100', textClass: 'text-red-500' },
  { name: 'Amber', value: 'amber', bgClass: 'bg-amber-100', textClass: 'text-amber-500' },
  { name: 'Purple', value: 'purple', bgClass: 'bg-purple-100', textClass: 'text-purple-500' },
  { name: 'Pink', value: 'pink', bgClass: 'bg-pink-100', textClass: 'text-pink-500' },
  { name: 'Indigo', value: 'indigo', bgClass: 'bg-indigo-100', textClass: 'text-indigo-500' },
  { name: 'Cyan', value: 'cyan', bgClass: 'bg-cyan-100', textClass: 'text-cyan-500' },
];

export function OneHabitEdit({ 
  open, 
  onOpenChange, 
  habit, 
  onSaveHabit, 
  onDeleteHabit 
}: OneHabitEditProps) {
  // Local state to track form data
  const [habitData, setHabitData] = useState<Habit>({
    id: '',
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

  // Load habit data when the dialog opens
  useEffect(() => {
    if (open && habit) {
      // If we're editing an existing habit
      console.log('⏳ Loading habit for editing:', habit.title, 'Color:', habit.iconColor);
      setHabitData({
        ...habit,
        // Set defaults for any missing properties
        description: habit.description || '',
        iconColor: habit.iconColor || 'blue'
      });
    } else if (open) {
      // If we're creating a new habit
      console.log('⏳ Creating a new habit');
      setHabitData({
        id: `habit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    }
  }, [open, habit]);

  // Handle changes to form fields
  const handleChange = (field: keyof Habit, value: any) => {
    console.log('🔄 Changing field:', field, 'to:', value);
    
    if (field === 'frequency' && value === 'daily') {
      // Daily habits are always absolute
      setHabitData(prev => ({
        ...prev,
        [field]: value,
        isAbsolute: true
      }));
    } else {
      // Normal field update
      setHabitData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle saving the habit
  const handleSave = () => {
    if (!habitData.title.trim()) {
      alert('Please enter a title for your habit');
      return;
    }

    // Get appropriate icon for the category
    const icon = getCategoryIcon(habitData.category);
    
    const finalHabit = {
      ...habitData,
      icon
    };
    
    console.log('💾 Saving habit:', finalHabit.title, 'Color:', finalHabit.iconColor);
    
    // Call the save function provided by the parent
    onSaveHabit(finalHabit);
  };

  // Get appropriate icon based on category
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'health': return 'heart';
      case 'fitness': return 'dumbbell';
      case 'mind': return 'brain';
      case 'social': return 'users';
      case 'productivity': return 'zap';
      default: return 'check-square';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={habitData.title}
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
              value={habitData.frequency}
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

          {/* Category selection - visible but disabled */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select 
                value={habitData.category}
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
                  key={color.value}
                  type="button"
                  aria-label={`Select ${color.name} color`}
                  className={`h-8 w-8 rounded-full ${color.bgClass} flex items-center justify-center transition-all
                    ${habitData.iconColor === color.value ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`}
                  onClick={() => handleChange('iconColor', color.value)}
                >
                  {habitData.iconColor === color.value && (
                    <Check className={`h-3 w-3 ${color.textClass}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {habit && onDeleteHabit && (
            <Button variant="destructive" onClick={() => {
              if (window.confirm('Are you sure you want to delete this habit?')) {
                onDeleteHabit(habitData.id);
              }
            }}>
              Delete
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
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