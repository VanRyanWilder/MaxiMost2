import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Info, Lightbulb, CheckCircle, Clock3 } from "lucide-react";
import { Task } from "@shared/schema";
import { categoryColors, frequencyColors } from "@/lib/utils";

interface TaskPresetOption {
  id: string;
  name: string;
  description: string;
  image: string;
  recommendedFor: string[];
}

export function TaskCustomization() {
  const [currentPreset, setCurrentPreset] = useState<string>("balanced");
  const [userProfile, setUserProfile] = useState({
    age: "30-45",
    fitnessLevel: "intermediate",
    focus: "balanced",
    time: "moderate"
  });
  
  const [customizedTasks, setCustomizedTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Morning Meditation",
      description: "10 minutes of focused meditation",
      category: "Mind",
      frequency: "Must-Do",
      programId: 1
    },
    {
      id: 2,
      title: "Strength Training",
      description: "30-45 min strength session",
      category: "Body",
      frequency: "5x Weekly",
      programId: 1
    },
    {
      id: 3,
      title: "Cold Shower",
      description: "2-minute cold exposure",
      category: "Body",
      frequency: "Must-Do",
      programId: 1
    },
    {
      id: 4,
      title: "Brain Dump Journaling",
      description: "Stream of consciousness writing",
      category: "Mind",
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
      title: "Reading",
      description: "20 pages minimum",
      category: "Mind",
      frequency: "3x Weekly",
      programId: 1
    }
  ]);
  
  const taskPresets: TaskPresetOption[] = [
    {
      id: "balanced",
      name: "Balanced Development",
      description: "Equal focus on physical, mental, and spiritual growth",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019a3c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      recommendedFor: ["Beginners", "Anyone seeking overall growth"]
    },
    {
      id: "physical",
      name: "Physical Focus",
      description: "Emphasis on training, recovery, and physical performance",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      recommendedFor: ["Athletes", "Body transformation goals"]
    },
    {
      id: "mental",
      name: "Mental Mastery",
      description: "Focus on cognitive enhancement and mental resilience",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      recommendedFor: ["Knowledge workers", "Students", "Entrepreneurs"]
    },
    {
      id: "minimal",
      name: "Minimalist Protocol",
      description: "Essential practices for busy individuals with limited time",
      image: "https://images.unsplash.com/photo-1472148439583-1f4cf81b80e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      recommendedFor: ["Busy professionals", "Parents", "Time-constrained"]
    }
  ];
  
  // Toggle task frequency between Must-Do and flexible options
  const toggleTaskFrequency = (taskId: number) => {
    setCustomizedTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          frequency: task.frequency === "Must-Do" ? "3x Weekly" : "Must-Do"
        };
      }
      return task;
    }));
  };
  
  // Function to get recommended preset based on user profile
  const getRecommendedPreset = () => {
    if (userProfile.time === "minimal") return "minimal";
    if (userProfile.focus === "physical") return "physical";
    if (userProfile.focus === "mental") return "mental";
    return "balanced";
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5 text-primary" />
            Customize Your Daily Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Tailor your daily tasks to match your goals, experience level, and available time. 
            Choose a preset or customize individual tasks to create your perfect routine.
          </p>
          
          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Your Profile</TabsTrigger>
              <TabsTrigger value="presets">Task Presets</TabsTrigger>
              <TabsTrigger value="customize">Manual Customization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Tell us about yourself</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    We'll recommend the best task configuration based on your profile
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Age Range</Label>
                      <RadioGroup 
                        defaultValue={userProfile.age}
                        onValueChange={(value) => setUserProfile({...userProfile, age: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="18-29" id="age-1" />
                          <Label htmlFor="age-1">18-29</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30-45" id="age-2" />
                          <Label htmlFor="age-2">30-45</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="46-60" id="age-3" />
                          <Label htmlFor="age-3">46-60</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="60+" id="age-4" />
                          <Label htmlFor="age-4">60+</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Fitness Level</Label>
                      <RadioGroup 
                        defaultValue={userProfile.fitnessLevel}
                        onValueChange={(value) => setUserProfile({...userProfile, fitnessLevel: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="fitness-1" />
                          <Label htmlFor="fitness-1">Beginner</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="fitness-2" />
                          <Label htmlFor="fitness-2">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="fitness-3" />
                          <Label htmlFor="fitness-3">Advanced</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Primary Focus Area</Label>
                      <RadioGroup 
                        defaultValue={userProfile.focus}
                        onValueChange={(value) => setUserProfile({...userProfile, focus: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="balanced" id="focus-1" />
                          <Label htmlFor="focus-1">Balanced Development</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="physical" id="focus-2" />
                          <Label htmlFor="focus-2">Physical Performance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mental" id="focus-3" />
                          <Label htmlFor="focus-3">Mental & Cognitive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="spiritual" id="focus-4" />
                          <Label htmlFor="focus-4">Spiritual Growth</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Available Time</Label>
                      <RadioGroup 
                        defaultValue={userProfile.time}
                        onValueChange={(value) => setUserProfile({...userProfile, time: value})}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="minimal" id="time-1" />
                          <Label htmlFor="time-1">Minimal (30min/day)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="moderate" id="time-2" />
                          <Label htmlFor="time-2">Moderate (1hr/day)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dedicated" id="time-3" />
                          <Label htmlFor="time-3">Dedicated (2hr+/day)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center p-4 bg-primary bg-opacity-10 rounded-lg">
                    <div className="flex items-center">
                      <Lightbulb className="h-6 w-6 text-primary mr-2" />
                      <div>
                        <h4 className="font-medium">Recommended Preset:</h4>
                        <p className="text-sm text-gray-600">{taskPresets.find(p => p.id === getRecommendedPreset())?.name}</p>
                      </div>
                    </div>
                    <Button onClick={() => setCurrentPreset(getRecommendedPreset())}>
                      Apply Recommendation
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="presets">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {taskPresets.map((preset) => (
                  <div 
                    key={preset.id} 
                    className={`border rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                      currentPreset === preset.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentPreset(preset.id)}
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{preset.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{preset.description}</p>
                      <div className="text-sm">
                        <p className="text-gray-500 mb-1">Recommended for:</p>
                        <ul className="list-disc list-inside">
                          {preset.recommendedFor.map((rec, i) => (
                            <li key={i} className="text-gray-600">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        {currentPreset === preset.id ? (
                          <Button variant="default" className="w-full" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" /> Applied
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" onClick={() => setCurrentPreset(preset.id)}>
                            Apply Preset
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="customize">
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Task Configuration</h3>
                  <Button variant="outline" size="sm">
                    <Clock3 className="mr-2 h-4 w-4" />
                    Reset to Defaults
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {customizedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{task.title}</h4>
                            <p className="text-sm text-gray-500">{task.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="flex flex-col items-end">
                              <span className={`text-xs px-2 py-1 rounded mb-1 ${categoryColors[task.category].bg} ${categoryColors[task.category].text}`}>
                                {task.category}
                              </span>
                              <Select defaultValue={task.frequency}>
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                  <SelectValue placeholder="Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Must-Do">Must-Do</SelectItem>
                                  <SelectItem value="3x Weekly">3x Weekly</SelectItem>
                                  <SelectItem value="5x Weekly">5x Weekly</SelectItem>
                                  <SelectItem value="Weekly">Weekly</SelectItem>
                                  <SelectItem value="Optional">Optional</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`task-${task.id}`}
                                checked={task.frequency === "Must-Do"}
                                onCheckedChange={() => toggleTaskFrequency(task.id)}
                              />
                              <Label htmlFor={`task-${task.id}`} className="text-sm">
                                Must-Do
                              </Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-end space-x-4">
                  <Button variant="outline">Reset Changes</Button>
                  <Button>Save Customization</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}