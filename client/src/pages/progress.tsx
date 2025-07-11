// import { useState } from "react"; // Removed
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { ProgressVisualization } from "@/components/dashboard/progress-visualization";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Calendar, Activity, Brain } from "lucide-react";

export default function Progress() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed

  return (
    // Outer divs, Sidebar, MobileHeader removed
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2 bg-red-50 border border-red-100 rounded-lg p-4">
                        <h3 className="font-medium text-red-600 mb-2 text-sm">Physical Training</h3>
                        <p className="text-sm text-gray-600">
                          Track your workout consistency and strength progression.
                        </p>
                      </div>
                      <div className="md:col-span-1 bg-orange-50 border border-orange-100 rounded-lg p-4">
                        <h3 className="font-medium text-orange-600 mb-2 text-sm">Nutrition</h3>
                        <p className="text-sm text-gray-600">
                          Monitor your eating habits and fueling patterns.
                        </p>
                      </div>
                      <div className="md:col-span-1 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                        <h3 className="font-medium text-indigo-600 mb-2 text-sm">Sleep</h3>
                        <p className="text-sm text-gray-600">
                          Track your sleep quality and hygiene routines.
                        </p>
                      </div>
                      <div className="md:col-span-1 bg-amber-50 border border-amber-100 rounded-lg p-4">
                        <h3 className="font-medium text-amber-600 mb-2 text-sm">Mental Growth</h3>
                        <p className="text-sm text-gray-600">
                          Measure your cognitive development and learning.
                        </p>
                      </div>
                      <div className="md:col-span-1 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-medium text-blue-600 mb-2 text-sm">Relationships</h3>
                        <p className="text-sm text-gray-600">
                          Build and maintain meaningful connections.
                        </p>
                      </div>
                      <div className="md:col-span-2 bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-medium text-green-600 mb-2 text-sm">Financial Habits</h3>
                        <p className="text-sm text-gray-600">
                          Track your money management and financial growth routines.
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
  );
}