import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { ProgramList } from "@/components/programs/program-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CheckCircle } from "lucide-react";

interface MilestoneType {
  week: number;
  title: string;
  description: string;
  achievements: string[];
}

export default function Programs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const milestones: MilestoneType[] = [
    {
      week: 1,
      title: "Foundation Building",
      description: "Establish baseline habits and prepare body systems for progression",
      achievements: [
        "Establish morning and evening routines",
        "Baseline fitness assessment",
        "Implement basic nutrition framework",
        "Begin daily meditation practice"
      ]
    },
    {
      week: 4,
      title: "Adaptation Phase",
      description: "Your body and mind begin adapting to your new lifestyle",
      achievements: [
        "First noticeable physical changes",
        "Improved sleep quality metrics",
        "Meditation sessions extending to 15 minutes",
        "Reduced cravings for processed foods"
      ]
    },
    {
      week: 8, 
      title: "Breakthrough Period",
      description: "Mental and physical breakthroughs as adaptations compound",
      achievements: [
        "Significant strength improvements",
        "Enhanced mental clarity and focus duration",
        "Established intermittent fasting protocol",
        "Consistent adherence to cold exposure therapy"
      ]
    },
    {
      week: 12,
      title: "Transformation Complete",
      description: "Fundamental transformation of body composition and mental resilience",
      achievements: [
        "Body composition goals achieved",
        "Advanced meditation practice established",
        "Full nutritional discipline",
        "High stress resilience and emotional control"
      ]
    }
  ];

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Development Programs</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Program Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                  <div className="flex w-max space-x-4 p-4">
                    {milestones.map((milestone) => (
                      <Card key={milestone.week} className="w-[350px] shrink-0">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle>Week {milestone.week}</CardTitle>
                            <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                              {milestone.title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{milestone.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {milestone.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-center text-sm">
                                <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
            
            <ProgramList />
          </div>
        </main>
      </div>
    </div>
  );
}
