import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { TaskCustomization } from "@/components/tasks/task-customization";

export default function Tasks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Daily Tasks</h1>
            
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Task Discipline</h2>
              <p className="text-white text-opacity-90 max-w-3xl">
                "Discipline equals freedom. The hard path is the easy path. Do the things that are difficult, and life becomes easy." — Jocko Willink
              </p>
            </div>
            
            <Tabs defaultValue="tasks" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
                <TabsTrigger value="customize">Customize Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <DailyTasks />
              </TabsContent>
              
              <TabsContent value="customize">
                <TaskCustomization />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}