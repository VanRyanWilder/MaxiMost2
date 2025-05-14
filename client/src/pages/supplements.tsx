import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Supplement {
  id: number;
  name: string;
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  cost: string;
  costEffectiveness: number; // 1-10 rating
  userScore: number; // Average user score 1-5
  votes: number;
  category: string;
  affiliateLink: string;
}

export default function Supplements() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [sortOption, setSortOption] = useState<string>("cost-effectiveness");
  
  const supplements: Supplement[] = [
    {
      id: 1,
      name: "Vitamin D3 with K2",
      description: "Essential vitamin for immune function, bone health, and overall wellness.",
      benefits: [
        "Immune system support",
        "Bone health optimization",
        "Hormone regulation",
        "Cardiovascular health"
      ],
      dosage: "5,000-10,000 IU daily",
      timing: "Morning with breakfast",
      cost: "$0.10-0.30/day",
      costEffectiveness: 10,
      userScore: 4.8,
      votes: 342,
      category: "Essential",
      affiliateLink: "#"
    },
    {
      id: 2,
      name: "Magnesium Glycinate",
      description: "Highly bioavailable form of magnesium that supports sleep, muscle function, and stress reduction.",
      benefits: [
        "Improved sleep quality",
        "Muscle recovery enhancement",
        "Stress reduction",
        "Energy production support"
      ],
      dosage: "400-600mg daily",
      timing: "Evening before bed",
      cost: "$0.30-0.50/day",
      costEffectiveness: 9,
      userScore: 4.7,
      votes: 289,
      category: "Essential",
      affiliateLink: "#"
    },
    {
      id: 3,
      name: "Omega-3 Fish Oil",
      description: "Essential fatty acids that support brain health, reduce inflammation, and promote heart health.",
      benefits: [
        "Brain function optimization",
        "Inflammation reduction",
        "Joint health improvement",
        "Heart health support"
      ],
      dosage: "2-3g daily",
      timing: "With meals (split dosage)",
      cost: "$0.40-0.70/day",
      costEffectiveness: 8,
      userScore: 4.5,
      votes: 401,
      category: "Essential",
      affiliateLink: "#"
    },
    {
      id: 4,
      name: "Creatine Monohydrate",
      description: "The most well-researched supplement for strength, power, and muscle performance.",
      benefits: [
        "Increased strength and power",
        "Improved high-intensity performance",
        "Enhanced muscle recovery",
        "Cognitive benefits"
      ],
      dosage: "5g daily",
      timing: "Any time (consistent daily)",
      cost: "$0.10-0.30/day",
      costEffectiveness: 10,
      userScore: 4.9,
      votes: 536,
      category: "Performance",
      affiliateLink: "#"
    },
    {
      id: 5,
      name: "Berberine",
      description: "Natural compound that supports metabolic health and glucose management.",
      benefits: [
        "Blood glucose regulation",
        "Gut health improvement",
        "Cardiovascular support",
        "Longevity enhancement"
      ],
      dosage: "500mg, 3x daily",
      timing: "Before meals",
      cost: "$0.60-1.00/day",
      costEffectiveness: 7,
      userScore: 4.3,
      votes: 178,
      category: "Metabolic",
      affiliateLink: "#"
    },
    {
      id: 6,
      name: "NAC (N-Acetyl Cysteine)",
      description: "Powerful antioxidant and glutathione precursor that supports detoxification.",
      benefits: [
        "Glutathione production",
        "Respiratory health support",
        "Detoxification enhancement",
        "Cognitive support"
      ],
      dosage: "600-1200mg daily",
      timing: "With or without food",
      cost: "$0.30-0.60/day",
      costEffectiveness: 8,
      userScore: 4.4,
      votes: 203,
      category: "Antioxidant",
      affiliateLink: "#"
    },
    {
      id: 7,
      name: "Ashwagandha",
      description: "Adaptogenic herb that helps the body manage stress and supports hormonal balance.",
      benefits: [
        "Stress reduction",
        "Testosterone support",
        "Anxiety reduction",
        "Immune function enhancement"
      ],
      dosage: "600-1200mg daily",
      timing: "Morning or evening",
      cost: "$0.20-0.40/day",
      costEffectiveness: 9,
      userScore: 4.6,
      votes: 312,
      category: "Adaptogen",
      affiliateLink: "#"
    },
    {
      id: 8,
      name: "Zinc Picolinate",
      description: "Highly absorbable form of zinc that supports immune function and testosterone production.",
      benefits: [
        "Immune system enhancement",
        "Testosterone support",
        "Skin health improvement",
        "Protein synthesis support"
      ],
      dosage: "15-30mg daily",
      timing: "With food",
      cost: "$0.05-0.15/day",
      costEffectiveness: 9,
      userScore: 4.5,
      votes: 245,
      category: "Essential",
      affiliateLink: "#"
    }
  ];
  
  // Filter supplements by category
  const filteredSupplements = selectedCategory !== "All Categories" 
    ? supplements.filter(supplement => supplement.category === selectedCategory)
    : supplements;
    
  // Sort supplements based on selected option
  const sortedSupplements = [...filteredSupplements].sort((a, b) => {
    if (sortOption === "cost-effectiveness") {
      return b.costEffectiveness - a.costEffectiveness;
    } else if (sortOption === "user-score") {
      return b.userScore - a.userScore;
    } else if (sortOption === "popularity") {
      return b.votes - a.votes;
    } else {
      return 0;
    }
  });
  
  // Generate star ratings
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const halfStar = score % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />);
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Supplement Recommendations</h1>
            
            <div className="bg-gradient-to-r from-accent to-primary rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Supplement Strategy</h2>
              <p className="text-white text-opacity-90 max-w-3xl">
                "Quality supplements are force multipliers for your health and performance, but they don't replace a solid foundation of nutrition, sleep, and exercise. Focus on these highest-impact options for the best return on investment." — Gary Brecka
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-xl">Supplement Rankings</h3>
                  <p className="text-sm text-gray-500">Ranked by effectiveness, cost, and user ratings</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option>All Categories</option>
                    <option>Essential</option>
                    <option>Performance</option>
                    <option>Metabolic</option>
                    <option>Antioxidant</option>
                    <option>Adaptogen</option>
                  </select>
                  
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="cost-effectiveness">Sort by: Cost-Effectiveness</option>
                    <option value="user-score">Sort by: User Rating</option>
                    <option value="popularity">Sort by: Popularity</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {sortedSupplements.map((supplement) => (
                  <Card key={supplement.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/3 p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{supplement.name}</h3>
                            <div className="flex items-center space-x-2 mt-1 mb-2">
                              <div className="flex">
                                {renderStars(supplement.userScore)}
                              </div>
                              <span className="text-sm text-gray-500">({supplement.votes} votes)</span>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {supplement.category}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{supplement.description}</p>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {supplement.benefits.map((benefit, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="mr-2 text-primary">•</span> {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Dosage:</span>
                            <p>{supplement.dosage}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Timing:</span>
                            <p>{supplement.timing}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <p>{supplement.cost}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:w-1/3 bg-gray-50 p-5 flex flex-col justify-between">
                        <div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Cost-Effectiveness:</h4>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-primary h-2.5 rounded-full" 
                                  style={{ width: `${supplement.costEffectiveness * 10}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{supplement.costEffectiveness}/10</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                            <span>User Rating:</span>
                            <span className="font-medium text-gray-700">{supplement.userScore}/5</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full mb-2" variant="default">
                            View Product
                          </Button>
                          <Button className="w-full" variant="outline">
                            Upvote
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-xl mb-4">Blood Work Tracking</h3>
              <p className="text-gray-600 mb-6">
                Track your blood work results over time to monitor the effectiveness of your supplement protocol. 
                Upload your lab reports to see how your biomarkers improve.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium mb-2">Upload Blood Work Results</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your PDF lab reports or click to upload
                </p>
                <Button>Upload Files</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}