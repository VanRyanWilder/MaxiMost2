import { useState, useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Calendar, Trophy, Settings, Bell, Eye, Paintbrush } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Habit } from "@/types/habit";
import { HabitCompletion } from "@/types/habit-completion";
import { habitSuggestions } from "@/data/habit-data";
import { formatDate } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";

// Demo data for habits - ensure all required properties are set
const absoluteHabits: Habit[] = [
  ...habitSuggestions.health.slice(0, 2).map(habit => ({
    ...habit,
    isAbsolute: true,
    iconColor: habit.iconColor || 'blue'
  })),
  ...habitSuggestions.mind.slice(0, 1).map(habit => ({
    ...habit,
    isAbsolute: true,
    iconColor: habit.iconColor || 'purple'
  }))
];

const additionalHabits: Habit[] = [
  ...habitSuggestions.fitness.slice(0, 1).map(habit => ({
    ...habit,
    iconColor: habit.iconColor || 'red'
  })),
  ...habitSuggestions.mind.slice(1, 2).map(habit => ({
    ...habit,
    iconColor: habit.iconColor || 'blue'
  }))
];

// Generate some sample habit completions for the demo
const generateSampleCompletions = (habits: Habit[]): HabitCompletion[] => {
  const completions: HabitCompletion[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  habits.forEach(habit => {
    // Add some completions in the past 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // More likely to be completed if it's an "absolute" habit
      const completed = Math.random() < (habit.isAbsolute ? 0.85 : 0.5);

      if (completed) {
        completions.push({
          id: `completion-${habit.id}-${date.toISOString()}`,
          habitId: habit.id,
          date: date,
          completed: true
        });
      }
    }
  });

  return completions;
};

// Function to get day name
function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Function to format date as "May 15"
function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format date based on format preference
function formatDateByPreference(date: Date, format: string): string {
  switch(format) {
    case 'short':
      return `${getDayName(date)}, ${date.getDate()}`;
    case 'medium':
      return `${getDayName(date)}, ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`;
    case 'long':
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    default:
      return `${getDayName(date)}, ${date.getDate()}`;
  }
}

// Get an array of dates for a view (Thursday to Wednesday)
function getViewDates(daysBack: number = 3, daysForward: number = 4): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add past days (including today)
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  // Add future days
  for (let i = 1; i <= daysForward - 1; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  return dates;
}

