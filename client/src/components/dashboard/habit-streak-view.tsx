import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, subDays, isSameDay, startOfWeek, addDays } from 'date-fns';
import { 
  BarChart, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  Settings, 
  TrendingUp, 
  Award, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Types from high-roi-activities.tsx
type Frequency = "daily" | "weekly" | "custom" | "2x-week" | "3x-week" | "4x-week";

type HighRoiActivity = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: string;
  frequency: Frequency;
  isAbsolute: boolean; // If true, this is a "must-do" activity
  lastCompleted?: Date | null;
  streak?: number;
  type?: "principle" | "custom" | "default"; // Used to identify types of habits
  principle?: string; // For daily principle activities
  category?: string; // Health, Fitness, Mind, Social
};

type CompletedActivity = {
  id: string;
  date: Date;
};

type HabitStreakViewProps = {
  activities: HighRoiActivity[];
  completedActivities: CompletedActivity[];
  onCompleteActivity: (id: string) => void;
  onAddHabit: () => void;
  onShowStats: (habitId: string) => void;
  onEditHabit: (habitId: string) => void;
};

export const HabitStreakView: React.FC<HabitStreakViewProps> = ({
  activities,
  completedActivities,
  onCompleteActivity,
  onAddHabit,
  onShowStats,
  onEditHabit
}) => {
  const [selectedTab, setSelectedTab] = React.useState('all');
  const [weekOffset, setWeekOffset] = React.useState(0);
  
  // Generate dates for last 7 days
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday as start of week
  
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    return addDays(startOfCurrentWeek, i + (weekOffset * 7));
  });
  
  // Helper to check if activity was completed on a specific date
  const isCompletedOnDate = (activityId: string, date: Date): boolean => {
    return completedActivities.some(
      completed => completed.id === activityId && isSameDay(new Date(completed.date), date)
    );
  };
  
  // Filter activities based on selected tab
  const filteredActivities = activities.filter(activity => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'health') return activity.category === 'health';
    if (selectedTab === 'fitness') return activity.category === 'fitness';
    if (selectedTab === 'mind') return activity.category === 'mind';
    if (selectedTab === 'social') return activity.category === 'social';
    return true;
  });
  
  // Group activities by absolute vs optional
  const absoluteActivities = filteredActivities.filter(a => a.isAbsolute);
  const optionalActivities = filteredActivities.filter(a => !a.isAbsolute);
  
  // Calculate streak for each activity
  const calculateStreak = (activityId: string): number => {
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      if (isCompletedOnDate(activityId, currentDate)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Habit Streaks
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onAddHabit}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-2 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="health" className="text-xs">Health</TabsTrigger>
            <TabsTrigger value="fitness" className="text-xs">Fitness</TabsTrigger>
            <TabsTrigger value="mind" className="text-xs">Mind</TabsTrigger>
            <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="flex items-center gap-1 text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <span className="text-sm font-medium">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
            className="flex items-center gap-1 text-xs"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="text-center text-xs p-1 font-medium"></div>
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
        
        {/* Must-Do Activities */}
        {absoluteActivities.length > 0 && (
          <>
            <div className="my-2 px-1 py-1 bg-primary/5 rounded text-xs font-medium">
              Daily Must-Do Habits
            </div>
            <div className="space-y-1 mb-2">
              {absoluteActivities.map(activity => (
                <div key={activity.id} className="grid grid-cols-8 gap-1 items-center border-b border-b-muted/60 py-1">
                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-1.5 ml-1 truncate">
                      {React.cloneElement(activity.icon, { className: 'h-3.5 w-3.5 shrink-0 text-primary' })}
                      <span className="text-xs font-medium truncate">{activity.title}</span>
                    </div>
                    <div className="flex ml-1 gap-1 items-center">
                      {activity.streak && activity.streak > 3 ? (
                        <Badge variant="outline" className="px-1 py-0 h-4 text-[10px] flex items-center gap-0.5 bg-amber-500/10 text-amber-700 border-amber-200">
                          <Award className="h-2.5 w-2.5" /> {activity.streak || calculateStreak(activity.id)}
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">{activity.timeCommitment}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Week Day Checkins */}
                  {weekDates.map((date, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-center items-center h-10 rounded-md cursor-pointer transition-colors ${
                        isCompletedOnDate(activity.id, date) 
                          ? 'bg-green-500/20' 
                          : isSameDay(date, today) 
                            ? 'bg-primary/5 hover:bg-primary/10' 
                            : 'hover:bg-muted'
                      }`}
                      onClick={() => isSameDay(date, today) && onCompleteActivity(activity.id)}
                    >
                      {isCompletedOnDate(activity.id, date) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className={`h-5 w-5 rounded-full border ${
                          isSameDay(date, today) ? 'border-primary' : 'border-muted-foreground/30'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Optional Activities */}
        {optionalActivities.length > 0 && (
          <>
            <div className="my-2 px-1 py-1 bg-secondary/10 rounded text-xs font-medium">
              Flexible Habits
            </div>
            <div className="space-y-1">
              {optionalActivities.map(activity => (
                <div key={activity.id} className="grid grid-cols-8 gap-1 items-center border-b border-b-muted/60 py-1">
                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-1.5 ml-1 truncate">
                      {React.cloneElement(activity.icon, { className: 'h-3.5 w-3.5 shrink-0 text-primary' })}
                      <span className="text-xs font-medium truncate">{activity.title}</span>
                    </div>
                    <div className="flex ml-1 gap-1 items-center">
                      <span className="text-[10px] text-muted-foreground">
                        {activity.frequency === 'daily' ? 'Daily' :
                         activity.frequency === 'weekly' ? 'Weekly' :
                         activity.frequency === '2x-week' ? '2× week' :
                         activity.frequency === '3x-week' ? '3× week' :
                         activity.frequency === '4x-week' ? '4× week' : 'Custom'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Week Day Checkins */}
                  {weekDates.map((date, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-center items-center h-10 rounded-md cursor-pointer transition-colors ${
                        isCompletedOnDate(activity.id, date) 
                          ? 'bg-blue-500/20' 
                          : isSameDay(date, today) 
                            ? 'bg-primary/5 hover:bg-primary/10' 
                            : 'hover:bg-muted'
                      }`}
                      onClick={() => isSameDay(date, today) && onCompleteActivity(activity.id)}
                    >
                      {isCompletedOnDate(activity.id, date) ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      ) : (
                        <div className={`h-5 w-5 rounded-full border ${
                          isSameDay(date, today) ? 'border-primary' : 'border-muted-foreground/30'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};