import React, { useState, useEffect } from "react";
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
import { v4 as uuidv4 } from 'uuid';
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
  BadgeCheck,
  Apple,
  DollarSign
} from "lucide-react";

// Import shared types
import { Habit, HabitFrequency, HabitCategory } from "@/types/habit";

type UnifiedHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
};

// Default habit for new creation
const DEFAULT_HABIT: Habit = {
  id: '',
  title: '',
  description: '',
  icon: 'dumbbell',
  iconColor: '#ef4444', // Default red for physical
  impact: 5,
  effort: 3,
  timeCommitment: '5 min',
  frequency: 'daily',
  isAbsolute: true,
  category: 'physical',
  streak: 0,
  createdAt: new Date()
};

// Icon mappings with categories
const ICON_MAP: Record<string, LucideIcon> = {
  droplets: DropletIcon,
  dumbbell: Dumbbell,
  brain: Brain,
  book: BookOpen,
  users: Users,
  heart: Heart,
  sun: Sun,
  zap: Zap,
  utensils: Utensils,
  coffee: Coffee,
  moon: Moon,
  alarm: AlarmClock,
  pill: Pill,
  chart: BarChart,
  leaf: Leaf,
  pen: PenTool,
  mic: Mic,
  bed: Bed,
  message: MessageCircle,
  bookText: BookText,
  heartPulse: HeartPulse,
  weight: Weight,
  footprints: Footprints,
  check: Check,
  timer: Timer,
  dollar: CircleDollarSign,
  thumbsUp: ThumbsUp,
  music: Music,
  award: Award,
  smile: SmilePlus,
  badge: BadgeCheck,
  apple: Apple,
  dollarSign: DollarSign
};

// Categories with their color mappings
const CATEGORY_COLORS: Record<string, string> = {
  physical: '#ef4444', // Red for physical
  nutrition: '#f97316', // Orange for nutrition
  sleep: '#a855f7',    // Indigo for sleep
  mental: '#eab308',   // Yellow for mental
  relationships: '#3b82f6', // Blue for relationships  
  financial: '#22c55e',  // Green for financial
  health: '#ef4444', // Legacy - maps to physical
  fitness: '#ef4444', // Legacy - maps to physical
  mind: '#eab308',    // Legacy - maps to mental
  social: '#3b82f6',  // Legacy - maps to relationships
  finance: '#22c55e', // Legacy - maps to financial
  productivity: '#22c55e' // Legacy - maps to financial
};

