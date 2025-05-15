import { useState } from 'react';
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { DashboardHabits } from "@/components/dashboard/dashboard-habits";
import { HighRoiActivities } from "@/components/dashboard/high-roi-activities";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ProgressCard } from "@/components/dashboard/progress-card";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col">
        <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <PageContainer title="Dashboard">
          <WelcomeBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <DashboardHabits />
              
              <Tabs defaultValue="daily">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Your Progress</h2>
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="daily" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProgressCard 
                      title="Habits Completed" 
                      value="5/8" 
                      trend="+12%" 
                      description="today" 
                    />
                    <ProgressCard 
                      title="Streak" 
                      value="7 days" 
                      trend="+2" 
                      description="best ever: 14"
                    />
                    <ProgressCard 
                      title="Consistency" 
                      value="86%" 
                      trend="+4%" 
                      description="last 30 days"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="weekly" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProgressCard 
                      title="Weekly Completion" 
                      value="78%" 
                      trend="+5%" 
                      description="this week" 
                    />
                    <ProgressCard 
                      title="Most Consistent" 
                      value="Exercise" 
                      description="92% completion"
                    />
                    <ProgressCard 
                      title="Needs Focus" 
                      value="Reading" 
                      trend="-5%" 
                      description="45% completion"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="monthly" className="m-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ProgressCard 
                      title="Monthly Habits" 
                      value="24/30" 
                      trend="+3" 
                      description="completed" 
                    />
                    <ProgressCard 
                      title="Perfect Days" 
                      value="18" 
                      trend="+5" 
                      description="out of 30"
                    />
                    <ProgressCard 
                      title="Avg. Completion" 
                      value="81%" 
                      trend="+7%" 
                      description="this month"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <Card>
                <CardHeader>
                  <CardTitle>Habit Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Your top performing habits and areas for improvement.</p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Morning Routine</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Exercise</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Reading</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-primary/20 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <DailyMotivation />
              <HighRoiActivities />
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}