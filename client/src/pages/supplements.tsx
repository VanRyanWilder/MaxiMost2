import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, ThumbsUp, ThumbsDown, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Define the type based on our database schema
interface Supplement {
  id: number;
  name: string;
  description: string;
  benefits: string;
  dosage: string;
  sideEffects: string | null;
  interactions: string | null;
  categories: string;
  upvotes: number;
  downvotes: number;
  totalReviews: number;
  averageRating: string;
  imageUrl: string | null;
  amazonUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Extend the type with calculated/parsed fields for the UI
interface SupplementWithParsedData extends Supplement {
  parsedBenefits: string[];
  parsedCategories: string[];
  costEffectiveness?: number;
}

// Sample supplements data for initial UI development
// This will be replaced by API data
const sampleSupplements: Supplement[] = [
  {
    id: 1,
    name: "Vitamin D3 with K2",
    description: "Essential vitamin highlighted by both Huberman and Brecka as critical for immune function, longevity, and hormonal regulation.",
    benefits: JSON.stringify([
      "Immune system optimization",
      "Bone health and calcium utilization",
      "Hormone production support",
      "Cardiovascular health protection"
    ]),
    dosage: "5,000-10,000 IU daily",
    sideEffects: "Rare at recommended doses. Excessive amounts may lead to hypercalcemia.",
    interactions: "May interact with certain medications including statins and blood thinners.",
    categories: "Essential,Vitamin,Hormone",
    upvotes: 842,
    downvotes: 21,
    totalReviews: 156,
    averageRating: "4.8",
    imageUrl: null,
    amazonUrl: "https://www.amazon.com/dp/B07XYQJR65?tag=beastmode-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Magnesium Glycinate",
    description: "Andrew Huberman's top recommendation for sleep, neural plasticity, and recovery.",
    benefits: JSON.stringify([
      "Enhanced sleep architecture",
      "Muscle relaxation and recovery",
      "Stress resilience",
      "Cognitive function support"
    ]),
    dosage: "300-400mg daily",
    sideEffects: "Generally well-tolerated. May cause loose stools at high doses.",
    interactions: "May interact with certain antibiotics and medications.",
    categories: "Essential,Mineral,Sleep",
    upvotes: 756,
    downvotes: 18,
    totalReviews: 124,
    averageRating: "4.7",
    imageUrl: null,
    amazonUrl: "https://www.amazon.com/dp/B07RM7VXFV?tag=beastmode-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Supplements() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("upvotes");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get logged in user (mock for now)
  const userId = 1; // This would come from auth context in a real app
  
  // Fetch supplements from the API
  const { data: supplements, isLoading, error } = useQuery({
    queryKey: ['/api/supplements'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (data: { userId: number, supplementId: number, voteType: string }) => {
      return apiRequest('POST', '/api/supplements/votes', data);
    },
    onSuccess: () => {
      // Invalidate supplements to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/supplements'] });
      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
      console.error("Vote error:", error);
    }
  });
  
  // Handle voting
  const handleVote = (supplementId: number, voteType: string) => {
    voteMutation.mutate({ userId, supplementId, voteType });
  };
  
  // Parse benefits and categories from string to arrays
  const parseSupplementData = (supplement: Supplement): SupplementWithParsedData => {
    // Parse benefits - either a JSON string or comma-separated list
    let parsedBenefits: string[] = [];
    try {
      // Try parsing as JSON first
      parsedBenefits = JSON.parse(supplement.benefits);
    } catch (e) {
      // Fall back to comma-separated parsing
      parsedBenefits = supplement.benefits.split(',').map(b => b.trim());
    }
    
    // Parse categories
    const parsedCategories = supplement.categories.split(',').map(c => c.trim());
    
    // Calculate cost-effectiveness (mock for now, would be based on some algorithm)
    const costEffectiveness = Math.round((supplement.upvotes / (supplement.upvotes + supplement.downvotes || 1)) * 10);
    
    return {
      ...supplement,
      parsedBenefits,
      parsedCategories,
      costEffectiveness
    };
  };
  
  // Use sample data during development, will be replaced by API data
  const availableSupplements = supplements || sampleSupplements;
  
  // Process all supplements with parsed data
  const processedSupplements: SupplementWithParsedData[] = 
    availableSupplements.map(s => parseSupplementData(s as Supplement));
  
  // Get unique categories from all supplements
  const allCategories = Array.from(
    new Set(processedSupplements.flatMap(s => s.parsedCategories))
  ).sort();
  
  // Filter supplements by category
  const filteredSupplements = selectedCategory === "All" 
    ? processedSupplements
    : processedSupplements.filter(supplement => 
        supplement.parsedCategories.includes(selectedCategory)
      );
      
  // Sort supplements based on selected option
  const sortedSupplements = [...filteredSupplements].sort((a, b) => {
    if (sortOption === "upvotes") {
      return b.upvotes - a.upvotes;
    } else if (sortOption === "rating") {
      return parseFloat(b.averageRating) - parseFloat(a.averageRating);
    } else if (sortOption === "costEffectiveness") {
      return (b.costEffectiveness || 0) - (a.costEffectiveness || 0);
    } else {
      return 0;
    }
  });
  
  // Generate star ratings
  const renderStars = (score: string) => {
    const stars = [];
    const numericScore = parseFloat(score);
    const fullStars = Math.floor(numericScore);
    const halfStar = numericScore % 1 >= 0.5;
    
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
                  <p className="text-sm text-gray-500">Ranked by efficacy, user ratings, and scientific evidence</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {allCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select 
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="upvotes">Sort by: Popularity</option>
                    <option value="rating">Sort by: User Rating</option>
                    <option value="costEffectiveness">Sort by: Cost-Effectiveness</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="overflow-hidden">
                      <div className="p-5">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-500 mb-4">Failed to load supplements</p>
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/supplements'] })}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
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
                                  {renderStars(supplement.averageRating)}
                                </div>
                                <span className="text-sm text-gray-500">({supplement.totalReviews} reviews)</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {supplement.parsedCategories.map(category => (
                                <Badge key={category} variant="outline" className="text-xs px-2 py-1 bg-gray-100">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{supplement.description}</p>
                          
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">Benefits:</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {supplement.parsedBenefits.map((benefit, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center">
                                  <span className="mr-2 text-primary">•</span> {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Dosage:</span>
                              <p>{supplement.dosage}</p>
                            </div>
                            {supplement.sideEffects && (
                              <div>
                                <span className="text-gray-500">Side Effects:</span>
                                <p className="truncate">{supplement.sideEffects}</p>
                              </div>
                            )}
                            {supplement.interactions && (
                              <div>
                                <span className="text-gray-500">Interactions:</span>
                                <p className="truncate">{supplement.interactions}</p>
                              </div>
                            )}
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
                                    style={{ width: `${supplement.costEffectiveness || 0}0%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{supplement.costEffectiveness}/10</span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <h4 className="text-sm font-medium mb-1">Community Rating:</h4>
                              <div className="flex gap-3">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleVote(supplement.id, 'up')}
                                  disabled={voteMutation.isPending}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{supplement.upvotes}</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => handleVote(supplement.id, 'down')}
                                  disabled={voteMutation.isPending}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>{supplement.downvotes}</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {supplement.amazonUrl && (
                            <div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      className="w-full flex items-center justify-center gap-2"
                                      onClick={() => window.open(supplement.amazonUrl, '_blank')}
                                    >
                                      <ShieldCheck className="w-4 h-4" />
                                      View on Amazon
                                      <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Affiliate link - we earn a commission on qualified purchases</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <p className="text-xs text-center mt-2 text-gray-500">
                                Quality tested & verified
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}