export function UnifiedHabitDialog({
  open,
  onOpenChange,
  habit,
  onSave,
  onDelete
}: UnifiedHabitDialogProps) {
  const [editedHabit, setEditedHabit] = useState<Habit>(DEFAULT_HABIT);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("general");
  
  // Reset form when habit changes or dialog opens/closes
  useEffect(() => {
    if (!open) {
      setIsInitialized(false);
      return;
    }
    
    if (isInitialized) return;
    
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
      
      console.log("Initializing unified dialog with habit:", habitToEdit.title);
      
      // Set the edited habit with all default values if any are missing
      setEditedHabit({
        ...DEFAULT_HABIT,
        ...habitToEdit,
        id: habitToEdit.id || DEFAULT_HABIT.id,
        title: habitToEdit.title || DEFAULT_HABIT.title,
        description: habitToEdit.description || DEFAULT_HABIT.description,
        icon: habitToEdit.icon || DEFAULT_HABIT.icon,
        iconColor: habitToEdit.iconColor || CATEGORY_COLORS[habitToEdit.category as HabitCategory] || DEFAULT_HABIT.iconColor,
        impact: habitToEdit.impact || DEFAULT_HABIT.impact,
        effort: habitToEdit.effort || DEFAULT_HABIT.effort,
        timeCommitment: habitToEdit.timeCommitment || DEFAULT_HABIT.timeCommitment,
        frequency: habitToEdit.frequency || DEFAULT_HABIT.frequency,
        isAbsolute: typeof habitToEdit.isAbsolute === 'boolean' ? habitToEdit.isAbsolute : DEFAULT_HABIT.isAbsolute,
        category: habitToEdit.category || DEFAULT_HABIT.category,
        streak: habitToEdit.streak || DEFAULT_HABIT.streak,
        createdAt: habitToEdit.createdAt || DEFAULT_HABIT.createdAt
      });
    } else {
      // Create new habit with default values
      const newId = uuidv4();
      setEditedHabit({
        ...DEFAULT_HABIT,
        id: newId
      });
    }
    
    setIsInitialized(true);
  }, [habit, open, isInitialized]);

  // Update category color when category changes, but only on initialization
  // to avoid infinite loop between state updates
  useEffect(() => {
    if (editedHabit.category && !editedHabit.iconColor) {
      const categoryKey = editedHabit.category;
      if (CATEGORY_COLORS[categoryKey]) {
        setEditedHabit(prev => ({
          ...prev,
          iconColor: CATEGORY_COLORS[categoryKey]
        }));
      }
    }
  }, [editedHabit.category, editedHabit.iconColor]);

  const handleSave = () => {
    // Validate required fields
    if (!editedHabit.title.trim()) {
      alert("Habit title is required");
      return;
    }
    
    // If this is a new habit, generate a unique ID
    if (!editedHabit.id) {
      editedHabit.id = uuidv4();
    }
    
    onSave(editedHabit);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (onDelete && editedHabit.id) {
      onDelete(editedHabit.id);
      onOpenChange(false);
    }
  };

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || Dumbbell;
    return <IconComponent className="h-5 w-5" style={{ color: editedHabit.iconColor || '#000' }} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {habit ? (
              <>
                <Pencil className="mr-2 h-5 w-5" />
                Edit Habit: {editedHabit.title}
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Habit
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {habit 
              ? "Modify your habit details below. Click save when you're done."
              : "Set up your new habit with the details below. Add a clear title and realistic commitment."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Habit Title *
              </Label>
              <Input 
                id="title" 
                value={editedHabit.title || ''} 
                onChange={(e) => setEditedHabit({...editedHabit, title: e.target.value})}
                placeholder="E.g., Drink water, 10 push-ups, Take vitamins" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea 
                id="description" 
                value={editedHabit.description || ''} 
                onChange={(e) => setEditedHabit({...editedHabit, description: e.target.value})}
                placeholder="Why is this habit important to you?"
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select 
                value={editedHabit.category} 
                onValueChange={(value) => setEditedHabit({...editedHabit, category: value as HabitCategory})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">
                    <div className="flex items-center">
                      <Dumbbell className="h-4 w-4 mr-2 text-red-500" />
                      Physical Training
                    </div>
                  </SelectItem>
                  <SelectItem value="nutrition">
                    <div className="flex items-center">
                      <Utensils className="h-4 w-4 mr-2 text-orange-500" />
                      Nutrition & Fueling
                    </div>
                  </SelectItem>
                  <SelectItem value="sleep">
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                      Sleep & Hygiene
                    </div>
                  </SelectItem>
                  <SelectItem value="mental">
                    <div className="flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-yellow-500" />
                      Mental Acuity & Growth
                    </div>
                  </SelectItem>
                  <SelectItem value="relationships">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      Relationships & Community
                    </div>
                  </SelectItem>
                  <SelectItem value="financial">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Financial Habits
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-medium">
                Icon
              </Label>
              <Select 
                value={editedHabit.icon} 
                onValueChange={(value) => setEditedHabit({...editedHabit, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center">
                      {getIconComponent(editedHabit.icon)}
                      <span className="ml-2">{editedHabit.icon.charAt(0).toUpperCase() + editedHabit.icon.slice(1)}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center">
                        {React.createElement(ICON_MAP[icon], { className: "h-4 w-4 mr-2", style: { color: editedHabit.iconColor } })}
                        {icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-sm font-medium">
                Frequency
              </Label>
              <Select 
                value={editedHabit.frequency} 
                onValueChange={(value) => setEditedHabit({...editedHabit, frequency: value as HabitFrequency})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="2x-week">2x per week</SelectItem>
                  <SelectItem value="3x-week">3x per week</SelectItem>
                  <SelectItem value="4x-week">4x per week</SelectItem>
                  <SelectItem value="5x-week">5x per week</SelectItem>
                  <SelectItem value="6x-week">6x per week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeCommitment" className="text-sm font-medium">
                Time Commitment
              </Label>
              <Select 
                value={editedHabit.timeCommitment || '5 min'} 
                onValueChange={(value) => setEditedHabit({...editedHabit, timeCommitment: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 min">1 minute</SelectItem>
                  <SelectItem value="2 min">2 minutes</SelectItem>
                  <SelectItem value="5 min">5 minutes</SelectItem>
                  <SelectItem value="10 min">10 minutes</SelectItem>
                  <SelectItem value="15 min">15 minutes</SelectItem>
                  <SelectItem value="30 min">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2+ hours">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="absolute" className="text-sm font-medium">
                  Absolute Habit
                </Label>
                <Switch 
                  id="absolute"
                  checked={editedHabit.isAbsolute}
                  onCheckedChange={(checked) => setEditedHabit({...editedHabit, isAbsolute: checked})}
                />
              </div>
              <p className="text-xs text-gray-500">
                An absolute habit is binary (done/not done). Non-absolute habits track weekly frequency.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="impact" className="text-sm font-medium">
                Impact Rating (1-10): {editedHabit.impact}
              </Label>
              <Slider 
                id="impact"
                min={1} 
                max={10} 
                step={1}
                value={[editedHabit.impact || 5]} 
                onValueChange={(value) => setEditedHabit({...editedHabit, impact: value[0]})}
              />
              <p className="text-xs text-gray-500">
                How impactful is this habit for your life goals?
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="effort" className="text-sm font-medium">
                Effort Level (1-10): {editedHabit.effort}
              </Label>
              <Slider 
                id="effort"
                min={1} 
                max={10} 
                step={1}
                value={[editedHabit.effort || 3]} 
                onValueChange={(value) => setEditedHabit({...editedHabit, effort: value[0]})}
              />
              <p className="text-xs text-gray-500">
                How much willpower/effort does this habit require?
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          {onDelete && editedHabit.id && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}