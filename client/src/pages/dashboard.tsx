import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HighRoiActivities } from "@/components/dashboard/high-roi-activities";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { PageContainer } from "@/components/layout/page-container";
import { DashboardHabits } from "@/components/dashboard/dashboard-habits";

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <WelcomeBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="w-full mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">High-ROI Habits</h2>
                <a href="/habits" className="text-primary text-sm hover:underline flex items-center gap-1">
                  <span>View all habits</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
              
              {/* Mini Habits Dashboard */}
              <DashboardHabits />
            </div>
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