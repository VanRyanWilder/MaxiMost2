import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { type Metric } from "@shared/schema";

export function MetricsCard() {
  const { user } = useUser();
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock metrics data
  useEffect(() => {
    if (user?.id) {
      // In a real app, we would fetch this from the API
      const mockMetrics: Metric[] = [{
        id: 1,
        userId: 1,
        date: new Date(),
        workouts: 3,
        sleepHours: 7,
        meditation: 5,
        nutrition: "Good"
      }];
      
      setMetrics(mockMetrics);
      setIsLoading(false);
    }
  }, [user]);
  
  // For simplicity, just use the first metric
  const metric = metrics?.[0];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Weekly Metrics</h3>
          <a href="#" className="text-primary text-sm">View All</a>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase">Workouts</p>
            <p className="text-xl font-bold">{metric?.workouts ?? 0} of 5</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-secondary h-1.5 rounded-full" 
                style={{ width: `${metric ? ((metric.workouts ?? 0) / 5) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase">Sleep Quality</p>
            <p className="text-xl font-bold">{metric?.sleepHours ?? 0} hrs</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-warning h-1.5 rounded-full" 
                style={{ width: `${metric ? ((metric.sleepHours ?? 0) / 9) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase">Meditation</p>
            <p className="text-xl font-bold">{metric?.meditation ?? 0} of 7</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-accent h-1.5 rounded-full" 
                style={{ width: `${metric ? ((metric.meditation ?? 0) / 7) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase">Nutrition</p>
            <p className="text-xl font-bold">{metric?.nutrition ?? "Not Tracked"}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-primary h-1.5 rounded-full" 
                style={{ width: metric?.nutrition === "Good" ? "85%" : "50%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
