import React, { useState, useEffect } from "react";
import { format, addDays, startOfWeek, subDays, parseISO, isAfter, isBefore, isToday, isSameDay, differenceInDays } from 'date-fns';
import { getEmptyStateMessage } from './empty-state-fix';
import { Link } from "wouter";
import { useSort } from '@dnd-kit/sortable';
import { 
  useDraggable, 
  useDroppable, 
  DndContext, 
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { 
  MoreHorizontal, 
  PlusCircle, 
  CalendarDays, 
  LayoutList, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  GripVertical, 
  Plus, 
  Menu,
  Zap,
  Medal,
  Flame,
  Dumbbell,
  Book,
  Heart,
  Users,
  Brain,
  SparkleIcon,
  Sparkles,
  Activity,
  ScrollText,
  Droplets,
  CopyCheck,
  Pizza,
  Pencil,
  Trash2,
  ListFilter,
  FilterX,
  ChevronDown,
  ChevronsUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  CircleOff,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DeleteHabitDialog } from "@/components/dialogs/delete-habit-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Type definitions
type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string; // Color for the icon
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean; // Must-do daily vs flexible habit
  category: HabitCategory;
  streak: number;
  createdAt: Date;
}

interface HabitCompletion {
  habitId: string;
  date: Date;
  completed: boolean;
}

interface HabitStack {
  id: string;
  name: string;
  description: string;
  icon: string;
  habits: Omit<Habit, "id" | "streak" | "createdAt">[];
}

