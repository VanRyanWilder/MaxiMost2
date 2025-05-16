import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  ShieldCheck, 
  Trophy, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Link, 
  ExternalLink,
  User, 
  Quote, 
  Leaf, 
  Beaker,
  Search,
  Filter
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageContainer } from '@/components/layout/page-container';
import { WriteReviewDialog } from '@/components/supplements/write-review-dialog';

// Types 
import { Supplement, SupplementReview } from '@shared/schema';

// Top 10 supplements data with expert insights
const topSupplements = [
  {
    id: 1,
    name: "Omega-3 Fatty Acids (EPA and DHA)",
    benefits: "Reduces inflammation, supports heart and brain health, aids recovery.",
    expertInsights: [
      {
        expert: "Rhonda Patrick",
        insight: "Highlights omega-3s for their anti-inflammatory properties and cognitive benefits, key for recovery and mental clarity."
      },
      {
        expert: "Peter Attia",
        insight: "Recommends them for cardiovascular health, vital for endurance athletes."
      }
    ],
    dosage: "1-3g daily (combined EPA/DHA) with meals",
    considerations: "Look for high-quality, tested products with minimal oxidation. Higher doses need physician oversight.",
    amazonUrl: "https://www.amazon.com/s?k=omega+3+epa+dha&tag=maximost-20"
  },
  {
    id: 2,
    name: "Vitamin D3",
    benefits: "Immune function, bone health, mood regulation, hormone optimization.",
    expertInsights: [
      {
        expert: "Andrew Huberman",
        insight: "Essential for mood, immune function, and sleep; most people are deficient."
      },
      {
        expert: "Rhonda Patrick",
        insight: "Emphasizes D3's role in gene expression and immune regulation."
      }
    ],
    dosage: "1,000-5,000 IU daily with fat-containing meal",
    considerations: "Test levels first. Take with K2 for optimal calcium regulation. Morning dosing may be beneficial for circadian rhythm.",
    amazonUrl: "https://www.amazon.com/s?k=vitamin+d3+k2&tag=maximost-20"
  },
  {
    id: 3,
    name: "Magnesium (Glycinate/Threonate)",
    benefits: "Muscle relaxation, sleep quality, stress reduction, energy production.",
    expertInsights: [
      {
        expert: "Andrew Huberman",
        insight: "Recommends magnesium threonate before sleep for brain benefits and glycinate for general use."
      },
      {
        expert: "Dom D'Agostino",
        insight: "Notes its importance for mitochondrial function and energy production."
      }
    ],
    dosage: "200-400mg elemental magnesium daily (divided doses)",
    considerations: "Different forms have different effects: glycinate for sleep/relaxation, threonate for cognitive benefits, malate for energy.",
    amazonUrl: "https://www.amazon.com/s?k=magnesium+glycinate+threonate&tag=maximost-20"
  }
];

export default function SupplementsUnifiedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const userId = 1; // Placeholder - would come from auth context in a real app
  
  const { data: supplements, isLoading, error } = useQuery({
    queryKey: ['/api/supplements'],
    queryFn: async () => {
      const response = await fetch('/api/supplements');
      if (!response.ok) throw new Error('Failed to fetch supplements');
      return response.json();
    }
  });
  
  const handleOpenReviewDialog = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setReviewDialogOpen(true);
  };
  
  const filteredSupplements = supplements ? supplements.filter((supplement: Supplement) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        supplement.name.toLowerCase().includes(query) ||
        supplement.description.toLowerCase().includes(query) ||
        supplement.categories.toLowerCase().includes(query) ||
        supplement.benefits.toLowerCase().includes(query)
      );
    }
    return true;
  }) : [];
  
  return (
    <PageContainer title="Supplements">
      <div className="flex flex-col space-y-8 pb-16">
        {/* Hero section */}
        <section className="w-full py-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">MaxiMost Supplement Guide</h1>
            <p className="text-lg mb-4 max-w-2xl">
              Community-driven ratings and reviews of the most effective supplements for optimal health and performance.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Expert verified and community tested</span>
            </div>
          </div>
        </section>
        
        {/* Search section */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search supplements..."
              className="pl-9 w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" title="Filter supplements">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Top Supplements section */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-7 w-7 text-amber-500" />
            <h2 className="text-2xl font-bold">Top Supplements</h2>
          </div>
          
          <p className="text-muted-foreground max-w-3xl mb-6">
            These are the highest-ROI supplements backed by scientific research and recommended by leading health experts. 
            Each provides significant benefits with minimal downsides when used appropriately.
          </p>
          
          {/* Top supplements grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {topSupplements.map((supplement, index) => (
              <SupplementCard key={index} supplement={supplement} index={index} />
            ))}
          </div>
        </div>

        {/* Write review dialog */}
        {selectedSupplement && (
          <WriteReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            supplementId={selectedSupplement.id}
            userId={userId}
          />
        )}
      </div>
    </PageContainer>
  );
}

// Supplement Card Component
function SupplementCard({ supplement, index, onReview }: { 
  supplement: any; 
  index?: number;
  onReview?: () => void;
}) {
  const amazonUrl = supplement.amazonUrl || "https://www.amazon.com/s?k=" + encodeURIComponent(supplement.name) + "&tag=maximost-20";
  const isTopPick = index === 0;
  const isTopThree = index !== undefined && index < 3;
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {isTopPick && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 mb-1">
                #1 Top Pick
              </Badge>
            )}
            <CardTitle className="text-xl">{supplement.name}</CardTitle>
          </div>
          {isTopThree && index !== undefined && (
            <div className="bg-amber-100 h-8 w-8 rounded-full flex items-center justify-center text-amber-800 font-bold border border-amber-300">
              #{index + 1}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm">{supplement.benefits}</p>
        
        {supplement.expertInsights && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <User className="h-4 w-4" />
              Expert Insights
            </h4>
            {supplement.expertInsights.map((insight: any, i: number) => (
              <div key={i} className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {insight.expert}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{insight.insight}</p>
              </div>
            ))}
          </div>
        )}
        
        {supplement.dosage && (
          <div className="flex items-center gap-2 text-sm">
            <Beaker className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span><span className="font-medium">Dosage:</span> {supplement.dosage}</span>
          </div>
        )}
        
        {supplement.considerations && (
          <div>
            <h4 className="text-sm font-medium mb-1">Key Considerations:</h4>
            <p className="text-xs text-muted-foreground">{supplement.considerations}</p>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline"
            size="sm"
            className="w-full gap-1"
            onClick={() => window.open(amazonUrl, '_blank')}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Amazon
          </Button>
          
          {onReview && (
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-1"
              onClick={onReview}
            >
              <Star className="h-3.5 w-3.5" />
              Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader component
function SupplementsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="pt-4">
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}