import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useUser } from "@/context/user-context";
import { type Program } from "@shared/schema";
import { getProgramColorClasses } from "@/lib/utils";

export function ProgramCard() {
  const { user } = useUser();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock program data for development
  useEffect(() => {
    if (user?.currentProgramId) {
      // In a real app, we would fetch this from the API
      const mockProgram: Program = {
        id: 3,
        name: "Complete Transformation",
        description: "Comprehensive program to transform your body, mind, and habits. This is our flagship program for those serious about change.",
        duration: 12,
        level: "Advanced",
        features: ["Full blood work analysis", "Custom supplement protocol", "Advanced fitness programming", "Deep habit reconstruction"],
        color: "progress",
        isPopular: true
      };
      
      setProgram(mockProgram);
      setIsLoading(false);
    }
  }, [user]);
  
  if (isLoading || !program) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Current Program</h3>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded mb-2.5"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentWeek = 4; // This would normally be calculated based on program start date
  const programProgress = 32; // This would normally be calculated based on program start date and duration
  const colorClasses = getProgramColorClasses(program.color);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Current Program</h3>
          <span className={`bg-primary text-white text-xs px-2 py-1 rounded`}>
            Week {currentWeek} of {program.duration}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold text-lg">{program.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{program.description}</p>
          
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium">{programProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${colorClasses.bg} h-2.5 rounded-full`} 
              style={{ width: `${programProgress}%` }}
            ></div>
          </div>
        </div>
        
        <a href="#" className="text-primary font-medium text-sm flex items-center">
          View program details
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 ml-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </a>
      </CardContent>
    </Card>
  );
}
