import { useUser } from "@/context/user-context";
import { type Task } from "@shared/schema";
import { categoryColors, frequencyColors } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UserTaskStatus {
  [taskId: number]: boolean;
}

export function DailyTasks() {
  const { user } = useUser();
  const { toast } = useToast();
  const [taskStatus, setTaskStatus] = useState<UserTaskStatus>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock tasks data
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch this from the API
      const mockTasks: Task[] = [
        {
          id: 1,
          title: "Morning Prayer/Meditation",
          description: "10 minutes of focused meditation",
          category: "Spirit",
          frequency: "Must-Do",
          programId: 1
        },
        {
          id: 2,
          title: "Morning Workout",
          description: "30 min strength training",
          category: "Body",
          frequency: "Must-Do",
          programId: 1
        },
        {
          id: 3,
          title: "Brain Dump Journaling",
          description: "Write 3 pages of stream-of-consciousness",
          category: "Mind",
          frequency: "Must-Do",
          programId: 1
        },
        {
          id: 4,
          title: "Cold Shower",
          description: "2-minute minimum cold exposure",
          category: "Body",
          frequency: "Must-Do",
          programId: 1
        },
        {
          id: 5,
          title: "Supplements",
          description: "Morning supplement stack",
          category: "Health",
          frequency: "Must-Do",
          programId: 1
        },
        {
          id: 6,
          title: "Read Stoic Philosophy",
          description: "20 pages minimum",
          category: "Mind",
          frequency: "3x Weekly",
          programId: 1
        },
        {
          id: 7,
          title: "Cardio Session",
          description: "30 min zone 2 cardio",
          category: "Body",
          frequency: "5x Weekly",
          programId: 1
        },
        {
          id: 8,
          title: "Intermittent Fasting",
          description: "16:8 fasting window",
          category: "Health",
          frequency: "5x Weekly",
          programId: 1
        }
      ];
      
      setTasks(mockTasks);
      setIsLoading(false);
    }
  }, [user]);
  
  // Filter tasks based on frequency
  const mustDoTasks = tasks?.filter(task => task.frequency === "Must-Do") || [];
  const flexibleTasks = tasks?.filter(task => task.frequency !== "Must-Do") || [];
  
  // Filter by category if not "All Categories"
  const filteredMustDoTasks = selectedCategory !== "All Categories" 
    ? mustDoTasks.filter(task => task.category === selectedCategory)
    : mustDoTasks;
    
  const filteredFlexibleTasks = selectedCategory !== "All Categories"
    ? flexibleTasks.filter(task => task.category === selectedCategory)
    : flexibleTasks;
  
  const handleTaskStatusChange = async (taskId: number, checked: boolean) => {
    try {
      // In a real app, we would call an API to update the user task status
      // For now, we'll just update the local state
      setTaskStatus(prev => ({ ...prev, [taskId]: checked }));
      
      // Simulate API call to update task status
      // await apiRequest("PATCH", `/api/user-tasks/${userTaskId}`, { completed: checked });
      // queryClient.invalidateQueries({ queryKey: ["/api/user-tasks"] });
      
      toast({
        title: checked ? "Task completed!" : "Task marked as incomplete",
        description: "Your progress has been updated.",
        variant: checked ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast({
        title: "Failed to update task",
        description: "There was an error updating your task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl">Daily Must-Do Tasks</h3>
        <div className="flex space-x-2">
          <select 
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Mind</option>
            <option>Body</option>
            <option>Brain</option>
            <option>Spirit</option>
            <option>Health</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 mb-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="animate-pulse flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="h-5 w-5 bg-gray-200 rounded-md mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {filteredMustDoTasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-item border border-gray-200 rounded-lg p-4 flex items-center transition-all ${taskStatus[task.id] ? 'bg-green-50' : 'bg-white'}`}
            >
              <Checkbox
                checked={taskStatus[task.id] || false}
                onCheckedChange={(checked) => handleTaskStatusChange(task.id, checked as boolean)}
                className="mr-3 h-5 w-5"
              />
              <div className="flex-1">
                <h4 className={`task-title font-medium ${taskStatus[task.id] ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${frequencyColors[task.frequency].bg} ${frequencyColors[task.frequency].text} text-xs px-2 py-1 rounded`}>
                  {task.frequency}
                </span>
                <span className={`${categoryColors[task.category].bg} ${categoryColors[task.category].text} text-xs px-2 py-1 rounded`}>
                  {task.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-bold text-xl mb-4">Flexible Frequency Tasks</h3>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="animate-pulse flex items-center p-4 border border-gray-200 rounded-lg">
              <div className="h-5 w-5 bg-gray-200 rounded-md mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFlexibleTasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-item border border-gray-200 rounded-lg p-4 flex items-center transition-all ${taskStatus[task.id] ? 'bg-green-50' : 'bg-white'}`}
            >
              <Checkbox
                checked={taskStatus[task.id] || false}
                onCheckedChange={(checked) => handleTaskStatusChange(task.id, checked as boolean)}
                className="mr-3 h-5 w-5"
              />
              <div className="flex-1">
                <h4 className={`task-title font-medium ${taskStatus[task.id] ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`${frequencyColors[task.frequency]?.bg || 'bg-gray-200'} ${frequencyColors[task.frequency]?.text || 'text-gray-700'} text-xs px-2 py-1 rounded`}>
                  {task.frequency}
                </span>
                <span className={`${categoryColors[task.category].bg} ${categoryColors[task.category].text} text-xs px-2 py-1 rounded`}>
                  {task.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
