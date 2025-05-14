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
  Filter,
  BarChart, 
  TrendingUp
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
  
  // Morning routine options from various experts
  const morningRoutines = [
    {
      id: "huberman-routine",
      title: "Huberman Morning Protocol",
      description: "Start with morning sunlight, cold exposure, delayed breakfast, and exercise to optimize hormones and energy.",
      author: "Andrew Huberman",
      steps: [
        "Get sunlight in eyes within 30-60 minutes of waking",
        "Delay breakfast by 1-2 hours to maintain fat-burning",
        "Cold exposure for 1-3 minutes",
        "Exercise in a fasted state",
        "Hydrate with water and electrolytes"
      ],
      timeCommitment: "30-60 min"
    },
    {
      id: "goggins-routine",
      title: "Goggins Morning Protocol",
      description: "Extreme discipline-based routine focused on mental toughness and physical resilience.",
      author: "David Goggins",
      steps: [
        "Wake up at 4:30 AM",
        "Immediate workout/run",
        "Cold shower",
        "Review your goals and accountability mirror",
        "Begin work before others are awake"
      ],
      timeCommitment: "60-90 min"
    },
    {
      id: "jocko-routine",
      title: "Jocko Morning Protocol",
      description: "Military-precision morning routine for maximum discipline and productivity.",
      author: "Jocko Willink",
      steps: [
        "Wake up at 4:30 AM",
        "Take a photo of your watch",
        "Immediate workout",
        "Plan and review the day's objectives",
        "Begin executing on tasks before standard work hours"
      ],
      timeCommitment: "60-90 min"
    },
    {
      id: "robbins-routine",
      title: "5 Second Rule Morning",
      description: "Action-oriented morning routine to build momentum through quick decisions.",
      author: "Mel Robbins",
      steps: [
        "5-4-3-2-1 countdown to get out of bed immediately",
        "Don't check your phone for first hour",
        "3-minute mindfulness breathing",
        "Set 3 intentional goals for the day",
        "Physical movement for at least 10 minutes"
      ],
      timeCommitment: "30-40 min"
    },
    {
      id: "brecka-routine",
      title: "Brecka Optimization Protocol",
      description: "Hormone and energy optimization focused morning routine based on evolutionary biology.",
      author: "Mike Brecka",
      steps: [
        "Morning sunlight exposure for minimum 10 minutes",
        "Cold shower or ice bath",
        "Mobility and movement practice",
        "Nutritional supplement stack",
        "Protein-focused breakfast"
      ],
      timeCommitment: "45-60 min"
    }
  ];
  
  // Get today's principle based on date
  const getTodaysPrinciple = () => {
    try {
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const diff = today.getTime() - startOfYear.getTime();
      const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
      return principleSummaries[dayOfYear % principleSummaries.length];
    } catch (error) {
      console.error("Error getting today's principle:", error);
      return principleSummaries[0]; // Return the first principle as fallback
    }
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
    },
    {
      id: "daily-dad",
      title: "Daily Dad",
      description: "Read Ryan Holiday's 'Daily Dad' for wisdom on fatherhood and life principles.",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      impact: 7,
      effort: 2,
      timeCommitment: "5 min/day",
      frequency: "daily",
      isAbsolute: false,
      streak: 0,
      type: "custom"
    },
    {
      id: "prayer",
      title: "Christian Prayer",
      description: "Daily spiritual practice for mental clarity, gratitude and connection.",
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
      impact: 9,
      effort: 2,
      timeCommitment: "10 min/day",
      frequency: "daily",
      isAbsolute: false,
      streak: 0,
      type: "custom"
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
  
  // State for today's principle
  const [todaysPrinciple, setTodaysPrinciple] = useState<PrincipleContent>(getTodaysPrinciple());
  const [showPrincipleDetails, setShowPrincipleDetails] = useState(false);
  
  // State for new custom habit
  const [newHabit, setNewHabit] = useState<{
    title: string;
    description: string;
    impact: number;
    effort: number;
    timeCommitment: string;
    frequency: Frequency;
    isAbsolute: boolean;
  }>({
    title: "",
    description: "",
    impact: 5,
    effort: 3,
    timeCommitment: "",
    frequency: "daily",
    isAbsolute: false
  });
  
  // Dialog states
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [addHabitDialogOpen, setAddHabitDialogOpen] = useState(false);
  
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
  
  // Create a new custom habit
  const createCustomHabit = () => {
    if (!newHabit.title || !newHabit.timeCommitment) {
      return; // Validate required fields
    }
    
    const customHabitId = `custom-${Date.now()}`;
    const iconOptions = [
      <Brain className="h-8 w-8 text-purple-500" />,
      <Activity className="h-8 w-8 text-emerald-500" />,
      <BookOpen className="h-8 w-8 text-blue-500" />,
      <Sun className="h-8 w-8 text-amber-500" />
    ];
    
    const newCustomHabit: HighRoiActivity = {
      id: customHabitId,
      title: newHabit.title,
      description: newHabit.description,
      icon: iconOptions[Math.floor(Math.random() * iconOptions.length)],
      impact: newHabit.impact,
      effort: newHabit.effort,
      timeCommitment: newHabit.timeCommitment,
      frequency: newHabit.frequency,
      isAbsolute: newHabit.isAbsolute,
      streak: 0,
      type: "custom"
    };
    
    // Add to activities list
    setActivities(prev => [...prev, newCustomHabit]);
    
    // If it's a must-do activity, add it to today's plan
    if (newHabit.isAbsolute) {
      setSelectedActivities(prev => [...prev, customHabitId]);
      saveCurrentPlan();
    }
    
    // Reset form
    setNewHabit({
      title: "",
      description: "",
      impact: 5,
      effort: 3,
      timeCommitment: "",
      frequency: "daily",
      isAbsolute: false
    });
    
    setAddHabitDialogOpen(false);
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAddHabitDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Custom Habit
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
                          {activity.type === "principle" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowPrincipleDetails(true)}
                              className="h-5 px-1.5 text-xs ml-auto text-primary"
                            >
                              Read Today's Principle
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.type === "principle" 
                            ? `Today: "${todaysPrinciple.title}" by ${todaysPrinciple.author}`
                            : activity.description
                          }
                        </p>
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
        
        {/* Daily Principle Dialog */}
        <Dialog open={showPrincipleDetails} onOpenChange={setShowPrincipleDetails}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{todaysPrinciple.title}</DialogTitle>
              <DialogDescription className="text-sm flex items-center mt-1">
                <span className="font-medium">{todaysPrinciple.author}</span>
                <span className="mx-2">•</span>
                <span className="italic">{todaysPrinciple.source}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-base leading-relaxed">{todaysPrinciple.content}</p>
            </div>
            
            <div className="mt-2 bg-primary/10 rounded-lg p-3 border border-primary/20">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Application
              </h4>
              <p className="text-sm mt-1">
                Reflect on how you can apply this principle in your life today. 
                Small, consistent actions based on these principles lead to exponential growth.
              </p>
            </div>
            
            <DialogFooter className="mt-4">
              <Button onClick={() => setShowPrincipleDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Add Custom Habit Dialog */}
        <Dialog open={addHabitDialogOpen} onOpenChange={setAddHabitDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Custom Habit</DialogTitle>
              <DialogDescription>
                Add your own custom habits to track. High-ROI activities produce the most results with minimal effort.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-2">
              <div>
                <Label htmlFor="habit-title">Habit Title*</Label>
                <input 
                  id="habit-title"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  placeholder="e.g. Cold Shower, Meditation, etc."
                  className="w-full mt-1 rounded-md border border-border px-3 py-2"
                />
              </div>
              
              <div>
                <Label htmlFor="habit-description">Description</Label>
                <textarea
                  id="habit-description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="What is this habit for? What are its benefits?"
                  className="w-full mt-1 rounded-md border border-border px-3 py-2 h-20 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="habit-time">Time Commitment*</Label>
                  <input 
                    id="habit-time"
                    value={newHabit.timeCommitment}
                    onChange={(e) => setNewHabit({...newHabit, timeCommitment: e.target.value})}
                    placeholder="e.g. 10 min/day"
                    className="w-full mt-1 rounded-md border border-border px-3 py-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="habit-frequency">Frequency</Label>
                  <select
                    id="habit-frequency"
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as Frequency})}
                    className="w-full mt-1 rounded-md border border-border px-3 py-2 bg-background"
                  >
                    <option value="daily">Daily</option>
                    <option value="2x-week">2x per Week</option>
                    <option value="3x-week">3x per Week</option>
                    <option value="4x-week">4x per Week</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Impact (1-10)</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
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
                    <input
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
            </div>
            
            <div className="bg-secondary/10 p-3 rounded-lg mt-2">
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
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setAddHabitDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createCustomHabit}>
                Add Habit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
              
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Available Activities</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAddHabitDialogOpen(true)}
                  className="h-7 px-2 text-xs flex items-center gap-1"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Create New
                </Button>
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