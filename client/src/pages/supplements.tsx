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
      description: "Essential vitamin highlighted by both Huberman and Brecka as critical for immune function, longevity, and hormonal regulation.",
      benefits: [
        "Immune system optimization",
        "Bone health and calcium utilization",
        "Hormone production support",
        "Cardiovascular health protection"
      ],
      dosage: "5,000-10,000 IU daily",
      timing: "Morning with fat-containing meal",
      cost: "$0.10-0.30/day",
      costEffectiveness: 10,
      userScore: 4.8,
      votes: 842,
      category: "Essential",
      affiliateLink: "#vitamin-d3-k2-link"
    },
    {
      id: 2,
      name: "Magnesium Glycinate/Threonate",
      description: "Andrew Huberman's top recommendation for sleep, neural plasticity, and recovery. Threonate form crosses the blood-brain barrier efficiently.",
      benefits: [
        "Enhanced sleep architecture",
        "Muscle relaxation and recovery",
        "Stress resilience",
        "Cognitive function support"
      ],
      dosage: "300-400mg glycinate, 100-200mg threonate",
      timing: "Glycinate before bed, threonate morning/afternoon",
      cost: "$0.30-0.70/day",
      costEffectiveness: 9,
      userScore: 4.7,
      votes: 756,
      category: "Essential",
      affiliateLink: "#magnesium-link"
    },
    {
      id: 3,
      name: "Omega-3 (EPA/DHA)",
      description: "Brecka calls this 'non-negotiable' - pure, molecularly distilled fish oil with at least 1g combined EPA/DHA for inflammation control.",
      benefits: [
        "Reduced systemic inflammation",
        "Enhanced brain function and neuroplasticity",
        "Improved cardiovascular markers",
        "Joint health optimization"
      ],
      dosage: "1-3g EPA/DHA combined daily",
      timing: "With meals (split dosage)",
      cost: "$0.40-0.90/day",
      costEffectiveness: 9,
      userScore: 4.6,
      votes: 801,
      category: "Essential",
      affiliateLink: "#omega3-link"
    },
    {
      id: 4,
      name: "Creatine Monohydrate",
      description: "Huberman's top cognitive and physical performance enhancer with over 500 studies supporting safety and efficacy.",
      benefits: [
        "Increased power output and strength",
        "Enhanced cognitive performance",
        "Improved recovery between training",
        "Neuroprotective properties"
      ],
      dosage: "5g daily (no loading phase needed)",
      timing: "Any time (consistency matters most)",
      cost: "$0.10-0.30/day",
      costEffectiveness: 10,
      userScore: 4.9,
      votes: 936,
      category: "Performance",
      affiliateLink: "#creatine-link"
    },
    {
      id: 5,
      name: "Athletic Greens/AG1",
      description: "Comprehensive micronutrient insurance policy recommended by both Huberman and Brecka for covering nutritional bases.",
      benefits: [
        "Comprehensive micronutrient support",
        "Digestive enzyme optimization",
        "Prebiotic and probiotic blend",
        "Adaptogen and antioxidant complex"
      ],
      dosage: "1 serving daily",
      timing: "Morning on empty stomach",
      cost: "$2.50-3.30/day",
      costEffectiveness: 7,
      userScore: 4.5,
      votes: 678,
      category: "Essential",
      affiliateLink: "#greens-link"
    },
    {
      id: 6,
      name: "Tongkat Ali (Longjack)",
      description: "Huberman's go-to recommendation for hormonal support, particularly for testosterone optimization in both men and women.",
      benefits: [
        "Natural testosterone support",
        "Libido enhancement",
        "Energy and vitality improvement",
        "Cortisol modulation"
      ],
      dosage: "400-600mg daily (with 2% eurycomanone)",
      timing: "Morning with breakfast",
      cost: "$0.50-1.00/day",
      costEffectiveness: 8,
      userScore: 4.4,
      votes: 543,
      category: "Hormonal",
      affiliateLink: "#tongkat-link"
    },
    {
      id: 7,
      name: "Berberine",
      description: "Gary Brecka's 'metformin alternative' for blood glucose regulation and metabolic health optimization.",
      benefits: [
        "Blood glucose management",
        "AMPK activation pathway",
        "Lipid profile improvement",
        "Gut health and microbiome support"
      ],
      dosage: "500mg, 2-3x daily",
      timing: "Before or with meals",
      cost: "$0.60-1.00/day",
      costEffectiveness: 8,
      userScore: 4.3,
      votes: 478,
      category: "Metabolic",
      affiliateLink: "#berberine-link"
    },
    {
      id: 8,
      name: "Protein Powder (Whey Isolate)",
      description: "Complete protein source with all essential amino acids, recommended by Huberman for muscle protein synthesis and recovery.",
      benefits: [
        "Muscle recovery acceleration",
        "Lean mass preservation",
        "Appetite regulation",
        "Immune system support"
      ],
      dosage: "20-40g per serving, 1-2 servings daily",
      timing: "Post-workout and/or between meals",
      cost: "$1.00-2.00/day",
      costEffectiveness: 9,
      userScore: 4.7,
      votes: 865,
      category: "Performance",
      affiliateLink: "#protein-link"
    },
    {
      id: 9,
      name: "Apigenin",
      description: "Huberman's recommendation for sleep enhancement and estrogen management, naturally found in chamomile and parsley.",
      benefits: [
        "Sleep quality enhancement",
        "Estrogen modulation",
        "Antioxidant properties",
        "Cognitive support"
      ],
      dosage: "50mg daily",
      timing: "30-60 minutes before bedtime",
      cost: "$0.20-0.40/day",
      costEffectiveness: 8,
      userScore: 4.2,
      votes: 342,
      category: "Sleep",
      affiliateLink: "#apigenin-link"
    },
    {
      id: 10,
      name: "L-Theanine",
      description: "Amino acid that promotes relaxation without sedation, particularly effective when combined with caffeine.",
      benefits: [
        "Calm focus enhancement",
        "Stress reduction",
        "Alpha brain wave promotion",
        "Sleep quality improvement"
      ],
      dosage: "100-200mg, 1-3x daily",
      timing: "Morning with coffee, afternoon, and/or evening",
      cost: "$0.10-0.25/day",
      costEffectiveness: 10,
      userScore: 4.6,
      votes: 723,
      category: "Cognitive",
      affiliateLink: "#theanine-link"
    },
    {
      id: 11,
      name: "Fadogia Agrestis",
      description: "Paired with Tongkat Ali in Huberman's hormone optimization protocol for enhanced testosterone support.",
      benefits: [
        "Luteinizing hormone support",
        "Testosterone level optimization",
        "Libido enhancement",
        "Recovery acceleration"
      ],
      dosage: "600mg daily (10:1 extract)",
      timing: "Morning with breakfast",
      cost: "$0.70-1.20/day",
      costEffectiveness: 7,
      userScore: 4.1,
      votes: 385,
      category: "Hormonal",
      affiliateLink: "#fadogia-link"
    },
    {
      id: 12,
      name: "NAC (N-Acetyl Cysteine)",
      description: "Brecka's recommendation for glutathione production and detoxification support, especially important in modern environments.",
      benefits: [
        "Master antioxidant glutathione production",
        "Liver detoxification enhancement",
        "Respiratory pathway support",
        "Mental clarity improvement"
      ],
      dosage: "600-1200mg daily",
      timing: "Morning or evening",
      cost: "$0.30-0.60/day",
      costEffectiveness: 8,
      userScore: 4.4,
      votes: 503,
      category: "Antioxidant",
      affiliateLink: "#nac-link"
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