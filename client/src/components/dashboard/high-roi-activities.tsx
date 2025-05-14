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
  MoveUp
} from "lucide-react";

type HighRoiActivity = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeCommitment: string;
};

export function HighRoiActivities() {
  const activities: HighRoiActivity[] = [
    {
      id: "sleep",
      title: "Prioritize Sleep",
      description: "7-9 hours of quality sleep enhances cognition, recovery, and hormone balance.",
      icon: <Brain className="h-8 w-8 text-indigo-500" />,
      impact: 10,
      effort: 3,
      timeCommitment: "7-9 hrs/day"
    },
    {
      id: "sugar",
      title: "Eliminate Sugar",
      description: "Cutting refined sugar reduces inflammation and stabilizes energy.",
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      impact: 9,
      effort: 6,
      timeCommitment: "Ongoing"
    },
    {
      id: "sunlight",
      title: "Morning Sunlight",
      description: "10-15 minutes of morning sunlight regulates circadian rhythm and boosts mood.",
      icon: <Sun className="h-8 w-8 text-amber-500" />,
      impact: 8,
      effort: 1,
      timeCommitment: "10-15 min/day"
    },
    {
      id: "strength",
      title: "Strength Training",
      description: "2-3 weekly sessions build muscle, bone density, and metabolic health.",
      icon: <Activity className="h-8 w-8 text-green-500" />,
      impact: 9,
      effort: 5,
      timeCommitment: "2-3 hrs/week"
    },
    {
      id: "principles",
      title: "Apply Core Principles",
      description: "Daily application of evidence-based mindset practices from peak performers.",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      impact: 8,
      effort: 4,
      timeCommitment: "15 min/day"
    }
  ];
  
  // Sort activities by ROI (impact divided by effort)
  const sortedActivities = [...activities].sort((a, b) => 
    (b.impact / b.effort) - (a.impact / a.effort)
  );

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
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-border">
              <div className="flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base">{activity.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="bg-secondary/30 px-2 py-1 rounded text-xs">
                    {activity.timeCommitment}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ROI Score: <span className="font-medium text-primary">{(activity.impact / activity.effort * 10).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground mb-1">Impact</div>
                <div className="font-bold text-lg">{activity.impact}/10</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}