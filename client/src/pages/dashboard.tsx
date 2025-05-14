import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HighRoiActivities } from "@/components/dashboard/high-roi-activities";
import { StreakHabitTracker } from "@/components/dashboard/streak-habit-tracker";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { PageContainer } from "@/components/layout/page-container";

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <WelcomeBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="loop" className="w-full mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">High-ROI Habits</h2>
                <TabsList>
                  <TabsTrigger value="loop" className="text-xs">
                    Streak View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="text-xs">
                    List View
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="loop" className="mt-0">
                <StreakHabitTracker />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <HighRoiActivities />
              </TabsContent>
            </Tabs>
          </div>
          <div className="space-y-6">
            <DailyMotivation />
          </div>
        </div>
        
        <Tabs defaultValue="tasks" className="mb-6">
          <TabsList className="mb-6 border-b border-border w-full justify-start overflow-x-auto">
            <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-2">
              Daily Tasks
            </TabsTrigger>
            <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-2">
              Resources
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary pb-2">
              Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-0">
            <DailyTasks />
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <ResourceLibrary />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <ProgressVisualization />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCard 
            title="Current Program"
            value="Beast Mode Program"
            trend="+12%"
            description="Week 3 of 12"
          />
          <ProgressCard 
            title="Habit Completion"
            value="87%"
            trend="+5%"
            description="Last 7 days"
          />
          <ProgressCard 
            title="Daily Streak"
            value="9 days"
            trend="+2"
            description="New record!"
          />
        </div>
      </div>
    </PageContainer>
  );
}