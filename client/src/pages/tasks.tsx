// import { Sidebar } from "@/components/layout/sidebar"; // Removed: AppLayout handles sidebar
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed: AppLayout's TopHeader handles mobile toggle
import { useState } from "react"; // useState might still be used for other things, or can be removed if not
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyTasks } from "@/components/tasks/daily-tasks";
import { TaskCustomization } from "@/components/tasks/task-customization";
import { JournalingWidget } from "@/components/tasks/journaling-widget";

export default function Tasks() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed

  return (
    // The outer div and flex container are now handled by AppLayout.
    // PageContainer might be used here if it's a standard content wrapper, or just the content.
    // For now, assuming PageContainer is handled by AppLayout or not strictly needed for this page's direct render.
    // <div className="bg-gray-50 font-sans"> // Removed: AppLayout handles bg
      // <MobileHeader onMenuClick={() => setSidebarOpen(true)} /> // Removed
      
      // <div className="flex min-h-screen"> // Removed
        // <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} /> // Removed
        
        // <main className="flex-1 lg:ml-64"> // Removed lg:ml-64, flex-1 might be handled by AppLayout's main slot
        // The direct <main> tag will be provided by AppLayout. This component returns its content.
          <div className="container mx-auto px-4 py-6"> {/* This can be the root or wrapped in a PageContainer if desired */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">BeastMode Toolbox</h1>
                <p className="text-gray-600 mt-1">Your daily discipline toolkit for consistent improvement</p>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-2 text-sm">
                <span className="font-medium">Current streak:</span>
                <span className="font-bold text-primary">7 days</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 5.23858 18.7614 3 16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16ZM19 16C19 17.6569 17.6569 19 16 19H8C6.34315 19 5 17.6569 5 16V8C5 6.34315 6.34315 5 8 5H16C17.6569 5 19 6.34315 19 8V16Z" />
                  <path d="M8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9H16C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7H8Z" />
                  <path d="M7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z" />
                  <path d="M8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17H16C16.5523 17 17 16.5523 17 16C17 15.4477 16.5523 15 16 15H8Z" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Task Discipline</h2>
                <p className="text-white text-opacity-90 max-w-3xl">
                  "Discipline equals freedom. The hard path is the easy path. Do the things that are difficult, and life becomes easy." — Jocko Willink
                </p>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                    Daily Must-Dos
                  </div>
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                    Multiple Weekly Tasks
                  </div>
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm">
                    Task Customization
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="tasks" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
                <TabsTrigger value="journaling">Brain Dumping & Journaling</TabsTrigger>
                <TabsTrigger value="customize">Customize Tasks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <DailyTasks />
              </TabsContent>
              
              <TabsContent value="journaling">
                <JournalingWidget />
              </TabsContent>
              
              <TabsContent value="customize">
                <TaskCustomization />
              </TabsContent>
            </Tabs>
          </div>
  );
}