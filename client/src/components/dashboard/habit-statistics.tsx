import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  BarChart2,
  Calendar, 
  Activity,
  TrendingUp, 
  Award, 
  LineChart,
  Timer,
  CheckCircle2
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, subDays, differenceInDays } from 'date-fns';

type HabitStatisticsProps = {
  habitTitle: string;
  habitIcon: JSX.Element;
  completionData: {
    dates: Date[];
    completed: boolean[];
  };
  longestStreak: number;
  currentStreak: number;
  totalCompletions: number;
  successRate: number;
  impact: number;
  effort: number;
};

export const HabitStatistics: React.FC<HabitStatisticsProps> = ({
  habitTitle,
  habitIcon,
  completionData,
  longestStreak,
  currentStreak,
  totalCompletions,
  successRate,
  impact,
  effort
}) => {
  const [viewMode, setViewMode] = React.useState('month');
  
  // Calculate ROI score
  const roiScore = (impact / effort * 10).toFixed(1);
  
  // Generate a visual representation of the month with completion status
  const today = new Date();
  const startOfThisMonth = startOfMonth(today);
  const daysInCurrentView = viewMode === 'month' ? 30 : 7;
  
  // Calculate success rate
  const weekSuccessRate = Math.round(
    (completionData.completed.slice(0, 7).filter(Boolean).length / 7) * 100
  );
  
  const monthSuccessRate = Math.round(
    (completionData.completed.slice(0, 30).filter(Boolean).length / 30) * 100
  );
  
  // Mock data for day-by-day display (would be calculated from actual completionData)
  const dayBlocks = Array.from({ length: daysInCurrentView }).map((_, index) => {
    const date = subDays(today, daysInCurrentView - 1 - index);
    const isCompleted = completionData.completed[daysInCurrentView - 1 - index];
    
    return { date, isCompleted };
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            {React.cloneElement(habitIcon, { className: 'h-5 w-5 text-primary' })}
            <span>{habitTitle}</span>
          </CardTitle>
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs px-3">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" /> Current Streak
            </div>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-xs text-primary mt-1">days</div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Award className="h-3.5 w-3.5" /> Longest Streak
            </div>
            <div className="text-2xl font-bold">{longestStreak}</div>
            <div className="text-xs text-primary mt-1">days</div>
          </div>
          
          <div className="bg-primary/5 rounded-lg p-3 flex flex-col items-center justify-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Success Rate
            </div>
            <div className="text-2xl font-bold">{viewMode === 'week' ? weekSuccessRate : monthSuccessRate}%</div>
            <div className="text-xs text-primary mt-1">completion rate</div>
          </div>
        </div>
        
        {/* Calendar View */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {viewMode === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
          </h3>
          
          <div className="grid grid-cols-15 gap-1">
            {dayBlocks.map((day, index) => (
              <div 
                key={index}
                className={`h-8 rounded-md flex items-center justify-center ${
                  day.isCompleted 
                    ? 'bg-green-500/20' 
                    : 'bg-muted/30'
                }`}
                title={format(day.date, 'MMM d, yyyy')}
              >
                {day.isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Analytics */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            Analytics
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">Total Completions</span>
                <span className="text-xs font-medium">{totalCompletions}</span>
              </div>
              <Progress value={Math.min(totalCompletions/100 * 100, 100)} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">Consistency</span>
                <span className="text-xs font-medium">{successRate}%</span>
              </div>
              <Progress value={successRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">ROI Score</span>
                <span className="text-xs font-medium">{roiScore}/10</span>
              </div>
              <Progress value={parseFloat(roiScore) * 10} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};