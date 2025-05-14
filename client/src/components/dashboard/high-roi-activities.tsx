import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BookOpen, 
  AlertTriangle, 
  Activity, 
  Brain, 
  Sun, 
  MoveUp,
  Check,
  Star,
  Clock,
  Calendar,
  Edit,
  Save,
  Plus,
  CheckCircle,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Trash2,
  PlusCircle,
  Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
};

type CompletedActivity = {
  id: string;
  date: Date;
};

type DailyPlan = {
  id: string;
  date: string; // ISO string format
  activityIds: string[];
};

type PrincipleContent = {
  id: number;
  title: string;
  author: string;
  content: string;
  source: string;
};

export function HighRoiActivities() {
  // Daily principles summaries
  const principleSummaries: PrincipleContent[] = [
    {
      id: 1,
      title: "Discipline Equals Freedom",
      author: "Jocko Willink",
      content: "The more discipline you have to do what you don't want to do, the more freedom you'll have to do what you want to do. Wake up early, train hard, and stick to your routines to build true freedom in your life.",
      source: "Discipline Equals Freedom: Field Manual"
    },
    {
      id: 2,
      title: "Don't Count on Motivation",
      author: "David Goggins",
      content: "Motivation is fleeting and unreliable. Discipline and consistency are what produce results. Get comfortable being uncomfortable and push through resistance when motivation fades.",
      source: "Can't Hurt Me"
    },
    {
      id: 3,
      title: "The 1% Rule",
      author: "James Clear",
      content: "Improve by just 1% each day and you'll end up with results that are nearly 37 times better after one year. Small, consistent improvements compound dramatically over time.",
      source: "Atomic Habits"
    },
    {
      id: 4,
      title: "The Dichotomy of Leadership",
      author: "Jocko Willink",
      content: "Balance is essential in leadership - be aggressive but not reckless, confident but not cocky, and attentive to details without getting lost in them. Find the balance in all aspects of life.",
      source: "The Dichotomy of Leadership"
    },
    {
      id: 5,
      title: "The Cookie Jar Method",
      author: "David Goggins",
      content: "When facing challenges, mentally reach into your 'cookie jar' of past accomplishments and difficult situations you've overcome. Use these memories as fuel to push through current obstacles.",
      source: "Can't Hurt Me"
    },
  ];
  
  // Get today's principle based on date
  const getTodaysPrinciple = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return principleSummaries[dayOfYear % principleSummaries.length];
  };
  
  // Initial activities data
  const defaultActivities: HighRoiActivity[] = [
    {
      id: "sleep",
      title: "Prioritize Sleep",
      description: "7-9 hours of quality sleep enhances cognition, recovery, and hormone balance.",
      icon: <Brain className="h-8 w-8 text-indigo-500" />,
      impact: 10,
      effort: 3,
      timeCommitment: "7-9 hrs/day",
      frequency: "daily",
      isAbsolute: true,
      streak: 3,
      type: "default"
    },
    {
      id: "sugar",
      title: "Eliminate Sugar",
      description: "Cutting refined sugar reduces inflammation and stabilizes energy.",
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      impact: 9,
      effort: 6,
      timeCommitment: "Ongoing",
      frequency: "daily",
      isAbsolute: false,
      streak: 1,
      type: "default"
    },
    {
      id: "sunlight",
      title: "Morning Sunlight",
      description: "10-15 minutes of morning sunlight regulates circadian rhythm and boosts mood.",
      icon: <Sun className="h-8 w-8 text-amber-500" />,
      impact: 8,
      effort: 1,
      timeCommitment: "10-15 min/day",
      frequency: "daily",
      isAbsolute: true,
      streak: 5,
      type: "default"
    },
    {
      id: "strength",
      title: "Strength Training",
      description: "2-3 weekly sessions build muscle, bone density, and metabolic health.",
      icon: <Activity className="h-8 w-8 text-green-500" />,
      impact: 9,
      effort: 5,
      timeCommitment: "2-3 hrs/week",
      frequency: "3x-week",
      isAbsolute: false,
      streak: 2,
      type: "default"
    },
    {
      id: "daily-principle",
      title: "Daily Principle",
      description: "Read and reflect on today's principle from top performers and authors.",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      impact: 8,
      effort: 2,
      timeCommitment: "5 min/day",
      frequency: "daily",
      isAbsolute: true,
      streak: 7,
      type: "principle",
      principle: getTodaysPrinciple().title
    }
  ];
  
  // State for activities and completed activities
  const [activities, setActivities] = useState<HighRoiActivity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
  const [editMode, setEditMode] = useState(false);
  
  // State for daily plans
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  // Dialog states
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('high-roi-activities');
    const savedCompletedActivities = localStorage.getItem('completed-activities');
    const savedDailyPlans = localStorage.getItem('daily-activity-plans');
    
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      setActivities(defaultActivities);
    }
    
    if (savedCompletedActivities) {
      // Parse dates correctly
      const parsedCompleted = JSON.parse(savedCompletedActivities).map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
      setCompletedActivities(parsedCompleted);
    }
    
    if (savedDailyPlans) {
      setDailyPlans(JSON.parse(savedDailyPlans));
    } else {
      // Create a default plan for today if none exists
      const today = format(new Date(), 'yyyy-MM-dd');
      const absoluteActivities = defaultActivities
        .filter(a => a.isAbsolute)
        .map(a => a.id);
      
      setDailyPlans([{
        id: 'default-plan',
        date: today,
        activityIds: absoluteActivities
      }]);
    }
    
    // Set selected activities for today's plan
    updateSelectedActivitiesForDate(format(new Date(), 'yyyy-MM-dd'));
    
  }, []);
  
  // Update selected activities when date changes
  const updateSelectedActivitiesForDate = (date: string) => {
    const plan = dailyPlans.find(p => p.date === date);
    
    if (plan) {
      setSelectedActivities(plan.activityIds);
    } else {
      // If no plan exists, select absolute activities by default
      const absoluteActivities = activities
        .filter(a => a.isAbsolute)
        .map(a => a.id);
      
      setSelectedActivities(absoluteActivities);
    }
  };
  
  // Save data to localStorage when it changes
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('high-roi-activities', JSON.stringify(activities));
    }
  }, [activities]);
  
  useEffect(() => {
    if (completedActivities.length > 0) {
      localStorage.setItem('completed-activities', JSON.stringify(completedActivities));
    }
  }, [completedActivities]);
  
  useEffect(() => {
    if (dailyPlans.length > 0) {
      localStorage.setItem('daily-activity-plans', JSON.stringify(dailyPlans));
    }
  }, [dailyPlans]);
  
  // Handle date change
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    updateSelectedActivitiesForDate(newDate);
  };
  
  // Toggle activity selection for plan
  const toggleActivitySelection = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };
  
  // Save current plan
  const saveCurrentPlan = () => {
    const existingPlanIndex = dailyPlans.findIndex(p => p.date === selectedDate);
    
    if (existingPlanIndex >= 0) {
      // Update existing plan
      setDailyPlans(prev => prev.map((plan, index) => 
        index === existingPlanIndex
          ? { ...plan, activityIds: selectedActivities }
          : plan
      ));
    } else {
      // Create new plan
      setDailyPlans(prev => [
        ...prev,
        {
          id: `plan-${Date.now()}`,
          date: selectedDate,
          activityIds: selectedActivities
        }
      ]);
    }
    
    setPlanDialogOpen(false);
  };

  // Sort activities by ROI (impact divided by effort) and absolute status
  const sortedActivities = [...activities].sort((a, b) => {
    // First sort by absolute status
    if (a.isAbsolute && !b.isAbsolute) return -1;
    if (!a.isAbsolute && b.isAbsolute) return 1;
    
    // Then sort by ROI
    return (b.impact / b.effort) - (a.impact / a.effort);
  });
  
  // Get today's plan activities
  const todaysPlanActivities = activities.filter(activity => 
    selectedActivities.includes(activity.id)
  );
  
  // Get available activities (not in today's plan)
  const availableActivities = activities.filter(activity => 
    !selectedActivities.includes(activity.id)
  );
  
  // Check if activity was completed today
  const isCompletedToday = (activityId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return completedActivities.some(completed => 
      completed.id === activityId && 
      new Date(completed.date).setHours(0, 0, 0, 0) === today.getTime()
    );
  };
  
  // Handle marking activity as complete
  const handleCompleteActivity = (activityId: string) => {
    // Check if already completed today
    if (isCompletedToday(activityId)) {
      // Remove completion
      setCompletedActivities(prev => 
        prev.filter(item => 
          !(item.id === activityId && 
            new Date(item.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0))
        )
      );
      
      // Update streak (decrease)
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, streak: (activity.streak || 0) > 0 ? (activity.streak || 0) - 1 : 0 } 
            : activity
        )
      );
    } else {
      // Add completion
      setCompletedActivities(prev => 
        [...prev, { id: activityId, date: new Date() }]
      );
      
      // Update streak (increase)
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, streak: (activity.streak || 0) + 1 } 
            : activity
        )
      );
    }
  };
  
  // Toggle absolute status for an activity
  const toggleAbsolute = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, isAbsolute: !activity.isAbsolute } 
          : activity
      )
    );
  };
  
  // Change frequency for an activity
  const changeFrequency = (activityId: string, frequency: Frequency) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, frequency } 
          : activity
      )
    );
  };
  
  // Get absolute and non-absolute activities
  const absoluteActivities = todaysPlanActivities.filter(a => a.isAbsolute);
  const optionalActivities = todaysPlanActivities.filter(a => !a.isAbsolute);
  
  // Calculate completion percentage
  const completedCount = todaysPlanActivities.filter(a => isCompletedToday(a.id)).length;
  const completionPercentage = todaysPlanActivities.length > 0 
    ? Math.round((completedCount / todaysPlanActivities.length) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Today's High ROI Activities <MoveUp className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Customized plan for {format(new Date(selectedDate), 'EEEE, MMMM d')}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPlanDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <ListFilter className="h-4 w-4" />
              Customize Plan
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-1.5">
            <div className="text-sm font-medium">Today's Progress</div>
            <div className="text-sm">{completedCount}/{todaysPlanActivities.length} completed</div>
          </div>
          <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      
        {todaysPlanActivities.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-3">No activities planned for today</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPlanDialogOpen(true)}
              className="flex items-center mx-auto gap-1"
            >
              <Plus className="h-4 w-4" />
              Create Daily Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Absolute Activities */}
            {absoluteActivities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <h3 className="font-medium">Must-Do Activities</h3>
                </div>
                <div className="space-y-3">
                  {absoluteActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex-shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-base">{activity.title}</h3>
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="bg-secondary/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timeCommitment}
                          </div>
                          {activity.streak && activity.streak > 0 && (
                            <div className="text-xs font-medium text-primary flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {activity.streak} day streak
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Checkbox 
                          className="h-6 w-6 border-2" 
                          checked={isCompletedToday(activity.id)} 
                          onCheckedChange={() => handleCompleteActivity(activity.id)}
                        />
                        <div className="text-xs text-muted-foreground mt-1">Done</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Optional Activities */}
            {optionalActivities.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  <h3 className="font-medium">Additional Activities</h3>
                </div>
                <div className="space-y-3">
                  {optionalActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-border">
                      <div className="flex-shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-base">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="bg-secondary/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timeCommitment}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            ROI: <span className="font-medium text-primary">{(activity.impact / activity.effort * 10).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Checkbox 
                          className="h-6 w-6 border-2" 
                          checked={isCompletedToday(activity.id)} 
                          onCheckedChange={() => handleCompleteActivity(activity.id)}
                        />
                        <div className="text-xs text-muted-foreground mt-1">Done</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Activity Plan Dialog */}
        <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Customize Your Daily Plan</DialogTitle>
              <DialogDescription>
                Select which activities you want to include in your plan for {format(new Date(selectedDate), 'EEEE, MMMM d')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-2">
              <Label>Date</Label>
              <div className="mt-1">
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)} 
                  className="w-full rounded-md border border-border px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Selected Activities</h4>
                <span className="text-xs text-muted-foreground">{selectedActivities.length} selected</span>
              </div>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto p-1">
                {selectedActivities.length === 0 ? (
                  <div className="text-center py-3 border border-dashed rounded-md text-sm text-muted-foreground">
                    No activities selected
                  </div>
                ) : (
                  sortedActivities
                    .filter(a => selectedActivities.includes(a.id))
                    .map(activity => (
                      <div key={activity.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0">
                            {React.cloneElement(activity.icon, { className: 'w-5 h-5' })}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{activity.title}</div>
                            <div className="text-xs text-muted-foreground">{activity.timeCommitment}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActivitySelection(activity.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-2">
                <h4 className="font-medium">Available Activities</h4>
              </div>
              
              <div className="space-y-2 max-h-[150px] overflow-y-auto p-1">
                {availableActivities.length === 0 ? (
                  <div className="text-center py-3 border border-dashed rounded-md text-sm text-muted-foreground">
                    All activities selected
                  </div>
                ) : (
                  availableActivities.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between gap-2 p-2 rounded-md border border-border">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {React.cloneElement(activity.icon, { className: 'w-5 h-5' })}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{activity.title}</div>
                          <div className="text-xs text-muted-foreground">{activity.timeCommitment}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActivitySelection(activity.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveCurrentPlan}>
                Save Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}