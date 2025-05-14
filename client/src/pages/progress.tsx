import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Activity, Brain } from "lucide-react";

export default function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  Progress Analytics
                </h1>
                <p className="text-gray-600 mt-1">Track, visualize, and analyze your self-improvement journey</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  <span>5 Metrics Tracked</span>
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Your Growth Mindset
                    </CardTitle>
                    <CardDescription>
                      Personalized insights to power your transformation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Your progress data tells a story of commitment and growth. The visualizations and analytics 
                      below provide insights into your habits, performance metrics, and overall progress toward your goals.
                      Use these insights to identify patterns, celebrate wins, and refine your approach.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-medium text-blue-700 mb-2 text-sm">Consistency</h3>
                        <p className="text-sm text-gray-600">
                          Track how regularly you maintain your habits and routines over time.
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-medium text-purple-700 mb-2 text-sm">Performance</h3>
                        <p className="text-sm text-gray-600">
                          Measure your physical and mental metrics to track tangible progress.
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-medium text-green-700 mb-2 text-sm">Growth</h3>
                        <p className="text-sm text-gray-600">
                          Visualize your long-term improvement across all aspects of development.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Removed AI Motivational Companion */}
            </div>
            
            <Tabs defaultValue="charts" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="charts">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Charts & Analytics
                </TabsTrigger>
                <TabsTrigger value="goals">
                  <Activity className="h-4 w-4 mr-2" />
                  Goals & Milestones
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts">
                <ProgressVisualization />
              </TabsContent>
              
              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle>Goals & Milestones</CardTitle>
                    <CardDescription>
                      Set targets and track your milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Goals Tracking Coming Soon</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        The ability to set, track, and manage goals with milestones will be available in the next update. 
                        For now, you can track your progress using the charts and analytics.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}