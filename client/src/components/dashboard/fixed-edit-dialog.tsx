import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit, HabitFrequency, HabitCategory } from '@/types/habit';

type FixedEditDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Default color schemes for habit icons
const colorSchemes = [
  { id: 'blue', name: 'Blue', primary: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'green', name: 'Green', primary: 'text-green-500', bg: 'bg-green-100' },
  { id: 'red', name: 'Red', primary: 'text-red-500', bg: 'bg-red-100' },
  { id: 'amber', name: 'Amber', primary: 'text-amber-500', bg: 'bg-amber-100' },
  { id: 'purple', name: 'Purple', primary: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'indigo', name: 'Indigo', primary: 'text-indigo-500', bg: 'bg-indigo-100' },
  { id: 'pink', name: 'Pink', primary: 'text-pink-500', bg: 'bg-pink-100' },
  { id: 'cyan', name: 'Cyan', primary: 'text-cyan-500', bg: 'bg-cyan-100' },
];

// Template for a new habit
const DEFAULT_NEW_HABIT: Habit = {
  id: `habit-${Date.now()}`,
  title: '',
  description: '',
  icon: 'check-square',
  iconColor: 'blue',
  impact: 8,
  effort: 3,
  timeCommitment: '5 min',
  frequency: 'daily',
  isAbsolute: true,
  category: 'health',
  streak: 0,
  createdAt: new Date()
};

export function FixedEditDialog({ open, setOpen, habit, onSave, onDelete }: FixedEditDialogProps) {
  // Local state to track habit data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [iconColor, setIconColor] = useState('blue');
  const [isNew, setIsNew] = useState(true);
  const [habitId, setHabitId] = useState('');

  // Initialize form data when dialog opens or habit changes
  useEffect(() => {
    if (open) {
      if (habit) {
        console.log("EDIT DIALOG: Loading habit for editing:", habit.title);
        setTitle(habit.title);
        setDescription(habit.description || '');
        setFrequency(habit.frequency);
        setCategory(habit.category);
        setIconColor(habit.iconColor || 'blue');
        setHabitId(habit.id);
        setIsNew(false);
      } else {
        console.log("EDIT DIALOG: Creating new habit");
        // Default values for a new habit
        setTitle('');
        setDescription('');
        setFrequency('daily');
        setCategory('health');
        setIconColor('blue');
        setHabitId(`habit-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
        setIsNew(true);
      }
    }
  }, [habit, open]);

  // Handle form submission
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your habit');
      return;
    }

    // Construct the complete habit object
    const updatedHabit: Habit = {
      id: habitId,
      title,
      description,
      icon: getCategoryIcon(category),
      iconColor,
      impact: 8,
      effort: 4,
      timeCommitment: '5 min',
      frequency,
      isAbsolute: frequency === 'daily', // Daily habits are always absolute
      category,
      streak: habit?.streak || 0,
      createdAt: habit?.createdAt || new Date()
    };

    console.log("📦 SAVING HABIT:", {
      title: updatedHabit.title,
      color: updatedHabit.iconColor,
      id: updatedHabit.id
    });

    // Call parent's onSave function
    onSave(updatedHabit);
    
    // Close the dialog
    setOpen(false);
  };

  // Get an appropriate icon based on category
  const getCategoryIcon = (cat: HabitCategory): string => {
    switch (cat) {
      case 'health': return 'droplets';
      case 'fitness': return 'dumbbell';
      case 'mind': return 'brain';
      case 'social': return 'users';
      case 'productivity': return 'zap';
      default: return 'check-square';
    }
  };

  // Render color button
  const renderColorButton = (color: typeof colorSchemes[0]) => {
    return (
      <button
        key={color.id}
        type="button"
        className={`h-8 w-8 rounded-md ${color.bg} flex items-center justify-center
          ${iconColor === color.id ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => {
          console.log(`Setting color to ${color.id}`);
          setIconColor(color.id);
        }}
      >
        <div className={`h-4 w-4 rounded-full ${color.primary}`}></div>
      </button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Create New Habit' : 'Edit Habit'}
          </DialogTitle>
          <DialogDescription>
            {isNew 
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={frequency}
              onValueChange={(value: HabitFrequency) => setFrequency(value)}
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

          {/* Category selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={category}
              onValueChange={(value: HabitCategory) => setCategory(value)}
            >
              <SelectTrigger className="col-span-3">
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
          </div>

          {/* Color selection */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Color
            </Label>
            <div className="col-span-3 grid grid-cols-4 gap-2">
              {colorSchemes.map(color => renderColorButton(color))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {!isNew && onDelete && (
            <Button variant="destructive" onClick={() => {
              if (window.confirm('Are you sure you want to delete this habit?')) {
                onDelete(habitId);
                setOpen(false);
              }
            }}>
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