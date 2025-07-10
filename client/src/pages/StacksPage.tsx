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
      <h1 className="text-3xl font-bold mb-8 text-center text-neutral-100">Manage Your Habit Stacks</h1>

      {/* Removed custom bg-neutral-800/80, backdrop-blur-sm (already in Card), border-neutral-700. Retained shadow-lg and text-neutral-100 */}
      <Card className="mb-8 shadow-lg text-neutral-100">
        <CardHeader>
          <CardTitle className="text-2xl text-neutral-100">Create New Stack</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="new-stack-name" className="text-sm font-medium text-neutral-300">Stack Name</Label>
            <Input
              id="new-stack-name"
              type="text"
              value={newStackName}
              onChange={(e) => setNewStackName(e.target.value)}
              placeholder="e.g., Morning Routine, Evening Wind-down"
              className="mt-1 bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-400 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-neutral-300">Select Habits for Stack</Label>
            {availableHabits.length > 0 ? (
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-neutral-700 bg-neutral-900/50 p-3 rounded-md">
                {availableHabits.map(habit => (
                  <div key={habit.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`habit-${habit.id}`}
                      checked={selectedHabitsForNewStack.has(habit.id)}
                      onCheckedChange={() => toggleHabitForNewStack(habit.id)}
                      className="border-neutral-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`habit-${habit.id}`} className="font-normal text-sm text-neutral-300">
                      {habit.title}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400 mt-1">No habits available to add. Create some habits first!</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateStack} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Stack
          </Button>
        </CardFooter>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-neutral-100">Your Stacks</h2>
        {stacks.length > 0 ? (
          <div className="space-y-4">
            {stacks.map(stack => (
              // Removed custom bg-neutral-800/70, border-neutral-700. Retained shadow-md and text-neutral-100
              <Card key={stack.id} className="shadow-md text-neutral-100">
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleStackExpansion(stack.id)}>
                  <CardTitle className="text-xl text-neutral-100">{stack.name}</CardTitle>
                  {expandedStacks[stack.id] ? <ChevronDown className="h-5 w-5 text-neutral-300" /> : <ChevronRight className="h-5 w-5 text-neutral-300" />}
                </CardHeader>
                {expandedStacks[stack.id] && (
                  <CardContent>
                    <p className="text-sm text-neutral-400 mb-2">Habits in this stack:</p>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-neutral-300">
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
          <p className="text-neutral-400">You haven't created any habit stacks yet.</p>
        )}
      </div>

      {/* Expert Habit Stacks Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center md:text-left text-neutral-100">Expert Habit Stacks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertStacksData.map(expertStack => (
            // Removed custom bg-neutral-800/50, border-neutral-700. Retained shadow-lg, text-neutral-100 and hover effects.
            <Card
              key={expertStack.id}
              className="shadow-lg flex flex-col text-neutral-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <CardHeader>
                <CardTitle className="text-xl text-blue-400">{expertStack.expertName}</CardTitle>
                <p className="text-sm text-neutral-400">{expertStack.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-medium mb-2 text-sm text-neutral-300">Example Habits:</h4>
                <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-neutral-400">
                  {expertStack.habits.map((habit, index) => (
                    <li key={index}>{habit}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => alert(`Placeholder: Adding ${expertStack.expertName}'s stack to your dashboard.`)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to My Dashboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Placeholder data for Expert Stacks
const expertStacksData = [
  {
    id: 'huberman',
    expertName: 'Andrew Huberman',
    description: 'Optimize your day with science-backed protocols for focus, sleep, and well-being.',
    habits: ['Morning Sunlight (10-30 min)', 'Cold Exposure (1-3 min)', 'Delayed Caffeine Intake (90-120 min after waking)', 'Non-Sleep Deep Rest (NSDR)'],
  },
  {
    id: 'brecka',
    expertName: 'Gary Brecka',
    description: 'Focus on foundational health principles for optimal human performance.',
    habits: ['Grounding (Earthing)', 'Controlled Breathwork (e.g., Wim Hof)', 'Cold Plunge', 'Sunlight Exposure'],
  },
  {
    id: 'ferriss',
    expertName: 'Tim Ferriss',
    description: 'Deconstruct world-class performers and apply their tools for personal effectiveness.',
    habits: ['5-Minute Journal', 'Titanium Tea or Similar Morning Ritual', '80/20 Analysis of Tasks', 'Exercise (e.g., AcroYoga, Kettlebells)'],
  },
  {
    id: 'attia',
    expertName: 'Peter Attia',
    description: 'A data-driven approach to enhancing healthspan and performance, focusing on Medicine 3.0.',
    habits: ['Zone 2 Cardio (3-4x/week)', 'Strength Training (2-3x/week)', 'Stability Training', 'Time-Restricted Eating (TRE)'],
  },
  {
    id: 'jocko',
    expertName: 'Jocko Willink',
    description: 'Embrace discipline and extreme ownership to achieve your goals.',
    habits: ['"Get After It" Early Wake-up (e.g., 4:30 AM)', 'Prioritize & Execute Daily Tasks', 'Intense Physical Training', 'Detach and Re-evaluate'],
  },
  {
    id: 'goggins',
    expertName: 'David Goggins',
    description: 'Develop mental toughness and resilience by embracing discomfort.',
    habits: ['Accountability Mirror', 'Cookie Jar (Remember Past Successes)', 'Push Beyond Perceived Limits Daily', 'After Action Reports (AARs)'],
  },
  {
    id: 'robbins',
    expertName: 'Mel Robbins',
    description: 'Use simple, science-backed tools to overcome procrastination and take action.',
    habits: ['The 5 Second Rule', 'High-Five Habit in the Mirror', 'Reframe Anxiety as Excitement', 'Identify and Act on "Activation Energy"'],
  },
];

export default StacksPage;
