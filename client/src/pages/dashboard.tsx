import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { AIMotivationalCompanion } from "@/components/dashboard/ai-motivational-companion";
import { HighRoiActivities } from "@/components/dashboard/high-roi-activities";
import { LoopHabitTracker } from "@/components/dashboard/loop-habit-tracker";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { ResourceLibrary } from "@/components/resources/resource-library";
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
                <Tabs defaultValue="calendar" className="w-full mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <MoveUp className="h-5 w-5 text-primary" />
                      High-ROI Habits
                    </h2>
                    <TabsList>
                      <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3.5 w-3.5" /> Calendar
                      </TabsTrigger>
                      <TabsTrigger value="list" className="flex items-center gap-1 text-xs">
                        <ListChecks className="h-3.5 w-3.5" /> List
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="flex items-center gap-1 text-xs">
                        <BarChart2 className="h-3.5 w-3.5" /> Stats
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="calendar" className="mt-0">
                    <HabitStreakView 
                      activities={[]} 
                      completedActivities={[]}
                      onCompleteActivity={(id) => console.log(`Completing ${id}`)}
                      onAddHabit={() => console.log('Add habit')}
                      onShowStats={() => console.log('Show stats')}
                      onEditHabit={() => console.log('Edit habit')}
                    />
                  </TabsContent>
                  
                  <TabsContent value="list" className="mt-0">
                    <HighRoiActivities />
                  </TabsContent>
                  
                  <TabsContent value="stats" className="mt-0">
                    <HabitStatistics 
                      habitTitle="Morning Routine"
                      habitIcon={<Sun />}
                      completionData={{
                        dates: Array.from({ length: 30 }).map((_, i) => new Date(Date.now() - i * 86400000)),
                        completed: Array.from({ length: 30 }).map(() => Math.random() > 0.3)
                      }}
                      longestStreak={14}
                      currentStreak={7}
                      totalCompletions={67}
                      successRate={78}
                      impact={9}
                      effort={4}
                    />
                  </TabsContent>
                </Tabs>
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
