import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Play, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  PauseCircle,
  RotateCcw,
  Check,
  Clock,
  Sparkles,
  Zap,
  Users,
  Heart,
  Brain,
  Dumbbell,
  Bird,
  Calendar,
  Grid,
  Settings
} from "lucide-react";
import type { Habit, HabitStack } from "@/types/habit";

interface HabitStackDisplayProps {
  stacks: HabitStack[];
  onDeleteStack: (stackId: string) => void;
  onEditStack: (stack: HabitStack) => void;
  onDuplicateStack: (stack: HabitStack) => void;
  onLaunchStack: (stackId: string) => void;
}

export function HabitStackDisplay({ 
  stacks, 
  onDeleteStack, 
  onEditStack, 
  onDuplicateStack,
  onLaunchStack
}: HabitStackDisplayProps) {
  const [activeStackId, setActiveStackId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'brain': return <Brain className="h-5 w-5" />;
      case 'dumbbell': return <Dumbbell className="h-5 w-5" />;
      case 'calendar-days': return <Calendar className="h-5 w-5" />;
      case 'layout-grid': return <Grid className="h-5 w-5" />;
      case 'settings': return <Settings className="h-5 w-5" />;
      case 'bird': return <Bird className="h-5 w-5" />;
      case 'sparkles': return <Sparkles className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="h-4 w-4 text-green-500" />;
      case 'fitness': return <Dumbbell className="h-4 w-4 text-blue-500" />;
      case 'mind': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'social': return <Users className="h-4 w-4 text-amber-500" />;
      default: return <Sparkles className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTotalStackTime = (habits: Pick<Habit, 'timeCommitment'>[]) => {
    let totalMinutes = 0;
    
    habits.forEach(habit => {
      const timeStr = habit.timeCommitment.toLowerCase();
      
      // Extract the number part
      const match = timeStr.match(/(\d+)/);
      if (!match) return;
      
      const number = parseInt(match[1], 10);
      
      // Determine the unit
      if (timeStr.includes('hour')) {
        totalMinutes += number * 60;
      } else if (timeStr.includes('min')) {
        totalMinutes += number;
      }
    });
    
    // Format the total time
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}${mins > 0 ? ` ${mins} min` : ''}`;
    }
    
    return `${totalMinutes} min`;
  };
  
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteStack(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };
  
  const handleLaunchStack = (stackId: string) => {
    setActiveStackId(stackId);
    onLaunchStack(stackId);
  };
  
  const noStacksMessage = (
    <div className="text-center p-6 border border-dashed rounded-lg">
      <Zap className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-1">No Habit Stacks Yet</h3>
      <p className="text-muted-foreground mb-4">
        Create your first habit stack to boost your productivity and simplify your habit routine.
      </p>
      <Button>Create Your First Stack</Button>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle>Habit Stacks</CardTitle>
            <CardDescription>
              Pre-defined sequences of habits to streamline your routine
            </CardDescription>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            New Stack
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {stacks.length === 0 ? (
          noStacksMessage
        ) : (
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="grid">
                  <Grid className="h-4 w-4 mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list">
                  <Settings className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
              
              <Badge variant="secondary" className="h-6">
                {stacks.length} Stack{stacks.length !== 1 && 's'}
              </Badge>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {stacks.map((stack) => (
                  <Card key={stack.id} className={`overflow-hidden ${
                    activeStackId === stack.id ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="flex gap-3 items-center">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {getIconComponent(stack.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{stack.name}</CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {getTotalStackTime(stack.habits)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEditStack(stack)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDuplicateStack(stack)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteConfirmId(stack.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    
                    <CardContent className="p-4 pt-0">
                      {stack.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {stack.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {Array.from(new Set(stack.habits.map(h => h.category))).map((category) => (
                          <Badge key={category} variant="outline" className="flex gap-1 items-center text-xs">
                            {getCategoryIcon(category)}
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-3">
                        {stack.habits.length} habit{stack.habits.length !== 1 && 's'}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => handleLaunchStack(stack.id)}
                        className="w-full gap-2"
                        size="sm"
                        variant={activeStackId === stack.id ? "secondary" : "default"}
                      >
                        {activeStackId === stack.id ? (
                          <>
                            <PauseCircle className="h-4 w-4" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Start Stack
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {stacks.map((stack) => (
                    <Accordion key={stack.id} type="single" collapsible>
                      <AccordionItem value={stack.id} className={`border rounded-lg p-3 ${
                        activeStackId === stack.id ? 'bg-muted' : ''
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getIconComponent(stack.icon)}
                            </div>
                            <div>
                              <h3 className="font-medium">{stack.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {getTotalStackTime(stack.habits)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {stack.habits.length} habit{stack.habits.length !== 1 && 's'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleLaunchStack(stack.id)}
                              className="gap-2"
                              size="sm"
                              variant={activeStackId === stack.id ? "secondary" : "default"}
                            >
                              {activeStackId === stack.id ? (
                                <>
                                  <PauseCircle className="h-4 w-4" />
                                  In Progress
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" />
                                  Start
                                </>
                              )}
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEditStack(stack)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDuplicateStack(stack)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setDeleteConfirmId(stack.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <AccordionTrigger className="hover:no-underline p-0 ml-1" />
                          </div>
                        </div>
                        
                        <AccordionContent className="pt-4">
                          {stack.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                              {stack.description}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium mb-2">Habits in this stack:</h4>
                            {stack.habits.map((habit, index) => (
                              <div key={`${stack.id}-habit-${index}`} className="flex items-center gap-3 p-2 rounded-md border">
                                <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium">{index + 1}</span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{habit.title}</p>
                                  <div className="flex gap-2 items-center mt-1">
                                    <Badge variant="outline" className="text-xs flex gap-1 items-center">
                                      {getCategoryIcon(habit.category)}
                                      {habit.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {habit.timeCommitment}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this habit stack? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}