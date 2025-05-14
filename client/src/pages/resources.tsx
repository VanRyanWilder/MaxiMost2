import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { ResourceLibrary } from "@/components/resources/resource-library";
import { useQuery } from "@tanstack/react-query";
import { type Resource } from "@shared/schema";

export default function Resources() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: resource } = useQuery<Resource>({
    queryKey: ["/api/resources/1"], // Fetch the first resource for detailed view
  });

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Resources</h1>
            
            {resource && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title} 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-bold">{resource.title}</h2>
                      <span className="text-xs px-2 py-1 rounded bg-primary text-white">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{resource.description}</p>
                    <div className="prose max-w-none">
                      <p>{resource.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <ResourceLibrary />
          </div>
        </main>
      </div>
    </div>
  );
}
