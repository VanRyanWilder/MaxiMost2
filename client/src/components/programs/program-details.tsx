import { useState } from "react";
import { Program } from "../../types/program";
import { goalIcons, goalLabels, timeCommitmentLabels, fitnessLevelLabels } from "../../data/program-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, ArrowLeft, PlusCircle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Habit } from "../../types/habit";

interface ProgramDetailsProps {
  program: Program;
  onBack: () => void;
  onAddHabit: (habitId: string) => void;
  onAddAllHabits: (habitIds: string[]) => void;
  habitLibrary: Habit[];
}

export default function ProgramDetails({ 
  program, 
  onBack, 
  onAddHabit,
  onAddAllHabits,
  habitLibrary
}: ProgramDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const PrimaryGoalIcon = goalIcons[program.primaryGoal];
  
  // Filter and find habits that are part of this program
  const programHabits = program.habitIds.map(habitId => {
    // Try to find the habit in our library by matching habit name to habit ID
    // This is a simplified approach - in a real app you'd have proper IDs
    const foundHabit = habitLibrary.find(h => 
      h.title.toLowerCase().includes(habitId.split('-').join(' ').toLowerCase())
    );
    
    if (foundHabit) {
      return foundHabit;
    }
    
    // Fallback - create a placeholder habit if not found
    return {
      id: habitId,
      title: habitId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: "A habit for your program.",
      icon: "CircleCheck",
      iconColor: "blue",
      impact: 7,
      effort: 5,
      timeCommitment: "moderate",
      frequency: "daily", 
      isAbsolute: false,
      category: "health",
      streak: 0,
      createdAt: new Date()
    };
  });
  
  const handleAddAllHabits = () => {
    onAddAllHabits(program.habitIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Recommendations
        </Button>
        
        <h1 className="text-2xl font-bold">{program.name}</h1>
      </div>
      
      <Card>
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white">
              <PrimaryGoalIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-700">{program.name}</CardTitle>
              <CardDescription className="text-blue-600/80">
                {goalLabels[program.primaryGoal]} Program • {program.durationWeeks} weeks
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="habits">Program Habits</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{program.durationWeeks} weeks</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <div className="text-sm text-gray-500">Time Commitment</div>
                    <div className="font-medium">{timeCommitmentLabels[program.timeCommitment]}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Suitable For</h3>
                <div className="flex flex-wrap gap-2">
                  {program.fitnessLevel.map(level => (
                    <Badge key={level} variant="outline">
                      {fitnessLevelLabels[level]}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Goals This Program Supports</h3>
                <div className="flex flex-wrap gap-2">
                  {program.supportedGoals.map(goal => (
                    <Badge key={goal} className={`${program.primaryGoal === goal ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {goalLabels[goal]}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Habits</h3>
                <ul className="space-y-2">
                  {program.habitIds.slice(0, 3).map(habitId => (
                    <li key={habitId} className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      <span className="flex-grow">
                        {habitId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => onAddHabit(habitId)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </li>
                  ))}
                  {program.habitIds.length > 3 && (
                    <li className="text-sm text-blue-600 pl-7 cursor-pointer" onClick={() => setActiveTab("habits")}>
                      + View all {program.habitIds.length} habits
                    </li>
                  )}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="habits" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Program Habits</h3>
                <Button onClick={handleAddAllHabits}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add All Habits
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                {programHabits.map(habit => (
                  <Card key={habit.id} className="overflow-hidden">
                    <div className="p-4 flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`p-2 rounded-full bg-${habit.iconColor}-100`}>
                          <CheckCircle className={`h-5 w-5 text-${habit.iconColor}-600`} />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{habit.title}</h4>
                        <p className="text-sm text-gray-500">{habit.description}</p>
                        <div className="flex items-center mt-1 gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {habit.frequency}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {habit.timeCommitment} • Impact: {habit.impact}/10
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => onAddHabit(habit.id)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Program Schedule</h4>
                  <p className="text-sm text-blue-700">
                    This program runs for {program.durationWeeks} weeks and is designed to be followed at your own pace.
                    Add the habits to your dashboard to start tracking your progress.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Week-by-Week Breakdown</h3>
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="py-3 px-4 bg-gray-50">
                      <CardTitle className="text-base">Week 1-2: Foundation</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Focus on establishing the core habits and building consistency.
                      </p>
                      <ul className="space-y-1 text-sm">
                        {programHabits.slice(0, 2).map(habit => (
                          <li key={habit.id} className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>{habit.title}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3 px-4 bg-gray-50">
                      <CardTitle className="text-base">Week 3-4: Build</CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Add more challenging habits and increase consistency.
                      </p>
                      <ul className="space-y-1 text-sm">
                        {programHabits.slice(0, 4).map(habit => (
                          <li key={habit.id} className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>{habit.title}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  {program.durationWeeks > 4 && (
                    <Card>
                      <CardHeader className="py-3 px-4 bg-gray-50">
                        <CardTitle className="text-base">Week 5+: Mastery</CardTitle>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Maintain all habits and focus on consistency and improvement.
                        </p>
                        <ul className="space-y-1 text-sm">
                          {programHabits.map(habit => (
                            <li key={habit.id} className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              <span>{habit.title}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="bg-gray-50 justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <Button onClick={handleAddAllHabits}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add All Habits
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}