import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProgramGoalCategory, FitnessLevel, TimeCommitment, RecommendationCriteria } from "../../types/program";
import { goalLabels, goalIcons, fitnessLevelLabels, timeCommitmentLabels, timeCommitmentIcons } from "../../data/program-data";

interface UserGoalFormProps {
  onSubmit: (criteria: RecommendationCriteria) => void;
  initialValues?: Partial<RecommendationCriteria>;
}

export default function UserGoalForm({ onSubmit, initialValues }: UserGoalFormProps) {
  const [primaryGoal, setPrimaryGoal] = useState<ProgramGoalCategory>(
    initialValues?.primaryGoal || "health-optimization"
  );
  const [secondaryGoal, setSecondaryGoal] = useState<ProgramGoalCategory | undefined>(
    initialValues?.secondaryGoal
  );
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(
    initialValues?.fitnessLevel || "beginner"
  );
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>(
    initialValues?.timeCommitment || "moderate"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const criteria: RecommendationCriteria = {
      primaryGoal,
      secondaryGoal,
      fitnessLevel,
      timeCommitment
    };
    
    onSubmit(criteria);
  };

  const PrimaryGoalIcon = goalIcons[primaryGoal];
  const TimeIcon = timeCommitmentIcons[timeCommitment];

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-xl text-blue-700">Personalize Your Program</CardTitle>
          <CardDescription>
            Tell us about your goals and preferences to get tailored recommendations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="text-base font-semibold">What is your primary goal?</h3>
            
            <RadioGroup
              value={primaryGoal}
              onValueChange={(value) => setPrimaryGoal(value as ProgramGoalCategory)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {Object.entries(goalLabels).map(([key, label]) => {
                const GoalIcon = goalIcons[key as ProgramGoalCategory];
                return (
                  <Label
                    key={key}
                    htmlFor={`goal-${key}`}
                    className={`flex items-center space-x-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      primaryGoal === key ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem id={`goal-${key}`} value={key} className="sr-only" />
                    <div className={`p-1.5 rounded-full ${primaryGoal === key ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <GoalIcon className={`h-5 w-5 ${primaryGoal === key ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${primaryGoal === key ? 'text-blue-700' : 'text-gray-700'}`}>
                        {label}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-base font-semibold mb-3">Do you have a secondary goal?</h3>
            <Select 
              value={secondaryGoal || "none"} 
              onValueChange={(value) => setSecondaryGoal(value === "none" ? undefined : value as ProgramGoalCategory)}
            >
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a secondary goal (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No secondary goal</SelectItem>
                {Object.entries(goalLabels)
                  .filter(([key]) => key !== primaryGoal)
                  .map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-base font-semibold mb-3">What is your current fitness level?</h3>
            <RadioGroup
              value={fitnessLevel}
              onValueChange={(value) => setFitnessLevel(value as FitnessLevel)}
              className="flex flex-col sm:flex-row gap-3"
            >
              {Object.entries(fitnessLevelLabels).map(([key, label]) => (
                <Label
                  key={key}
                  htmlFor={`level-${key}`}
                  className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-colors ${
                    fitnessLevel === key ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem id={`level-${key}`} value={key} className="sr-only" />
                  <div className="flex-1 text-center">
                    <p className={`font-medium ${fitnessLevel === key ? 'text-blue-700' : 'text-gray-700'}`}>
                      {label}
                    </p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-base font-semibold mb-3">How much time can you commit daily?</h3>
            <RadioGroup
              value={timeCommitment}
              onValueChange={(value) => setTimeCommitment(value as TimeCommitment)}
              className="flex flex-col sm:flex-row gap-3"
            >
              {Object.entries(timeCommitmentLabels).map(([key, label]) => {
                const TimeIcon = timeCommitmentIcons[key as TimeCommitment];
                return (
                  <Label
                    key={key}
                    htmlFor={`time-${key}`}
                    className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer transition-colors ${
                      timeCommitment === key ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem id={`time-${key}`} value={key} className="sr-only" />
                    <TimeIcon className={`h-4 w-4 mr-2 ${timeCommitment === key ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${timeCommitment === key ? 'text-blue-700' : 'text-gray-700'}`}>
                        {label}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <PrimaryGoalIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Focusing on {goalLabels[primaryGoal]}
                {secondaryGoal && ` and ${goalLabels[secondaryGoal]}`}
              </p>
              <p className="text-xs text-gray-500">
                {fitnessLevelLabels[fitnessLevel]} • {timeCommitmentLabels[timeCommitment]}
              </p>
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Get Recommendations
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}