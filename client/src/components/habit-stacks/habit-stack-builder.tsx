import { useState } from "react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Info, 
  Edit, 
  Link, 
  Clock, 
  CalendarDays, 
  LayoutGrid, 
  Settings, 
  ChevronsUpDown,
  Bird,
  Users,
  Brain,
  Heart,
  Dumbbell,
  Sparkles
} from "lucide-react";
import type { Habit, HabitStack } from "@/types/habit";

interface SortableHabitItemProps {
  habit: Habit;
  index: number;
  onRemoveHabit: (index: number) => void;
}

function SortableHabitItem({ habit, index, onRemoveHabit }: SortableHabitItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: habit.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'health':
        return <Heart className="h-4 w-4 text-green-500" />;
      case 'fitness':
        return <Dumbbell className="h-4 w-4 text-blue-500" />;
      case 'mind':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'social':
        return <Users className="h-4 w-4 text-amber-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-gray-500" />;
    }
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="border rounded-md p-3 mb-2 bg-card flex items-center gap-3 cursor-move touch-none"
    >
      <div className="touch-none cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex flex-1 items-center">
        <div className="flex-1">
          <div className="font-medium text-sm">{habit.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs gap-1 py-0 h-5">
              {getIconForCategory(habit.category)}
              {habit.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {habit.timeCommitment}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemoveHabit(index)}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

interface HabitStackBuilderProps {
  availableHabits: Habit[];
  onCreateStack: (stack: HabitStack) => void;
  existingStacks?: HabitStack[]; // To check for duplicate names
}

export function HabitStackBuilder({ availableHabits, onCreateStack, existingStacks = [] }: HabitStackBuilderProps) {
  const [stackName, setStackName] = useState("");
  const [stackDescription, setStackDescription] = useState("");
  const [stackIcon, setStackIcon] = useState("zap");
  const [selectedHabits, setSelectedHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>("");
  const { toast } = useToast();
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedHabits((habits) => {
        const oldIndex = habits.findIndex(habit => habit.id === active.id);
        const newIndex = habits.findIndex(habit => habit.id === over.id);
        
        return arrayMove(habits, oldIndex, newIndex);
      });
    }
  };
  
  const handleAddHabit = () => {
    if (!selectedHabitId) return;
    
    const habitToAdd = availableHabits.find(h => h.id === selectedHabitId);
    if (!habitToAdd) return;
    
    // Check if already added
    if (selectedHabits.some(h => h.id === habitToAdd.id)) {
      toast({
        title: "Habit already added",
        description: "This habit is already in your stack.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedHabits([...selectedHabits, habitToAdd]);
    setSelectedHabitId("");
  };
  
  const handleRemoveHabit = (index: number) => {
    const updatedHabits = [...selectedHabits];
    updatedHabits.splice(index, 1);
    setSelectedHabits(updatedHabits);
  };
  
  const handleCreateStack = () => {
    // Validation
    if (!stackName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your habit stack.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedHabits.length < 2) {
      toast({
        title: "Not enough habits",
        description: "A stack should contain at least 2 habits.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicate names
    if (existingStacks.some(stack => stack.name.toLowerCase() === stackName.toLowerCase())) {
      toast({
        title: "Duplicate name",
        description: "A stack with this name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the stack
    const newStack: HabitStack = {
      id: `stack-${Date.now()}`,
      name: stackName,
      description: stackDescription,
      icon: stackIcon,
      habits: selectedHabits.map(h => ({
        title: h.title,
        description: h.description,
        icon: h.icon,
        iconColor: h.iconColor,
        impact: h.impact,
        effort: h.effort,
        timeCommitment: h.timeCommitment,
        frequency: h.frequency,
        isAbsolute: h.isAbsolute,
        category: h.category
      }))
    };
    
    onCreateStack(newStack);
    
    // Reset form
    setStackName("");
    setStackDescription("");
    setStackIcon("zap");
    setSelectedHabits([]);
    
    toast({
      title: "Stack created",
      description: `"${stackName}" has been created successfully.`,
    });
  };
  
  // List of icons for selection
  const iconOptions = [
    { value: "zap", label: "Lightning", icon: <Zap className="h-4 w-4" /> },
    { value: "brain", label: "Brain", icon: <Brain className="h-4 w-4" /> },
    { value: "users", label: "Social", icon: <Users className="h-4 w-4" /> },
    { value: "heart", label: "Health", icon: <Heart className="h-4 w-4" /> },
    { value: "dumbbell", label: "Fitness", icon: <Dumbbell className="h-4 w-4" /> },
    { value: "calendar-days", label: "Calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { value: "layout-grid", label: "Grid", icon: <LayoutGrid className="h-4 w-4" /> },
    { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    { value: "sparkles", label: "Sparkles", icon: <Sparkles className="h-4 w-4" /> },
    { value: "bird", label: "Bird", icon: <Bird className="h-4 w-4" /> }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Habit Stack</CardTitle>
        <CardDescription>
          Group complementary habits together for more effective habit building
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stack Details Section */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="stack-name">Stack Name <span className="text-destructive">*</span></Label>
            <Input
              id="stack-name"
              placeholder="Morning Routine"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="stack-description">Description</Label>
            <Textarea
              id="stack-description"
              placeholder="A set of habits to kick-start your day..."
              value={stackDescription}
              onChange={(e) => setStackDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="stack-icon">Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStackIcon(option.value)}
                  className={`flex items-center justify-center h-10 rounded-md border ${
                    stackIcon === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-input hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Habit Selection Section */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="select-habit">Add Habits to Stack</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Select habits to include in this stack. Arrange them in the order they should be completed.
            </p>
            
            <div className="flex gap-2">
              <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a habit" />
                </SelectTrigger>
                <SelectContent>
                  {availableHabits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={handleAddHabit} disabled={!selectedHabitId}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Selected Habits</Label>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground cursor-help">
                    <Info className="h-3 w-3 mr-1" />
                    Drag to reorder
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarFallback><Info className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Habit Stack Order</h4>
                      <p className="text-sm text-muted-foreground">
                        The order of habits in your stack can significantly impact your success. 
                        Try to arrange them in a logical sequence, from easiest to hardest, or 
                        following a natural progression in your routine.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            {selectedHabits.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={selectedHabits.map(h => h.id)}>
                  <div>
                    {selectedHabits.map((habit, index) => (
                      <SortableHabitItem
                        key={habit.id}
                        habit={habit}
                        index={index}
                        onRemoveHabit={handleRemoveHabit}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="border border-dashed rounded-md p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  No habits selected yet. Add at least 2 habits to create a stack.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {selectedHabits.length} habit{selectedHabits.length !== 1 && 's'} selected
        </div>
        <Button onClick={handleCreateStack} disabled={selectedHabits.length < 2 || !stackName.trim()}>
          Create Habit Stack
        </Button>
      </CardFooter>
    </Card>
  );
}