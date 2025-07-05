import React, { useState } from 'react'; // Added useState
import { PageContainer } from "@/components/layout/page-container";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { TopRatedSupplements } from "@/components/dashboard/top-rated-supplements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added Button
import { useUser } from "@/context/user-context"; // Added useUser
import { apiClient } from "@/lib/apiClient"; // Added apiClient
import { Habit, HabitCategory, HabitFrequency } from "@/types/habit"; // Added Habit types
import {
  Activity, Zap, PlusCircle, Sun, Dumbbell, Droplets, Brain, BookOpen, Users, Clock, CheckSquare, Pill, Bed, Utensils
} from 'lucide-react'; // Added Lucide icons

export default function ExplorePage() {
  const { firebaseUser } = useUser();

  // Simplified addHabit for ExplorePage
  const addHabitExplore = async (newHabitData: Omit<Habit, 'id' | 'createdAt' | 'streak'>) => {
    if (!firebaseUser) {
      alert("Please log in to add habits.");
      return;
    }
    try {
      const createdHabit = await apiClient<Habit>('/habits', {
        method: 'POST',
        body: JSON.stringify(newHabitData),
      });
      alert(`Habit "${createdHabit.title}" added! View it on your dashboard.`);
    } catch (err) {
      console.error("Failed to add habit from explore:", err);
      alert("Failed to add habit. Please try again.");
    }
  };

  // Full Templates for Habit Library, copied from original dashboard.tsx definitions
  const quickAddTemplates = [
    { title: "Make Bed", iconName: "checkSquare", IconComponent: CheckSquare, description: "Start the day right", category: "mind" as HabitCategory },
    { title: "Pray", iconName: "sun", IconComponent: Sun, description: "Daily prayer practice", category: "mind" as HabitCategory },
    { title: "Lift Weights", iconName: "dumbbell", IconComponent: Dumbbell, description: "Strength training", category: "fitness" as HabitCategory },
    { title: "Brush Teeth", iconName: "activity", IconComponent: Activity, description: "Oral hygiene", category: "health" as HabitCategory },
    { title: "Wash Face", iconName: "droplets", IconComponent: Droplets, description: "Skincare", category: "health" as HabitCategory },
    { title: "Meditate", iconName: "brain", IconComponent: Brain, description: "Mental clarity", category: "mind" as HabitCategory },
    { title: "Call Friend", iconName: "users", IconComponent: Users, description: "Social connection", category: "social" as HabitCategory },
    { title: "Drink Water", iconName: "droplets", IconComponent: Droplets, description: "Stay hydrated", category: "health" as HabitCategory },
    { title: "Journal", iconName: "bookOpen", IconComponent: BookOpen, description: "Express thoughts", category: "mind" as HabitCategory },
    { title: "Brain Dump", iconName: "brain", IconComponent: Brain, description: "Clear your mind", category: "mind" as HabitCategory },
    { title: "Eat That Frog", iconName: "activity", IconComponent: Activity, description: "Do hardest task first", category: "mind" as HabitCategory },
    { title: "Cardio", iconName: "activity", IconComponent: Activity, description: "Heart health", category: "fitness" as HabitCategory },
    { title: "Supplements", iconName: "pill", IconComponent: Pill, description: "Daily vitamins", category: "health" as HabitCategory },
    // Note: "Custom" quick add is handled by UnifiedHabitDialog, so not listed here for direct add.
  ];

  const expertStackTemplates = [
    {
      name: "Morning Routine Stack",
      IconComponent: Sun,
      description: "Kickstart your day with focus and energy.",
      habits: [
        { title: "Morning Meditation", description: "10 minutes of focused breathing", icon: "brain", category: "mind" as HabitCategory, impact: 9, effort: 2, timeCommitment: '10 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Morning Hydration", description: "Drink 16oz of water immediately after waking", icon: "droplets", category: "health" as HabitCategory, impact: 9, effort: 1, timeCommitment: '2 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Gratitude Journaling", description: "Write down 3 things you're grateful for", icon: "bookOpen", category: "mind" as HabitCategory, impact: 9, effort: 3, timeCommitment: '10 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
      ]
    },
    {
      name: "Huberman Lab Stack",
      IconComponent: Brain,
      description: "Optimize your biology with science-backed protocols.",
      habits: [
        { title: "Morning Sunlight", description: "Get 2-10 minutes of morning sunlight exposure", icon: "sun", category: "health" as HabitCategory, impact: 9, effort: 1, timeCommitment: '5 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Delay Caffeine", description: "Wait 90-120 minutes after waking before caffeine", icon: "clock", category: "health" as HabitCategory, impact: 7, effort: 3, timeCommitment: '0 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Cold Exposure", description: "Brief cold exposure via shower or plunge", icon: "droplets", category: "health" as HabitCategory, impact: 8, effort: 6, timeCommitment: '2 min', frequency: 'daily' as HabitFrequency, isAbsolute: false },
      ]
    },
    {
      name: "Jocko Willink Stack",
      IconComponent: CheckSquare,
      description: "Embrace discipline and extreme ownership.",
      habits: [
        { title: "4:30 AM Wake-Up", description: "Early start for maximum productivity", icon: "sun", category: "mind" as HabitCategory, impact: 8, effort: 8, timeCommitment: '0 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Morning Workout", description: "Intense physical training", icon: "dumbbell", category: "fitness" as HabitCategory, impact: 9, effort: 7, timeCommitment: '45 min', frequency: 'daily' as HabitFrequency, isAbsolute: false },
        { title: "Strategic Planning", description: "Plan your day with strategic priorities", icon: "bookOpen", category: "mind" as HabitCategory, impact: 8, effort: 3, timeCommitment: '10 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
      ]
    },
    {
      name: "Dr. Brecka Protocol",
      IconComponent: Pill,
      description: "Optimize your health with biomarker-driven strategies.",
      habits: [
        { title: "Track blood sugar", description: "Monitor glucose levels", icon: "activity", category: "health" as HabitCategory, iconColor: "blue", impact: 9, effort: 3, timeCommitment: '1 min', frequency: 'daily' as HabitFrequency, isAbsolute: false },
        { title: "Optimize sleep", description: "Prioritize sleep quality", icon: "bed", category: "health" as HabitCategory, iconColor: "indigo", impact: 10, effort: 5, timeCommitment: '8 hours', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Supplement protocol", description: "Targeted supplements", icon: "pill", category: "health" as HabitCategory, iconColor: "green", impact: 8, effort: 2, timeCommitment: '2 min', frequency: 'daily' as HabitFrequency, isAbsolute: true },
        { title: "Protein intake", description: "1g protein per pound body weight", icon: "utensils", category: "health" as HabitCategory, iconColor: "red", impact: 8, effort: 5, timeCommitment: 'All day', frequency: 'daily' as HabitFrequency, isAbsolute: true },
      ]
    },
    {
      name: "Fitness Stack",
      IconComponent: Dumbbell,
      description: "Build strength, endurance, and overall fitness.",
      habits: [
        { title: "Strength Training", description: "Resistance training for muscle growth", icon: "dumbbell", category: "fitness" as HabitCategory, impact: 9, effort: 7, timeCommitment: '45 min', frequency: '3x-week' as HabitFrequency, isAbsolute: false },
        { title: "Cardio Session", description: "Zone 2 cardio for endurance", icon: "activity", category: "fitness" as HabitCategory, impact: 8, effort: 5, timeCommitment: '30 min', frequency: '3x-week' as HabitFrequency, isAbsolute: false },
        { title: "Post-workout Stretch", description: "Improve recovery and flexibility", icon: "activity", category: "fitness" as HabitCategory, impact: 7, effort: 3, timeCommitment: '15 min', frequency: 'daily' as HabitFrequency, isAbsolute: false },
      ]
    }
  ];


  return (
    <PageContainer>
      <div className="space-y-8 py-8"> {/* Increased spacing */}
        <div className="text-center"> {/* Centered header */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Explore & Discover</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Find new habits, inspiration, and tools to accelerate your growth.
          </p>
        </div>

        {/* Habit Library Card - Moved from Dashboard */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center text-2xl">
              <Zap className="w-6 h-6 mr-2 text-purple-500" /> Habit Library & Starters
            </CardTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Quickly add proven habits or explore expert-curated stacks.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Quick Add Habits Section */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-4 text-foreground">Quick Add Individual Habits</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {quickAddTemplates.map((quickHabit) => (
                  <div key={quickHabit.title} className="border rounded-lg p-4 bg-background hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <quickHabit.IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="font-medium text-foreground truncate" title={quickHabit.title}>{quickHabit.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 flex-grow">{quickHabit.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-auto"
                      onClick={async () => {
                        const habitDataForApi: Omit<Habit, 'id' | 'createdAt' | 'streak'> = {
                          title: quickHabit.title,
                          description: quickHabit.description,
                          icon: quickHabit.iconName,
                          impact: 5, effort: 3, timeCommitment: '5 min',
                          frequency: 'daily', isAbsolute: true, category: quickHabit.category,
                        };
                        await addHabitExplore(habitDataForApi);
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add to Dashboard
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Expert Habit Stacks Section */}
            <div>
              <h4 className="text-xl font-semibold mb-4 text-foreground">Expert Habit Stacks</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expertStackTemplates.map((stack) => (
                  <div key={stack.name} className="border rounded-lg p-4 bg-background hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                       <stack.IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                       <h5 className="font-medium text-lg text-foreground truncate" title={stack.name}>{stack.name}</h5>
                    </div>
                    <ul className="text-xs text-muted-foreground mb-3 space-y-1 flex-grow">
                      {stack.habits.map(h => <li key={h.title} className="truncate" title={h.description}>- {h.title}</li>)}
                    </ul>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-auto"
                      onClick={async () => {
                        const habitPromises = stack.habits.map(template => {
                           const { title, description, icon, category } = template;
                           const habitDataForApi: Omit<Habit, 'id' | 'createdAt' | 'streak'> = {
                            title, description, icon, category,
                            impact: 5, effort: 3, timeCommitment: '5 min', frequency: 'daily', isAbsolute: true,
                           };
                           return addHabitExplore(habitDataForApi);
                        });
                        try {
                            await Promise.all(habitPromises);
                            alert(`${stack.name} habits added! Check your dashboard.`);
                        } catch (e) {
                            alert(`Error adding ${stack.name}. Some habits may not have been added.`);
                        }
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Stack to Dashboard
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Motivation Card (already here, will be restyled later) */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Daily Dose of Wisdom</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DailyMotivation />
          </CardContent>
        </Card>

        {/* Top Rated Supplements Card (already here) */}
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">Top Rated Supplements</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <TopRatedSupplements />
          </CardContent>
        </Card>

      </div>
    </PageContainer>
  );
}
