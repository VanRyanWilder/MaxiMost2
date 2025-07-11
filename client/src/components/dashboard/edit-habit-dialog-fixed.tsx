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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Brain, 
  DropletIcon, 
  Dumbbell, 
  BookOpen, 
  Users, 
  Heart, 
  Sun, 
  Zap,
  PlusCircle,
  Pencil,
  Utensils,
  Coffee,
  Moon,
  AlarmClock,
  Pill,
  BarChart,
  Leaf,
  PenTool,
  Mic,
  Bed,
  MessageCircle,
  BookText,
  HeartPulse,
  Weight,
  Footprints,
  Check,
  Timer,
  CircleDollarSign,
  ThumbsUp,
  Music,
  LucideIcon,
  Award,
  SmilePlus,
  BadgeCheck
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type EditHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Some components use setOpen instead of onOpenChange, so keep both for compatibility
  setOpen?: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Icon mappings - we use strings in the data model
// but need to map to the actual components for rendering
interface IconMapItem {
  component: React.ElementType;
  label: string;
  category: string;
}

// Map of icon keys to their components and metadata
const iconMap: Record<string, IconMapItem> = {
  // Health
  "heart": { component: Heart, label: "Heart", category: "health" },
  "heartPulse": { component: HeartPulse, label: "Heart Rate", category: "health" },
  "droplets": { component: DropletIcon, label: "Droplets", category: "health" },
  "pill": { component: Pill, label: "Medication", category: "health" },
  "weight": { component: Weight, label: "Weight", category: "health" },
  "leaf": { component: Leaf, label: "Nature", category: "health" },
  
  // Fitness
  "dumbbell": { component: Dumbbell, label: "Weights", category: "fitness" },
  "footprints": { component: Footprints, label: "Steps", category: "fitness" },
  "barChart": { component: BarChart, label: "Progress", category: "fitness" },
  
  // Mind
  "brain": { component: Brain, label: "Mind", category: "mind" },
  "book": { component: BookText, label: "Reading", category: "mind" },
  "penTool": { component: PenTool, label: "Writing", category: "mind" },
  "pencil": { component: Pencil, label: "Notes", category: "mind" },
  "mic": { component: Mic, label: "Speaking", category: "mind" },
  "music": { component: Music, label: "Music", category: "mind" },
  
  // Sleep
  "moon": { component: Moon, label: "Sleep", category: "sleep" },
  "bed": { component: Bed, label: "Bed", category: "sleep" },
  "alarm": { component: AlarmClock, label: "Alarm", category: "sleep" },
  
  // Food
  "utensils": { component: Utensils, label: "Eat", category: "food" },
  "coffee": { component: Coffee, label: "Drink", category: "food" },
  
  // Social
  "users": { component: Users, label: "Social", category: "social" },
  "messageCircle": { component: MessageCircle, label: "Communication", category: "social" },
  
  // Productivity
  "check": { component: Check, label: "Complete", category: "productivity" },
  "timer": { component: Timer, label: "Timer", category: "productivity" },
  "zap": { component: Zap, label: "Energy", category: "productivity" },
  "sun": { component: Sun, label: "Day", category: "productivity" },
  
  // Achievements
  "award": { component: Award, label: "Award", category: "achievements" },
  "badgeCheck": { component: BadgeCheck, label: "Badge", category: "achievements" },
  "thumbsUp": { component: ThumbsUp, label: "Like", category: "achievements" },
  "smilePlus": { component: SmilePlus, label: "Positive", category: "achievements" },
  
  // Financial
  "circleDollarSign": { component: CircleDollarSign, label: "Money", category: "finance" }
};

// Predefined color schemes for habits
const colorSchemes = [
  {id: "blue", primary: "text-blue-500", bg: "bg-blue-100", lightBg: "bg-blue-50/50", border: "border-blue-200"},
  {id: "green", primary: "text-green-500", bg: "bg-green-100", lightBg: "bg-green-50/50", border: "border-green-200"},
  {id: "red", primary: "text-red-500", bg: "bg-red-100", lightBg: "bg-red-50/50", border: "border-red-200"},
  {id: "amber", primary: "text-amber-500", bg: "bg-amber-100", lightBg: "bg-amber-50/50", border: "border-amber-200"},
  {id: "purple", primary: "text-purple-500", bg: "bg-purple-100", lightBg: "bg-purple-50/50", border: "border-purple-200"},
  {id: "indigo", primary: "text-indigo-500", bg: "bg-indigo-100", lightBg: "bg-indigo-50/50", border: "border-indigo-200"},
  {id: "pink", primary: "text-pink-500", bg: "bg-pink-100", lightBg: "bg-pink-50/50", border: "border-pink-200"},
  {id: "teal", primary: "text-teal-500", bg: "bg-teal-100", lightBg: "bg-teal-50/50", border: "border-teal-200"},
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
  isAbsolute: false,
  category: "health",
  streak: 0,
  createdAt: new Date()
};

// Helper function to render an icon from our icon map
function renderIcon(iconKey: string, className?: string) {
  const iconData = iconMap[iconKey];
  if (!iconData) return null;
  
  const IconComponent = iconData.component;
  return <IconComponent className={className || "h-4 w-4"} />;
}

// Group icons by their category
const iconCategories = Object.entries(iconMap).reduce<Record<string, string[]>>((acc, [key, value]) => {
  const category = value.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(key);
  return acc;
}, {});

