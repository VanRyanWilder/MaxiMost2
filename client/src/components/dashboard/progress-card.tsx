import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { type UserTask, type Task } from "@shared/schema";
import { useUser } from "@/context/user-context";

export function ProgressCard() {
  const { user } = useUser();
  const today = new Date();
  const [userTasks, setUserTasks] = useState<(UserTask & { task: Task })[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user tasks
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch this from the API
      const mockUserTasks: (UserTask & { task: Task })[] = [
        {
          id: 1,
          userId: 1,
          taskId: 1,
          completed: true,
          date: new Date(),
          task: {
            id: 1,
            title: "Morning Prayer/Meditation",
            description: "10 minutes of focused meditation",
            category: "Spirit",
            frequency: "Must-Do",
            programId: 1
          }
        },
        {
          id: 2,
          userId: 1,
          taskId: 2,
          completed: true,
          date: new Date(),
          task: {
            id: 2,
            title: "Morning Workout",
            description: "30 min strength training",
            category: "Body",
            frequency: "Must-Do",
            programId: 1
          }
        },
        {
          id: 3,
          userId: 1,
          taskId: 3,
          completed: false,
          date: new Date(),
          task: {
            id: 3,
            title: "Brain Dump Journaling",
            description: "Write 3 pages of stream-of-consciousness",
            category: "Mind",
            frequency: "Must-Do",
            programId: 1
          }
        },
        {
          id: 4,
          userId: 1,
          taskId: 4,
          completed: false,
          date: new Date(),
          task: {
            id: 4,
            title: "Cold Shower",
            description: "2-minute minimum cold exposure",
            category: "Body",
            frequency: "Must-Do",
            programId: 1
          }
        }
      ];
      
      setUserTasks(mockUserTasks);
      setIsLoading(false);
    }
  }, [user]);
  
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
