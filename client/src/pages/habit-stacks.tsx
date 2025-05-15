import { useState } from "react";
import { HabitStackBuilder } from "@/components/habit-stacks/habit-stack-builder";
import { HabitStackDisplay } from "@/components/habit-stacks/habit-stack-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Layers, 
  ArrowRight, 
  Brain,
  Zap,
  BookOpen,
  Hammer,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Habit, HabitStack } from "@/types/habit";

// Mock data for the page (would be loaded from storage in a real app)
const mockHabits: Habit[] = [
  {
    id: "h1",
    title: "Morning Meditation",
    description: "10 minutes of mindfulness meditation",
    icon: "brain",
    iconColor: "#8b5cf6",
    impact: 8,
    effort: 4,
    timeCommitment: "10 min",
    frequency: "daily",
    isAbsolute: true,
    category: "mind",
    streak: 12,
    createdAt: new Date(2023, 5, 15)
  },
  {
    id: "h2",
    title: "Daily Exercise",
    description: "30 minutes of any physical activity",
    icon: "dumbbell",
    iconColor: "#3b82f6",
    impact: 9,
    effort: 6,
    timeCommitment: "30 min",
    frequency: "daily",
    isAbsolute: true,
    category: "fitness",
    streak: 5,
    createdAt: new Date(2023, 6, 1)
  },
  {
    id: "h3",
    title: "Read Non-Fiction",
    description: "Read at least one chapter",
    icon: "book",
    iconColor: "#f59e0b",
    impact: 7,
    effort: 3,
    timeCommitment: "20 min",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 0,
    createdAt: new Date(2023, 6, 15)
  },
  {
    id: "h4",
    title: "Take Supplements",
    description: "Daily vitamin and mineral supplements",
    icon: "pill",
    iconColor: "#10b981",
    impact: 6,
    effort: 2,
    timeCommitment: "1 min",
    frequency: "daily",
    isAbsolute: true,
    category: "health",
    streak: 20,
    createdAt: new Date(2023, 5, 1)
  },
  {
    id: "h5",
    title: "Weekly Deep Work Session",
    description: "3-hour focused work on important projects",
    icon: "zap",
    iconColor: "#6366f1",
    impact: 9,
    effort: 8,
    timeCommitment: "3 hours",
    frequency: "weekly",
    isAbsolute: false,
    category: "mind",
    streak: 2,
    createdAt: new Date(2023, 7, 1)
  },
  {
    id: "h6",
    title: "Journal",
    description: "Write down thoughts, goals, and gratitude",
    icon: "pen",
    iconColor: "#ec4899",
    impact: 7,
    effort: 4,
    timeCommitment: "15 min",
    frequency: "daily",
    isAbsolute: false,
    category: "mind",
    streak: 3,
    createdAt: new Date(2023, 5, 20)
  },
  {
    id: "h7",
    title: "Cold Shower",
    description: "End shower with 60 seconds of cold water",
    icon: "drop",
    iconColor: "#0ea5e9",
    impact: 6,
    effort: 7,
    timeCommitment: "1 min",
    frequency: "daily",
    isAbsolute: false,
    category: "health",
    streak: 0,
    createdAt: new Date(2023, 6, 10)
  },
  {
    id: "h8",
    title: "Connect with Friend",
    description: "Call or meet a friend",
    icon: "users",
    iconColor: "#f43f5e",
    impact: 8,
    effort: 3,
    timeCommitment: "30 min",
    frequency: "weekly",
    isAbsolute: false,
    category: "social",
    streak: 1,
    createdAt: new Date(2023, 7, 5)
  }
];

// Sample habit stacks
const initialStacks: HabitStack[] = [
  {
    id: "stack-1",
    name: "Morning Jumpstart",
    description: "A powerful way to start your day with clarity and energy",
    icon: "zap",
    habits: [
      {
        title: "Morning Meditation",
        description: "10 minutes of mindfulness meditation",
        icon: "brain",
        iconColor: "#8b5cf6",
        impact: 8,
        effort: 4,
        timeCommitment: "10 min",
        frequency: "daily",
        isAbsolute: true,
        category: "mind"
      },
      {
        title: "Take Supplements",
        description: "Daily vitamin and mineral supplements",
        icon: "pill",
        iconColor: "#10b981",
        impact: 6,
        effort: 2,
        timeCommitment: "1 min",
        frequency: "daily",
        isAbsolute: true,
        category: "health"
      },
      {
        title: "Cold Shower",
        description: "End shower with 60 seconds of cold water",
        icon: "drop",
        iconColor: "#0ea5e9",
        impact: 6,
        effort: 7,
        timeCommitment: "1 min",
        frequency: "daily",
        isAbsolute: false,
        category: "health"
      }
    ]
  },
  {
    id: "stack-2",
    name: "Weekly Growth Routine",
    description: "Dedicated time for personal and professional development",
    icon: "brain",
    habits: [
      {
        title: "Weekly Deep Work Session",
        description: "3-hour focused work on important projects",
        icon: "zap",
        iconColor: "#6366f1",
        impact: 9,
        effort: 8,
        timeCommitment: "3 hours",
        frequency: "weekly",
        isAbsolute: false,
        category: "mind"
      },
      {
        title: "Read Non-Fiction",
        description: "Read at least one chapter",
        icon: "book",
        iconColor: "#f59e0b",
        impact: 7,
        effort: 3,
        timeCommitment: "20 min",
        frequency: "daily",
        isAbsolute: false,
        category: "mind"
      },
      {
        title: "Connect with Friend",
        description: "Call or meet a friend",
        icon: "users",
        iconColor: "#f43f5e",
        impact: 8,
        effort: 3,
        timeCommitment: "30 min",
        frequency: "weekly",
        isAbsolute: false,
        category: "social"
      }
    ]
  }
];

