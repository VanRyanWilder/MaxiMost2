import { useState } from "react";
import { Program, RecommendationCriteria } from "../../types/program";
import { getRecommendedPrograms, goalIcons, goalLabels, fitnessLevelLabels, timeCommitmentLabels } from "../../data/program-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Check, ArrowRight, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgramRecommendationsProps {
  criteria: RecommendationCriteria;
  onSelectProgram: (program: Program) => void;
  maxShown?: number;
}

export default function ProgramRecommendations({ 
  criteria, 
  onSelectProgram,
  maxShown = 5
}: ProgramRecommendationsProps) {
  const allRecommendations = getRecommendedPrograms(criteria);
  const [showAll, setShowAll] = useState(false);
  
  const recommendations = showAll 
    ? allRecommendations 
    : allRecommendations.slice(0, maxShown);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personalized Programs</h2>
          <p className="text-gray-500">
            Based on your goals: {goalLabels[criteria.primaryGoal]}
            {criteria.secondaryGoal && ` and ${goalLabels[criteria.secondaryGoal]}`}
          </p>
        </div>
        
        {allRecommendations.length > maxShown && (
          <Button 
            variant="ghost" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Top Recommendations" : "Show All Programs"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((program) => (
          <ProgramCard 
            key={program.id} 
            program={program} 
            onSelect={() => onSelectProgram(program)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProgramCardProps {
  program: Program;
  onSelect: () => void;
}

function ProgramCard({ program, onSelect }: ProgramCardProps) {
  const PrimaryGoalIcon = goalIcons[program.primaryGoal];
  const matchScore = program.recommendationScore || 0;
  const matchPercentage = Math.min(100, Math.max(0, matchScore));
  
  // Determine the match level text and color
  let matchLevel = "Perfect Match";
  let matchColor = "text-green-600";
  let matchBg = "bg-green-50";
  let matchBorder = "border-green-200";
  
  if (matchScore < 70) {
    matchLevel = "Good Match";
    matchColor = "text-blue-600";
    matchBg = "bg-blue-50";
    matchBorder = "border-blue-200";
  }
  if (matchScore < 50) {
    matchLevel = "Moderate Match";
    matchColor = "text-yellow-600";
    matchBg = "bg-yellow-50";
    matchBorder = "border-yellow-200";
  }
  if (matchScore < 30) {
    matchLevel = "Minimal Match";
    matchColor = "text-gray-600";
    matchBg = "bg-gray-50";
    matchBorder = "border-gray-200";
  }

  return (
    <Card className={`overflow-hidden border ${matchBorder} transition-all hover:shadow-md`}>
      <CardHeader className={`${matchBg} pb-2`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full bg-white mr-2`}>
              <PrimaryGoalIcon className={`h-5 w-5 ${matchColor}`} />
            </div>
            <CardTitle className="text-lg font-semibold">{program.name}</CardTitle>
          </div>
          
          {matchScore > 0 && (
            <Badge variant="outline" className={`${matchColor} ${matchBg} border-0`}>
              <Award className="h-3 w-3 mr-1" />
              {matchLevel}
            </Badge>
          )}
        </div>
        <CardDescription className="mt-2">{program.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-4">
          {matchScore > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Match Score</span>
                <span className={`font-medium ${matchColor}`}>{Math.round(matchPercentage)}%</span>
              </div>
              <Progress value={matchPercentage} className="h-1.5" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{program.durationWeeks} weeks</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>{timeCommitmentLabels[program.timeCommitment].split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {program.fitnessLevel.map(level => (
              <Badge key={level} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                {fitnessLevelLabels[level]}
              </Badge>
            ))}
            {program.supportedGoals.slice(0, 2).map(goal => (
              <Badge key={goal} variant="secondary" className={`bg-${program.primaryGoal === goal ? 'blue' : 'gray'}-100 text-${program.primaryGoal === goal ? 'blue' : 'gray'}-700`}>
                {goalLabels[goal]}
              </Badge>
            ))}
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Core Habits:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {program.habitIds.slice(0, 3).map(habit => (
                <li key={habit} className="flex items-start">
                  <Check className="h-4 w-4 mr-1.5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{habit.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                </li>
              ))}
              {program.habitIds.length > 3 && (
                <li className="text-sm text-gray-500 italic">
                  + {program.habitIds.length - 3} more habits
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 py-3">
        <Button className="w-full" onClick={onSelect}>
          View Program Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}