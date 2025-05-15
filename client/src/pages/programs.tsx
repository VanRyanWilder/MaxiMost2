import { useState } from "react";
import { Program, RecommendationCriteria } from "../types/program";
import UserGoalForm from "../components/programs/user-goal-form";
import ProgramRecommendations from "../components/programs/program-recommendations";
import ProgramDetails from "../components/programs/program-details";
import { Habit } from "../types/habit";
import { programs } from "../data/program-data";
import { PageContainer } from "../components/layout/page-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Placeholder for habit library - to be populated from habit-data.ts once it's fully integrated
const allHabits: Habit[] = [];

export default function ProgramsPage() {
  const [criteria, setCriteria] = useState<RecommendationCriteria | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeTab, setActiveTab] = useState<string>("form");
  
  const handleFormSubmit = (formCriteria: RecommendationCriteria) => {
    setCriteria(formCriteria);
    setActiveTab("recommendations");
  };
  
  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program);
    setActiveTab("details");
  };
  
  const handleBackToRecommendations = () => {
    setSelectedProgram(null);
    setActiveTab("recommendations");
  };
  
  const handleResetForm = () => {
    setCriteria(null);
    setSelectedProgram(null);
    setActiveTab("form");
  };
  
  const handleAddHabit = (habitId: string) => {
    // Find a matching habit from our library
    const habit = allHabits.find(h => 
      h.title.toLowerCase().includes(habitId.split('-').join(' ').toLowerCase())
    );
    
    if (habit) {
      // In a real app, this would dispatch to a store or context
      console.log("Adding habit:", habit.title);
    } else {
      console.log("Adding habit by ID:", habitId);
    }
  };
  
  const handleAddAllHabits = (habitIds: string[]) => {
    // In a real app, this would add all habits to the user's dashboard
    console.log("Adding all habits:", habitIds);
  };
  
  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Recommendations</h1>
            <p className="text-gray-500 mt-1">
              Get personalized program recommendations based on your goals and preferences
            </p>
          </div>
          
          {activeTab !== "form" && (
            <Button variant="outline" onClick={handleResetForm}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Start Over
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="hidden">
            <TabsTrigger value="form">Goal Form</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="details">Program Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="space-y-6">
            <UserGoalForm onSubmit={handleFormSubmit} initialValues={criteria || undefined} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            {criteria && (
              <ProgramRecommendations 
                criteria={criteria}
                onSelectProgram={handleSelectProgram}
              />
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            {selectedProgram && (
              <ProgramDetails 
                program={selectedProgram}
                onBack={handleBackToRecommendations}
                onAddHabit={handleAddHabit}
                onAddAllHabits={handleAddAllHabits}
                habitLibrary={allHabits}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}