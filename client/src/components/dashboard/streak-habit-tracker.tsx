import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';
import { 
  BarChart2, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Star,
  PlusCircle,
  MoveUp,
  Pencil,
  Activity,
  Brain,
  LayoutGrid,
  Droplets,
  Heart,
  Dumbbell,
  BookOpen,
  Sun,
  ListChecks,
  Clock,
  Users,
  TrendingUp,
  BarChart
} from 'lucide-react';

// Types for habits
type Frequency = "daily" | "weekly" | "custom" | "2x-week" | "3x-week" | "4x-week";

type Category = "health" | "fitness" | "mind" | "social" | "custom";

type Habit = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: Frequency;
  isAbsolute: boolean;
  streak?: number;
  category: Category;
};

type Completion = {
  id: string;
  date: Date;
};

export function StreakHabitTracker() {
  const [viewMode, setViewMode] = useState('calendar');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [showAddHabitDialog, setShowAddHabitDialog] = useState(false);
  const [showEditHabitDialog, setShowEditHabitDialog] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<string | null>(null);
  
  // New habit form state
  const [newHabit, setNewHabit] = useState<{
    title: string;
    description: string;
    icon: string;
    impact: number;
    effort: number;
    timeCommitment: string;
    frequency: Frequency;
    isAbsolute: boolean;
    category: Category;
  }>({
    title: '',
    description: '',
    icon: 'activity',
    impact: 8,
    effort: 3,
    timeCommitment: '10 min',
    frequency: 'daily',
    isAbsolute: false,
    category: 'mind'
  });
  
  // Sample habit data
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 'hydration',
      title: 'Drink 64oz Water',
      description: 'Stay hydrated throughout the day',
      icon: <Droplets />,
      impact: 8,
      effort: 2,
      timeCommitment: '1 min',
      frequency: 'daily',
      isAbsolute: true,
      streak: 12,
      category: 'health'
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Clear your mind and focus on your breath',
      icon: <Brain />,
      impact: 8,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: true,
      streak: 5,
      category: 'mind'
    },
    {
      id: 'exercise',
      title: 'Exercise',
      description: 'Get your body moving and blood pumping',
      icon: <Dumbbell />,
      impact: 10,
      effort: 6,
      timeCommitment: '30-60 min',
      frequency: '4x-week',
      isAbsolute: false,
      streak: 3,
      category: 'fitness'
    },
    {
      id: 'reading',
      title: 'Reading',
      description: 'Read books to expand your knowledge',
      icon: <BookOpen />,
      impact: 7,
      effort: 4,
      timeCommitment: '20 min',
      frequency: 'daily',
      isAbsolute: false,
      streak: 0,
      category: 'mind'
    },
    {
      id: 'social',
      title: 'Social Interaction',
      description: 'Connect with friends or family',
      icon: <Users />,
      impact: 8,
      effort: 5,
      timeCommitment: '15-30 min',
      frequency: '3x-week',
      isAbsolute: false,
      streak: 1,
      category: 'social'
    }
  ]);
  
  // Sample completion data
  const completions: Completion[] = [
    { id: 'hydration', date: new Date() },
    { id: 'meditation', date: new Date() },
    { id: 'hydration', date: subDays(new Date(), 1) },
    { id: 'meditation', date: subDays(new Date(), 1) },
    { id: 'exercise', date: subDays(new Date(), 1) },
    { id: 'hydration', date: subDays(new Date(), 2) },
    { id: 'meditation', date: subDays(new Date(), 2) },
    { id: 'hydration', date: subDays(new Date(), 3) },
    { id: 'reading', date: subDays(new Date(), 3) },
    { id: 'exercise', date: subDays(new Date(), 4) },
    { id: 'hydration', date: subDays(new Date(), 4) },
  ];
  
  // Generate dates for the week view
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start with Monday
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });
  
  // Check if a habit was completed on a specific date
  const isCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => completion.id === habitId && isSameDay(completion.date, date)
    );
  };
  
  // Toggle completion status
  const toggleCompletion = (habitId: string, date: Date) => {
    console.log(`Toggling completion for ${habitId} on ${format(date, 'MMM d, yyyy')}`);
    // In a real app, this would update state and persist to backend
  };
  
  // Handle habit customization
  const handleAddHabit = () => {
    // Reset form to defaults
    setNewHabit({
      title: '',
      description: '',
      icon: 'activity',
      impact: 8,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: false,
      category: 'mind'
    });
    setShowAddHabitDialog(true);
  };
  
  const handleEditHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    setHabitToEdit(habitId);
    // Pre-fill form with current habit data
    setNewHabit({
      title: habit.title,
      description: habit.description,
      // Safer access: If habit.icon is a string (key), use it.
      // If it's a ReactNode, this is complex to reverse; default to 'activity' for the form.
      // This component's internal Habit type defines icon as ReactNode, but its form state newHabit.icon is a string.
      icon: typeof habit.icon === 'string' ? habit.icon : ((habit.icon as any)?.type?.name?.toLowerCase() || 'activity'),
      impact: habit.impact,
      effort: habit.effort,
      timeCommitment: habit.timeCommitment,
      frequency: habit.frequency,
      isAbsolute: habit.isAbsolute,
      category: habit.category || 'mind'
    });
    setShowEditHabitDialog(true);
  };
  
  const saveNewHabit = () => {
    console.log('Saving new habit:', newHabit);
    
    // Generate a unique ID for the new habit
    const newId = `habit-${Date.now()}`;
    
    // Create the new habit with the selected icon
    const newHabitWithIcon: Habit = {
      id: newId,
      title: newHabit.title,
      description: newHabit.description,
      icon: getIconByName(newHabit.icon),
      impact: newHabit.impact,
      effort: newHabit.effort,
      timeCommitment: newHabit.timeCommitment,
      frequency: newHabit.frequency,
      isAbsolute: newHabit.isAbsolute,
      streak: 0,
      category: newHabit.category
    };
    
    // Add the new habit to the habits array
    setHabits(prevHabits => [...prevHabits, newHabitWithIcon]);
    
    // Close the dialog
    setShowAddHabitDialog(false);
    
    // Reset the form
    setNewHabit({
      title: '',
      description: '',
      icon: 'activity',
      impact: 8,
      effort: 3,
      timeCommitment: '10 min',
      frequency: 'daily',
      isAbsolute: false,
      category: 'mind'
    });
  };
  
  const updateHabit = () => {
    if (!habitToEdit) return;
    
    console.log('Updating habit:', habitToEdit, newHabit);
    
    // Update the habit
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitToEdit) {
          return {
            ...habit,
            title: newHabit.title,
            description: newHabit.description,
            icon: getIconByName(newHabit.icon),
            impact: newHabit.impact,
            effort: newHabit.effort,
            timeCommitment: newHabit.timeCommitment,
            frequency: newHabit.frequency,
            isAbsolute: newHabit.isAbsolute,
            category: newHabit.category
          };
        }
        return habit;
      })
    );
    
    // Close the dialog
    setShowEditHabitDialog(false);
    setHabitToEdit(null);
  };
  
  // Find icon component by name
  const getIconByName = (name: string) => {
    switch (name.toLowerCase()) {
      case 'droplets': return <Droplets />;
      case 'brain': return <Brain />;
      case 'dumbbell': return <Dumbbell />;
      case 'bookopen': case 'book': return <BookOpen />;
      case 'users': return <Users />;
      case 'heart': return <Heart />;
      case 'sun': return <Sun />;
      case 'activity': return <Activity />;
      default: return <Activity />;
    }
  };
  
  // Filter habits based on category
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const filteredHabits = habits.filter(habit => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'absolute') return habit.isAbsolute;
    return habit.category === filterCategory;
  });
  
  // Listen for custom 'add-prefilled-habit' events
  useEffect(() => {
    const handleAddPrefilledHabit = (event: any) => {
      const habitData = event.detail;
      console.log('Received prefilled habit:', habitData);
      
      // Set newHabit state with the data received
      setNewHabit({
        title: habitData.title,
        description: habitData.description,
        // Safer access, assuming habitData.icon might be a string key or a ReactNode like object
        icon: typeof habitData.icon === 'string' ? habitData.icon : (habitData.icon?.type?.name?.toLowerCase() || 'activity'),
        impact: habitData.impact || 7,
        effort: habitData.effort || 3,
        timeCommitment: habitData.timeCommitment || '10 min',
        frequency: habitData.frequency as Frequency || 'daily',
        isAbsolute: !!habitData.isAbsolute,
        category: (habitData.category as Category) || 'mind'
      });
      
      // Open the dialog
      setShowAddHabitDialog(true);
    };
    
    // Add the event listener
    document.addEventListener('add-prefilled-habit', handleAddPrefilledHabit);
    
    // Clean up
    return () => {
      document.removeEventListener('add-prefilled-habit', handleAddPrefilledHabit);
    };
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <MoveUp className="h-5 w-5 text-primary" /> 
            High-ROI Habit Tracker
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="calendar" className="text-xs px-3 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Calendar
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs px-3 flex items-center gap-1">
                  <BarChart2 className="h-3.5 w-3.5" /> Stats
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" className="h-8 p-2 flex items-center gap-1 text-xs" onClick={handleAddHabit}>
              <PlusCircle className="h-3.5 w-3.5" /> Add Habit
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 mt-3 overflow-x-auto pb-2">
          <Badge 
            variant={filterCategory === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setFilterCategory('all')}
          >
            All
          </Badge>
          <Badge 
            variant={filterCategory === 'absolute' ? 'default' : 'outline'} 
            className="cursor-pointer" 
            onClick={() => setFilterCategory('absolute')}
          >
            Must-Do
          </Badge>
          <Badge 
            variant={filterCategory === 'health' ? 'default' : 'outline'} 
            className="cursor-pointer bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-200"
            onClick={() => setFilterCategory('health')}
          >
            Health
          </Badge>
          <Badge 
            variant={filterCategory === 'fitness' ? 'default' : 'outline'} 
            className="cursor-pointer bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border-blue-200"
            onClick={() => setFilterCategory('fitness')}
          >
            Fitness
          </Badge>
          <Badge 
            variant={filterCategory === 'mind' ? 'default' : 'outline'} 
            className="cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 border-purple-200"
            onClick={() => setFilterCategory('mind')}
          >
            Mind
          </Badge>
          <Badge 
            variant={filterCategory === 'social' ? 'default' : 'outline'} 
            className="cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border-amber-200"
            onClick={() => setFilterCategory('social')}
          >
            Social
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="calendar" className="mt-0">
          {/* Calendar Week Navigation */}
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="text-xs flex items-center gap-1"
            >
              ← Previous Week
            </Button>
            
            <span className="text-sm font-medium">
              {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="text-xs flex items-center gap-1"
              disabled={weekOffset >= 0}
            >
              Next Week →
            </Button>
          </div>
          
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-center"></div>
            {weekDates.map((date, index) => (
              <div 
                key={index} 
                className={`text-center text-xs p-1 font-medium ${
                  isSameDay(date, today) ? 'bg-primary/10 rounded-md' : ''
                }`}
              >
                {format(date, 'EEE')}
                <div className="text-[10px]">{format(date, 'd')}</div>
              </div>
            ))}
          </div>
          
          {/* Habits with completion checkins */}
          <div className="space-y-1">
            {filteredHabits.map(habit => (
              <div 
                key={habit.id} 
                className={`grid grid-cols-8 gap-1 items-center border-b border-b-muted/60 py-1
                  ${habit.isAbsolute ? 'bg-primary/5' : ''}
                `}
              >
                <div className="flex flex-col justify-center gap-1 relative group">
                  <div className="flex items-center gap-1.5 ml-1 truncate">
                    {React.cloneElement(habit.icon as React.ReactElement, { className: 'h-3.5 w-3.5 shrink-0 text-primary' })}
                    <span className="text-xs font-medium truncate">{habit.title}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 p-0.5 opacity-0 group-hover:opacity-100 absolute -right-1 top-0 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditHabit(habit.id);
                      }}
                    >
                      <Pencil className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex ml-1 gap-1 items-center">
                    {habit.streak && habit.streak > 0 ? (
                      <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] flex items-center gap-0.5 bg-amber-500/10 text-amber-700 border-amber-200">
                        <Star className="h-2.5 w-2.5" /> {habit.streak}
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{habit.timeCommitment}</span>
                    )}
                  </div>
                </div>
                
                {/* Week Day Checkins */}
                {weekDates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-center items-center h-10 rounded-md cursor-pointer transition-colors ${
                      isCompletedOnDate(habit.id, date) 
                        ? habit.isAbsolute ? 'bg-green-500/20' : 'bg-blue-500/20' 
                        : isSameDay(date, today) 
                          ? 'hover:bg-muted/80 bg-muted/50' 
                          : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleCompletion(habit.id, date)}
                  >
                    {isCompletedOnDate(habit.id, date) ? (
                      <CheckCircle2 className={`h-5 w-5 ${habit.isAbsolute ? 'text-green-600' : 'text-blue-600'}`} />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30"></div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <div className="space-y-4">
            {filteredHabits.map(habit => (
              <div 
                key={habit.id} 
                className={`p-4 border rounded-lg ${
                  habit.isAbsolute ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {React.cloneElement(habit.icon as React.ReactElement, { className: 'h-5 w-5' })}
                    <h3 className="font-medium">{habit.title}</h3>
                  </div>
                  <Badge variant={habit.isAbsolute ? 'outline' : 'secondary'} className="px-2 py-0 text-xs">
                    {habit.frequency === 'daily' ? 'Daily' : habit.frequency}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Current Streak</span>
                      <span className="font-medium">{habit.streak || 0} days</span>
                    </div>
                    <Progress value={habit.streak ? Math.min(habit.streak * 10, 100) : 0} className="h-2" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{habit.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>ROI: {(habit.impact / habit.effort * 10).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </CardContent>
      
      {/* Add Habit Dialog */}
      <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
        <DialogContent className="p-0 overflow-hidden">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              saveNewHabit();
            }}
            className="flex flex-col h-full"
          >
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Add New Habit</DialogTitle>
              <DialogDescription>
                Create a custom habit to track. High-ROI activities produce the most results with minimal effort.
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto px-6 py-4 space-y-4 max-h-[60vh]">
              <div>
                <Label htmlFor="habit-title">Habit Title*</Label>
                <Input 
                  id="habit-title"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  placeholder="e.g. Cold Shower, Meditation, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="habit-description">Description</Label>
                <Textarea 
                  id="habit-description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="What is this habit for? What are its benefits?"
                  className="mt-1 h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habit-time">Time Commitment*</Label>
                  <Input 
                    id="habit-time"
                    value={newHabit.timeCommitment}
                    onChange={(e) => setNewHabit({...newHabit, timeCommitment: e.target.value})}
                    placeholder="e.g. 10 min/day"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="habit-frequency">Frequency</Label>
                  <Select
                    value={newHabit.frequency}
                    onValueChange={(value) => setNewHabit({...newHabit, frequency: value as Frequency})}
                  >
                    <SelectTrigger id="habit-frequency" className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="2x-week">2x per Week</SelectItem>
                      <SelectItem value="3x-week">3x per Week</SelectItem>
                      <SelectItem value="4x-week">4x per Week</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habit-icon">Icon</Label>
                  <Select
                    value={newHabit.icon}
                    onValueChange={(value) => setNewHabit({...newHabit, icon: value})}
                  >
                    <SelectTrigger id="habit-icon" className="mt-1">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="brain">Brain</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="droplets">Water</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="sun">Sun</SelectItem>
                      <SelectItem value="users">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="habit-category">Category</Label>
                  <Select
                    value={newHabit.category}
                    onValueChange={(value) => setNewHabit({...newHabit, category: value})}
                  >
                    <SelectTrigger id="habit-category" className="mt-1">
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
                  <Label>Impact (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={newHabit.impact}
                      onChange={(e) => setNewHabit({...newHabit, impact: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="w-6 text-center font-medium">{newHabit.impact}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Effort (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={newHabit.effort}
                      onChange={(e) => setNewHabit({...newHabit, effort: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="w-6 text-center font-medium">{newHabit.effort}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="must-do"
                    checked={newHabit.isAbsolute}
                    onCheckedChange={(checked) => setNewHabit({...newHabit, isAbsolute: checked})}
                  />
                  <Label htmlFor="must-do">Mark as "Must-Do" activity</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-7">
                  Must-do activities are your non-negotiable daily habits
                </p>
              </div>
              
              <div className="bg-secondary/10 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                  <BarChart className="h-4 w-4 text-primary" />
                  ROI Calculator
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Return on Investment:</span>
                  <span className="font-bold text-primary">{(newHabit.impact / newHabit.effort * 10).toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher ROI = more results for less effort
                </p>
              </div>
            </div>
            
            <div className="p-6 pt-3 mt-auto border-t">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddHabitDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Habit
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Habit Dialog */}
      <Dialog open={showEditHabitDialog} onOpenChange={setShowEditHabitDialog}>
        <DialogContent className="p-0 overflow-hidden">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateHabit();
            }}
            className="flex flex-col h-full"
          >
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Edit Habit</DialogTitle>
              <DialogDescription>
                Update your habit details and tracking preferences
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto px-6 py-4 space-y-4 max-h-[60vh]">
              <div>
                <Label htmlFor="edit-habit-title">Habit Title*</Label>
                <Input 
                  id="edit-habit-title"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  placeholder="e.g. Cold Shower, Meditation, etc."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-habit-description">Description</Label>
                <Textarea 
                  id="edit-habit-description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="What is this habit for? What are its benefits?"
                  className="mt-1 h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-habit-time">Time Commitment*</Label>
                  <Input 
                    id="edit-habit-time"
                    value={newHabit.timeCommitment}
                    onChange={(e) => setNewHabit({...newHabit, timeCommitment: e.target.value})}
                    placeholder="e.g. 10 min/day"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-habit-frequency">Frequency</Label>
                  <Select
                    value={newHabit.frequency}
                    onValueChange={(value) => setNewHabit({...newHabit, frequency: value as Frequency})}
                  >
                    <SelectTrigger id="edit-habit-frequency" className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="2x-week">2x per Week</SelectItem>
                      <SelectItem value="3x-week">3x per Week</SelectItem>
                      <SelectItem value="4x-week">4x per Week</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-habit-icon">Icon</Label>
                  <Select
                    value={newHabit.icon}
                    onValueChange={(value) => setNewHabit({...newHabit, icon: value})}
                  >
                    <SelectTrigger id="edit-habit-icon" className="mt-1">
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="brain">Brain</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="droplets">Water</SelectItem>
                      <SelectItem value="heart">Heart</SelectItem>
                      <SelectItem value="sun">Sun</SelectItem>
                      <SelectItem value="users">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-habit-category">Category</Label>
                  <Select
                    value={newHabit.category}
                    onValueChange={(value) => setNewHabit({...newHabit, category: value})}
                  >
                    <SelectTrigger id="edit-habit-category" className="mt-1">
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
                  <Label>Impact (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={newHabit.impact}
                      onChange={(e) => setNewHabit({...newHabit, impact: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="w-6 text-center font-medium">{newHabit.impact}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Effort (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={newHabit.effort}
                      onChange={(e) => setNewHabit({...newHabit, effort: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="w-6 text-center font-medium">{newHabit.effort}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-must-do"
                    checked={newHabit.isAbsolute}
                    onCheckedChange={(checked) => setNewHabit({...newHabit, isAbsolute: checked})}
                  />
                  <Label htmlFor="edit-must-do">Mark as "Must-Do" activity</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-7">
                  Must-do activities are your non-negotiable daily habits
                </p>
              </div>
            </div>
            
            <div className="p-6 pt-3 mt-auto border-t">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditHabitDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Habit
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}