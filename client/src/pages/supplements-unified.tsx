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
    amazonUrl: "https://www.amazon.com/dp/B002CQU53K?tag=maximost-20"
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
    amazonUrl: "https://www.amazon.com/dp/B0797ND64V?tag=maximost-20"
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
    amazonUrl: "https://www.amazon.com/dp/B0058HWM9S?tag=maximost-20"
  },
  {
    id: 4,
    name: "Creatine Monohydrate",
    benefits: "Muscle strength, power output, cognitive function, cellular energy.",
    expertInsights: [
      {
        expert: "Layne Norton",
        insight: "One of the most well-researched supplements with proven benefits for strength, recovery, and even cognitive performance."
      },
      {
        expert: "Andy Galpin",
        insight: "Recommends for both athletes and general health as it's safe, effective, and supports muscle health."
      }
    ],
    dosage: "3-5g daily, timing doesn't matter",
    considerations: "No loading phase needed. Micronized form may reduce digestive discomfort. Benefit accumulates over time.",
    amazonUrl: "https://www.amazon.com/dp/B002DYIZEO?tag=maximost-20"
  },
  {
    id: 5,
    name: "Protein Powder (Whey/Plant)",
    benefits: "Muscle recovery, appetite control, convenient nutrition, immune support.",
    expertInsights: [
      {
        expert: "Stuart Phillips",
        insight: "Whey protein provides optimal amino acid profile for muscle protein synthesis – ideal for recovery timing."
      },
      {
        expert: "Gabrielle Lyon",
        insight: "Emphasizes protein's critical role for muscle maintenance, especially as we age."
      }
    ],
    dosage: "20-40g per serving as needed to meet daily protein targets",
    considerations: "Whey isolate for lactose sensitivity, plant blend for vegetarians. Look for third-party tested products with minimal additives.",
    amazonUrl: "https://www.amazon.com/dp/B000QSNYGI?tag=maximost-20"
  },
  {
    id: 6,
    name: "Vitamin K2 (MK-7)",
    benefits: "Calcium regulation, cardiovascular health, bone strength, dental health.",
    expertInsights: [
      {
        expert: "Chris Masterjohn",
        insight: "K2 directs calcium to bones instead of arteries; often deficient in modern diets yet crucial for D3 balance."
      },
      {
        expert: "Rhonda Patrick",
        insight: "Always pairs D3 with K2 to prevent calcium dysregulation and optimize cardiovascular health."
      }
    ],
    dosage: "100-200mcg daily with fat-containing meal",
    considerations: "Take with vitamin D3. MK-7 form has longer half-life than MK-4. May interact with blood thinners.",
    amazonUrl: "https://www.amazon.com/dp/B004GW4S0G?tag=maximost-20"
  },
  {
    id: 7,
    name: "Zinc",
    benefits: "Immune function, testosterone production, wound healing, enzyme reactions.",
    expertInsights: [
      {
        expert: "Rhonda Patrick",
        insight: "Critical for immune cell function and DNA repair mechanisms; deficiency is common during stress."
      },
      {
        expert: "Stacy Sims",
        insight: "Notes its importance for hormone production and metabolic health in both men and women."
      }
    ],
    dosage: "15-30mg daily with food",
    considerations: "Zinc picolinate or zinc bisglycinate have better absorption. Long-term use requires copper balance. Take with food to reduce nausea.",
    amazonUrl: "https://www.amazon.com/dp/B004O9ESUO?tag=maximost-20"
  },
  {
    id: 8,
    name: "L-Theanine",
    benefits: "Stress reduction, focus enhancement, sleep quality, cognitive performance.",
    expertInsights: [
      {
        expert: "Andrew Huberman",
        insight: "Combines well with caffeine for 'calm-alert' state; also excellent for stress management and sleep quality."
      },
      {
        expert: "Matthew Walker",
        insight: "Can improve sleep onset without sedation; helps quiet an active mind."
      }
    ],
    dosage: "200-400mg as needed or daily",
    considerations: "Synergistic with caffeine (2:1 theanine:caffeine ratio). Can be taken multiple times per day safely. Particularly useful during stressful periods.",
    amazonUrl: "https://www.amazon.com/dp/B01D1YQBOK?tag=maximost-20"
  },
  {
    id: 9,
    name: "Ashwagandha (KSM-66)",
    benefits: "Stress reduction, hormone balance, recovery enhancement, immune modulation.",
    expertInsights: [
      {
        expert: "Andrew Huberman",
        insight: "Particularly effective for sleep and HPA-axis regulation; one of the most well-studied adaptogens."
      },
      {
        expert: "Examine.com",
        insight: "Research shows consistent benefits for stress reduction, modest testosterone support, and recovery enhancement."
      }
    ],
    dosage: "600mg daily (standardized extract)",
    considerations: "KSM-66 or Sensoril extracts have best research. Take consistently for 4-8 weeks for full effects. May be best avoided with autoimmune thyroid conditions.",
    amazonUrl: "https://www.amazon.com/dp/B07N13YMK1?tag=maximost-20"
  },
  {
    id: 10,
    name: "Berberine",
    benefits: "Blood sugar regulation, lipid management, gut health, metabolic health.",
    expertInsights: [
      {
        expert: "Peter Attia",
        insight: "Often compares its metabolic benefits to metformin; particularly useful for those struggling with insulin sensitivity."
      },
      {
        expert: "Rhonda Patrick",
        insight: "Highlights both the metabolic and longevity potential, while noting GI adjustment period."
      }
    ],
    dosage: "500mg 1-3 times daily with meals",
    considerations: "Start with lower dose to assess tolerance. May interact with certain medications. Taking with meals reduces GI discomfort.",
    amazonUrl: "https://www.amazon.com/dp/B096X3JJ2V?tag=maximost-20"
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
          <a 
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button 
              variant="outline"
              size="sm"
              className="w-full gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Amazon
            </Button>
          </a>
          
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