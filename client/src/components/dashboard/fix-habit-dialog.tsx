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
import { 
  Brain, 
  Dumbbell, 
  Users, 
  Moon,
  Utensils,
  CircleDollarSign,
  Trash2,
  Lightbulb
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type FixHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Default habit template
const DEFAULT_HABIT: Habit = {
  id: `h-${Date.now()}`,
  title: "",
  description: "",
  icon: "dumbbell",
  iconColor: "red",
  impact: 8,
  effort: 4,
  timeCommitment: "10 min",
  frequency: "daily",
  isAbsolute: true,
  category: "physical",
  streak: 0,
  createdAt: new Date()
};

export function FixHabitDialog({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: FixHabitDialogProps) {
  const [editedHabit, setEditedHabit] = useState<Habit>(DEFAULT_HABIT);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Reset form when habit changes or dialog opens/closes
  // Added better state management to prevent infinite loops
  useEffect(() => {
    // Only update if dialog is open and not yet initialized with current data
    if (!open) {
      setIsInitialized(false);
      return;
    }
    
    // Skip if already initialized to prevent re-renders
    if (isInitialized) return;
    
    // Now safe to initialize the form
    if (habit) {
      const habitToEdit = { ...habit };
      
      // Ensure category is a MaxiMost category (mapping legacy categories)
      if (habitToEdit.category === "health" || habitToEdit.category === "fitness") {
        habitToEdit.category = "physical";
      } else if (habitToEdit.category === "mind") {
        habitToEdit.category = "mental";
      } else if (habitToEdit.category === "social") {
        habitToEdit.category = "relationships";
      } else if (habitToEdit.category === "finance" || habitToEdit.category === "productivity") {
        habitToEdit.category = "financial";
      }
      
      console.log("Initializing edit dialog with habit:", habitToEdit.title);
      
      // Set the edited habit with all default values if any are missing
      setEditedHabit({
        ...DEFAULT_HABIT,
        ...habitToEdit,
      });
      setIsCreatingNew(false);
    } else {
      // Create a new habit with a unique ID
      const newId = `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      setEditedHabit({
        ...DEFAULT_HABIT,
        id: newId
      });
      setIsCreatingNew(true);
    }
    
    // Mark as initialized to prevent further re-renders
    setIsInitialized(true);
  }, [habit, open, isInitialized]);
  
  const handleSave = () => {
    if (!editedHabit.title) {
      alert('Please enter a habit title');
      return;
    }

    let iconColor = editedHabit.iconColor || "blue";
    let icon = editedHabit.icon || "zap";
    
    // Ensure we have the correct icon and color for MaxiMost categories
    switch (editedHabit.category) {
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
        icon = "lightbulb";
        break;
      case "relationships": 
        iconColor = "green"; 
        icon = "users";
        break;
      case "financial": 
        iconColor = "emerald"; 
        icon = "dollar-sign";
        break;
    }
    
    // Force daily habits to be absolute
    const isAbsolute = editedHabit.frequency === 'daily' ? true : editedHabit.isAbsolute;
    
    // Create the final habit to save with all required fields guaranteed
    const finalHabit = {
      ...editedHabit,
      id: editedHabit.id,
      title: editedHabit.title.trim(),
      description: editedHabit.description || '',
      iconColor,
      icon,
      isAbsolute,
      impact: typeof editedHabit.impact === 'number' ? editedHabit.impact : 8,
      effort: typeof editedHabit.effort === 'number' ? editedHabit.effort : 4,
      timeCommitment: editedHabit.timeCommitment || '5 min',
      category: editedHabit.category,
      streak: typeof editedHabit.streak === 'number' ? editedHabit.streak : 0,
      createdAt: editedHabit.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    console.log("Saving habit:", finalHabit.title);
    
    // Close the dialog first to prevent any state issues
    onOpenChange(false);
    
    // Small delay to ensure the dialog is closed before saving
    setTimeout(() => {
      onSave(finalHabit);
    }, 50);
  };

  const handleDelete = () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this habit?')) {
      // Close dialog first to prevent state issues
      onOpenChange(false);
      
      // Small delay to ensure the dialog is closed before deleting
      setTimeout(() => {
        onDelete(editedHabit.id);
      }, 50);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isCreatingNew ? "Create New Habit" : "Edit Habit"}
          </DialogTitle>
          <DialogDescription>
            {isCreatingNew 
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
              onValueChange={(value: HabitCategory) => setEditedHabit({...editedHabit, category: value})}
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
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
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
          
          {/* Impact Rating */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="impact" className="text-right">
              Impact (1-10)
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select 
                value={editedHabit.impact.toString()} 
                onValueChange={(value) => setEditedHabit({...editedHabit, impact: parseInt(value)})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} - {value <= 3 ? 'Low' : value <= 7 ? 'Medium' : 'High'} Impact
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Effort Rating */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="effort" className="text-right">
              Effort (1-10)
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select 
                value={editedHabit.effort.toString()} 
                onValueChange={(value) => setEditedHabit({...editedHabit, effort: parseInt(value)})}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select effort required" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value} - {value <= 3 ? 'Easy' : value <= 7 ? 'Moderate' : 'Difficult'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          {!isCreatingNew && onDelete && (
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