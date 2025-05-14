import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { ProgramCard } from "@/components/dashboard/program-card";
import { MetricsCard } from "@/components/dashboard/metrics-card";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { AIMotivationalCompanion } from "@/components/dashboard/ai-motivational-companion";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { DailySchedule } from "@/components/schedule/daily-schedule";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { ProgramList } from "@/components/programs/program-list";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <WelcomeBanner />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProgressCard />
                  <ProgramCard />
                </div>
              </div>
              <div className="space-y-6">
                <AIMotivationalCompanion />
                <DailyMotivation />
              </div>
            </div>
            
            <Tabs defaultValue="tasks" className="mb-6">
              <TabsList className="mb-6 border-b border-border w-full justify-start overflow-x-auto">
                <TabsTrigger value="tasks" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Daily Tasks
                </TabsTrigger>
                <TabsTrigger value="schedule" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Today's Schedule
                </TabsTrigger>
                <TabsTrigger value="progress" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Progress Analytics
                </TabsTrigger>
                <TabsTrigger value="resources" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="programs" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Programs
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <DailyTasks />
              </TabsContent>
              
              <TabsContent value="schedule">
                <DailySchedule />
              </TabsContent>
              
              <TabsContent value="progress">
                <ProgressVisualization />
              </TabsContent>
              
              <TabsContent value="resources">
                <ResourceLibrary />
              </TabsContent>
              
              <TabsContent value="programs">
                <ProgramList />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
