import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, subDays, differenceInDays, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday } from "date-fns";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { 
  Award, 
  Flame, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  TrendingUp,
  Calendar,
  Activity,
  ChevronRight,
  CircleCheck,
  CircleX
} from "lucide-react";
import type { Habit, HabitCompletion } from "@/types/habit";

interface ProgressDashboardProps {
  habits: Habit[];
  completions: HabitCompletion[];
  timeframe?: 'week' | 'month' | 'year';
}

export function ProgressDashboard({ habits, completions, timeframe = 'week' }: ProgressDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>(timeframe);
  
  // Calculate stats based on habits and completions
  const stats = useMemo(() => {
    if (habits.length === 0) {
      return {
        totalHabits: 0,
        activeHabits: 0,
        completionRate: 0,
        streakCount: 0,
        maxStreak: 0,
        trendDirection: 'neutral',
        trendPercentage: 0,
        categoryBreakdown: [],
        recentActivity: [],
        dailyProgress: []
      };
    }
    
    // Get date ranges based on selected timeframe
    const today = new Date();
    let startDate = today;
    let endDate = today;
    let dateRange = 7;
    
    if (selectedTimeframe === 'week') {
      startDate = startOfWeek(today, { weekStartsOn: 1 });
      endDate = endOfWeek(today, { weekStartsOn: 1 });
      dateRange = 7;
    } else if (selectedTimeframe === 'month') {
      startDate = startOfMonth(today);
      endDate = endOfMonth(today);
      dateRange = differenceInDays(endDate, startDate) + 1;
    } else {
      startDate = subDays(today, 365);
      endDate = today;
      dateRange = 12; // We'll use months for yearly view
    }
    
    // Filter completions within the selected timeframe
    const filteredCompletions = completions.filter(completion => {
      const completionDate = new Date(completion.date);
      return isWithinInterval(completionDate, { start: startDate, end: endDate });
    });
    
    // Calculate completion rate
    const totalPossibleCompletions = habits.length * dateRange;
    const totalCompletions = filteredCompletions.filter(c => c.completed).length;
    const completionRate = totalPossibleCompletions > 0 
      ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
      : 0;
    
    // Calculate active habits (completed at least once in the timeframe)
    const activeHabitIds = new Set(filteredCompletions.filter(c => c.completed).map(c => c.habitId));
    const activeHabits = activeHabitIds.size;
    
    // Calculate streaks
    const maxStreak = Math.max(...habits.map(h => h.streak), 0);
    const streakCount = habits.filter(h => h.streak > 0).length;
    
    // Calculate trend (compared to previous period)
    const previousStartDate = subDays(startDate, dateRange);
    const previousEndDate = subDays(endDate, dateRange);
    
    const previousCompletions = completions.filter(completion => {
      const completionDate = new Date(completion.date);
      return isWithinInterval(completionDate, { start: previousStartDate, end: previousEndDate });
    });
    
    const previousTotalCompletions = previousCompletions.filter(c => c.completed).length;
    const previousCompletionRate = totalPossibleCompletions > 0 
      ? Math.round((previousTotalCompletions / totalPossibleCompletions) * 100)
      : 0;
    
    const trendDirection = completionRate > previousCompletionRate 
      ? 'up' 
      : completionRate < previousCompletionRate 
        ? 'down' 
        : 'neutral';
    
    const trendPercentage = previousCompletionRate > 0 
      ? Math.round(((completionRate - previousCompletionRate) / previousCompletionRate) * 100)
      : 0;
    
    // Calculate category breakdown
    const categoryCounts: Record<string, number> = {};
    habits.forEach(habit => {
      const category = habit.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const categoryBreakdown = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    // Get recent activity (last 5 completions)
    const recentActivity = [...filteredCompletions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(completion => {
        const habit = habits.find(h => h.id === completion.habitId);
        return {
          habitId: completion.habitId,
          habitTitle: habit?.title || 'Unknown Habit',
          date: completion.date,
          completed: completion.completed,
          category: habit?.category || 'unknown'
        };
      });
    
    // Generate daily progress for chart
    const dailyProgress = Array.from({ length: dateRange }).map((_, i) => {
      let date: Date;
      let label: string;
      
      if (selectedTimeframe === 'year') {
        // For yearly view, use months
        date = new Date(today.getFullYear(), i, 1);
        label = format(date, 'MMM');
      } else {
        // For weekly/monthly view, use days
        date = subDays(endDate, dateRange - i - 1);
        label = format(date, 'd MMM');
      }
      
      // Count completions for this day/month
      const dateCompletions = completions.filter(c => {
        const completionDate = new Date(c.date);
        if (selectedTimeframe === 'year') {
          // For yearly view, compare months
          return completionDate.getMonth() === date.getMonth() && completionDate.getFullYear() === date.getFullYear();
        } else {
          // For weekly/monthly view, compare days
          return completionDate.getDate() === date.getDate() && 
                 completionDate.getMonth() === date.getMonth() && 
                 completionDate.getFullYear() === date.getFullYear();
        }
      });
      
      const completed = dateCompletions.filter(c => c.completed).length;
      const total = habits.length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        name: label,
        total,
        completed,
        rate: completionRate,
        isToday: isToday(date)
      };
    });
    
    return {
      totalHabits: habits.length,
      activeHabits,
      completionRate,
      streakCount,
      maxStreak,
      trendDirection,
      trendPercentage,
      categoryBreakdown,
      recentActivity,
      dailyProgress
    };
  }, [habits, completions, selectedTimeframe]);
  
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#6b7280'];
  
  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Habit Progress Dashboard</CardTitle>
          <CardDescription>
            Track your habit completion and progress metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium mb-2">No habit data available</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Add some habits and start tracking your progress to see detailed analytics and insights here.
          </p>
          <Button variant="outline">
            Add Your First Habit
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Habit Progress Dashboard</CardTitle>
            <CardDescription>
              Track your habit completion and progress metrics
            </CardDescription>
          </div>
          <Tabs
            value={selectedTimeframe}
            onValueChange={(v) => setSelectedTimeframe(v as 'week' | 'month' | 'year')}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* High-level Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{stats.completionRate}%</span>
                {stats.trendDirection !== 'neutral' && (
                  <Badge variant={stats.trendDirection === 'up' ? 'outline' : 'secondary'} className={`flex items-center text-xs h-5 px-1.5 ${stats.trendDirection === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                    {stats.trendDirection === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {Math.abs(stats.trendPercentage)}%
                  </Badge>
                )}
              </div>
              <Progress value={stats.completionRate} className="h-1 mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">Habits Tracked</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{stats.totalHabits}</span>
                <Badge variant="outline" className="text-xs h-5 px-1.5 bg-blue-50 text-blue-600">
                  {stats.activeHabits} active
                </Badge>
              </div>
              <Progress value={(stats.activeHabits / stats.totalHabits) * 100} className="h-1 mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">Longest Streak</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{stats.maxStreak} 
                  <span className="text-sm text-muted-foreground font-normal ml-1">days</span>
                </span>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex space-x-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${i < Math.min(5, (stats.maxStreak / 2)) ? 'bg-orange-500' : 'bg-orange-100'}`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">Habits with Streaks</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{stats.streakCount}
                  <span className="text-sm text-muted-foreground font-normal ml-1">of {stats.totalHabits}</span>
                </span>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex space-x-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${i < Math.min(5, (stats.streakCount / stats.totalHabits) * 5) ? 'bg-amber-500' : 'bg-amber-100'}`}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Completion Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Habit Completion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.dailyProgress}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    fontSize={11} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Completion Rate']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Category Breakdown & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Habit Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-4">
              <div className="h-[180px] w-full max-w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {stats.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [value, 'Habits']}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {stats.categoryBreakdown.map((category, index) => (
                  <Badge key={index} variant="outline" style={{ 
                    backgroundColor: `${COLORS[index % COLORS.length]}20`, 
                    color: COLORS[index % COLORS.length],
                    borderColor: COLORS[index % COLORS.length]
                  }}>
                    {category.name}: {category.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${activity.completed ? 'bg-green-100' : 'bg-red-100'}`}>
                        {activity.completed ? (
                          <CircleCheck className="h-4 w-4 text-green-600" /> 
                        ) : (
                          <CircleX className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">{activity.habitTitle}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.date), 'dd MMM')}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {activity.category} habit
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No recent activity found</p>
                  </div>
                )}
              </div>
              
              {stats.recentActivity.length > 0 && (
                <Button
                  variant="ghost"
                  className="w-full mt-4 h-8 text-xs"
                >
                  View Full Activity Log
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}