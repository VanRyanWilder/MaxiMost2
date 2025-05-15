import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  CheckSquare,
  Award,
  Plus
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

// Types that mirror the ones in unified-habits.tsx
type HabitFrequency = "daily" | "weekly" | "2x-week" | "3x-week" | "4x-week" | "custom";
type HabitCategory = "health" | "fitness" | "mind" | "social" | "custom";

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  impact: number;
  effort: number;
  timeCommitment: string;
  frequency: HabitFrequency;
  isAbsolute: boolean;
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
    case 'brain': return <span className="bg-purple-100 text-purple-600 p-1 rounded-md">🧠</span>;
    case 'activity': return <span className="bg-red-100 text-red-600 p-1 rounded-md">📈</span>;
    case 'dumbbell': return <span className="bg-green-100 text-green-600 p-1 rounded-md">💪</span>;
    case 'bookopen': return <span className="bg-blue-100 text-blue-600 p-1 rounded-md">📚</span>;
    case 'heart': return <span className="bg-pink-100 text-pink-600 p-1 rounded-md">❤️</span>;
    case 'droplets': return <span className="bg-cyan-100 text-cyan-600 p-1 rounded-md">💧</span>;
    case 'sun': return <span className="bg-amber-100 text-amber-600 p-1 rounded-md">☀️</span>;
    case 'users': return <span className="bg-indigo-100 text-indigo-600 p-1 rounded-md">👥</span>;
    case 'checkcircle': return <span className="bg-teal-100 text-teal-600 p-1 rounded-md">✓</span>;
    default: return <span className="bg-gray-100 text-gray-600 p-1 rounded-md">📝</span>;
  }
};

// Sample data (same as in unified-habits.tsx)
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

export function DashboardHabits() {
  const { toast } = useToast();
  const [habits] = useState<Habit[]>(initialHabits);
  const [completions, setCompletions] = useState<HabitCompletion[]>(initialCompletions);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  
  // Filter to show only top 5 habits
  const sortedHabits = [...habits]
    .sort((a, b) => {
      // First, sort by absolute (must-do) first
      if (a.isAbsolute && !b.isAbsolute) return -1;
      if (!a.isAbsolute && b.isAbsolute) return 1;
      // Then by impact score
      return b.impact - a.impact;
    })
    .slice(0, 5); // Only show top 5 habits
  
  // Generate dates for this week
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start with Monday
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
  
  // Check if a habit was completed on a specific date
  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    return completions.some(
      completion => completion.habitId === habitId && 
                  isSameDay(completion.date, date) && 
                  completion.completed
    );
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
    }
    
    // Show toast
    toast({
      title: isCompleted ? "Habit marked as incomplete" : "Habit completed!",
      description: isCompleted ? "Your progress has been updated" : "Great job! Keep building that streak!",
      variant: isCompleted ? "destructive" : "default",
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant={activeView === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveView('list')}
              className="h-8 px-3"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button 
              variant={activeView === 'calendar' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveView('calendar')}
              className="h-8 px-3"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
          
          <a href="/habits" className="text-xs text-primary hover:underline flex items-center">
            <Plus className="h-3 w-3 mr-1" />
            Add habit
          </a>
        </div>
        
        {/* List View */}
        {activeView === 'list' && (
          <div className="space-y-2">
            {sortedHabits.map((habit) => (
              <div key={habit.id} className="flex items-center p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                <Checkbox 
                  checked={isHabitCompletedOnDate(habit.id, new Date())}
                  onCheckedChange={() => toggleHabitCompletion(habit.id, new Date())}
                  className="mr-2"
                />
                
                <div className="flex items-center gap-2 flex-1">
                  {getIconComponent(habit.icon)}
                  <span className={`font-medium text-sm ${isHabitCompletedOnDate(habit.id, new Date()) ? 'line-through opacity-60' : ''}`}>
                    {habit.title}
                  </span>
                </div>
                
                {habit.streak > 0 && (
                  <Badge variant="outline" className="ml-2 gap-1 text-xs">
                    <Award className="h-3 w-3" />
                    {habit.streak}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div>
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className=""></div>
              {weekDates.map((date, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium">
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-xs rounded-full w-5 h-5 flex items-center justify-center mx-auto ${
                    isSameDay(date, new Date()) ? 'bg-primary text-white' : 'text-gray-500'
                  }`}>
                    {format(date, 'd')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              {sortedHabits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
                  <div className="flex items-center gap-1 max-w-[100px]">
                    {getIconComponent(habit.icon)}
                    <span className="text-xs font-medium truncate">{habit.title}</span>
                  </div>
                  
                  {weekDates.map((date, index) => (
                    <div key={index} className="flex justify-center">
                      <Checkbox
                        checked={isHabitCompletedOnDate(habit.id, date)}
                        onCheckedChange={() => toggleHabitCompletion(habit.id, date)}
                        className={`h-4 w-4 ${
                          isHabitCompletedOnDate(habit.id, date) 
                            ? 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600' 
                            : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}