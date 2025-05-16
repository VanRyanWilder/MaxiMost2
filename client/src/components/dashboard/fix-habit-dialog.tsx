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
  Award,
  SmilePlus,
  BadgeCheck,
  Trash2,
  Lightbulb
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

// Icon mappings - we use strings in the data model
// but need to map to the actual components for rendering
interface IconMapItem {
  component: React.ElementType;
  label: string;
  category: string;
}

// Map of icon keys to their components and metadata
export const iconMap: Record<string, IconMapItem> = {
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
  "lightbulb": { component: Lightbulb, label: "Ideas", category: "mind" },
  
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
export const colorSchemes = [
  {id: "red", primary: "text-red-500", bg: "bg-red-100", lightBg: "bg-red-50/50", border: "border-red-200"},
  {id: "orange", primary: "text-orange-500", bg: "bg-orange-100", lightBg: "bg-orange-50/50", border: "border-orange-200"},
  {id: "amber", primary: "text-amber-500", bg: "bg-amber-100", lightBg: "bg-amber-50/50", border: "border-amber-200"},
  {id: "yellow", primary: "text-yellow-500", bg: "bg-yellow-100", lightBg: "bg-yellow-50/50", border: "border-yellow-200"},
  {id: "green", primary: "text-green-500", bg: "bg-green-100", lightBg: "bg-green-50/50", border: "border-green-200"},
  {id: "emerald", primary: "text-emerald-500", bg: "bg-emerald-100", lightBg: "bg-emerald-50/50", border: "border-emerald-200"},
  {id: "blue", primary: "text-blue-500", bg: "bg-blue-100", lightBg: "bg-blue-50/50", border: "border-blue-200"},
  {id: "indigo", primary: "text-indigo-500", bg: "bg-indigo-100", lightBg: "bg-indigo-50/50", border: "border-indigo-200"},
  {id: "purple", primary: "text-purple-500", bg: "bg-purple-100", lightBg: "bg-purple-50/50", border: "border-purple-200"},
  {id: "pink", primary: "text-pink-500", bg: "bg-pink-100", lightBg: "bg-pink-50/50", border: "border-pink-200"},
];

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

  const [activeTab, setActiveTab] = useState<string>("basic");
  const [iconPickerTab, setIconPickerTab] = useState<string>("health");
  
  // Helper function to render color options
  const renderColorOptions = () => {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {colorSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all ${
              editedHabit.iconColor === scheme.id 
                ? 'ring-2 ring-offset-2 ring-primary' 
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: `var(--${scheme.id}-100)` }}
            onClick={() => setEditedHabit({...editedHabit, iconColor: scheme.id})}
          >
            {editedHabit.iconColor === scheme.id && (
              <Check className={`h-4 w-4 ${scheme.primary}`} />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Helper function to render the icon picker
  const renderIconPicker = () => {
    return (
      <div className="mt-4">
        <Tabs defaultValue={iconPickerTab} onValueChange={setIconPickerTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="mind">Mind</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
          </TabsList>
          
          {Object.entries(iconCategories).map(([category, icons]) => (
            <TabsContent key={category} value={category} className={category !== iconPickerTab ? 'hidden' : ''}>
              <div className="grid grid-cols-6 gap-2">
                {icons.map((iconKey) => (
                  <div
                    key={iconKey}
                    className={`p-2 rounded cursor-pointer flex items-center justify-center transition-all hover:bg-gray-100 ${
                      editedHabit.icon === iconKey ? 'bg-blue-50 border border-blue-200' : ''
                    }`}
                    onClick={() => setEditedHabit({...editedHabit, icon: iconKey})}
                  >
                    <div className={`h-8 w-8 flex items-center justify-center ${
                      editedHabit.icon === iconKey ? `text-${editedHabit.iconColor}-500` : 'text-gray-600'
                    }`}>
                      {renderIcon(iconKey, "h-5 w-5")}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="metrics">Impact & Effort</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 pt-4">
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
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>Relationships & Community</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="financial">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-green-500" />
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
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Icon</h3>
              <p className="text-sm text-muted-foreground">Select an icon for your habit</p>
              {renderIconPicker()}
            </div>
            
            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-medium">Color</h3>
              <p className="text-sm text-muted-foreground">Choose a color theme</p>
              {renderColorOptions()}
            </div>
          </TabsContent>
          
          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="impact">Impact (How beneficial is this habit?)</Label>
                  <span className="font-medium">{editedHabit.impact}/10</span>
                </div>
                <Slider
                  id="impact"
                  min={1}
                  max={10}
                  step={1}
                  value={[editedHabit.impact]}
                  onValueChange={(value) => setEditedHabit({...editedHabit, impact: value[0]})}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Impact</span>
                  <span>Medium Impact</span>
                  <span>High Impact</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <Label htmlFor="effort">Effort Required</Label>
                  <span className="font-medium">{editedHabit.effort}/10</span>
                </div>
                <Slider
                  id="effort"
                  min={1}
                  max={10}
                  step={1}
                  value={[editedHabit.effort]}
                  onValueChange={(value) => setEditedHabit({...editedHabit, effort: value[0]})}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Easy</span>
                  <span>Moderate</span>
                  <span>Difficult</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between mt-6">
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