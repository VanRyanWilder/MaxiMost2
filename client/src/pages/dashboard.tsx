import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { HighRoiActivities } from "@/components/dashboard/high-roi-activities";
import { StreakHabitTracker } from "@/components/dashboard/streak-habit-tracker";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background font-sans min-h-screen overflow-hidden">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64 overflow-y-auto pb-20">
          <div className="container mx-auto px-4 py-6">
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
                <TabsTrigger value="tasks" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Daily Tasks
                </TabsTrigger>
                <TabsTrigger value="progress" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Progress Analytics
                </TabsTrigger>
                <TabsTrigger value="resources" className="px-4 py-2 text-sm font-medium rounded-t-lg">
                  Resources
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <DailyTasks />
              </TabsContent>
              
              <TabsContent value="progress">
                <ProgressVisualization />
              </TabsContent>
              
              <TabsContent value="resources">
                <ResourceLibrary />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
