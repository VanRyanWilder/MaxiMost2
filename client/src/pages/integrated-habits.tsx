import { useState } from "react";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, startOfWeek, addDays, subDays, isSameDay, isSameMonth, addMonths, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { 
  CheckSquare, 
  Calendar, 
  Plus, 
  Brain, 
  Activity, 
  Dumbbell, 
  BookOpen, 
  Heart, 
  Droplets, 
  Sun, 
  User, 
  Users, 
  CheckCircle,
  Pencil,
  Trash,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Trophy,
  Award,
  Zap,
  BarChart2,
  Clock,
  AlarmClock,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Bolt,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types for habits
type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
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

// Map icon strings to components
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'brain': return <Brain className="h-4 w-4" />;
    case 'activity': return <Activity className="h-4 w-4" />;
    case 'dumbbell': return <Dumbbell className="h-4 w-4" />;
    case 'bookopen': return <BookOpen className="h-4 w-4" />;
    case 'heart': return <Heart className="h-4 w-4" />;
    case 'droplets': return <Droplets className="h-4 w-4" />;
    case 'sun': return <Sun className="h-4 w-4" />;
    case 'user': return <User className="h-4 w-4" />;
    case 'users': return <Users className="h-4 w-4" />;
    case 'checkcircle': return <CheckCircle className="h-4 w-4" />;
    case 'alarmclock': return <AlarmClock className="h-4 w-4" />;
    case 'zap': return <Zap className="h-4 w-4" />;
    case 'clock': return <Clock className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

// Map category to color
const getCategoryColor = (category: HabitCategory) => {
  switch (category) {
    case 'health': return 'bg-green-100 text-green-800';
    case 'fitness': return 'bg-blue-100 text-blue-800';
    case 'mind': return 'bg-purple-100 text-purple-800';
    case 'social': return 'bg-amber-100 text-amber-800';
    case 'custom': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Map frequency to label
const getFrequencyLabel = (frequency: HabitFrequency) => {
  switch (frequency) {
    case 'daily': return 'Every Day';
    case 'weekly': return 'Once a Week';
    case '2x-week': return 'Twice a Week';
    case '3x-week': return '3 Times a Week';
    case '4x-week': return '4 Times a Week';
    case 'custom': return 'Custom';
    default: return 'Custom';
  }
};

// Sample habit data
const initialHabits: Habit[] = [
  {
    id: 'h1',
    title: 'Drink 64oz Water',
    description: 'Stay hydrated for optimal performance and health',
    icon: 'droplets',
    impact: 8,
    effort: 2,
    timeCommitment: '5 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'health',
    streak: 12,
    createdAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
  },
  {
    id: 'h2',
    title: 'Morning Meditation',
    description: 'Start the day with a clear, focused mind',
    icon: 'brain',
    impact: 9,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: true,
    category: 'mind',
    streak: 7,
    createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
  },
  {
    id: 'h3',
    title: 'Strength Training',
    description: 'Build strength and muscle mass',
    icon: 'dumbbell',
    impact: 9,
    effort: 7,
    timeCommitment: '45 min',
    frequency: '3x-week',
    isAbsolute: false,
    category: 'fitness',
    streak: 2,
    createdAt: new Date(Date.now() - 86400000 * 21) // 21 days ago
  },
  {
    id: 'h4',
    title: 'Read Books',
    description: 'Feed your mind with quality information',
    icon: 'bookopen',
    impact: 8,
    effort: 4,
    timeCommitment: '30 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
    streak: 5,
    createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
  },
  {
    id: 'h5',
    title: 'Social Connection',
    description: 'Connect with friends or family',
    icon: 'users',
    impact: 7,
    effort: 3,
    timeCommitment: '30 min',
    frequency: '2x-week',
    isAbsolute: false,
    category: 'social',
    streak: 1,
    createdAt: new Date(Date.now() - 86400000 * 7) // 7 days ago
  }
];

// Sample completion data
const initialCompletions: HabitCompletion[] = [
  { habitId: 'h1', date: new Date(), completed: true },
  { habitId: 'h2', date: new Date(), completed: true },
  { habitId: 'h1', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h2', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h3', date: subDays(new Date(), 1), completed: true },
  { habitId: 'h1', date: subDays(new Date(), 2), completed: true },
  { habitId: 'h2', date: subDays(new Date(), 2), completed: true },
  { habitId: 'h4', date: subDays(new Date(), 2), completed: true },
];

// Sample habit stacks (morning routines)
const habitStacks: HabitStack[] = [
  {
    id: 'stack1',
    name: 'Huberman Morning Stack',
    description: 'Dr. Andrew Huberman\'s science-based morning routine',
    icon: 'sun',
    habits: [
      {
        title: 'Morning Sunlight',
        description: 'Get 5-10 minutes of morning sunlight for circadian rhythm',
        icon: 'sun',
        impact: 10,
        effort: 2,
        timeCommitment: '5-10 min',
        frequency: 'daily',
        isAbsolute: true,
        category: 'health'
      },
      {
        title: 'Cold Exposure',
        description: 'Brief cold shower or exposure for alertness and metabolism',
        icon: 'droplets',
        impact: 8,
        effort: 7,
        timeCommitment: '1-3 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'health'
      },
      {
        title: 'Delay Caffeine',
        description: 'Wait 90-120 minutes after waking before caffeine',
        icon: 'clock',
        impact: 7,
        effort: 5,
        timeCommitment: '0 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'health'
      }
    ]
  },
  {
    id: 'stack2',
    name: 'Goggins Morning Stack',
    description: 'David Goggins\' hardcore morning routine',
    icon: 'dumbbell',
    habits: [
      {
        title: 'Early Wake-Up',
        description: 'Wake up at 4:30-5:00 AM',
        icon: 'alarmclock',
        impact: 8,
        effort: 8,
        timeCommitment: '0 min',
        frequency: 'daily',
        isAbsolute: true,
        category: 'mind'
      },
      {
        title: 'Morning Run',
        description: 'Morning run (3-10 miles)',
        icon: 'dumbbell',
        impact: 9,
        effort: 9,
        timeCommitment: '30-60 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'fitness'
      },
      {
        title: 'Push-ups/Pull-ups',
        description: 'Complete morning calisthenics set',
        icon: 'dumbbell',
        impact: 8,
        effort: 7,
        timeCommitment: '15 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'fitness'
      }
    ]
  },
  {
    id: 'stack3',
    name: 'Jocko Morning Stack',
    description: 'Jocko Willink\'s discipline-equals-freedom routine',
    icon: 'zap',
    habits: [
      {
        title: '4:30 AM Wake-Up',
        description: 'Wake up at 4:30 AM for early start advantage',
        icon: 'alarmclock',
        impact: 8,
        effort: 8,
        timeCommitment: '0 min',
        frequency: 'daily',
        isAbsolute: true,
        category: 'mind'
      },
      {
        title: 'Morning Workout',
        description: 'Intense morning workout (weight training or calisthenics)',
        icon: 'dumbbell',
        impact: 9,
        effort: 8,
        timeCommitment: '45-60 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'fitness'
      },
      {
        title: 'Plan the Day',
        description: 'Strategic planning and prioritization for the day ahead',
        icon: 'checkcircle',
        impact: 7,
        effort: 3,
        timeCommitment: '10 min',
        frequency: 'daily',
        isAbsolute: false,
        category: 'mind'
      }
    ]
  }
];

// Habit Quick-Add Templates
const quickAddHabits: Array<{
  title: string;
  description: string;
  icon: string;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: string;
  category: string;
  isAbsolute: boolean;
}> = [
  {
    title: "Drink Water",
    description: "Drink 64oz of water throughout the day",
    icon: "droplets",
    impact: 8,
    effort: 2,
    timeCommitment: "1 min",
    frequency: "daily",
    category: "health",
    isAbsolute: true
  },
  {
    title: "Meditate",
    description: "10-minute mindfulness meditation",
    icon: "brain",
    impact: 9,
    effort: 4,
    timeCommitment: "10 min",
    frequency: "daily",
    category: "mind",
    isAbsolute: false
  },
  {
    title: "Exercise",
    description: "30 minutes of physical activity",
    icon: "dumbbell",
    impact: 10,
    effort: 6,
    timeCommitment: "30 min",
    frequency: "daily",
    category: "fitness",
    isAbsolute: false
  },
  {
    title: "Read",
    description: "Read books or articles",
    icon: "bookopen",
    impact: 7,
    effort: 3,
    timeCommitment: "20 min",
    frequency: "daily",
    category: "mind",
    isAbsolute: false
  },
  {
    title: "Journal",
    description: "Write in journal for reflection and clarity",
    icon: "checkcircle",
    impact: 7,
    effort: 3,
    timeCommitment: "10 min",
    frequency: "daily",
    category: "mind",
    isAbsolute: false
  },
  {
    title: "Sleep 7+ Hours",
    description: "Get adequate sleep for recovery and performance",
    icon: "clock",
    impact: 10,
    effort: 5,
    timeCommitment: "7-9 hrs",
    frequency: "daily",
    category: "health",
    isAbsolute: true
  }
];

// Sortable Habit Item Component
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`border rounded-lg transition-all ${
        isCompleted 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="p-3 flex items-start gap-3">
        <div className="flex items-center h-full mt-1">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="h-5 w-5"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              {getIconComponent(habit.icon)}
            </span>
            <h3 className={`font-medium ${
              isCompleted ? 'line-through text-gray-500' : ''
            }`}>
              {habit.title}
            </h3>
            
            {habit.streak > 0 && (
              <Badge variant="outline" className="ml-auto">
                <Award className="h-3 w-3 mr-1" /> {habit.streak} {habit.frequency === 'daily' ? 'day streak' : 'completions'}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{habit.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {habit.timeCommitment}
            </Badge>
            <Badge className={getCategoryColor(habit.category)}>
              {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
            </Badge>
            {habit.frequency !== 'daily' && (
              <Badge variant="outline" className="text-xs">
                {getFrequencyLabel(habit.frequency)}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            {...attributes} 
            {...listeners}
            variant="ghost" 
            size="icon"
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <div className="flex justify-between mb-1 text-xs">
          <span>Completion rate (30 days)</span>
          <span>{completionRate}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function IntegratedHabits() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [activeView, setActiveView] = useState<'list' | 'calendar' | 'month'>('list');
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [editHabitOpen, setEditHabitOpen] = useState(false);
  const [stackDialogOpen, setStackDialogOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState<HabitStack | null>(null);
  const [habitFilter, setHabitFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | HabitCategory>('all');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // New habit form state
  const [newHabit, setNewHabit] = useState<Omit<Habit, 'id' | 'streak' | 'createdAt'>>({
    title: '',
    description: '',
    icon: 'activity',
    impact: 7,
    effort: 4,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind',
  });
  
  // Generate dates for the week view (using date-fns)
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start with Monday
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });
  
  // Generate dates for month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = startOfWeek(monthEnd);
  
  const monthDays = [];
  let day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      monthDays.push(day);
      day = addDays(day, 1);
    }
  }
  
  // Filter habits based on selected filters
  const filteredHabits = habits.filter(habit => {
    // Filter by type (daily/weekly)
    if (habitFilter === 'daily' && habit.frequency !== 'daily') return false;
    if (habitFilter === 'weekly' && habit.frequency === 'daily') return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && habit.category !== categoryFilter) return false;
    
    return true;
  });
  
  // Sort habits with absolute (must-do) first, then by impact
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    if (a.isAbsolute && !b.isAbsolute) return -1;
    if (!a.isAbsolute && b.isAbsolute) return 1;
    return b.impact - a.impact;
  });
  
  // Daily habits (must-do, daily frequency)
  const dailyHabits = sortedHabits.filter(habit => habit.frequency === 'daily');
  
  // Weekly habits (flexible, non-daily frequency)
  const weeklyHabits = sortedHabits.filter(habit => habit.frequency !== 'daily');
  
  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => completion.habitId === habitId && 
                   isSameDay(completion.date, date) && 
                   completion.completed
    );
  };

  // Get completion rate for a habit (last 30 days)
  const getCompletionRate = (habitId: string): number => {
    const last30Days = Array.from({ length: 30 }).map((_, i) => subDays(new Date(), i));
    
    // For daily habits, expect completion every day
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    // Calculate expected completions based on frequency
    let expectedDays = 30; // Default for daily
    
    if (habit.frequency !== 'daily') {
      switch (habit.frequency) {
        case 'weekly': expectedDays = 4; break; // About 4 in 30 days
        case '2x-week': expectedDays = 8; break; // About 8 in 30 days
        case '3x-week': expectedDays = 12; break; // About 12 in 30 days
        case '4x-week': expectedDays = 16; break; // About 16 in 30 days
        default: expectedDays = 4;
      }
    }
    
    const completedDays = completions.filter(
      c => c.habitId === habitId && 
      c.completed && 
      new Date(c.date).getTime() > Date.now() - (30 * 86400000)
    ).length;
    
    // Calculate rate (cap at 100%)
    return Math.min(100, Math.round((completedDays / expectedDays) * 100));
  };
  
  // Toggle habit completion for a specific date
  const toggleHabitCompletion = (habitId: string, date: Date) => {
    const isCompleted = isHabitCompletedOnDate(habitId, date);
    
    if (isCompleted) {
      // Remove completion
      setCompletions(completions.filter(
        c => !(c.habitId === habitId && isSameDay(c.date, date))
      ));
    } else {
      // Add completion
      setCompletions([...completions, { habitId, date, completed: true }]);
      
      // Update streak
      updateStreak(habitId);
    }
    
    // Show toast
    toast({
      title: isCompleted ? "Habit marked as incomplete" : "Habit completed!",
      description: isCompleted ? "Your progress has been updated" : "Great job! Keep building that streak!",
      variant: isCompleted ? "destructive" : "default",
    });
  };
  
  // Update streak for a habit
  const updateStreak = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Count consecutive days backwards
    let streak = 0;
    let currentDate = new Date();
    let checking = true;
    
    // For daily habits, check consecutive days
    if (habit.frequency === 'daily') {
      while (checking) {
        if (isHabitCompletedOnDate(habitId, currentDate)) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else {
          checking = false;
        }
      }
    } else {
      // For weekly habits, count completions in the past 7 days
      const pastWeek = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), i));
      streak = pastWeek.filter(date => isHabitCompletedOnDate(habitId, date)).length;
    }
    
    // Update habit streak
    setHabits(habits.map(h => 
      h.id === habitId ? { ...h, streak } : h
    ));
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setHabits((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        // Show toast
        toast({
          title: "Habits reordered",
          description: "Your habits have been reordered by priority",
        });
        
        return reordered;
      });
    }
  };
  
  // Setup drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Add new habit
  const addHabit = () => {
    const id = `h${Date.now()}`;
    
    const habit: Habit = {
      ...newHabit,
      id,
      streak: 0,
      createdAt: new Date()
    };
    
    setHabits([...habits, habit]);
    setAddHabitOpen(false);
    
    // Reset form
    setNewHabit({
      title: '',
      description: '',
      icon: 'activity',
      impact: 7,
      effort: 4,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: false,
      category: 'mind',
    });
    
    // Show success toast
    toast({
      title: "Habit added",
      description: "Your new habit has been added to your tracking list",
    });
  };
  
  // Edit habit
  const editHabit = () => {
    if (!selectedHabit) return;
    
    setHabits(habits.map(h => 
      h.id === selectedHabit.id ? { ...selectedHabit } : h
    ));
    
    setEditHabitOpen(false);
    setSelectedHabit(null);
    
    // Show success toast
    toast({
      title: "Habit updated",
      description: "Your habit has been updated successfully",
    });
  };
  
  // Delete habit
  const deleteHabit = (habitId: string) => {
    // Remove habit
    setHabits(habits.filter(h => h.id !== habitId));
    
    // Remove all completions for this habit
    setCompletions(completions.filter(c => c.habitId !== habitId));
    
    // Show toast
    toast({
      title: "Habit deleted",
      description: "The habit has been removed from your tracking list",
      variant: "destructive",
    });
  };
  
  // Add a pre-filled habit
  const addQuickHabit = (template: typeof quickAddHabits[0]) => {
    const id = `h${Date.now()}`;
    
    const habit: Habit = {
      ...template,
      id,
      streak: 0,
      createdAt: new Date(),
      frequency: template.frequency as HabitFrequency,
      category: template.category as HabitCategory
    };
    
    setHabits([...habits, habit]);
    
    // Show success toast
    toast({
      title: "Quick habit added",
      description: `"${template.title}" has been added to your habits`,
    });
  };
  
  // Add a whole habit stack
  const addHabitStack = () => {
    if (!selectedStack) return;
    
    // Add each habit in the stack
    const newHabits = selectedStack.habits.map(habitTemplate => {
      const id = `h${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        ...habitTemplate,
        id,
        streak: 0,
        createdAt: new Date()
      };
    });
    
    setHabits([...habits, ...newHabits]);
    setStackDialogOpen(false);
    setSelectedStack(null);
    
    // Show success toast
    toast({
      title: "Habit stack added",
      description: `${selectedStack.name} routines have been added to your habits`,
    });
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return format(date, 'MMM d, yyyy');
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  return (
    <PageContainer title="Habit Dashboard - Track and Build Effective Habits">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Maximus Habits</h1>
          <p className="text-gray-600 mt-1">Build and track high-ROI habits for maximum results</p>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-2 text-sm">
          <span className="font-medium">Current streak:</span>
          <span className="font-bold text-primary">7 days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <Trophy className="w-full h-full" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">Daily Habit Streaks</h2>
              <p className="text-white text-opacity-90 max-w-3xl">
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle
              </p>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                  Daily Must-Do Habits
                </div>
                <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                  Weekly Flexible Habits
                </div>
                <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                  Habit Stacking
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant={activeView === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('list')}
                  className="flex items-center gap-1"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>List</span>
                </Button>
                <Button 
                  variant={activeView === 'calendar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('calendar')}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Week</span>
                </Button>
                <Button 
                  variant={activeView === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('month')}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Month</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select 
                  value={habitFilter} 
                  onValueChange={(value) => setHabitFilter(value as 'all' | 'daily' | 'weekly')}
                >
                  <SelectTrigger className="h-9 w-[145px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Habits</SelectItem>
                    <SelectItem value="daily">Daily Habits</SelectItem>
                    <SelectItem value="weekly">Weekly Habits</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={categoryFilter} 
                  onValueChange={(value) => setCategoryFilter(value as 'all' | HabitCategory)}
                >
                  <SelectTrigger className="h-9 w-[145px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="mind">Mind</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={() => setAddHabitOpen(true)} size="sm" variant="default" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Habit</span>
                </Button>
              </div>
            </div>
            
            {/* List View */}
            {activeView === 'list' && (
              <div className="space-y-8">
                {/* Daily Habits Section */}
                {dailyHabits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Daily Must-Do Habits
                      <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                        <GripVertical className="h-3 w-3 mr-1" />
                        Drag to reorder
                      </Badge>
                    </h3>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={dailyHabits.map(h => h.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {dailyHabits.map((habit) => (
                            <SortableHabitItem 
                              key={habit.id}
                              habit={habit} 
                              isCompleted={isHabitCompletedOnDate(habit.id, new Date())} 
                              completionRate={getCompletionRate(habit.id)}
                              onToggle={() => toggleHabitCompletion(habit.id, new Date())}
                              onEdit={() => {
                                setSelectedHabit(habit);
                                setEditHabitOpen(true);
                              }}
                              onDelete={() => deleteHabit(habit.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
                
                {/* Weekly Habits Section */}
                {weeklyHabits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Weekly Flexible Habits
                      <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                        <GripVertical className="h-3 w-3 mr-1" />
                        Drag to reorder
                      </Badge>
                    </h3>
                    
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={weeklyHabits.map(h => h.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {weeklyHabits.map((habit) => (
                            <SortableHabitItem 
                              key={habit.id}
                              habit={habit} 
                              isCompleted={isHabitCompletedOnDate(habit.id, new Date())} 
                              completionRate={getCompletionRate(habit.id)}
                              onToggle={() => toggleHabitCompletion(habit.id, new Date())}
                              onEdit={() => {
                                setSelectedHabit(habit);
                                setEditHabitOpen(true);
                              }}
                              onDelete={() => deleteHabit(habit.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
                
                {sortedHabits.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                    <div className="mb-3 text-gray-400">
                      <CheckSquare className="h-10 w-10 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No habits found</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first habit to start tracking your progress
                    </p>
                    <Button onClick={() => setAddHabitOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Your First Habit
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Calendar View */}
            {activeView === 'calendar' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Weekly Calendar View</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setWeekOffset(weekOffset - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous Week
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setWeekOffset(0)}
                      disabled={weekOffset === 0}
                    >
                      Current Week
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setWeekOffset(weekOffset + 1)}
                    >
                      Next Week
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className=""></div>
                  {weekDates.map((date, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium">
                        {format(date, 'EEE')}
                      </div>
                      <div className={`text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto ${
                        isSameDay(date, new Date()) ? 'bg-primary text-white' : 'text-gray-500'
                      }`}>
                        {format(date, 'd')}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {sortedHabits.map((habit) => (
                    <div key={habit.id} className="grid grid-cols-8 gap-2 items-center py-2 border-b">
                      <div className="flex items-center gap-1.5 max-w-[150px]">
                        <span className="p-1 rounded-md text-primary">
                          {getIconComponent(habit.icon)}
                        </span>
                        <span className="text-sm font-medium truncate">{habit.title}</span>
                      </div>
                      
                      {weekDates.map((date, index) => (
                        <div key={index} className="flex justify-center">
                          <Checkbox
                            checked={isHabitCompletedOnDate(habit.id, date)}
                            onCheckedChange={() => toggleHabitCompletion(habit.id, date)}
                            className={`h-5 w-5 ${
                              isHabitCompletedOnDate(habit.id, date) 
                                ? 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600' 
                                : ''
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  
                  {sortedHabits.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        No habits found. Add a habit to see it in the calendar view.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Month Calendar View */}
            {activeView === 'month' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={nextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={i} className="text-center text-sm font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 42 }).map((_, i) => {
                    const date = addDays(startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }), i);
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isToday = isSameDay(date, new Date());
                    const isSelected = isSameDay(date, selectedDate);
                    
                    // Count habits completed on this date
                    const completedHabitsCount = habits.filter(habit => 
                      isHabitCompletedOnDate(habit.id, date)
                    ).length;
                    
                    // Check if there are any habits due on this date
                    const habitsDueCount = habits.length;
                    
                    // Calculate completion percentage
                    const completionPercentage = habitsDueCount > 0 
                      ? Math.round((completedHabitsCount / habitsDueCount) * 100) 
                      : 0;
                    
                    return (
                      <div 
                        key={i}
                        className={`
                          p-1 min-h-[60px] border rounded
                          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} 
                          ${isToday ? 'border-primary' : 'border-gray-100'}
                          ${isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''}
                          hover:bg-gray-50 cursor-pointer
                        `}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-medium ${isToday ? 'text-primary' : ''}`}>
                              {format(date, 'd')}
                            </span>
                            
                            {completedHabitsCount > 0 && (
                              <Badge 
                                variant="outline" 
                                className={`px-1 h-4 text-[10px] ${
                                  completionPercentage > 80 
                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                    : completionPercentage > 50 
                                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                                      : 'bg-gray-100 text-gray-800 border-gray-200'
                                }`}
                              >
                                {completedHabitsCount}/{habitsDueCount}
                              </Badge>
                            )}
                          </div>
                          
                          {/* Completion indicator */}
                          {completedHabitsCount > 0 && (
                            <div className="mt-auto">
                              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                                <div 
                                  className={`h-full rounded-full ${
                                    completionPercentage > 80 
                                      ? 'bg-green-500' 
                                      : completionPercentage > 50 
                                        ? 'bg-amber-500'
                                        : 'bg-gray-300'
                                  }`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Selected date habits */}
                {selectedDate && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      {format(selectedDate, 'MMMM d, yyyy')}
                    </h4>
                    
                    <div className="space-y-2">
                      {sortedHabits.map(habit => (
                        <div 
                          key={habit.id}
                          className={`flex items-center p-2 rounded-md ${
                            isHabitCompletedOnDate(habit.id, selectedDate)
                              ? 'bg-green-50 border border-green-100'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <Checkbox
                            checked={isHabitCompletedOnDate(habit.id, selectedDate)}
                            onCheckedChange={() => toggleHabitCompletion(habit.id, selectedDate)}
                            className="mr-2"
                          />
                          
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-white text-primary">
                              {getIconComponent(habit.icon)}
                            </span>
                            <span className={`text-sm font-medium ${
                              isHabitCompletedOnDate(habit.id, selectedDate) ? 'line-through text-gray-500' : ''
                            }`}>
                              {habit.title}
                            </span>
                          </div>
                          
                          <Badge className={`ml-auto ${getCategoryColor(habit.category)}`}>
                            {habit.category}
                          </Badge>
                        </div>
                      ))}
                      
                      {sortedHabits.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No habits to display for this date.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Habit Analytics */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Habit Analytics
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Completion Rate</h4>
                <div className="text-2xl font-bold text-blue-700">78%</div>
                <p className="text-xs text-blue-600 mt-1">Last 30 days average</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="text-sm font-medium text-green-800 mb-2">Current Streak</h4>
                <div className="text-2xl font-bold text-green-700">12 days</div>
                <p className="text-xs text-green-600 mt-1">Keep it going!</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Most Consistent</h4>
                <div className="text-lg font-bold text-purple-700">Hydration</div>
                <p className="text-xs text-purple-600 mt-1">95% completion rate</p>
              </div>
            </div>
          </div>
        </div>
        
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
            
            <ScrollArea className="h-[260px] p-4">
              <div className="space-y-3">
                {quickAddHabits.map((habit, index) => (
                  <div key={index} className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-lg">
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
            </ScrollArea>
          </div>
          
          {/* Habit Stacks / Morning Routines */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Expert Habit Stacks
              </h3>
              <p className="text-sm text-blue-700 mt-1">Add complete morning routines from experts</p>
            </div>
            
            <div className="p-4 space-y-4">
              {habitStacks.map(stack => (
                <div key={stack.id} className="p-3 bg-blue-50/40 border border-blue-100/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                      {getIconComponent(stack.icon)}
                    </span>
                    <h4 className="font-medium text-sm">{stack.name}</h4>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{stack.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {stack.habits.map((habit, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-white">
                        {habit.title}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSelectedStack(stack);
                      setStackDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Add Stack
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Streak Stats */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-primary" />
                Habit Streaks
              </h3>
              
              <div className="space-y-3">
                {sortedHabits.filter(h => h.streak > 0).sort((a, b) => b.streak - a.streak).slice(0, 3).map(habit => (
                  <div key={habit.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-white text-primary">
                        {getIconComponent(habit.icon)}
                      </span>
                      <span className="text-sm font-medium">{habit.title}</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      {habit.streak}
                    </Badge>
                  </div>
                ))}
                
                {sortedHabits.filter(h => h.streak > 0).length === 0 && (
                  <p className="text-sm text-center text-gray-500 py-2">
                    Complete habits to build streaks
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Habit Dialog */}
      <Dialog open={addHabitOpen} onOpenChange={setAddHabitOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Add a new habit to track or select from pre-defined templates.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="manual" className="mt-2">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="manual">Custom Habit</TabsTrigger>
              <TabsTrigger value="quick">Quick Add Templates</TabsTrigger>
              <TabsTrigger value="stacks">Expert Stacks</TabsTrigger>
            </TabsList>
            
            {/* Manual Entry Tab */}
            <TabsContent value="manual" className="mt-0">
              <div className="grid gap-4 py-2">
                <div>
                  <Label htmlFor="title" className="mb-1.5 block">Habit Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g., Morning Meditation"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="mb-1.5 block">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this habit involve?"
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="resize-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time" className="mb-1.5 block">Time Commitment</Label>
                    <Input
                      id="time"
                      placeholder="E.g., 10 min"
                      value={newHabit.timeCommitment}
                      onChange={(e) => setNewHabit({ ...newHabit, timeCommitment: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency" className="mb-1.5 block">Frequency</Label>
                    <Select
                      value={newHabit.frequency}
                      onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value as HabitFrequency })}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Once a Week</SelectItem>
                        <SelectItem value="2x-week">Twice a Week</SelectItem>
                        <SelectItem value="3x-week">3 Times a Week</SelectItem>
                        <SelectItem value="4x-week">4 Times a Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icon" className="mb-1.5 block">Icon</Label>
                    <Select
                      value={newHabit.icon}
                      onValueChange={(value) => setNewHabit({ ...newHabit, icon: value })}
                    >
                      <SelectTrigger id="icon">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activity">Activity</SelectItem>
                        <SelectItem value="brain">Brain</SelectItem>
                        <SelectItem value="dumbbell">Dumbbell</SelectItem>
                        <SelectItem value="bookopen">Book</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                        <SelectItem value="droplets">Droplets</SelectItem>
                        <SelectItem value="sun">Sun</SelectItem>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="checkcircle">Check</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                        <SelectItem value="alarmclock">Alarm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="mb-1.5 block">Category</Label>
                    <Select
                      value={newHabit.category}
                      onValueChange={(value) => setNewHabit({ ...newHabit, category: value as HabitCategory })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
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
                        value={newHabit.impact}
                        onChange={(e) => setNewHabit({ ...newHabit, impact: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <span className="ml-2 text-sm font-medium">{newHabit.impact}</span>
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
                        value={newHabit.effort}
                        onChange={(e) => setNewHabit({ ...newHabit, effort: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <span className="ml-2 text-sm font-medium">{newHabit.effort}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAbsolute"
                    checked={newHabit.isAbsolute}
                    onCheckedChange={(checked) => setNewHabit({ ...newHabit, isAbsolute: checked })}
                  />
                  <Label htmlFor="isAbsolute" className="text-sm font-medium">
                    This is a must-do habit (highest priority)
                  </Label>
                </div>
              </div>
            </TabsContent>
            
            {/* Quick Add Templates Tab */}
            <TabsContent value="quick" className="mt-0">
              <ScrollArea className="h-[350px] pr-4">
                <div className="grid grid-cols-1 gap-3">
                  {quickAddHabits.map((template, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setNewHabit({
                          title: template.title,
                          description: template.description,
                          icon: template.icon,
                          impact: template.impact,
                          effort: template.effort,
                          timeCommitment: template.timeCommitment,
                          frequency: template.frequency as HabitFrequency,
                          isAbsolute: template.isAbsolute,
                          category: template.category as HabitCategory,
                        });
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                          {getIconComponent(template.icon)}
                        </span>
                        <h3 className="font-medium">{template.title}</h3>
                        <Badge className={`ml-auto text-xs ${getCategoryColor(template.category as HabitCategory)}`}>
                          {template.category}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.timeCommitment}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getFrequencyLabel(template.frequency as HabitFrequency)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Impact: {template.impact}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            {/* Habit Stacks Tab */}
            <TabsContent value="stacks" className="mt-0">
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Expert habit stacks bundle multiple habits together for maximum effect.
                  Select a stack to view its habits, then choose one to add:
                </p>
                
                <Select
                  onValueChange={(stackId) => {
                    const selectedStack = habitStacks.find(s => s.id === stackId);
                    setSelectedStack(selectedStack || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a habit stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {habitStacks.map(stack => (
                      <SelectItem key={stack.id} value={stack.id}>
                        {stack.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStack && (
                <ScrollArea className="h-[250px] pr-4">
                  <div className="grid grid-cols-1 gap-3">
                    {selectedStack.habits.map((template, idx) => (
                      <div 
                        key={idx} 
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setNewHabit({
                            title: template.title,
                            description: template.description,
                            icon: template.icon,
                            impact: template.impact,
                            effort: template.effort,
                            timeCommitment: template.timeCommitment,
                            frequency: template.frequency,
                            isAbsolute: template.isAbsolute,
                            category: template.category,
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
              )}
              
              {!selectedStack && (
                <div className="text-center py-8 text-muted-foreground">
                  Select a habit stack to view available habits
                </div>
              )}
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
      
      {/* Edit Habit Dialog */}
      <Dialog open={editHabitOpen} onOpenChange={setEditHabitOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Update the details of your habit.
            </DialogDescription>
          </DialogHeader>
          
          {selectedHabit && (
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-title" className="mb-1.5 block">Habit Title</Label>
                <Input
                  id="edit-title"
                  value={selectedHabit.title}
                  onChange={(e) => setSelectedHabit({ ...selectedHabit, title: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description" className="mb-1.5 block">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedHabit.description}
                  onChange={(e) => setSelectedHabit({ ...selectedHabit, description: e.target.value })}
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-time" className="mb-1.5 block">Time Commitment</Label>
                  <Input
                    id="edit-time"
                    value={selectedHabit.timeCommitment}
                    onChange={(e) => setSelectedHabit({ ...selectedHabit, timeCommitment: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-frequency" className="mb-1.5 block">Frequency</Label>
                  <Select
                    value={selectedHabit.frequency}
                    onValueChange={(value) => setSelectedHabit({ ...selectedHabit, frequency: value as HabitFrequency })}
                  >
                    <SelectTrigger id="edit-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Once a Week</SelectItem>
                      <SelectItem value="2x-week">Twice a Week</SelectItem>
                      <SelectItem value="3x-week">3 Times a Week</SelectItem>
                      <SelectItem value="4x-week">4 Times a Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-icon" className="mb-1.5 block">Icon</Label>
                  <Select
                    value={selectedHabit.icon}
                    onValueChange={(value) => setSelectedHabit({ ...selectedHabit, icon: value })}
                  >
                    <SelectTrigger id="edit-icon">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="brain">Brain</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="bookopen">Book</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="droplets">Droplets</SelectItem>
                      <SelectItem value="sun">Sun</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="checkcircle">Check</SelectItem>
                      <SelectItem value="zap">Zap</SelectItem>
                      <SelectItem value="alarmclock">Alarm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-category" className="mb-1.5 block">Category</Label>
                  <Select
                    value={selectedHabit.category}
                    onValueChange={(value) => setSelectedHabit({ ...selectedHabit, category: value as HabitCategory })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
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
                      value={selectedHabit.impact}
                      onChange={(e) => setSelectedHabit({ ...selectedHabit, impact: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm font-medium">{selectedHabit.impact}</span>
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
                      value={selectedHabit.effort}
                      onChange={(e) => setSelectedHabit({ ...selectedHabit, effort: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm font-medium">{selectedHabit.effort}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isAbsolute"
                  checked={selectedHabit.isAbsolute}
                  onCheckedChange={(checked) => setSelectedHabit({ ...selectedHabit, isAbsolute: checked })}
                />
                <Label htmlFor="edit-isAbsolute" className="text-sm font-medium">
                  This is a must-do habit (highest priority)
                </Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditHabitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editHabit} disabled={!selectedHabit?.title}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Habit Stack Dialog */}
      <Dialog open={stackDialogOpen} onOpenChange={setStackDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Habit Stack</DialogTitle>
            <DialogDescription>
              {selectedStack?.description || "Add a complete set of habits at once."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStack && (
            <div className="py-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                {getIconComponent(selectedStack.icon)}
                <span>{selectedStack.name}</span>
              </h3>
              
              <div className="space-y-3 mt-4">
                {selectedStack.habits.map((habit, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1 rounded bg-white text-primary">
                        {getIconComponent(habit.icon)}
                      </span>
                      <span className="font-medium text-sm">{habit.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{habit.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {habit.timeCommitment}
                      </Badge>
                      <Badge className={getCategoryColor(habit.category)}>
                        {habit.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getFrequencyLabel(habit.frequency)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addHabitStack} disabled={!selectedStack}>
              Add All Habits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}