export function EditHabitDialogFixed({ 
  open, 
  onOpenChange, 
  setOpen,
  habit, 
  onSave,
  onDelete
}: EditHabitDialogProps) {
  // For backward compatibility with components using setOpen
  const handleOpenChange = setOpen || onOpenChange;
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [iconPickerTab, setIconPickerTab] = useState("health");
  
  // Ref to track if we're creating a new habit or editing an existing one
  const isCreatingNewHabit = useRef(false);
  
  // Reset form when habit changes
  useEffect(() => {
    if (habit) {
      console.log("Setting up habit form with:", habit.title);
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
      handleOpenChange(true);
    };
    
    document.addEventListener('open-add-habit-dialog', handleOpenAddHabitDialog);
    
    return () => {
      document.removeEventListener('open-add-habit-dialog', handleOpenAddHabitDialog);
    };
  }, [handleOpenChange]);
  
  if (!editedHabit) {
    return null;
  }
  
  const handleSaveDirectly = () => {
    if (editedHabit) {
      // Make sure isAbsolute is set correctly based on frequency
      const isDaily = editedHabit.frequency === 'daily';
      
      // Create a completely new object for the updated habit
      const finalHabit = {
        ...editedHabit,
        // Make sure daily habits are always absolute
        isAbsolute: isDaily,
        // If using a custom category, set the category
        ...(showCustomCategoryInput && customCategory ? { category: customCategory as HabitCategory } : {})
      };
      
      // Log the saving action
      console.log("DIRECT SAVE BUTTON CLICKED:", { 
        id: finalHabit.id,
        title: finalHabit.title,
        frequency: finalHabit.frequency, 
        isAbsolute: finalHabit.isAbsolute
      });
      
      // Call the parent component's save handler with the finalized habit
      onSave(finalHabit);
      
      // Close the dialog
      handleOpenChange(false);
    }
  };
  
  const handleDelete = () => {
    if (editedHabit && onDelete) {
      onDelete(editedHabit.id);
      handleOpenChange(false);
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
    
    if (editedHabit) {
      setEditedHabit({...editedHabit, category: value as HabitCategory, icon: icon});
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              onValueChange={(value: HabitFrequency) => {
                // Update isAbsolute automatically when switching to/from daily
                const isAbsolute = value === 'daily';
                setEditedHabit({
                  ...editedHabit,
                  frequency: value,
                  isAbsolute: isAbsolute
                });
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (Absolute)</SelectItem>
                <SelectItem value="2x-week">2x per week</SelectItem>
                <SelectItem value="3x-week">3x per week</SelectItem>
                <SelectItem value="4x-week">4x per week</SelectItem>
                <SelectItem value="5x-week">5x per week</SelectItem>
                <SelectItem value="6x-week">6x per week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeCommitment" className="text-right">
              Time
            </Label>
            <Input
              id="timeCommitment"
              value={editedHabit.timeCommitment}
              onChange={(e) => setEditedHabit({...editedHabit, timeCommitment: e.target.value})}
              className="col-span-3"
              placeholder="Time commitment"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="impact" className="text-right">
              Impact (1-10)
            </Label>
            <div className="col-span-3 px-2">
              <Slider
                value={[editedHabit.impact]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setEditedHabit({...editedHabit, impact: value[0]})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="effort" className="text-right">
              Effort (1-10)
            </Label>
            <div className="col-span-3 px-2">
              <Slider
                value={[editedHabit.effort]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setEditedHabit({...editedHabit, effort: value[0]})}
              />
            </div>
          </div>
          
          {/* Icon selection */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Icon
            </Label>
            <div className="col-span-3">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-md ${editedHabit.iconColor ? colorSchemes.find(c => c.id === editedHabit.iconColor)?.bg : "bg-blue-100"}`}>
                  {renderIcon(editedHabit.icon, `h-5 w-5 ${editedHabit.iconColor ? colorSchemes.find(c => c.id === editedHabit.iconColor)?.primary : "text-blue-500"}`)}
                </div>
                <span className="text-sm font-medium">Current Icon</span>
              </div>
              
              <Tabs value={iconPickerTab} onValueChange={setIconPickerTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-2">
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="fitness">Fitness</TabsTrigger>
                  <TabsTrigger value="mind">Mind</TabsTrigger>
                  <TabsTrigger value="more">More</TabsTrigger>
                </TabsList>
                
                {Object.keys(iconCategories).map(category => (
                  <TabsContent key={category} value={category === "social" || category === "food" || category === "sleep" || category === "productivity" || category === "achievements" || category === "finance" ? "more" : category}>
                    <div className="grid grid-cols-6 gap-2">
                      {iconCategories[category].map(iconKey => (
                        <Button
                          key={iconKey}
                          type="button"
                          variant="outline"
                          size="icon"
                          className={`p-2 ${editedHabit.icon === iconKey ? "ring-2 ring-blue-500 ring-opacity-80" : ""}`}
                          onClick={() => setEditedHabit({...editedHabit, icon: iconKey})}
                        >
                          {renderIcon(iconKey, `h-5 w-5 ${editedHabit.iconColor ? colorSchemes.find(c => c.id === editedHabit.iconColor)?.primary : "text-blue-500"}`)}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          
          {/* Icon color */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Color
            </Label>
            <div className="col-span-3 grid grid-cols-8 gap-2">
              {colorSchemes.map(scheme => (
                <Button
                  key={scheme.id}
                  type="button"
                  variant="outline"
                  size="icon"
                  className={`p-2 ${scheme.bg} ${editedHabit.iconColor === scheme.id ? "ring-2 ring-blue-500 ring-opacity-80" : ""}`}
                  onClick={() => setEditedHabit({...editedHabit, iconColor: scheme.id})}
                >
                  <div className={`h-5 w-5 rounded-full ${scheme.primary} bg-white flex items-center justify-center`}>
                    {editedHabit.iconColor === scheme.id && <Check className="h-3 w-3" />}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          {!isCreatingNewHabit.current && onDelete && (
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDirectly}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}