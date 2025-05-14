import { useQuery } from "@tanstack/react-query";
import { type Program } from "@shared/schema";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getProgramColorClasses } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/user-context";
import { apiRequest } from "@/lib/queryClient";

export function ProgramList() {
  const [selectedDuration, setSelectedDuration] = useState<string>("All Durations");
  const { toast } = useToast();
  const { user, refetchUser } = useUser();
  
  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
  });
  
  // Filter programs by duration if needed
  const filteredPrograms = selectedDuration !== "All Durations"
    ? programs?.filter(program => {
        const duration = parseInt(selectedDuration);
        return program.duration === duration;
      })
    : programs;
    
  const handleStartProgram = async (programId: number) => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to start a program",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest("PATCH", `/api/users/${user.id}/program`, { programId });
      
      toast({
        title: "Program started!",
        description: "Your new program has been set up and is ready to go.",
        variant: "default",
      });
      
      // Refetch user data to update UI
      refetchUser();
    } catch (error) {
      console.error("Failed to start program:", error);
      toast({
        title: "Failed to start program",
        description: "There was an error starting your program. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl">Development Programs</h3>
        <div className="flex space-x-2">
          <select 
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
          >
            <option>All Durations</option>
            <option>3</option>
            <option>6</option>
            <option>12</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-3 bg-gray-200"></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded mt-2"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                
                <div className="h-16 bg-gray-200 rounded mt-3 mb-4"></div>
                
                <div className="space-y-2 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms?.map((program) => {
            const colorClasses = getProgramColorClasses(program.color);
            return (
              <div 
                key={program.id} 
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm relative"
              >
                {program.isPopular && (
                  <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
                <div className={`h-3 ${colorClasses.bg}`}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs ${colorClasses.bg} bg-opacity-10 ${colorClasses.bg.replace('bg-', 'text-')} px-2 py-1 rounded`}>
                        {program.duration} Weeks
                      </span>
                      <h4 className="font-semibold text-lg mt-2">{program.name}</h4>
                    </div>
                    <span className="bg-dark text-white text-xs px-3 py-1 rounded-full">
                      {program.level}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3 mb-4">{program.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${colorClasses.bg} text-white py-2 rounded-lg font-medium`}
                    onClick={() => handleStartProgram(program.id)}
                  >
                    {program.id === user?.currentProgramId ? "Current Program" : "Start Program"}
                  </Button>
                </div>
              </div>
            );
          })}
          
          {/* Custom Program Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50">
            <div className="h-3 bg-dark"></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-dark bg-opacity-10 text-dark px-2 py-1 rounded">Custom</span>
                  <h4 className="font-semibold text-lg mt-2">Personalized Program</h4>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mt-3 mb-4">A fully customized program tailored to your specific goals, lifestyle, and current fitness level.</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                  <span>1:1 coaching sessions</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                  <span>Custom timeline</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                  <span>Personalized nutrition</span>
                </div>
                <div className="flex items-center text-sm">
                  <CheckCircle className="text-secondary mr-2 h-4 w-4" />
                  <span>Tailored workout program</span>
                </div>
              </div>
              
              <Button className="w-full bg-dark text-white py-2 rounded-lg font-medium">
                Request Info
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
