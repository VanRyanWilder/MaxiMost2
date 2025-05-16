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
import { 
  Brain, 
  Dumbbell, 
  Users, 
  Moon,
  Utensils,
  CircleDollarSign,
  Trash2
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type MaxiMostEditDialogProps = {
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
  icon: "dumbbell",
  iconColor: "red", // Default color scheme matching the Physical Training category
  impact: 8,
  effort: 4,
  timeCommitment: "10 min",
  frequency: "daily", // Default frequency
  isAbsolute: true, // Daily habits are absolute
  category: "physical", // Default to Physical Training
  streak: 0,
  createdAt: new Date()
};

export function MaxiMostEditDialog({ 
  open, 
  onOpenChange, 
  habit, 
  onSave,
  onDelete
}: MaxiMostEditDialogProps) {
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);
  const [isCreatingNewHabit, setIsCreatingNewHabit] = useState(false);
  
  // Reset form when habit changes
  useEffect(() => {
    if (!open) return;
    
    if (habit) {
      // We're editing an existing habit
      let workingHabit = {...habit};
      
      // Make sure the category is one of the MaxiMost categories
      if (workingHabit.category === "health" || workingHabit.category === "fitness") {
        workingHabit.category = "physical";
      } else if (workingHabit.category === "mind") {
        workingHabit.category = "mental";
      } else if (workingHabit.category === "social") {
        workingHabit.category = "relationships";
      } else if (workingHabit.category === "finance" || workingHabit.category === "productivity") {
        workingHabit.category = "financial";
      }
      
      // Ensure correct icon and color for the category
      workingHabit = ensureCategoryIconAndColor(workingHabit);
      
      setEditedHabit(workingHabit);
      setIsCreatingNewHabit(false);
    } else {
      // Create a new habit with a unique ID
      const newHabit = {
        ...DEFAULT_NEW_HABIT,
        id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`
      };
      setEditedHabit(newHabit);
      setIsCreatingNewHabit(true);
    }
  }, [habit, open]);
  
  function ensureCategoryIconAndColor(habitData: Habit): Habit {
    let iconColor = habitData.iconColor || "blue";
    let icon = habitData.icon || "zap";
    
    // Set appropriate colors and icons for MaxiMost categories
    switch(habitData.category) {
      case "physical": 
        iconColor = "red"; 
        icon = "dumbbell";
        break;
      case "nutrition": 
        iconColor = "orange"; 
        icon = "utensils";
        break;
      case "sleep": 
        iconColor = "indigo"; 
        icon = "moon";
        break;
      case "mental": 
        iconColor = "yellow"; 
        icon = "brain";
        break;
      case "relationships": 
        iconColor = "green"; 
        icon = "users";
        break;
      case "financial": 
        iconColor = "emerald"; 
        icon = "circleDollarSign";
        break;
    }
    
    return {
      ...habitData,
      iconColor,
      icon
    };
  }
  
  if (!editedHabit) {
    return null;
  }
  
  const handleSave = () => {
    if (!editedHabit || !editedHabit.title) return;
    
    // Ensure the habit has the right icon and color for its category
    const finalHabit = ensureCategoryIconAndColor(editedHabit);
    
    // Make sure isAbsolute is set correctly based on frequency
    finalHabit.isAbsolute = finalHabit.frequency === 'daily';
    
    console.log("MaxiMost Edit Dialog - Saving habit:", {
      id: finalHabit.id,
      title: finalHabit.title,
      category: finalHabit.category,
      icon: finalHabit.icon,
      iconColor: finalHabit.iconColor
    });
    
    // Save and close
    onSave(finalHabit);
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (editedHabit && onDelete) {
      onDelete(editedHabit.id);
      onOpenChange(false);
    }
  };
  
  const handleCategoryChange = (value: HabitCategory) => {
    setEditedHabit(prev => {
      if (!prev) return prev;
      
      // Update the category
      const updatedHabit = { ...prev, category: value };
      
      // Ensure the right icon and color are set
      return ensureCategoryIconAndColor(updatedHabit);
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isCreatingNewHabit ? "Create New Habit" : "Edit Habit"}
          </DialogTitle>
          <DialogDescription>
            {isCreatingNewHabit 
              ? "Define a new habit to add to your dashboard."
              : "Refine this habit to maximize your success and consistency."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Habit Name */}
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
          
          {/* Description */}
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
          
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={editedHabit.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {/* MaxiMost primary categories */}
                <SelectItem value="physical">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-red-500" />
                    <span>Physical Training</span>
                  </div>
                </SelectItem>
                <SelectItem value="nutrition">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    <span>Nutrition & Fueling</span>
                  </div>
                </SelectItem>
                <SelectItem value="sleep">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    <span>Sleep & Hygiene</span>
                  </div>
                </SelectItem>
                <SelectItem value="mental">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-yellow-500" />
                    <span>Mental Acuity & Growth</span>
                  </div>
                </SelectItem>
                <SelectItem value="relationships">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Relationships & Community</span>
                  </div>
                </SelectItem>
                <SelectItem value="financial">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                    <span>Financial Habits</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Frequency */}
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
                <SelectItem value="daily">Daily (7 days/week)</SelectItem>
                <SelectItem value="6x-week">6 times per week</SelectItem>
                <SelectItem value="5x-week">5 times per week</SelectItem>
                <SelectItem value="4x-week">4 times per week</SelectItem>
                <SelectItem value="3x-week">3 times per week</SelectItem>
                <SelectItem value="2x-week">2 times per week</SelectItem>
                <SelectItem value="1x-week">1 time per week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Commitment */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeCommitment" className="text-right">
              Time
            </Label>
            <Input
              id="timeCommitment"
              value={editedHabit.timeCommitment}
              onChange={(e) => setEditedHabit({...editedHabit, timeCommitment: e.target.value})}
              className="col-span-3"
              placeholder="e.g. 5 min"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {!isCreatingNewHabit && onDelete && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}