export default function HabitTrackerPage() {
  const allHabits = [...absoluteHabits, ...additionalHabits];
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Settings states
  const [activeTab, setActiveTab] = useState<string>("tracker");
  const [daysVisible, setDaysVisible] = useState<number>(7);
  const [showAbsoluteHabits, setShowAbsoluteHabits] = useState<boolean>(true);
  const [showAdditionalHabits, setShowAdditionalHabits] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("20:00");
  const [theme, setTheme] = useState<string>("blue");
  const [compactView, setCompactView] = useState<boolean>(false);
  const [dateFormat, setDateFormat] = useState<string>("short");

  // Calculate view dates based on days visible setting
  const [viewDates, setViewDates] = useState<Date[]>(() => {
    const pastDays = Math.floor(daysVisible / 2);
    const futureDays = daysVisible - pastDays;
    return getViewDates(pastDays, futureDays);
  });

  // Update view dates when days visible changes
  useEffect(() => {
    const pastDays = Math.floor(daysVisible / 2);
    const futureDays = daysVisible - pastDays;
    setViewDates(getViewDates(pastDays, futureDays));
  }, [daysVisible]);

  // Generate sample completions when the component mounts
  useEffect(() => {
    setCompletions(generateSampleCompletions(allHabits));
  }, []);

  // Handle toggling habit completion status
  const handleToggleCompletion = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    // Check if there's already a completion for this habit on this date
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date.toISOString().split('T')[0] === dateStr
    );

    if (existingIndex >= 0) {
      // Remove the completion if it exists
      setCompletions(prev => {
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        return updated;
      });
    } else {
      // Add a new completion
      const newCompletion: HabitCompletion = {
        id: `completion-${habitId}-${dateStr}`,
        habitId: habitId,
        date: date,
        completed: true
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  // Check if a habit is completed on a specific date
  const isHabitCompleted = (habitId: string, date: Date) => {
    return completions.some(
      (completion) =>
        completion.habitId === habitId &&
        formatDate(new Date(completion.date)) === formatDate(date) &&
        completion.completed
    );
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (completions.filter(c => formatDate(new Date(c.date)) === formatDate(today)).length /
    allHabits.length) * 100
  );

  // Count active habits (those with completions in the past 7 days)
  const activeHabits = new Set(
    completions.filter(c => {
      const date = new Date(c.date);
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).map(c => c.habitId)
  ).size;

  // Calculate current streak
  const dailyStreak = 4; // Mock value, would normally be calculated based on continuous days

  // Stats metrics
  const stats = [
    { title: 'Day Streak', value: 28, icon: '🔥' },
    { title: 'Completion %', value: completionPercentage, icon: '🎯' },
    { title: 'Active Habits', value: activeHabits, icon: '⚡' },
    { title: 'Weekly Streak', value: dailyStreak, icon: '📅' }
  ];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Logo size="medium" />
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Habit Dashboard</Badge>
          </div>

          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-1" />
              Add Habit
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="tracker">Habit Tracker</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="mt-0">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-3xl font-bold">{stat.value}</h3>
                    </div>
                    <div className="text-2xl">{stat.icon}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current Date with Calendar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-lg font-medium">Thursday, May 15</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Absolute Habits */}
            {showAbsoluteHabits && (
              <Card className="mb-6">
                <CardHeader className="py-4 px-6 border-b">
                  <CardTitle className="text-lg font-semibold">Daily Absolute Habits</CardTitle>
                  <span className="text-xs text-gray-500">{absoluteHabits.length} habits</span>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 bg-gray-50">
                        <th className="py-3 px-6 font-medium w-[200px]">Habit</th>
                        {viewDates.map((date, i) => (
                          <th
                            key={i}
                            className={`py-3 px-2 text-center font-medium ${
                              formatDate(date) === formatDate(today) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{getDayName(date)}</span>
                              <span>{date.getDate()}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {absoluteHabits.map((habit, index) => (
                        <tr key={habit.id} className={`${compactView ? 'h-10' : ''} border-b border-gray-100`}>
                          <td className={`${compactView ? 'py-1' : 'py-3'} px-6`}>
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white mr-3`}
                                style={{ backgroundColor: habit.category === 'health' ? '#38BDF8' : '#A78BFA' }}
                              >
                                {habit.category === 'health' ? '💧' : '📖'}
                              </div>
                              <div>
                                <div className="font-medium">{habit.title}</div>
                                <div className="text-xs text-gray-500">{habit.category} · {habit.timeCommitment}</div>
                              </div>
                            </div>
                          </td>
                          {viewDates.map((date, i) => {
                            const isPast = date <= today;
                            const isCompleted = isHabitCompleted(habit.id, date);
                            return (
                              <td key={i} className={`${compactView ? 'py-1' : 'py-3'} px-2 text-center`}>
                                <button
                                  onClick={() => isPast && handleToggleCompletion(habit.id, date)}
                                  className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto ${
                                    isCompleted
                                      ? theme === 'blue' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                      : 'bg-gray-100 text-gray-400'
                                  } ${!isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  disabled={!isPast}
                                >
                                  {isCompleted && <Check className="h-4 w-4" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Additional Habits */}
            {showAdditionalHabits && (
              <Card>
                <CardHeader className="py-4 px-6 border-b">
                  <CardTitle className="text-lg font-semibold">Additional Habits</CardTitle>
                  <span className="text-xs text-gray-500">{additionalHabits.length} habits</span>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 bg-gray-50">
                        <th className="py-3 px-6 font-medium w-[200px]">Habit</th>
                        {viewDates.map((date, i) => (
                          <th
                            key={i}
                            className={`py-3 px-2 text-center font-medium ${
                              formatDate(date) === formatDate(today) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{getDayName(date)}</span>
                              <span>{date.getDate()}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {additionalHabits.map((habit, index) => (
                        <tr key={habit.id} className={`${compactView ? 'h-10' : ''} border-b border-gray-100`}>
                          <td className={`${compactView ? 'py-1' : 'py-3'} px-6`}>
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-white mr-3`}
                                style={{ backgroundColor: habit.category === 'fitness' ? '#EF4444' : '#A78BFA' }}
                              >
                                {habit.category === 'fitness' ? '💪' : '🧘'}
                              </div>
                              <div>
                                <div className="font-medium">{habit.title}</div>
                                <div className="text-xs text-gray-500">{habit.category} · {habit.frequency}</div>
                              </div>
                            </div>
                          </td>
                          {viewDates.map((date, i) => {
                            const isPast = date <= today;
                            const isCompleted = isHabitCompleted(habit.id, date);
                            return (
                              <td key={i} className={`${compactView ? 'py-1' : 'py-3'} px-2 text-center`}>
                                <button
                                  onClick={() => isPast && handleToggleCompletion(habit.id, date)}
                                  className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto ${
                                    isCompleted
                                      ? theme === 'blue' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                      : 'bg-gray-100 text-gray-400'
                                  } ${!isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  disabled={!isPast}
                                >
                                  {isCompleted && <Check className="h-4 w-4" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Daily Motivation Section */}
            <Card className="mt-6">
              <CardHeader className="py-4 px-6 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                <CardTitle className="text-lg font-semibold">Daily Motivation</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <blockquote className="text-gray-600 italic">
                  "The secret of getting ahead is getting started. The secret of getting started is breaking your
                  complex overwhelming tasks into small manageable tasks, and then starting on the first
                  one."
                </blockquote>
                <p className="text-right text-sm text-gray-500 mt-2">- Mark Twain</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Range Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Date Range Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="daysVisible">Days visible in calendar view</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="daysVisible"
                        min={4}
                        max={14}
                        step={1}
                        value={[daysVisible]}
                        onValueChange={(value) => setDaysVisible(value[0])}
                        className="flex-1"
                      />
                      <span className="font-medium text-sm w-6 text-center">{daysVisible}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (Thu, 15)</SelectItem>
                        <SelectItem value="medium">Medium (Thu, May 15)</SelectItem>
                        <SelectItem value="long">Long (Thursday, May 15)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Display Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Eye className="h-5 w-5 mr-2 text-blue-500" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showAbsolute">Show Absolute Habits</Label>
                    <Switch
                      id="showAbsolute"
                      checked={showAbsoluteHabits}
                      onCheckedChange={setShowAbsoluteHabits}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showAdditional">Show Additional Habits</Label>
                    <Switch
                      id="showAdditional"
                      checked={showAdditionalHabits}
                      onCheckedChange={setShowAdditionalHabits}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactView">Compact View</Label>
                    <Switch
                      id="compactView"
                      checked={compactView}
                      onCheckedChange={setCompactView}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Theme Color</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Bell className="h-5 w-5 mr-2 text-blue-500" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <Switch
                      id="enableNotifications"
                      checked={showNotifications}
                      onCheckedChange={setShowNotifications}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Daily Reminder Time</Label>
                    <input
                      type="time"
                      id="reminderTime"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      disabled={!showNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Export/Import Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Paintbrush className="h-5 w-5 mr-2 text-blue-500" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      Export Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      Import Data
                    </Button>
                  </div>

                  <div className="pt-4">
                    <Button variant="destructive" className="w-full">
                      Reset All Habits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}