export default function HabitStacksPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [habitStacks, setHabitStacks] = useState<HabitStack[]>(initialStacks);
  const [editingStack, setEditingStack] = useState<HabitStack | null>(null);
  const { toast } = useToast();
  
  const handleCreateStack = (stack: HabitStack) => {
    if (editingStack) {
      // Update existing stack
      setHabitStacks(stacks => 
        stacks.map(s => s.id === editingStack.id ? stack : s)
      );
      toast({
        title: "Stack updated",
        description: `"${stack.name}" has been updated.`,
      });
      setEditingStack(null);
    } else {
      // Add new stack
      setHabitStacks([...habitStacks, stack]);
      toast({
        title: "Stack created",
        description: `"${stack.name}" has been added to your stacks.`,
      });
    }
    setShowBuilder(false);
  };
  
  const handleDeleteStack = (stackId: string) => {
    setHabitStacks(stacks => stacks.filter(stack => stack.id !== stackId));
    toast({
      title: "Stack deleted",
      description: "The stack has been removed.",
    });
  };
  
  const handleEditStack = (stack: HabitStack) => {
    setEditingStack(stack);
    setShowBuilder(true);
  };
  
  const handleDuplicateStack = (stack: HabitStack) => {
    const newStack: HabitStack = {
      ...stack,
      id: `stack-${Date.now()}`,
      name: `${stack.name} (Copy)`,
    };
    setHabitStacks([...habitStacks, newStack]);
    toast({
      title: "Stack duplicated",
      description: `A copy of "${stack.name}" has been created.`,
    });
  };
  
  const handleLaunchStack = (stackId: string) => {
    // In a real app, this would trigger the habit completion flow
    toast({
      title: "Stack started",
      description: "You're now working through this habit stack.",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Habit Stacks</h1>
        
        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary/10 p-4 rounded-full">
                <Layers className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Power Up Your Habits</h2>
                <p className="text-muted-foreground mb-4">
                  Habit stacking is a science-backed technique to build new habits by linking them to existing ones.
                  Create curated sequences of habits that work together for maximum impact.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mt-0.5">
                      <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Neurologically Optimized</p>
                      <p className="text-xs text-muted-foreground">Uses neural pathways for easier adoption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full mt-0.5">
                      <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Reduces Friction</p>
                      <p className="text-xs text-muted-foreground">Lower activation energy for challenging habits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full mt-0.5">
                      <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evidence-Based</p>
                      <p className="text-xs text-muted-foreground">Based on behavioral science research</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-full mt-0.5">
                      <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Customize & Learn</p>
                      <p className="text-xs text-muted-foreground">Adapt and refine over time</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="link" className="p-0 h-auto text-sm flex items-center gap-1 text-primary">
                    Learn more about habit stacking
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {showBuilder ? (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{editingStack ? 'Edit' : 'Create'} Habit Stack</h2>
              <Button variant="ghost" onClick={() => {
                setShowBuilder(false);
                setEditingStack(null);
              }}>
                Cancel
              </Button>
            </div>
            <HabitStackBuilder 
              availableHabits={mockHabits}
              onCreateStack={handleCreateStack}
              existingStacks={editingStack ? habitStacks.filter(s => s.id !== editingStack.id) : habitStacks}
            />
          </div>
        ) : (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setShowBuilder(true)}>
              <Hammer className="h-4 w-4 mr-2" />
              Build a New Habit Stack
            </Button>
          </div>
        )}
        
        <HabitStackDisplay 
          stacks={habitStacks}
          onDeleteStack={handleDeleteStack}
          onEditStack={handleEditStack}
          onDuplicateStack={handleDuplicateStack}
          onLaunchStack={handleLaunchStack}
        />
      </div>
    </div>
  );
}