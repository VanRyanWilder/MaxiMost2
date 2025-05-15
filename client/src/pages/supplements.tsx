import { useState } from "react";
import { ModernLayout } from "@/components/layout/modern-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, ShoppingCart, Star, ThumbsUp, ThumbsDown, Filter, Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";

// Sample supplement data - this would come from an API in a real implementation
const supplements = [
  {
    id: 1,
    name: "Omega-3 (EPA/DHA)",
    rating: 4.8,
    votesUp: 942,
    votesDown: 24,
    reviewCount: 342,
    category: "Essential Fatty Acids",
    tags: ["Heart Health", "Brain Function", "Inflammation"],
    price: 29.99,
    image: "omega3.jpg",
    description: "High-quality fish oil supplement providing essential EPA and DHA fatty acids.",
    benefits: [
      "Reduces inflammation",
      "Supports cardiovascular health",
      "Enhances brain function and cognition",
      "May improve mood and mental health"
    ],
    dosage: "1-2 grams daily with food",
    featured: true
  },
  {
    id: 2,
    name: "Vitamin D3 + K2",
    rating: 4.9,
    votesUp: 876,
    votesDown: 17,
    reviewCount: 298,
    category: "Vitamins",
    tags: ["Bone Health", "Immunity", "Cardiovascular"],
    price: 24.99,
    image: "vitamind.jpg",
    description: "Optimally balanced vitamin D3 and K2 for immune and bone health.",
    benefits: [
      "Enhances calcium absorption and utilization",
      "Strengthens immune function",
      "Improves bone density and strength",
      "Supports cardiovascular health"
    ],
    dosage: "5000 IU D3 + 100mcg K2 daily with a meal containing fat",
    featured: true
  },
  {
    id: 3,
    name: "Magnesium Glycinate",
    rating: 4.7,
    votesUp: 802,
    votesDown: 35,
    reviewCount: 263,
    category: "Minerals",
    tags: ["Sleep", "Stress", "Muscle Recovery"],
    price: 19.99,
    image: "magnesium.jpg",
    description: "Highly bioavailable form of magnesium for optimal absorption and minimal digestive discomfort.",
    benefits: [
      "Improves sleep quality",
      "Reduces stress and anxiety",
      "Supports muscle recovery",
      "Helps manage blood pressure"
    ],
    dosage: "300-400mg daily, preferably before bedtime",
    featured: true
  },
  {
    id: 4,
    name: "Creatine Monohydrate",
    rating: 4.8,
    votesUp: 756,
    votesDown: 28,
    reviewCount: 241,
    category: "Performance",
    tags: ["Strength", "Power", "Cognitive"],
    price: 19.99,
    image: "creatine.jpg",
    description: "The most well-researched and effective supplement for increasing physical performance and muscle mass.",
    benefits: [
      "Increases strength and power output",
      "Enhances muscle mass and recovery",
      "Improves high-intensity exercise performance",
      "May provide cognitive benefits"
    ],
    dosage: "5g daily, timing doesn't matter",
    featured: false
  },
  {
    id: 5,
    name: "Ashwagandha KSM-66",
    rating: 4.6,
    votesUp: 689,
    votesDown: 42,
    reviewCount: 220,
    category: "Adaptogens",
    tags: ["Stress", "Hormones", "Recovery"],
    price: 22.99,
    image: "ashwagandha.jpg",
    description: "Premium root-only extract of ashwagandha for stress reduction and hormonal balance.",
    benefits: [
      "Reduces cortisol and stress",
      "May improve testosterone in men",
      "Enhances recovery from exercise",
      "Supports healthy immune function"
    ],
    dosage: "600mg daily, split into two doses",
    featured: false
  },
  {
    id: 6,
    name: "Vitamin B Complex",
    rating: 4.5,
    votesUp: 632,
    votesDown: 48,
    reviewCount: 206,
    category: "Vitamins",
    tags: ["Energy", "Metabolism", "Brain"],
    price: 18.99,
    image: "bcomplex.jpg",
    description: "Comprehensive blend of all essential B vitamins in their most bioavailable forms.",
    benefits: [
      "Supports energy production",
      "Enhances cognitive function",
      "Improves mood and stress response",
      "Supports cellular metabolism"
    ],
    dosage: "1 capsule daily with breakfast",
    featured: false
  }
];

// Available categories for filtering
const categories = [
  "All Categories",
  "Vitamins",
  "Minerals",
  "Essential Fatty Acids",
  "Adaptogens",
  "Performance",
  "Nootropics",
  "Sleep",
  "Digestive"
];

export default function SupplementsPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSupplements = supplements.filter(supplement => {
    // Apply category filter
    if (activeCategory !== "All Categories" && supplement.category !== activeCategory) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        supplement.name.toLowerCase().includes(query) ||
        supplement.description.toLowerCase().includes(query) ||
        supplement.category.toLowerCase().includes(query) ||
        supplement.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured supplements at the top
  const featuredSupplements = filteredSupplements.filter(s => s.featured);
  const regularSupplements = filteredSupplements.filter(s => !s.featured);
  
  return (
    <ModernLayout pageTitle="Supplements">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Supplements</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Research-backed supplements with the highest ROI for your health
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search supplements..."
                    className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" title="Filter supplements">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Featured Supplements Section */}
          {featuredSupplements.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                Featured Supplements
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredSupplements.map(supplement => (
                  <SupplementCard key={supplement.id} supplement={supplement} />
                ))}
              </div>
            </div>
          )}
          
          {/* All Supplements Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">All Supplements</h2>
            
            {regularSupplements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularSupplements.map(supplement => (
                  <SupplementCard key={supplement.id} supplement={supplement} />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No supplements found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setActiveCategory("All Categories");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Information Section */}
          <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full text-indigo-600 dark:text-indigo-300">
                  <Pill className="h-10 w-10" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">How We Rate Supplements</h2>
                  <p className="text-muted-foreground mb-4">
                    Our supplement ratings are based on a rigorous evaluation of scientific research, efficacy, safety, 
                    and value. We prioritize supplements with the strongest evidence-based benefits that provide the 
                    best return on investment for your health.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mt-0.5">
                        <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Research-Backed</p>
                        <p className="text-xs text-muted-foreground">Based on peer-reviewed studies</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full mt-0.5">
                        <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Community Verified</p>
                        <p className="text-xs text-muted-foreground">Real user experiences and feedback</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernLayout>
  );
}

// Supplement Card Component
function SupplementCard({ supplement }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <Badge>{supplement.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium">{supplement.rating}</span>
          </div>
        </div>
        <CardTitle className="text-xl">{supplement.name}</CardTitle>
        <CardDescription className="line-clamp-2">{supplement.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {supplement.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs text-muted-foreground">{supplement.votesUp}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-3.5 w-3.5 text-rose-600" />
              <span className="text-xs text-muted-foreground">{supplement.votesDown}</span>
            </div>
          </div>
          <span className="text-sm font-medium">${supplement.price}</span>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/supplement-detail/${supplement.id}`} className="flex-1">
            <Button variant="outline" className="w-full flex items-center justify-center gap-1">
              <span>Details</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>Buy</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}