// Utility functions
const getCategoryColor = (category: HabitCategory) => {
  switch (category) {
    case "health":
      return "bg-green-100 text-green-800";
    case "fitness":
      return "bg-blue-100 text-blue-800";
    case "mind":
      return "bg-purple-100 text-purple-800";
    case "social":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getFrequencyLabel = (frequency: HabitFrequency) => {
  switch (frequency) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "2x-week":
      return "Twice a week";
    case "3x-week":
      return "Three times a week";
    case "4x-week":
      return "Four times a week";
    case "custom":
      return "Custom";
    default:
      return "Custom";
  }
};

const getIconComponent = (iconName: string, iconColor?: string) => {
  const style = iconColor ? { color: iconColor } : {};
  
  switch (iconName) {
    case "dumbbell":
      return <Dumbbell className="h-4 w-4" style={style} />;
    case "heart":
      return <Heart className="h-4 w-4" style={style} />;
    case "book":
      return <Book className="h-4 w-4" style={style} />;
    case "users":
      return <Users className="h-4 w-4" style={style} />;
    case "brain":
      return <Brain className="h-4 w-4" style={style} />;
    case "flame":
      return <Flame className="h-4 w-4" style={style} />;
    case "medal":
      return <Medal className="h-4 w-4" style={style} />;
    case "activity":
      return <Activity className="h-4 w-4" style={style} />;
    case "scroll":
      return <ScrollText className="h-4 w-4" style={style} />;
    case "water":
      return <Droplets className="h-4 w-4" style={style} />;
    case "check":
      return <CopyCheck className="h-4 w-4" style={style} />;
    case "food":
      return <Pizza className="h-4 w-4" style={style} />;
    default:
      return <SparkleIcon className="h-4 w-4" style={style} />;
  }
};

interface SortableHabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  completionRate: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableHabitItem({ 
  habit, 
  isCompleted, 
  completionRate,
  onToggle, 
  onEdit, 
  onDelete 
}: SortableHabitItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: habit.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group relative"
    >
      <div className={`p-4 mb-2.5 rounded-lg border ${isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-white'} hover:shadow-sm transition-all flex items-center gap-3`}>
        <button 
          onClick={onToggle}
          className={`rounded-full h-6 w-6 min-w-6 flex items-center justify-center 
            ${isCompleted 
              ? 'text-white bg-primary hover:bg-primary/90' 
              : 'text-muted-foreground border hover:border-primary/50'}`}
        >
          {isCompleted && <Check className="h-3.5 w-3.5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <span className="mr-2">
              {getIconComponent(habit.icon, habit.iconColor)}
            </span>
            
            <h3 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {habit.title}
            </h3>
            
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 flex gap-1 items-center">
                <Clock className="h-2.5 w-2.5" />
                {habit.timeCommitment}
              </Badge>
              
              <Badge className={`text-[10px] px-1.5 py-0 ${getCategoryColor(habit.category)}`}>
                {habit.category}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1">
              <Progress value={completionRate} className="h-1.5" />
            </div>
            
            <span className="text-[10px] font-medium text-muted-foreground">
              {habit.streak} day streak
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <button 
            className="opacity-30 hover:opacity-100 cursor-grab active:cursor-grabbing"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default function IntegratedHabits() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    title: "",
    description: "",
    icon: "sparkle",
    iconColor: "#4F46E5",
    impact: 5,
    effort: 3,
    timeCommitment: "5 min",
    frequency: "daily",
    isAbsolute: true,
    category: "health"
  });
  
  // Dummy data for habits (this would come from an API/database in a real app)
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "h1",
      title: "Drink 1 gallon of water",
      description: "Stay hydrated throughout the day",
      icon: "water",
      impact: 8,
      effort: 4,
      timeCommitment: "All day",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 5,
      createdAt: new Date("2024-05-01")
    },
    {
      id: "h2",
      title: "Read for 10 minutes",
      description: "Read anything non-fiction to expand knowledge",
      icon: "book",
      impact: 7,
      effort: 2,
      timeCommitment: "10 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 12,
      createdAt: new Date("2024-04-25")
    },
    {
      id: "h3",
      title: "Strength training",
      description: "Focus on compound movements",
      icon: "dumbbell",
      impact: 9,
      effort: 7,
      timeCommitment: "45 min",
      frequency: "3x-week",
      isAbsolute: false,
      category: "fitness",
      streak: 3,
      createdAt: new Date("2024-04-28")
    },
    {
      id: "h4",
      title: "Meditate",
      description: "Clear mind and reduce stress",
      icon: "brain",
      impact: 8,
      effort: 3,
      timeCommitment: "10 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind",
      streak: 7,
      createdAt: new Date("2024-04-30")
    },
    {
      id: "h5",
      title: "Call a friend",
      description: "Maintain meaningful connections",
      icon: "users",
      impact: 6,
      effort: 2,
      timeCommitment: "15 min",
      frequency: "weekly",
      isAbsolute: false,
      category: "social",
      streak: 2,
      createdAt: new Date("2024-05-02")
    },
    {
      id: "h6",
      title: "Intermittent fasting",
      description: "16:8 fasting window",
      icon: "food",
      impact: 7,
      effort: 6,
      timeCommitment: "All day",
      frequency: "daily",
      isAbsolute: true,
      category: "health",
      streak: 10,
      createdAt: new Date("2024-04-22")
    }
  ]);
  
  // Simulated completions for the current week
  const [completions, setCompletions] = useState<HabitCompletion[]>([
    { habitId: "h1", date: new Date(), completed: true },
    { habitId: "h2", date: new Date(), completed: true },
    { habitId: "h4", date: new Date(), completed: false },
    { habitId: "h6", date: new Date(), completed: true },
    { habitId: "h1", date: subDays(new Date(), 1), completed: true },
    { habitId: "h2", date: subDays(new Date(), 1), completed: true },
    { habitId: "h3", date: subDays(new Date(), 1), completed: true },
    { habitId: "h4", date: subDays(new Date(), 1), completed: true },
    { habitId: "h6", date: subDays(new Date(), 1), completed: true },
    { habitId: "h1", date: subDays(new Date(), 2), completed: true },
    { habitId: "h2", date: subDays(new Date(), 2), completed: true },
    { habitId: "h4", date: subDays(new Date(), 2), completed: false },
    { habitId: "h6", date: subDays(new Date(), 2), completed: true },
    { habitId: "h1", date: subDays(new Date(), 3), completed: true },
    { habitId: "h2", date: subDays(new Date(), 3), completed: true },
    { habitId: "h3", date: subDays(new Date(), 3), completed: true },
    { habitId: "h5", date: subDays(new Date(), 3), completed: true },
    { habitId: "h6", date: subDays(new Date(), 3), completed: true },
    { habitId: "h1", date: subDays(new Date(), 4), completed: true },
    { habitId: "h2", date: subDays(new Date(), 4), completed: true },
    { habitId: "h4", date: subDays(new Date(), 4), completed: true },
    { habitId: "h6", date: subDays(new Date(), 4), completed: true },
  ]);
  
  // Draggable and sortable configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Calendar view state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Custom habits for quick add
  const [customQuickAddHabits, setCustomQuickAddHabits] = useState<any[]>([]);
  
  // Sample habit stacks
  const [habitStacks, setHabitStacks] = useState<HabitStack[]>([
    {
      id: "stack1",
      name: "Morning Routine Stack",
      description: "Start your day right with these powerful habits",
      icon: "sparkle",
      habits: [
        {
          title: "Morning meditation",
          description: "5 minutes of mindfulness to start the day",
          icon: "brain",
          iconColor: "#8b5cf6",
          impact: 8,
          effort: 3,
          timeCommitment: "5 min",
          frequency: "daily",
          isAbsolute: true,
          category: "mind",
        },
        {
          title: "Drink 16oz water",
          description: "Hydrate first thing in the morning",
          icon: "water",
          iconColor: "#3b82f6",
          impact: 7,
          effort: 1,
          timeCommitment: "1 min",
          frequency: "daily",
          isAbsolute: true,
          category: "health",
        },
        {
          title: "Make bed",
          description: "Start with a small win",
          icon: "check",
          iconColor: "#10b981",
          impact: 4,
          effort: 1,
          timeCommitment: "2 min",
          frequency: "daily",
          isAbsolute: true,
          category: "mind",
        }
      ]
    },
    {
      id: "stack2",
      name: "Fitness Success Stack",
      description: "The core habits of every successful fitness transformation",
      icon: "dumbbell",
      habits: [
        {
          title: "Strength training",
          description: "Focus on compound lifts",
          icon: "dumbbell",
          iconColor: "#ef4444",
          impact: 9,
          effort: 7,
          timeCommitment: "45 min",
          frequency: "3x-week",
          isAbsolute: false,
          category: "fitness",
        },
        {
          title: "Protein goal",
          description: "Hit daily protein targets (1g per lb bodyweight)",
          icon: "food",
          iconColor: "#22c55e",
          impact: 8,
          effort: 5,
          timeCommitment: "All day",
          frequency: "daily",
          isAbsolute: true,
          category: "health",
        },
        {
          title: "Track progress",
          description: "Measure and record key fitness metrics",
          icon: "activity",
          iconColor: "#3b82f6",
          impact: 6,
          effort: 2,
          timeCommitment: "5 min",
          frequency: "weekly",
          isAbsolute: false,
          category: "fitness",
        }
      ]
    },
    {
      id: "stack3",
      name: "Mental Growth Stack",
      description: "Habits that strengthen your mind and focus",
      icon: "brain",
      habits: [
        {
          title: "Daily reading",
          description: "Read books that expand your knowledge",
          icon: "book",
          iconColor: "#8b5cf6",
          impact: 8,
          effort: 4,
          timeCommitment: "20 min",
          frequency: "daily",
          isAbsolute: true,
          category: "mind",
        },
        {
          title: "Journaling",
          description: "Write down thoughts, goals and gratitude",
          icon: "scroll",
          iconColor: "#0ea5e9",
          impact: 7,
          effort: 3,
          timeCommitment: "10 min",
          frequency: "daily",
          isAbsolute: false,
          category: "mind",
        },
        {
          title: "Learn something new",
          description: "Dedicate time to learning a new skill",
          icon: "brain",
          iconColor: "#8b5cf6",
          impact: 7,
          effort: 4,
          timeCommitment: "30 min",
          frequency: "3x-week",
          isAbsolute: false,
          category: "mind",
        }
      ]
    },
    {
      id: "stack4",
      name: "Faith & Spiritual Stack",
      description: "Deepen your spiritual practice and connection",
      icon: "heart",
      habits: [
        {
          title: "Prayer",
          description: "Daily communication with God",
          icon: "heart",
          iconColor: "#ec4899",
          impact: 10,
          effort: 3,
          timeCommitment: "10 min",
          frequency: "daily",
          isAbsolute: true,
          category: "mind",
        },
        {
          title: "Scripture reading",
          description: "Study and reflect on sacred texts",
          icon: "book",
          iconColor: "#8b5cf6",
          impact: 9,
          effort: 4,
          timeCommitment: "15 min",
          frequency: "daily",
          isAbsolute: true,
          category: "mind",
        },
        {
          title: "Gratitude practice",
          description: "Write down blessings and express thankfulness",
          icon: "scroll",
          iconColor: "#0ea5e9",
          impact: 7,
          effort: 2,
          timeCommitment: "5 min",
          frequency: "daily",
          isAbsolute: false,
          category: "mind",
        }
      ]
    }
  ]);
  
  const [selectedStack, setSelectedStack] = useState<HabitStack | null>(null);
  
  // Helper functions
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(c => 
      c.habitId === habitId && 
      isSameDay(new Date(c.date), date) && 
      c.completed
    );
  };
  
  const toggleHabitCompletion = (habitId: string, date: Date) => {
    const existingCompletion = completions.find(c => 
      c.habitId === habitId && isSameDay(new Date(c.date), date)
    );
    
    if (existingCompletion) {
      // Toggle existing completion
      setCompletions(completions.map(c => 
        c.habitId === habitId && isSameDay(new Date(c.date), date)
          ? { ...c, completed: !c.completed }
          : c
      ));
    } else {
      // Add new completion
      setCompletions([
        ...completions,
        { habitId, date, completed: true }
      ]);
    }
    
    // Update streak if it's today
    if (isToday(date)) {
      const wasCompleted = existingCompletion?.completed ?? false;
      
      if (!wasCompleted) {
        // If marking as completed, increment streak
        setHabits(habits.map(h => 
          h.id === habitId
            ? { ...h, streak: h.streak + 1 }
            : h
        ));
      } else {
        // If marking as incomplete, decrement streak (min 0)
        setHabits(habits.map(h => 
          h.id === habitId
            ? { ...h, streak: Math.max(0, h.streak - 1) }
            : h
        ));
      }
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const addHabit = () => {
    const habit: Habit = {
      id: `h${Date.now()}`,
      title: newHabit.title || "",
      description: newHabit.description || "",
      icon: newHabit.icon || "sparkle",
      iconColor: newHabit.iconColor || '#4F46E5', // Add default iconColor
      impact: newHabit.impact || 5,
      effort: newHabit.effort || 3,
      timeCommitment: newHabit.timeCommitment || "5 min",
      frequency: newHabit.frequency as HabitFrequency || "daily",
      isAbsolute: newHabit.isAbsolute !== undefined ? newHabit.isAbsolute : true,
      category: newHabit.category as HabitCategory || "health",
      streak: 0,
      createdAt: new Date(),
    };
    
    // Use the callback form of setState to ensure we're working with the most recent state
    setHabits(prevHabits => [...prevHabits, habit]);
    
    // Also add to custom quick add templates if not already added
    const quickAddHabitExists = customQuickAddHabits.some(h => h.title === habit.title);
    
    if (!quickAddHabitExists) {
      const quickAddHabit = {
        title: habit.title,
        description: habit.description,
        icon: habit.icon,
        iconColor: habit.iconColor,
        impact: habit.impact,
        effort: habit.effort,
        timeCommitment: habit.timeCommitment,
        frequency: habit.frequency,
        isAbsolute: habit.isAbsolute,
        category: habit.category
      };
      
      setCustomQuickAddHabits([...customQuickAddHabits, quickAddHabit]);
    }
    
    setAddHabitOpen(false);
    setNewHabit({
      title: "",
      description: "",
      icon: "sparkle",
      iconColor: "#4F46E5",
      impact: 5,
      effort: 3,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health"
    });
    
    toast({
      title: "Habit added",
      description: "Your new habit has been added successfully",
    });
  };
  
  const updateHabit = () => {
    if (!editHabit) return;
    
    setHabits(habits.map(h => 
      h.id === editHabit.id
        ? { ...editHabit }
        : h
    ));
    
    setEditHabit(null);
    
    toast({
      title: "Habit updated",
      description: "Your habit has been updated successfully",
    });
  };
  
  // State for delete confirmation dialog
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const deleteHabit = (id: string) => {
    // Open the confirmation dialog
    setHabitToDelete(id);
  };
  
  const confirmDeleteHabit = () => {
    if (habitToDelete) {
      // Properly update the habits state using a callback to ensure we're working with the most recent state
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitToDelete));
      
      // Also remove any completions for this habit
      setCompletions(prevCompletions => prevCompletions.filter(c => c.habitId !== habitToDelete));
      
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted",
      });
      
      // Close the confirmation dialog
      setHabitToDelete(null);
    }
  };
  
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return "Today";
    }
    
    return format(date, "EEEE, MMM d");
  };
  
  // Function to add a habit from a quick template
  const addQuickHabit = (template: any) => {
    const habit: Habit = {
      id: `h${Date.now()}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor || '#4F46E5', // Add default iconColor if not present
      impact: template.impact,
      effort: template.effort,
      timeCommitment: template.timeCommitment,
      frequency: template.frequency as HabitFrequency,
      isAbsolute: template.isAbsolute,
      category: template.category as HabitCategory,
      streak: 0,
      createdAt: new Date(),
    };
    
    setHabits([...habits, habit]);
    
    toast({
      title: "Habit added",
      description: `${template.title} has been added to your habits`,
    });
  };
  
  // Get filtered and sorted habits for display
  const getFilteredHabits = () => {
    let filtered = [...habits];
    
    // Apply category filter if set and not 'all'
    if (filterCategory && filterCategory !== 'all') {
      filtered = filtered.filter(h => h.category === filterCategory);
    }
    
    return filtered;
  };
  
  // Get completion rate for each habit over the last 7 days
  const getCompletionRate = (habitId: string) => {
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
    
    // For daily habits, check every day
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    if (habit.frequency === "daily") {
      const completed = lastSevenDays.filter(date => 
        isHabitCompletedOnDate(habitId, date)
      ).length;
      
      return (completed / 7) * 100;
    }
    
    // For weekly habits, check if completed at least once in the period
    if (habit.frequency === "weekly") {
      const hasCompletion = completions.some(c => 
        c.habitId === habitId && 
        c.completed && 
        differenceInDays(new Date(), new Date(c.date)) < 7
      );
      
      return hasCompletion ? 100 : 0;
    }
    
    // For 2x, 3x, 4x/week habits
    const targetFrequency = {
      "2x-week": 2,
      "3x-week": 3,
      "4x-week": 4
    }[habit.frequency] || 1;
    
    const completed = lastSevenDays.filter(date => 
      isHabitCompletedOnDate(habitId, date)
    ).length;
    
    return Math.min(100, (completed / targetFrequency) * 100);
  };
  
  // Recommended quick add habit templates
  const recommendedHabits = [
    {
      title: "Prayer",
      description: "Daily communication with God",
      icon: "heart",
      iconColor: "#ec4899",
      impact: 10,
      effort: 2,
      timeCommitment: "5-15 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind"
    },
    {
      title: "Bible reading",
      description: "Study God's word daily",
      icon: "book",
      iconColor: "#8b5cf6",
      impact: 10,
      effort: 3,
      timeCommitment: "10-15 min",
      frequency: "daily",
      isAbsolute: true,
      category: "mind"
    },
    {
      title: "Cold shower",
      description: "Build resilience with cold exposure",
      icon: "shower",
      iconColor: "#0ea5e9",
      impact: 7,
      effort: 6,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: false,
      category: "health"
    },
    {
      title: "Drink water",
      description: "Stay hydrated throughout the day",
      icon: "water",
      iconColor: "#3b82f6",
      impact: 8,
      effort: 2,
      timeCommitment: "All day",
      frequency: "daily",
      isAbsolute: true,
      category: "health"
    },
    {
      title: "Take supplements",
      description: "Daily supplements for optimal health",
      icon: "pill",
      iconColor: "#f59e0b",
      impact: 8,
      effort: 1,
      timeCommitment: "1 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health"
    },
    {
      title: "Strength training",
      description: "Resistance training for muscle and health",
      icon: "dumbbell",
      iconColor: "#ef4444",
      impact: 9,
      effort: 7,
      timeCommitment: "45-60 min",
      frequency: "3x-week",
      isAbsolute: false,
      category: "fitness"
    },
    {
      title: "Limit sugar intake",
      description: "Stay under daily sugar target",
      icon: "food",
      iconColor: "#f43f5e",
      impact: 8,
      effort: 6,
      timeCommitment: "All day",
      frequency: "daily",
      isAbsolute: true,
      category: "health"
    },
    {
      title: "Intermittent fasting",
      description: "Fast for 16 hours, eat during 8-hour window",
      icon: "hourglass",
      iconColor: "#9333ea",
      impact: 9,
      effort: 7,
      timeCommitment: "16 hours",
      frequency: "daily",
      isAbsolute: false,
      category: "health"
    },
    {
      title: "Journal writing",
      description: "Record thoughts, ideas, and reflections",
      icon: "pencil",
      iconColor: "#64748b",
      impact: 7,
      effort: 4,
      timeCommitment: "10 min",
      frequency: "daily",
      isAbsolute: true,
      category: "health"
    },
    {
      title: "Practice gratitude",
      description: "Write down 3 things you're grateful for",
      icon: "scroll",
      impact: 7,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "daily",
      isAbsolute: false,
      category: "mind"
    },
    {
      title: "Connect with loved ones",
      description: "Call or message someone you care about",
      icon: "users",
      impact: 7,
      effort: 3,
      timeCommitment: "10-15 min",
      frequency: "weekly",
      isAbsolute: false,
      category: "social"
    },
    {
      title: "Walk outside",
      description: "Get some fresh air and natural light",
      icon: "activity",
      impact: 6,
      effort: 3,
      timeCommitment: "15-30 min",
      frequency: "daily",
      isAbsolute: false,
      category: "fitness"
    }
  ];
  
  // Filter dropdown options for different habit categories
  const filterOptions = [
    { value: "all", label: "All habits" },
    { value: "health", label: "Health" },
    { value: "fitness", label: "Fitness" },
    { value: "mind", label: "Mind & Spirit" },
    { value: "social", label: "Social" },
    { value: "custom", label: "Custom" }
  ];
  
  // Icons dropdown options
  const iconOptions = [
    { value: "sparkle", label: "Sparkle" },
    { value: "dumbbell", label: "Dumbbell" },
    { value: "heart", label: "Heart" },
    { value: "book", label: "Book" },
    { value: "brain", label: "Brain" },
    { value: "users", label: "People" },
    { value: "water", label: "Water" },
    { value: "flame", label: "Flame" },
    { value: "medal", label: "Medal" },
    { value: "activity", label: "Activity" },
    { value: "scroll", label: "Scroll" },
    { value: "check", label: "Check" },
    { value: "food", label: "Food" }
  ];
  
  const filteredHabits = getFilteredHabits();
  
  // Add items for a habit stack in the Add New Habit dialog
  const addHabitStackFromDialogPreview = (stack: HabitStack) => {
    // Create all habits first
    const newHabits = stack.habits.map(template => ({
      id: `h${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      iconColor: template.iconColor || '#4F46E5', // Add default iconColor if not present
      impact: template.impact,
      effort: template.effort,
      timeCommitment: template.timeCommitment,
      frequency: template.frequency as HabitFrequency,
      isAbsolute: template.isAbsolute,
      category: template.category as HabitCategory,
      streak: 0,
      createdAt: new Date(),
    }));
    
    // Then update the state once with all the new habits
    setHabits(prevHabits => [...prevHabits, ...newHabits]);
    
    toast({
      title: "Habit stack added",
      description: `Added ${newHabits.length} habits from ${stack.name}`
    });
    
    setAddHabitOpen(false);
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Your Habits</CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setAddHabitOpen(true)} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Habit
              </Button>
              
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as "list" | "calendar")}
                className="inline-flex h-9"
              >
                <TabsList className="px-1 h-9">
                  <TabsTrigger value="list" className="h-7 px-3">
                    <LayoutList className="h-4 w-4 mr-1" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="h-7 px-3">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <CardDescription>
              Track your progress and build consistent habits
            </CardDescription>
            
            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value)} 
            >
              <SelectTrigger className="h-8 w-auto gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <SelectValue placeholder="Filter habits" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map(option => (
                  <SelectItem key={option.label} value={option.value || ""}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="list" className="m-0">
              <div className="py-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {formatDate(new Date())}
                </h3>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={filteredHabits.map(h => h.id)}>
                    {filteredHabits.map(habit => (
                      <SortableHabitItem
                        key={habit.id}
                        habit={habit}
                        isCompleted={isHabitCompletedOnDate(habit.id, new Date())}
                        completionRate={getCompletionRate(habit.id)}
                        onToggle={() => toggleHabitCompletion(habit.id, new Date())}
                        onEdit={() => setEditHabit(habit)}
                        onDelete={() => deleteHabit(habit.id)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                
                {filteredHabits.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {filterCategory 
                      ? "No habits found for this category" 
                      : "No habits added yet. Click 'Add Habit' to get started."}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="m-0">
              <div className="flex items-center justify-center gap-2 mb-3 text-sm text-muted-foreground bg-blue-50 py-2 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
                <span>Use arrows to navigate between days</span>
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="mb-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border mx-auto"
                />
              </div>
              
              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={() => setSelectedDate(subDays(selectedDate, 1))} 
                    className="p-1 rounded-full hover:bg-gray-100 text-muted-foreground"
                    aria-label="Previous day"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {formatDate(selectedDate)}
                  </h3>
                  
                  <button 
                    onClick={() => setSelectedDate(addDays(selectedDate, 1))} 
                    className="p-1 rounded-full hover:bg-gray-100 text-muted-foreground"
                    aria-label="Next day"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                
                {filteredHabits.map(habit => (
                  <div key={habit.id} className="p-4 mb-2.5 rounded-lg border bg-white hover:shadow-sm transition-all flex items-center gap-3">
                    <button 
                      onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                      className={`rounded-full h-6 w-6 min-w-6 flex items-center justify-center 
                        ${isHabitCompletedOnDate(habit.id, selectedDate) 
                          ? 'text-white bg-primary hover:bg-primary/90' 
                          : 'text-muted-foreground border hover:border-primary/50'}`}
                    >
                      {isHabitCompletedOnDate(habit.id, selectedDate) && <Check className="h-3.5 w-3.5" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {getIconComponent(habit.icon, habit.iconColor)}
                        </span>
                        
                        <h3 className={`font-medium text-sm ${isHabitCompletedOnDate(habit.id, selectedDate) ? 'line-through text-muted-foreground' : ''}`}>
                          {habit.title}
                        </h3>
                        
                        <div className="ml-auto flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 flex gap-1 items-center">
                            <Clock className="h-2.5 w-2.5" />
                            {habit.timeCommitment}
                          </Badge>
                          
                          <Badge className={`text-[10px] px-1.5 py-0 ${getCategoryColor(habit.category)}`}>
                            {habit.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredHabits.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {filterCategory 
                      ? "No habits found for this category" 
                      : "No habits added yet. Click 'Add Habit' to get started."}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Habit Stacks Section */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Expert Habit Stacks</CardTitle>
            <CardDescription>
              Combine multiple habits into powerful stacks for maximum effect
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {habitStacks.map(stack => (
                <div 
                  key={stack.id}
                  className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => {
                    // Open a dialog showing the stack details
                    setSelectedStack(stack);
                    setShowStackDetailsDialog(true);
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getIconComponent(stack.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium">{stack.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {stack.habits.length} habits
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {stack.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {stack.habits.map((habit, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-[10px] font-normal flex items-center gap-1"
                      >
                        {getIconComponent(habit.icon)}
                        {habit.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Habit Stack Details Dialog */}
      <Dialog open={showStackDetailsDialog} onOpenChange={setShowStackDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStack?.name || "Habit Stack"}</DialogTitle>
            <DialogDescription>
              {selectedStack?.description || "Build multiple habits together"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedStack && (
              <>
                <div className="mb-3 flex justify-between items-center">
                  <p className="text-sm text-primary font-medium">
                    {selectedStack.habits.length} habits in this stack
                  </p>
                  <Button 
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => {
                      // Add all habits from the stack directly to habits list
                      addHabitStackFromDialogPreview(selectedStack);
                      setShowStackDetailsDialog(false);
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Add All Habits
                  </Button>
                </div>
                
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-1 gap-3">
                    {selectedStack.habits.map((template, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          // Create a new habit with a unique ID
                          const id = `h${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                          
                          const newHabit: Habit = {
                            id,
                            title: template.title,
                            description: template.description,
                            icon: template.icon,
                            iconColor: template.iconColor || '#4F46E5', // Add default iconColor if not present
                            impact: template.impact,
                            effort: template.effort,
                            timeCommitment: template.timeCommitment,
                            frequency: template.frequency as HabitFrequency,
                            isAbsolute: template.isAbsolute,
                            category: template.category as HabitCategory,
                            streak: 0,
                            createdAt: new Date()
                          };
                          
                          // Add to habits state
                          setHabits(prevHabits => [...prevHabits, newHabit]);
                          
                          // Close the dialog
                          setShowStackDetailsDialog(false);
                          
                          toast({
                            title: "Habit added",
                            description: `${template.title} has been added to your habits`,
                          });
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                            {getIconComponent(template.icon)}
                          </span>
                          <h3 className="font-medium">{template.title}</h3>
                          <Badge className={`ml-auto text-xs ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {template.timeCommitment}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getFrequencyLabel(template.frequency)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Impact: {template.impact}/10
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Habit form dialog */}
      <Dialog open={!!editHabit} onOpenChange={(open) => !open && setEditHabit(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update your habit details below
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-title" className="mb-1.5 block">
                Habit Title
              </Label>
              <Input
                id="edit-title"
                value={editHabit?.title || ""}
                onChange={(e) => setEditHabit(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="What habit do you want to build?"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description" className="mb-1.5 block">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editHabit?.description || ""}
                onChange={(e) => setEditHabit(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Add some details about this habit"
                className="resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category" className="mb-1.5 block">
                  Category
                </Label>
                <Select
                  value={editHabit?.category || "health"}
                  onValueChange={(value) => setEditHabit(prev => prev ? { ...prev, category: value as HabitCategory } : null)}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mind">Mind & Spirit</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-icon" className="mb-1.5 block">
                  Icon
                </Label>
                <Select
                  value={editHabit?.icon || "sparkle"}
                  onValueChange={(value) => setEditHabit(prev => prev ? { ...prev, icon: value } : null)}
                >
                  <SelectTrigger id="edit-icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon.value} value={icon.value}>
                        <div className="flex items-center gap-2">
                          {getIconComponent(icon.value)}
                          <span>{icon.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-frequency" className="mb-1.5 block">
                  Frequency
                </Label>
                <Select
                  value={editHabit?.frequency || "daily"}
                  onValueChange={(value) => setEditHabit(prev => prev ? { ...prev, frequency: value as HabitFrequency } : null)}
                >
                  <SelectTrigger id="edit-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="2x-week">Twice a week</SelectItem>
                    <SelectItem value="3x-week">Three times a week</SelectItem>
                    <SelectItem value="4x-week">Four times a week</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-time" className="mb-1.5 block">
                  Time Commitment
                </Label>
                <Select
                  value={editHabit?.timeCommitment || "5 min"}
                  onValueChange={(value) => setEditHabit(prev => prev ? { ...prev, timeCommitment: value } : null)}
                >
                  <SelectTrigger id="edit-time">
                    <SelectValue placeholder="Select time required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 min">1 minute</SelectItem>
                    <SelectItem value="5 min">5 minutes</SelectItem>
                    <SelectItem value="10 min">10 minutes</SelectItem>
                    <SelectItem value="15 min">15 minutes</SelectItem>
                    <SelectItem value="30 min">30 minutes</SelectItem>
                    <SelectItem value="45 min">45 minutes</SelectItem>
                    <SelectItem value="60 min">60 minutes</SelectItem>
                    <SelectItem value="90+ min">90+ minutes</SelectItem>
                    <SelectItem value="All day">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-impact" className="mb-1.5 block">
                  Impact (1-10)
                </Label>
                <div className="flex items-center">
                  <Input
                    id="edit-impact"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={editHabit?.impact || 5}
                    onChange={(e) => setEditHabit(prev => prev ? { ...prev, impact: parseInt(e.target.value) } : null)}
                    className="w-full"
                  />
                  <span className="ml-2 min-w-[25px] text-center">
                    {editHabit?.impact || 5}
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-effort" className="mb-1.5 block">
                  Effort (1-10)
                </Label>
                <div className="flex items-center">
                  <Input
                    id="edit-effort"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={editHabit?.effort || 3}
                    onChange={(e) => setEditHabit(prev => prev ? { ...prev, effort: parseInt(e.target.value) } : null)}
                    className="w-full"
                  />
                  <span className="ml-2 min-w-[25px] text-center">
                    {editHabit?.effort || 3}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="edit-absolute"
                checked={editHabit?.isAbsolute ?? true}
                onCheckedChange={(checked) => setEditHabit(prev => prev ? { ...prev, isAbsolute: checked } : null)}
              />
              <Label htmlFor="edit-absolute">
                Daily "absolute" (must-do every day)
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditHabit(null)}>
              Cancel
            </Button>
            <Button onClick={updateHabit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={habitToDelete !== null} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this habit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHabitToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteHabit}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={addHabitOpen} onOpenChange={setAddHabitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Create a new habit to track in your dashboard
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="custom">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="custom">Custom Habit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="custom" className="mt-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title" className="mb-1.5 block">
                    Habit Title
                  </Label>
                  <Input
                    id="title"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    placeholder="What habit do you want to build?"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="mb-1.5 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    placeholder="Add some details about this habit"
                    className="resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="mb-1.5 block">
                      Category
                    </Label>
                    <Select
                      value={newHabit.category as string}
                      onValueChange={(value) => setNewHabit({ ...newHabit, category: value as HabitCategory })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="mind">Mind & Spirit</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="icon" className="mb-1.5 block">
                      Icon
                    </Label>
                    <Select
                      value={newHabit.icon}
                      onValueChange={(value) => setNewHabit({ ...newHabit, icon: value })}
                    >
                      <SelectTrigger id="icon">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              {getIconComponent(icon.value)}
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequency" className="mb-1.5 block">
                      Frequency
                    </Label>
                    <Select
                      value={newHabit.frequency as string}
                      onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value as HabitFrequency })}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="2x-week">Twice a week</SelectItem>
                        <SelectItem value="3x-week">Three times a week</SelectItem>
                        <SelectItem value="4x-week">Four times a week</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="mb-1.5 block">
                      Time Commitment
                    </Label>
                    <Select
                      value={newHabit.timeCommitment}
                      onValueChange={(value) => setNewHabit({ ...newHabit, timeCommitment: value })}
                    >
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select time required" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 min">1 minute</SelectItem>
                        <SelectItem value="5 min">5 minutes</SelectItem>
                        <SelectItem value="10 min">10 minutes</SelectItem>
                        <SelectItem value="15 min">15 minutes</SelectItem>
                        <SelectItem value="30 min">30 minutes</SelectItem>
                        <SelectItem value="45 min">45 minutes</SelectItem>
                        <SelectItem value="60 min">60 minutes</SelectItem>
                        <SelectItem value="90+ min">90+ minutes</SelectItem>
                        <SelectItem value="All day">All day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="impact" className="mb-1.5 block">
                      Impact (1-10)
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="impact"
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={newHabit.impact}
                        onChange={(e) => setNewHabit({ ...newHabit, impact: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <span className="ml-2 min-w-[25px] text-center">
                        {newHabit.impact}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="effort" className="mb-1.5 block">
                      Effort (1-10)
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="effort"
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={newHabit.effort}
                        onChange={(e) => setNewHabit({ ...newHabit, effort: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <span className="ml-2 min-w-[25px] text-center">
                        {newHabit.effort}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="absolute"
                    checked={newHabit.isAbsolute}
                    onCheckedChange={(checked) => setNewHabit({ ...newHabit, isAbsolute: checked })}
                  />
                  <Label htmlFor="absolute">
                    Daily "absolute" (must-do every day)
                  </Label>
                </div>
              </div>
            </TabsContent>
            

          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddHabitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addHabit} disabled={!newHabit.title}>
              Add Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sidebar layout with main content and sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Main content area */}
          <div className="space-y-6">
            {/* Informational card about habit formation */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-1">The 1% Better Principle</h3>
                    <p className="text-muted-foreground">
                      Getting 1% better every day compounds to 37x improvement over a year. 
                      Small, consistent actions are the key to massive change.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Habit Stacks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Expert Habit Stacks</CardTitle>
                <CardDescription>
                  Combine multiple habits into powerful stacks for maximum effect
                </CardDescription>
              </CardHeader>
              
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {habitStacks.map(stack => (
                  <div 
                    key={stack.id}
                    className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => addHabitStackFromDialogPreview(stack)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {getIconComponent(stack.icon)}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{stack.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {stack.habits.length} habits
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {stack.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {stack.habits.map((habit, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className="text-[10px] font-normal flex items-center gap-1"
                        >
                          {getIconComponent(habit.icon)}
                          {habit.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Add Habits */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-100 p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Add Habits
              </h3>
              <p className="text-sm text-amber-700 mt-1">Add popular habit templates instantly</p>
            </div>
            
            <ScrollArea className="h-[400px] p-4">
              <div className="space-y-5">
                {/* Recommended habits section */}
                <div>
                  <h4 className="text-sm font-semibold text-amber-700 mb-2">Recommended Habits</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {recommendedHabits.map((habit, index) => (
                      <div key={index} className="p-3 bg-amber-50/50 border-2 border-amber-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                            {getIconComponent(habit.icon)}
                          </span>
                          <h4 className="font-medium text-sm">{habit.title}</h4>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">{habit.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {habit.timeCommitment}
                            </Badge>
                            <Badge className={`text-[10px] px-1.5 py-0 ${getCategoryColor(habit.category as HabitCategory)}`}>
                              {habit.category}
                            </Badge>
                          </div>
                          
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => addQuickHabit(habit)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* User created habits section */}
                {customQuickAddHabits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Your Custom Habits</h4>
                    <div className="space-y-3">
                      {customQuickAddHabits.map((habit, index) => (
                        <div key={`custom-${index}`} className="p-3 bg-amber-50/50 border-2 border-amber-200/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                              {getIconComponent(habit.icon)}
                            </span>
                            <h4 className="font-medium text-sm">{habit.title}</h4>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3">{habit.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {habit.timeCommitment}
                              </Badge>
                              <Badge className={`text-[10px] px-1.5 py-0 ${getCategoryColor(habit.category as HabitCategory)}`}>
                                {habit.category}
                              </Badge>
                            </div>
                            
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => addQuickHabit(habit)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {/* Quick Tips Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Habit Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex gap-2">
                <div className="shrink-0 bg-primary/10 p-1.5 rounded-full h-7 w-7 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Stack habits by connecting new ones to established routines
                </p>
              </div>
              <div className="flex gap-2">
                <div className="shrink-0 bg-primary/10 p-1.5 rounded-full h-7 w-7 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Start extremely small (2-minute rule) to build consistency
                </p>
              </div>
              <div className="flex gap-2">
                <div className="shrink-0 bg-primary/10 p-1.5 rounded-full h-7 w-7 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Track "don't break the chain" streaks for higher motivation
                </p>
              </div>
              <div className="flex gap-2">
                <div className="shrink-0 bg-primary/10 p-1.5 rounded-full h-7 w-7 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  Prioritize habits with highest impact-to-effort ratio first
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}