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
  Save
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

type Frequency = "daily" | "weekly" | "custom";

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
};

type CompletedActivity = {
  id: string;
  date: Date;
};

export function HighRoiActivities() {
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
      streak: 3
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
      streak: 1
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
      streak: 5
    },
    {
      id: "strength",
      title: "Strength Training",
      description: "2-3 weekly sessions build muscle, bone density, and metabolic health.",
      icon: <Activity className="h-8 w-8 text-green-500" />,
      impact: 9,
      effort: 5,
      timeCommitment: "2-3 hrs/week",
      frequency: "weekly",
      isAbsolute: false,
      streak: 2
    },
    {
      id: "principles",
      title: "Apply Core Principles",
      description: "Daily application of evidence-based mindset practices from peak performers.",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      impact: 8,
      effort: 4,
      timeCommitment: "15 min/day",
      frequency: "daily",
      isAbsolute: true,
      streak: 7
    }
  ];
  
  // State for activities and completed activities
  const [activities, setActivities] = useState<HighRoiActivity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
  const [editMode, setEditMode] = useState(false);
  
  // Load saved activities data from localStorage on component mount
  useEffect(() => {
    const savedActivities = localStorage.getItem('high-roi-activities');
    const savedCompletedActivities = localStorage.getItem('completed-activities');
    
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
  }, []);
  
  // Save to localStorage whenever activities change
  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('high-roi-activities', JSON.stringify(activities));
    }
  }, [activities]);
  
  // Save completed activities to localStorage
  useEffect(() => {
    if (completedActivities.length > 0) {
      localStorage.setItem('completed-activities', JSON.stringify(completedActivities));
    }
  }, [completedActivities]);

  // Sort activities by ROI (impact divided by effort) and absolute status
  const sortedActivities = [...activities].sort((a, b) => {
    // First sort by absolute status
    if (a.isAbsolute && !b.isAbsolute) return -1;
    if (!a.isAbsolute && b.isAbsolute) return 1;
    
    // Then sort by ROI
    return (b.impact / b.effort) - (a.impact / a.effort);
  });
  
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
  
  // Get daily and weekly activities
  const dailyActivities = sortedActivities.filter(a => a.frequency === "daily");
  const weeklyActivities = sortedActivities.filter(a => a.frequency === "weekly");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              High ROI Activities <MoveUp className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription>Maximum results with minimum effective effort</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1"
          >
            {editMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            {editMode ? "Save" : "Customize"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> Daily Absolutes
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Weekly Activities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            {dailyActivities.map((activity) => (
              <div key={activity.id} className={`flex items-start gap-4 p-3 rounded-lg border 
                ${activity.isAbsolute ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                <div className="flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base">{activity.title}</h3>
                    {activity.isAbsolute && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="bg-secondary/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.timeCommitment}
                    </div>
                    {!editMode && activity.streak && activity.streak > 0 && (
                      <div className="text-xs font-medium text-primary flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {activity.streak} day streak
                      </div>
                    )}
                    {editMode && (
                      <div className="flex items-center gap-1.5">
                        <Switch 
                          id={`absolute-${activity.id}`}
                          checked={activity.isAbsolute}
                          onCheckedChange={() => toggleAbsolute(activity.id)}
                        />
                        <Label htmlFor={`absolute-${activity.id}`} className="text-xs">
                          Must Do Daily
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
                {!editMode ? (
                  <div className="flex flex-col items-center">
                    <Checkbox 
                      className="h-6 w-6 border-2" 
                      checked={isCompletedToday(activity.id)} 
                      onCheckedChange={() => handleCompleteActivity(activity.id)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">Done</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground">ROI</div>
                    <div className="font-bold text-sm">{(activity.impact / activity.effort * 10).toFixed(1)}</div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            {weeklyActivities.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No weekly activities set.</p>
                <p className="text-sm mt-1">Edit your daily activities to move some to weekly.</p>
              </div>
            ) : (
              weeklyActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-border">
                  <div className="flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="bg-secondary/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {activity.timeCommitment}
                      </div>
                      {editMode && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => changeFrequency(activity.id, 'daily')}
                          className="h-7 text-xs"
                        >
                          Move to Daily
                        </Button>
                      )}
                    </div>
                  </div>
                  {!editMode ? (
                    <div className="flex flex-col items-center">
                      <Checkbox 
                        className="h-6 w-6 border-2" 
                        checked={isCompletedToday(activity.id)} 
                        onCheckedChange={() => handleCompleteActivity(activity.id)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">Done</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">ROI</div>
                      <div className="font-bold text-sm">{(activity.impact / activity.effort * 10).toFixed(1)}</div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {editMode && dailyActivities.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Move daily activities to weekly:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dailyActivities.map(activity => (
                    <Button 
                      key={activity.id}
                      variant="outline" 
                      size="sm" 
                      onClick={() => changeFrequency(activity.id, 'weekly')}
                      className="justify-start"
                    >
                      <span className="mr-2">{activity.icon}</span>
                      <span className="text-xs">{activity.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}