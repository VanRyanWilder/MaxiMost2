import { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, 
  DropletIcon, 
  Dumbbell, 
  BookOpen, 
  Users, 
  Heart, 
  Sun, 
  Zap,
  PlusCircle
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type EditHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Default habit template for creating new habits
const DEFAULT_NEW_HABIT: Habit = {
  id: `h-${Date.now()}`,
  title: "",
  description: "",
  icon: "zap",
  impact: 8,
  effort: 4,
  timeCommitment: "10 min",
  frequency: "daily",
  isAbsolute: false,
  category: "health",
  streak: 0,
  createdAt: new Date()
};

export function EditHabitDialog({ 
  open, 
  onOpenChange, 
  habit, 
  onSave,
  onDelete
}: EditHabitDialogProps) {
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  
  // Ref to track if we're creating a new habit or editing an existing one
  const isCreatingNewHabit = useRef(false);
  
  // Reset form when habit changes
  useEffect(() => {
    if (habit) {
      setEditedHabit({...habit});
      isCreatingNewHabit.current = false;
      setShowCustomCategoryInput(habit.category !== "health" && 
                                 habit.category !== "fitness" && 
                                 habit.category !== "mind" && 
                                 habit.category !== "social");
      if (habit.category !== "health" && 
          habit.category !== "fitness" && 
          habit.category !== "mind" && 
          habit.category !== "social") {
        setCustomCategory(habit.category);
      }
    } else {
      // Create a new habit with a unique ID
      const newHabit = {
        ...DEFAULT_NEW_HABIT,
        id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`
      };
      setEditedHabit(newHabit);
      isCreatingNewHabit.current = true;
      setShowCustomCategoryInput(false);
      setCustomCategory("");
    }
  }, [habit, open]);
  
  // Listen for add-habit-dialog events
  useEffect(() => {
    const handleOpenAddHabitDialog = () => {
      // Create a new habit with a unique ID
      const newHabit = {
        ...DEFAULT_NEW_HABIT,
        id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`
      };
      setEditedHabit(newHabit);
      isCreatingNewHabit.current = true;
      setShowCustomCategoryInput(false);
      setCustomCategory("");
      onOpenChange(true);
    };
    
    document.addEventListener('open-add-habit-dialog', handleOpenAddHabitDialog);
    
    return () => {
      document.removeEventListener('open-add-habit-dialog', handleOpenAddHabitDialog);
    };
  }, [onOpenChange]);
  
  if (!editedHabit) {
    return null;
  }
  
  const handleSave = () => {
    if (editedHabit) {
      // If using a custom category, set the category to the custom value
      if (showCustomCategoryInput && customCategory) {
        const finalHabit = {
          ...editedHabit,
          category: customCategory as HabitCategory
        };
        onSave(finalHabit);
      } else {
        onSave(editedHabit);
      }
      onOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (editedHabit && onDelete) {
      onDelete(editedHabit.id);
      onOpenChange(false);
    }
  };
  
  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategoryInput(true);
      return;
    }
    
    setShowCustomCategoryInput(false);
    
    // Set both category and relevant icon based on selection
    let icon = "zap";
    switch (value) {
      case "health": icon = "heart"; break;
      case "fitness": icon = "dumbbell"; break;
      case "mind": icon = "brain"; break;
      case "social": icon = "users"; break;
      default: icon = "zap";
    }
    
    setEditedHabit({...editedHabit, category: value as HabitCategory, icon: icon});
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isCreatingNewHabit.current ? "Create New Habit" : "Edit Habit"}
          </DialogTitle>
          <DialogDescription>
            {isCreatingNewHabit.current 
              ? "Define a new habit to add to your dashboard."
              : "Refine this habit to maximize your success and consistency."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Name
            </Label>
            <Input
              id="title"
              value={editedHabit.title}
              onChange={(e) => setEditedHabit({...editedHabit, title: e.target.value})}
              className="col-span-3"
              placeholder="Habit name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedHabit.description}
              onChange={(e) => setEditedHabit({...editedHabit, description: e.target.value})}
              className="col-span-3"
              placeholder="Brief description"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category/Icon
            </Label>
            <Select 
              value={editedHabit.category} 
              onValueChange={(value: HabitCategory) => setEditedHabit({...editedHabit, category: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-blue-500" />
                    <span>Health</span>
                  </div>
                </SelectItem>
                <SelectItem value="fitness">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-blue-500" />
                    <span>Fitness</span>
                  </div>
                </SelectItem>
                <SelectItem value="mind">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    <span>Mind</span>
                  </div>
                </SelectItem>
                <SelectItem value="social">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Social</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={editedHabit.frequency} 
              onValueChange={(value: HabitFrequency) => setEditedHabit({...editedHabit, frequency: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="2x-week">2x per week</SelectItem>
                <SelectItem value="3x-week">3x per week</SelectItem>
                <SelectItem value="4x-week">4x per week</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time Needed
            </Label>
            <Select 
              value={editedHabit.timeCommitment} 
              onValueChange={(value) => setEditedHabit({...editedHabit, timeCommitment: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 min">1 minute</SelectItem>
                <SelectItem value="5 min">5 minutes</SelectItem>
                <SelectItem value="10 min">10 minutes</SelectItem>
                <SelectItem value="15 min">15 minutes</SelectItem>
                <SelectItem value="30 min">30 minutes</SelectItem>
                <SelectItem value="45 min">45 minutes</SelectItem>
                <SelectItem value="60 min">1 hour</SelectItem>
                <SelectItem value="All day">Throughout the day</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Impact (1-10)</Label>
            <div className="col-span-3 px-2">
              <Slider 
                value={[editedHabit.impact]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setEditedHabit({...editedHabit, impact: value[0]})}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Lower</span>
                <span>Current: {editedHabit.impact}</span>
                <span>Higher</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Effort (1-10)</Label>
            <div className="col-span-3 px-2">
              <Slider 
                value={[editedHabit.effort]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setEditedHabit({...editedHabit, effort: value[0]})}
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Easier</span>
                <span>Current: {editedHabit.effort}</span>
                <span>Harder</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isAbsolute" className="text-right">
              Daily Must-Do
            </Label>
            <div className="flex items-center gap-2 col-span-3">
              <Switch 
                id="isAbsolute"
                checked={editedHabit.isAbsolute}
                onCheckedChange={(checked) => setEditedHabit({...editedHabit, isAbsolute: checked})}
              />
              <span className="text-sm text-muted-foreground">
                {editedHabit.isAbsolute 
                  ? "This is a daily absolute habit (must-do)" 
                  : "This is a flexible habit (optional)"}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          {onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete Habit
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}