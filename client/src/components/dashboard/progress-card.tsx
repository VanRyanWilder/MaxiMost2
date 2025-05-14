import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { type UserTask } from "@shared/schema";
import { useUser } from "@/context/user-context";

export function ProgressCard() {
  const { user } = useUser();
  const today = new Date();
  
  const { data: userTasks, isLoading } = useQuery<(UserTask & { task: { title: string } })[]>({
    queryKey: ["/api/user-tasks/1", today.toISOString().split('T')[0]],
    enabled: !!user
  });
  
  const totalTasks = userTasks?.length || 0;
  const completedTasks = userTasks?.filter(t => t.completed).length || 0;
  const progressPercentage = totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Today's Progress</h3>
          <span className="text-xs text-gray-500">{formatDate(today)}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Daily Tasks</span>
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-3xl font-bold text-secondary">{completedTasks}</p>
            <p className="text-sm text-gray-600">Tasks Complete</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <p className="text-3xl font-bold text-accent">{totalTasks - completedTasks}</p>
            <p className="text-sm text-gray-600">Tasks Remaining</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
