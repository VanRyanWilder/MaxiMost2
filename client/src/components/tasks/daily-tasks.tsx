import { useUser } from "@/context/user-context";
import { type Task } from "@shared/schema";
import { categoryColors, frequencyColors } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronUp, ChevronDown, Edit, Trash, GripVertical, PlusCircle, Save } from "lucide-react";

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
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    category: 'Mind',
    frequency: 'Must-Do',
    programId: 1
  });
  
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
  
  // Move a task up or down in the list
  const moveTask = (taskId: number, direction: 'up' | 'down') => {
    if (!tasks) return;
    
    const tasksCopy = [...tasks];
    const taskIndex = tasksCopy.findIndex(t => t.id === taskId);
    
    if (
      (direction === 'up' && taskIndex === 0) || 
      (direction === 'down' && taskIndex === tasksCopy.length - 1)
    ) {
      return; // Already at the limit
    }
    
    const newIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;
    const taskToMove = tasksCopy[taskIndex];
    
    // Remove the task from its current position
    tasksCopy.splice(taskIndex, 1);
    // Insert it at the new position
    tasksCopy.splice(newIndex, 0, taskToMove);
    
    setTasks(tasksCopy);
    
    toast({
      title: "Task order updated",
      description: `"${taskToMove.title}" moved ${direction}`,
    });
  };
  
  // Handle opening the edit dialog
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditTaskDialog(true);
  };
  
  // Save edited task
  const saveEditedTask = () => {
    if (!editingTask || !tasks) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    );
    
    setTasks(updatedTasks);
    setShowEditTaskDialog(false);
    
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated",
    });
  };
  
  // Handle adding a new task
  const handleAddTask = () => {
    if (!tasks) return;
    
    // Create a simple unique ID for the new task
    const maxId = Math.max(...tasks.map(t => t.id), 0);
    const newTaskWithId = { ...newTask, id: maxId + 1 };
    
    setTasks([...tasks, newTaskWithId]);
    setShowAddTaskDialog(false);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      category: 'Mind',
      frequency: 'Must-Do',
      programId: 1
    });
    
    toast({
      title: "Task added",
      description: "Your new task has been added to your plan",
    });
  };
  
  // Handle deleting a task
  const handleDeleteTask = (taskId: number) => {
    if (!tasks) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your plan",
      variant: "destructive"
    });
  };
  
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-bold text-xl text-gray-900">Maximus Gains Daily Plan</h3>
          <p className="text-sm text-gray-500 mt-1">Track your daily discipline to build momentum</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowAddTaskDialog(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-gray-600">Must-Do Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-gray-600">Multiple Weekly</span>
          </div>
          
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Mind">Mind</SelectItem>
              <SelectItem value="Body">Body</SelectItem>
              <SelectItem value="Spirit">Spirit</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
            </SelectContent>
          </Select>
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
          {filteredMustDoTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No daily tasks found for this category</p>
            </div>
          ) : (
            filteredMustDoTasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-item border-l-4 border-l-emerald-500 border border-gray-200 rounded-lg p-4 flex items-center transition-all ${taskStatus[task.id] ? 'bg-green-50' : 'bg-white'} hover:shadow-sm`}
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
                <div className="flex flex-col items-end sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <span className="inline-flex items-center bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    Must-Do
                  </span>
                  <span className={`${categoryColors[task.category].bg} ${categoryColors[task.category].text} text-xs px-2.5 py-1 rounded-full`}>
                    {task.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex items-center mb-4">
        <h3 className="font-bold text-xl">Multiple Times Per Week</h3>
        <div className="ml-2 text-xs inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
          Weekly Goals
        </div>
      </div>
      
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
          {filteredFlexibleTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No weekly tasks found for this category</p>
            </div>
          ) : (
            filteredFlexibleTasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-item border-l-4 border-l-blue-500 border border-gray-200 rounded-lg p-4 flex items-center transition-all ${taskStatus[task.id] ? 'bg-green-50' : 'bg-white'} hover:shadow-sm`}
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
                <div className="flex flex-col items-end sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {task.frequency}
                  </span>
                  <span className={`${categoryColors[task.category].bg} ${categoryColors[task.category].text} text-xs px-2.5 py-1 rounded-full`}>
                    {task.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Tracking Progress</h4>
            <p className="text-sm text-gray-600 mt-1">Your completion rate impacts your recommendations and program advancement</p>
          </div>
        </div>
      </div>
    </div>
  );
}
