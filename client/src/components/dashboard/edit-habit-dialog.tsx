import { useState, useEffect } from "react";
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
  Activity,
  ScrollText
} from "lucide-react";

// Types that mirror the ones in dashboard.tsx
type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean;
  category: HabitCategory;
  streak?: number;
  createdAt?: Date;
}

type EditHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

export function EditHabitDialog({ 
  open, 
  onOpenChange, 
  habit, 
  onSave,
  onDelete
}: EditHabitDialogProps) {
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);
  
  // Reset form when habit changes
  useEffect(() => {
    setEditedHabit(habit ? {...habit} : null);
  }, [habit]);
  
  if (!editedHabit) {
    return null;
  }
  
  const handleSave = () => {
    if (editedHabit) {
      onSave(editedHabit);
      onOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (editedHabit && onDelete) {
      onDelete(editedHabit.id);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Refine this habit to maximize your success and consistency.
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
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Select 
              value={editedHabit.icon} 
              onValueChange={(value) => setEditedHabit({...editedHabit, icon: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brain">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Mind</span>
                  </div>
                </SelectItem>
                <SelectItem value="droplets">
                  <div className="flex items-center gap-2">
                    <DropletIcon className="h-4 w-4" />
                    <span>Water</span>
                  </div>
                </SelectItem>
                <SelectItem value="dumbbell">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    <span>Fitness</span>
                  </div>
                </SelectItem>
                <SelectItem value="bookopen">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Reading</span>
                  </div>
                </SelectItem>
                <SelectItem value="users">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Social</span>
                  </div>
                </SelectItem>
                <SelectItem value="heart">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Health</span>
                  </div>
                </SelectItem>
                <SelectItem value="sun">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Energy</span>
                  </div>
                </SelectItem>
                <SelectItem value="scroll">
                  <div className="flex items-center gap-2">
                    <ScrollText className="h-4 w-4" />
                    <span>Journal</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={editedHabit.category} 
              onValueChange={(value: HabitCategory) => setEditedHabit({...editedHabit, category: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="mind">Mind</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
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