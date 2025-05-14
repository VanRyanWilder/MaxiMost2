import { useQuery } from "@tanstack/react-query";
import { type Resource } from "@shared/schema";
import { categoryColors } from "@/lib/utils";
import { useState } from "react";

export function ResourceLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });
  
  // Filter resources by category if needed
  const filteredResources = selectedCategory !== "All Categories"
    ? resources?.filter(resource => resource.category === selectedCategory)
    : resources;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl">Resources Library</h3>
        <div className="flex space-x-2">
          <select 
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>All Categories</option>
            <option>Philosophy</option>
            <option>Nutrition</option>
            <option>Fitness</option>
            <option>Mindfulness</option>
            <option>Supplements</option>
            <option>Sleep</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-3/4 h-6 bg-gray-200 rounded mt-2"></div>
                <div className="w-full h-16 bg-gray-200 rounded mt-1 mb-3"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources?.map((resource) => (
            <div key={resource.id} className="bg-gray-50 rounded-xl overflow-hidden">
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className={`text-xs ${categoryColors[resource.category].bg} ${categoryColors[resource.category].text} px-2 py-1 rounded`}>
                  {resource.category}
                </span>
                <h4 className="font-semibold text-lg mt-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 mt-1 mb-3">{resource.description}</p>
                <a href="#" className="text-primary font-medium text-sm flex items-center">
                  Read more
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
