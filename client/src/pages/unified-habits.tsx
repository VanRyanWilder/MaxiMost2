import { useState } from "react";
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
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
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
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define types for habits
type HabitFrequency = "daily" | "2x-week" | "3x-week" | "4x-week" | "5x-week" | "6x-week";
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

// Map icon strings to components
const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'brain': return <Brain />;
    case 'activity': return <Activity />;
    case 'dumbbell': return <Dumbbell />;
    case 'bookopen': return <BookOpen />;
    case 'heart': return <Heart />;
    case 'droplets': return <Droplets />;
    case 'sun': return <Sun />;
    case 'user': return <User />;
    case 'users': return <Users />;
    case 'checkcircle': return <CheckCircle />;
    default: return <Activity />;
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

export default function UnifiedHabits() {
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [editHabitOpen, setEditHabitOpen] = useState(false);
  const [habitFilter, setHabitFilter] = useState<'all' | 'daily' | 'weekly'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | HabitCategory>('all');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
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
        case '2x-week': expectedDays = 8; break; // About 8 in 30 days (2 per week * 4 weeks)
        case '3x-week': expectedDays = 12; break; // About 12 in 30 days (3 per week * 4 weeks)
        case '4x-week': expectedDays = 16; break; // About 16 in 30 days (4 per week * 4 weeks)
        case '5x-week': expectedDays = 20; break; // About 20 in 30 days (5 per week * 4 weeks)
        case '6x-week': expectedDays = 24; break; // About 24 in 30 days (6 per week * 4 weeks)
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
  
  // Move habit up/down in the list (for sorting)
  const moveHabit = (habitId: string, direction: 'up' | 'down') => {
    const habitIndex = habits.findIndex(h => h.id === habitId);
    if (habitIndex === -1) return;
    
    // Cannot move first item up or last item down
    if (
      (direction === 'up' && habitIndex === 0) || 
      (direction === 'down' && habitIndex === habits.length - 1)
    ) {
      return;
    }
    
    const newHabits = [...habits];
    const targetIndex = direction === 'up' ? habitIndex - 1 : habitIndex + 1;
    
    // Swap habits
    [newHabits[habitIndex], newHabits[targetIndex]] = [newHabits[targetIndex], newHabits[habitIndex]];
    
    setHabits(newHabits);
  };
  
  return (
    <PageContainer title="Habit Tracker - Build Consistent Habits">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Daily Habits</h1>
          <p className="text-gray-600 mt-1">Build consistent high-ROI habits for maximum results</p>
        </div>
        
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-2 text-sm">
          <span className="font-medium">Current streak:</span>
          <span className="font-bold text-primary">7 days</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Trophy className="w-full h-full" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Daily Habit Tracker</h2>
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
              Streak Tracking
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button 
            variant={activeView === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('list')}
            className="flex items-center gap-1"
          >
            <CheckSquare className="h-4 w-4" />
            <span>List View</span>
          </Button>
          <Button 
            variant={activeView === 'calendar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('calendar')}
            className="flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Calendar View</span>
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
          
          <Button onClick={() => setAddHabitOpen(true)} size="sm" className="flex items-center gap-1">
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Daily Must-Do Habits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyHabits.map((habit) => (
                  <div key={habit.id} className={`border rounded-lg transition-all ${
                    isHabitCompletedOnDate(habit.id, new Date()) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4 flex items-start gap-3">
                      <div className="flex items-center h-full">
                        <Checkbox 
                          checked={isHabitCompletedOnDate(habit.id, new Date())}
                          onCheckedChange={() => toggleHabitCompletion(habit.id, new Date())}
                          className="h-5 w-5"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                            {getIconComponent(habit.icon)}
                          </span>
                          <h3 className={`font-medium ${
                            isHabitCompletedOnDate(habit.id, new Date()) ? 'line-through text-gray-500' : ''
                          }`}>
                            {habit.title}
                          </h3>
                          
                          {habit.streak > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              <Award className="h-3 w-3 mr-1" /> {habit.streak} day streak
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {habit.timeCommitment}
                          </Badge>
                          <Badge className={getCategoryColor(habit.category)}>
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getFrequencyLabel(habit.frequency)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedHabit(habit);
                            setEditHabitOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-3">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>Completion rate (30 days)</span>
                        <span>{getCompletionRate(habit.id)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${getCompletionRate(habit.id)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Weekly Habits Section */}
          {weeklyHabits.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Weekly Flexible Habits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyHabits.map((habit) => (
                  <div key={habit.id} className={`border rounded-lg transition-all ${
                    isHabitCompletedOnDate(habit.id, new Date()) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4 flex items-start gap-3">
                      <div className="flex items-center h-full">
                        <Checkbox 
                          checked={isHabitCompletedOnDate(habit.id, new Date())}
                          onCheckedChange={() => toggleHabitCompletion(habit.id, new Date())}
                          className="h-5 w-5"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                            {getIconComponent(habit.icon)}
                          </span>
                          <h3 className={`font-medium ${
                            isHabitCompletedOnDate(habit.id, new Date()) ? 'line-through text-gray-500' : ''
                          }`}>
                            {habit.title}
                          </h3>
                          
                          {habit.streak > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              <Award className="h-3 w-3 mr-1" /> {habit.streak} completions
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {habit.timeCommitment}
                          </Badge>
                          <Badge className={getCategoryColor(habit.category)}>
                            {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getFrequencyLabel(habit.frequency)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedHabit(habit);
                            setEditHabitOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-3">
                      <div className="flex justify-between mb-1 text-xs">
                        <span>Completion rate (30 days)</span>
                        <span>{getCompletionRate(habit.id)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${getCompletionRate(habit.id)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
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
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Weekly Calendar View</CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWeekOffset(weekOffset - 1)}
                >
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
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
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
            
            <div className="space-y-3">
              {sortedHabits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No habits found. Add a habit to see it in the calendar view.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Add Habit Dialog */}
      <Dialog open={addHabitOpen} onOpenChange={setAddHabitOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Add a new habit to track. Fill out the details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
    </PageContainer>
  );
}
