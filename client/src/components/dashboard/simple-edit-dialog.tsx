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
  Heart, 
  Dumbbell, 
  Brain, 
  Users, 
  Zap,
  Droplets
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type SimpleEditDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Predefined color schemes for habits
const colorSchemes = [
  {id: "blue", name: "Blue", primary: "text-blue-500", bg: "bg-blue-100"},
  {id: "green", name: "Green", primary: "text-green-500", bg: "bg-green-100"},
  {id: "red", name: "Red", primary: "text-red-500", bg: "bg-red-100"},
  {id: "amber", name: "Amber", primary: "text-amber-500", bg: "bg-amber-100"},
  {id: "purple", name: "Purple", primary: "text-purple-500", bg: "bg-purple-100"},
  {id: "indigo", name: "Indigo", primary: "text-indigo-500", bg: "bg-indigo-100"},
  {id: "pink", name: "Pink", primary: "text-pink-500", bg: "bg-pink-100"},
  {id: "cyan", name: "Cyan", primary: "text-cyan-500", bg: "bg-cyan-100"},
];

// Default habit template for creating new habits
const DEFAULT_NEW_HABIT: Habit = {
  id: `h-${Date.now()}`,
  title: "",
  description: "",
  icon: "zap",
  iconColor: "blue", // Default color scheme
  impact: 8,
  effort: 4,
  timeCommitment: "10 min",
  frequency: "daily", // Default frequency
  isAbsolute: true,
  category: "health",
  streak: 0,
  createdAt: new Date()
};

export function SimpleEditDialog({ 
  open, 
  setOpen,
  habit, 
  onSave,
  onDelete
}: SimpleEditDialogProps) {
  const [habitData, setHabitData] = useState<Habit>(DEFAULT_NEW_HABIT);
  const [isNewHabit, setIsNewHabit] = useState(true);
  
  // Reset form when habit changes or when dialog opens
  useEffect(() => {
    if (open) {
      if (habit) {
        // Deep clone to avoid reference issues
        setHabitData({...habit});
        setIsNewHabit(false);
        console.log("EDIT DIALOG - Editing habit:", habit.title, "with color:", habit.iconColor);
      } else {
        // Create a new habit with a unique ID
        const newHabit = {
          ...DEFAULT_NEW_HABIT,
          id: `h-${Date.now()}-${Math.floor(Math.random() * 1000000)}`
        };
        setHabitData(newHabit);
        setIsNewHabit(true);
        console.log("EDIT DIALOG - Creating new habit");
      }
    }
  }, [habit, open]);
  
  const handleSave = () => {
    // Make sure daily habits are always absolute
    const isDaily = habitData.frequency === 'daily';
    const finalHabit = {
      ...habitData,
      isAbsolute: isDaily,
    };
    
    console.log("SAVE DIALOG - Sending habit to parent:", {
      id: finalHabit.id,
      title: finalHabit.title,
      iconColor: finalHabit.iconColor
    });
    
    onSave(finalHabit);
    setOpen(false);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(habitData.id);
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewHabit ? "Create New Habit" : "Edit Habit"}
          </DialogTitle>
          <DialogDescription>
            {isNewHabit 
              ? "Define a new habit to add to your dashboard."
              : "Refine this habit to maximize your success and consistency."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Name
            </Label>
            <Input
              id="title"
              value={habitData.title}
              onChange={(e) => setHabitData({...habitData, title: e.target.value})}
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
              value={habitData.description}
              onChange={(e) => setHabitData({...habitData, description: e.target.value})}
              className="col-span-3"
              placeholder="Brief description"
            />
          </div>
          
          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={habitData.frequency} 
              onValueChange={(value: HabitFrequency) => setHabitData({
                ...habitData, 
                frequency: value,
                isAbsolute: value === 'daily' // Make daily habits always absolute
              })}
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
          
          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={habitData.category} 
              onValueChange={(value: HabitCategory) => {
                console.log("Setting category to:", value);
                
                // Update icon based on category
                let icon = habitData.icon;
                switch (value) {
                  case "health": icon = "droplets"; break;
                  case "fitness": icon = "dumbbell"; break;
                  case "mind": icon = "brain"; break;
                  case "social": icon = "users"; break;
                  default: break;
                }
                
                setHabitData({...habitData, category: value, icon});
              }}
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
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Color selection - SIMPLIFIED */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Color
            </Label>
            <div className="col-span-3">
              <Select 
                value={habitData.iconColor} 
                onValueChange={(color: string) => {
                  console.log("Selected color:", color);
                  setHabitData({...habitData, iconColor: color});
                }}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${colorSchemes.find(c => c.id === habitData.iconColor)?.bg || "bg-blue-100"}`}></div>
                    <span>{colorSchemes.find(c => c.id === habitData.iconColor)?.name || "Blue"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colorSchemes.map(color => (
                    <SelectItem key={color.id} value={color.id}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.bg}`}></div>
                        <span>{color.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-2 grid grid-cols-4 gap-2">
                {colorSchemes.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    className={`w-10 h-10 rounded-md ${color.bg} flex items-center justify-center ${
                      habitData.iconColor === color.id 
                        ? "ring-2 ring-blue-500 ring-opacity-80" 
                        : ""
                    }`}
                    onClick={() => {
                      console.log(`Setting color to: ${color.id}`);
                      setHabitData({...habitData, iconColor: color.id});
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.primary}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          {!isNewHabit && onDelete && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}