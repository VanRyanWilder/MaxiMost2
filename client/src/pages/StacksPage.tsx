import React from 'react';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/apiClient'; // Assuming you might fetch habits
import { FirestoreHabit } from '../../../shared/types/firestore'; // Adjust path as needed
import { useUser } from '@/context/user-context'; // To get user ID for associating stacks

// Mock habit type for now, will align with FirestoreHabit later
interface MockHabit {
  id: string;
  title: string;
}

interface HabitStack {
  id: string;
  name: string;
  habitIds: string[];
  userId?: string; // Optional: for associating with a user
}

const StacksPage: React.FC = () => {
  const { user } = useUser();
  const [stacks, setStacks] = useState<HabitStack[]>([]);
  const [newStackName, setNewStackName] = useState('');
  const [availableHabits, setAvailableHabits] = useState<MockHabit[]>([]);
  const [selectedHabitsForNewStack, setSelectedHabitsForNewStack] = useState<Set<string>>(new Set());
  const [editingStack, setEditingStack] = useState<HabitStack | null>(null);
  const [expandedStacks, setExpandedStacks] = useState<Record<string, boolean>>({});

  // Mock fetching available habits - replace with actual API call
  useEffect(() => {
    const fetchMockHabits = async () => {
      // In a real app, fetch user's habits from Firestore via apiClient
      // For now, using mock data based on FirestoreHabit structure
      const mockUserHabits: MockHabit[] = [
        { id: 'habit1', title: 'Morning Meditation' },
        { id: 'habit2', title: 'Drink Water' },
        { id: 'habit3', title: 'Read 10 Pages' },
        { id: 'habit4', title: 'Evening Walk' },
        { id: 'habit5', title: 'Plan Next Day' },
      ];
      setAvailableHabits(mockUserHabits);
    };
    fetchMockHabits();
    // TODO: Fetch existing stacks for the user
  }, [user]);

  const handleCreateStack = () => {
    if (!newStackName.trim() || selectedHabitsForNewStack.size === 0) {
      alert('Please provide a stack name and select at least one habit.');
      return;
    }
    const newStack: HabitStack = {
      id: `stack-${Date.now()}`, // Temporary ID
      name: newStackName.trim(),
      habitIds: Array.from(selectedHabitsForNewStack),
      userId: user?.uid,
    };
    setStacks([...stacks, newStack]);
    setNewStackName('');
    setSelectedHabitsForNewStack(new Set());
    // TODO: API call to save stack
    alert(`Stack "${newStack.name}" created! (Placeholder - not saved to backend)`);
  };

  const toggleHabitForNewStack = (habitId: string) => {
    setSelectedHabitsForNewStack(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  const toggleStackExpansion = (stackId: string) => {
    setExpandedStacks(prev => ({ ...prev, [stackId]: !prev[stackId] }));
  };

  const getHabitTitleById = (habitId: string) => {
    return availableHabits.find(h => h.id === habitId)?.title || 'Unknown Habit';
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Your Habit Stacks</h1>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-stack-name" className="text-sm font-medium">Stack Name</Label>
            <Input
              id="new-stack-name"
              type="text"
              value={newStackName}
              onChange={(e) => setNewStackName(e.target.value)}
              placeholder="e.g., Morning Routine, Evening Wind-down"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Select Habits for Stack</Label>
            {availableHabits.length > 0 ? (
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md">
                {availableHabits.map(habit => (
                  <div key={habit.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`habit-${habit.id}`}
                      checked={selectedHabitsForNewStack.has(habit.id)}
                      onCheckedChange={() => toggleHabitForNewStack(habit.id)}
                    />
                    <Label htmlFor={`habit-${habit.id}`} className="font-normal text-sm">
                      {habit.title}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No habits available to add. Create some habits first!</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateStack} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Stack
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Stacks</h2>
        {stacks.length > 0 ? (
          <div className="space-y-4">
            {stacks.map(stack => (
              <Card key={stack.id} className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleStackExpansion(stack.id)}>
                  <CardTitle className="text-xl">{stack.name}</CardTitle>
                  {expandedStacks[stack.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </CardHeader>
                {expandedStacks[stack.id] && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Habits in this stack:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                      {stack.habitIds.map(habitId => (
                        <li key={habitId}>{getHabitTitleById(habitId)}</li>
                      ))}
                    </ul>
                    {/* TODO: Add Edit/Delete buttons for stack */}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven't created any habit stacks yet.</p>
        )}
      </div>
    </div>
  );
};

export default StacksPage;
