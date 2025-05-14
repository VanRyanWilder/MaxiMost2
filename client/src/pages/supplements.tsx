import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Pill, 
  Leaf, 
  Brain, 
  Heart, 
  Dumbbell, 
  BarChart2, 
  Beaker, 
  FileText,
  Filter,
  LayoutGrid,
  List,
  Search,
  ExternalLink,
  Trophy,
  User,
  Quote,
  ArrowRight
} from "lucide-react";

// Define supplement types
type SupplementCategory = 
  | "cognitive" 
  | "fitness" 
  | "longevity" 
  | "sleep" 
  | "stress"
  | "hormone"
  | "general";

type ReviewScore = {
  efficacy: number;
  evidence: number;
  safety: number;
  value: number;
  overall: number;
};

interface ExpertInsight {
  expert: string;
  insight: string;
}

interface TopSupplement {
  id: number;
  name: string;
  benefits: string;
  expertInsights: ExpertInsight[];
  dosage: string;
}

interface Supplement {
  id: string;
  name: string;
  scientificName: string;
  category: SupplementCategory;
  description: string;
  effectivenessTier: "A" | "B" | "C" | "D" | "F";
  benefits: string[];
  dosage: string;
  warnings: string[];
  reviewScore: ReviewScore;
  upvotes: number;
  downvotes: number;
  researchLinks: string[];
  amazonLink?: string;
}

export default function SupplementsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"browse" | "top10">("browse");

  // Top 10 supplements data with expert insights
  const topSupplements: TopSupplement[] = [
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
        },
        {
          expert: "Ben Greenfield",
          insight: "Suggests omega-3s to reduce joint inflammation and enhance performance in high-intensity sports."
        }
      ],
      dosage: "2-4g daily, with ~2g EPA for optimal anti-inflammatory effects."
    },
    {
      id: 2,
      name: "Vitamin D3",
      benefits: "Boosts bone health, immunity, and muscle function.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Stresses its role in immune support and injury prevention for athletes with heavy training loads."
        },
        {
          expert: "Kelly Starrett",
          insight: "Advocates for vitamin D to maintain bone density and aid recovery, especially for runners."
        },
        {
          expert: "Cate Shanahan",
          insight: "Notes its importance for calcium absorption and preventing stress fractures."
        }
      ],
      dosage: "4,000-5,000 IU/day, adjusted based on blood levels."
    },
    {
      id: 3,
      name: "Magnesium",
      benefits: "Promotes muscle relaxation, sleep quality, and energy production.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Uses magnesium for better sleep and muscle recovery, critical for intense training schedules."
        },
        {
          expert: "Phil Maffetone",
          insight: "Recommends it to prevent cramps and support endurance performance."
        },
        {
          expert: "Stuart McGill",
          insight: "Emphasizes its role in muscle relaxation and spine health for injury prevention."
        }
      ],
      dosage: "1g daily, preferably as magnesium glycinate or citrate."
    },
    {
      id: 4,
      name: "Creatine Monohydrate",
      benefits: "Enhances muscle strength, power, and cognitive performance.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Praises creatine for physical and mental benefits, especially under fatigue."
        },
        {
          expert: "Andy Galpin",
          insight: "Recommends it for strength gains and recovery in high-intensity athletes."
        },
        {
          expert: "Brad Schoenfeld",
          insight: "Supports its use for muscle growth and resilience against injuries."
        }
      ],
      dosage: "5-10g daily."
    },
    {
      id: 5,
      name: "Probiotics",
      benefits: "Improves gut health, immunity, and mental well-being.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Values probiotics for gut health and metabolic benefits, aiding recovery."
        },
        {
          expert: "Rhonda Patrick",
          insight: "Notes their role in reducing gut inflammation, essential for athletes with high nutritional needs."
        },
        {
          expert: "Ben Greenfield",
          insight: "Suggests probiotics to optimize nutrient absorption and prevent GI issues in endurance events."
        }
      ],
      dosage: "10-50 billion CFU daily, depending on the product."
    },
    {
      id: 6,
      name: "Curcumin (with Piperine)",
      benefits: "Reduces inflammation, supports joint and metabolic health.",
      expertInsights: [
        {
          expert: "Peter Attia",
          insight: "Takes curcumin for its anti-inflammatory effects, speeding up recovery."
        },
        {
          expert: "Kelly Starrett",
          insight: "Recommends it for joint mobility and managing repetitive stress injuries."
        },
        {
          expert: "Cate Shanahan",
          insight: "Highlights its role in reducing systemic inflammation and aiding tissue repair."
        }
      ],
      dosage: "500-1,000mg daily in bioavailable forms."
    },
    {
      id: 7,
      name: "B Vitamins (Methylated Forms: B-12, Folate, B6)",
      benefits: "Supports energy production, brain health, and recovery.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Uses methylated B vitamins for cognitive and energy support during stress."
        },
        {
          expert: "Rhonda Patrick",
          insight: "Emphasizes their importance for cellular repair and recovery."
        },
        {
          expert: "Phil Maffetone",
          insight: "Recommends them for endurance athletes to enhance aerobic metabolism."
        }
      ],
      dosage: "Low-dose methylated forms, tailored to individual needs."
    },
    {
      id: 8,
      name: "Sulforaphane",
      benefits: "Provides antioxidant support, aids detoxification, and boosts brain health.",
      expertInsights: [
        {
          expert: "Rhonda Patrick",
          insight: "Advocates for sulforaphane's neuroprotective and anti-inflammatory effects, enhancing cognitive resilience."
        },
        {
          expert: "Ben Greenfield",
          insight: "Recommends it for detoxification, especially for athletes facing environmental stressors."
        }
      ],
      dosage: "20-40mg daily, from broccoli sprouts or supplements."
    },
    {
      id: 9,
      name: "NMN/NR (Nicotinamide Mononucleotide/Nicotinamide Riboside)",
      benefits: "Boosts cellular energy and supports longevity.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Takes NMN for cellular health, potentially aiding recovery and endurance."
        },
        {
          expert: "Peter Attia",
          insight: "Explores NAD+ precursors for metabolic benefits, relevant to ultra-marathoners."
        },
        {
          expert: "David Sinclair",
          insight: "Pioneers its use for cellular resilience and longevity."
        }
      ],
      dosage: "250-500mg daily."
    },
    {
      id: 10,
      name: "Electrolytes (e.g., LMNT)",
      benefits: "Maintains hydration, muscle function, and performance.",
      expertInsights: [
        {
          expert: "Andrew Huberman",
          insight: "Uses LMNT for hydration during intense workouts."
        },
        {
          expert: "Chris Hinshaw",
          insight: "Recommends electrolytes to prevent cramping and sustain performance in endurance sports."
        },
        {
          expert: "Tim Noakes",
          insight: "His hydration research underscores their importance for ultra-marathoners."
        }
      ],
      dosage: "1-2 packets daily, adjusted for activity level."
    }
  ];
  
  // Sample data for supplements
  const supplements: Supplement[] = [
    {
      id: "creatine",
      name: "Creatine Monohydrate",
      scientificName: "N-aminoiminomethyl-N-methylglycine",
      category: "fitness",
      description: "One of the most researched and effective supplements for increasing muscle strength and power",
      effectivenessTier: "A",
      benefits: [
        "Increases muscle strength and power",
        "Improves high-intensity exercise performance",
        "May provide cognitive benefits"
      ],
      dosage: "3-5g daily, loading phase optional",
      warnings: [
        "May cause water retention",
        "Stay well hydrated when supplementing"
      ],
      reviewScore: {
        efficacy: 9.5,
        evidence: 9.8,
        safety: 9.0,
        value: 9.5,
        overall: 9.5
      },
      upvotes: 245,
      downvotes: 12,
      researchLinks: [
        "https://pubmed.ncbi.nlm.nih.gov/14636102/",
        "https://pubmed.ncbi.nlm.nih.gov/12701815/"
      ],
      amazonLink: "https://www.amazon.com/dp/B00E9M4XEE"
    },
    {
      id: "vitamin-d",
      name: "Vitamin D3",
      scientificName: "Cholecalciferol",
      category: "general",
      description: "Essential vitamin with widespread effects on health, immunity, and overall wellbeing",
      effectivenessTier: "A",
      benefits: [
        "Supports bone health",
        "Enhances immune function",
        "May improve mood and mental health"
      ],
      dosage: "1,000-5,000 IU daily, adjusted based on blood levels",
      warnings: [
        "Toxicity possible at extremely high doses",
        "Should have blood levels monitored periodically"
      ],
      reviewScore: {
        efficacy: 9.0,
        evidence: 9.5,
        safety: 9.0,
        value: 9.5,
        overall: 9.3
      },
      upvotes: 218,
      downvotes: 8,
      researchLinks: [
        "https://pubmed.ncbi.nlm.nih.gov/22552031/",
        "https://pubmed.ncbi.nlm.nih.gov/28768407/"
      ],
      amazonLink: "https://www.amazon.com/dp/B0032BH76O"
    },
    {
      id: "magnesium",
      name: "Magnesium",
      scientificName: "Magnesium (various forms)",
      category: "general",
      description: "Essential mineral involved in hundreds of biochemical reactions in the body",
      effectivenessTier: "B",
      benefits: [
        "Supports muscle and nerve function",
        "Reduces muscle cramps and tension",
        "Supports normal heart rhythm",
        "May reduce anxiety and stress"
      ],
      dosage: "200-400mg elemental magnesium daily, preferably in the evening",
      warnings: [
        "May cause digestive upset at high doses",
        "Consult doctor if you have kidney issues"
      ],
      reviewScore: {
        efficacy: 8.0,
        evidence: 8.0,
        safety: 9.0,
        value: 8.5,
        overall: 8.4
      },
      upvotes: 156,
      downvotes: 14,
      researchLinks: [
        "https://pubmed.ncbi.nlm.nih.gov/23853635/",
        "https://pubmed.ncbi.nlm.nih.gov/27933574/"
      ],
      amazonLink: "https://www.amazon.com/dp/B07RM7VXFV"
    },
    {
      id: "fish-oil",
      name: "Fish Oil (EPA/DHA)",
      scientificName: "Omega-3 Fatty Acids",
      category: "general",
      description: "Essential fatty acids with extensive research supporting cardiovascular and brain benefits",
      effectivenessTier: "B",
      benefits: [
        "Reduces inflammation",
        "Supports heart health",
        "May improve cognitive function",
        "Supports joint health"
      ],
      dosage: "1-3g combined EPA/DHA daily",
      warnings: [
        "May interact with blood thinning medications",
        "Look for products tested for heavy metals"
      ],
      reviewScore: {
        efficacy: 7.5,
        evidence: 8.5,
        safety: 9.0,
        value: 7.0,
        overall: 8.0
      },
      upvotes: 174,
      downvotes: 22,
      researchLinks: [
        "https://pubmed.ncbi.nlm.nih.gov/30787335/",
        "https://pubmed.ncbi.nlm.nih.gov/29800598/"
      ],
      amazonLink: "https://www.amazon.com/dp/B01GV4O37E"
    },
    {
      id: "protein",
      name: "Whey Protein",
      scientificName: "Whey Protein Isolate/Concentrate",
      category: "fitness",
      description: "High-quality protein source for building and repairing muscle tissue",
      effectivenessTier: "A",
      benefits: [
        "Supports muscle growth and recovery",
        "Convenient way to meet protein needs",
        "Contains all essential amino acids"
      ],
      dosage: "20-40g per serving, 1-2 servings daily based on needs",
      warnings: [
        "May cause digestive issues for those with lactose intolerance",
        "Not necessary if protein needs are met through diet"
      ],
      reviewScore: {
        efficacy: 9.0,
        evidence: 9.0,
        safety: 9.5,
        value: 8.0,
        overall: 8.9
      },
      upvotes: 198,
      downvotes: 15,
      researchLinks: [
        "https://pubmed.ncbi.nlm.nih.gov/28642676/",
        "https://pubmed.ncbi.nlm.nih.gov/25169440/"
      ],
      amazonLink: "https://www.amazon.com/dp/B01N5HPDCS"
    }
  ];
  
  // Helper functions for display
  function getCategoryIcon(category: SupplementCategory) {
    switch (category) {
      case "cognitive":
        return <Brain className="h-5 w-5" />;
      case "fitness":
        return <Dumbbell className="h-5 w-5" />;
      case "longevity":
        return <Heart className="h-5 w-5" />;
      case "sleep":
        return <Brain className="h-5 w-5" />;
      case "stress":
        return <Brain className="h-5 w-5" />;
      case "hormone":
        return <Beaker className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  }
  
  function getTierColor(tier: Supplement["effectivenessTier"]) {
    switch (tier) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "F":
        return "bg-red-100 text-red-800 border-red-200";
    }
  }

  // Filter supplements based on search, category, and tier
  const filteredSupplements = supplements.filter(supplement => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      supplement.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      supplement.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || supplement.category === categoryFilter;
    
    // Tier filter
    const matchesTier = tierFilter === "all" || supplement.effectivenessTier === tierFilter;
    
    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <PageContainer title="Science-Backed Supplements">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "browse" | "top10")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="browse" className="text-base">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Browse All
          </TabsTrigger>
          <TabsTrigger value="top10" className="text-base">
            <Trophy className="h-4 w-4 mr-2" />
            Top 10 Expert Picks
          </TabsTrigger>
        </TabsList>
          
        {/* Browse Tab Content */}
        <TabsContent value="browse">
          {/* Filter and search bar */}
          <div className="bg-background sticky top-0 z-10 py-4 mb-6 border-b">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search supplements..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cognitive">Cognitive</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="general">General Health</SelectItem>
                    <SelectItem value="hormone">Hormonal</SelectItem>
                    <SelectItem value="longevity">Longevity</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                    <SelectItem value="stress">Stress</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="A">Tier A</SelectItem>
                    <SelectItem value="B">Tier B</SelectItem>
                    <SelectItem value="C">Tier C</SelectItem>
                    <SelectItem value="D">Tier D</SelectItem>
                    <SelectItem value="F">Tier F</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === "grid" ? "default" : "ghost"} 
                    size="icon" 
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "default" : "ghost"} 
                    size="icon" 
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tier explanation */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Effectiveness Tiers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
              <div className="flex items-center p-2 bg-green-50 rounded-md border border-green-100">
                <span className="font-bold text-green-800 mr-2">A Tier:</span>
                <span className="text-green-700">Strong scientific evidence, highly effective</span>
              </div>
              <div className="flex items-center p-2 bg-blue-50 rounded-md border border-blue-100">
                <span className="font-bold text-blue-800 mr-2">B Tier:</span>
                <span className="text-blue-700">Good evidence, effective for most people</span>
              </div>
              <div className="flex items-center p-2 bg-yellow-50 rounded-md border border-yellow-100">
                <span className="font-bold text-yellow-800 mr-2">C Tier:</span>
                <span className="text-yellow-700">Mixed evidence, may work for some</span>
              </div>
              <div className="flex items-center p-2 bg-orange-50 rounded-md border border-orange-100">
                <span className="font-bold text-orange-800 mr-2">D Tier:</span>
                <span className="text-orange-700">Weak evidence, likely ineffective</span>
              </div>
              <div className="flex items-center p-2 bg-red-50 rounded-md border border-red-100">
                <span className="font-bold text-red-800 mr-2">F Tier:</span>
                <span className="text-red-700">Debunked or potentially harmful</span>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {filteredSupplements.length} {filteredSupplements.length === 1 ? 'supplement' : 'supplements'} found
            </h3>
            <Select defaultValue="effectiveness">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="effectiveness">Sort by Effectiveness</SelectItem>
                <SelectItem value="evidence">Sort by Evidence Quality</SelectItem>
                <SelectItem value="upvotes">Sort by Community Votes</SelectItem>
                <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Grid view of supplements */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupplements.map(supplement => (
                <Card key={supplement.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`font-bold ${getTierColor(supplement.effectivenessTier)}`}>
                        Tier {supplement.effectivenessTier}
                      </Badge>
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        {getCategoryIcon(supplement.category)}
                        <span>{supplement.category.charAt(0).toUpperCase() + supplement.category.slice(1)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{supplement.name}</CardTitle>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{supplement.upvotes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm">{supplement.downvotes}</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="italic mt-1 text-sm">
                      {supplement.scientificName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm mb-2">{supplement.description}</p>
                    <div className="text-sm">
                      <div className="font-medium mb-1">Key Benefits:</div>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {supplement.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-sm">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      Details
                    </Button>
                    {supplement.amazonLink && (
                      <Button size="sm" className="text-xs h-8">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Buy
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            /* List view of supplements */
            <div className="space-y-4">
              {filteredSupplements.map(supplement => (
                <div key={supplement.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start mb-2">
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                          <Badge className={`font-bold ${getTierColor(supplement.effectivenessTier)}`}>
                            Tier {supplement.effectivenessTier}
                          </Badge>
                          <Badge variant="outline" className="flex gap-1.5 items-center">
                            {getCategoryIcon(supplement.category)}
                            <span>{supplement.category.charAt(0).toUpperCase() + supplement.category.slice(1)}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                          <span className="text-xs font-medium text-muted-foreground">Overall Score:</span>
                          <div className="flex items-center gap-1">
                            <BarChart2 className="h-4 w-4 text-primary" />
                            <span className="font-bold">{supplement.reviewScore.overall}/10</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold">
                            {supplement.name}
                          </h3>
                          <p className="text-sm text-muted-foreground italic">{supplement.scientificName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{supplement.upvotes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4 text-red-600" />
                            <span className="text-sm">{supplement.downvotes}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-2">{supplement.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
                        <div>
                          <h4 className="text-sm font-semibold">Benefits:</h4>
                          <ul className="text-sm list-disc pl-5">
                            {supplement.benefits.map((benefit, i) => (
                              <li key={i}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold">Dosage:</h4>
                          <p className="text-sm">{supplement.dosage}</p>
                          
                          <h4 className="text-sm font-semibold mt-2">Warnings:</h4>
                          <ul className="text-sm list-disc pl-5">
                            {supplement.warnings.map((warning, i) => (
                              <li key={i} className="text-red-600">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-32 flex flex-row md:flex-col gap-2 justify-end">
                      <Button size="sm" variant="outline" className="text-xs h-8 w-full justify-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Research
                      </Button>
                      {supplement.amazonLink && (
                        <Button size="sm" className="text-xs h-8 w-full justify-center">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Buy
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
            
        {/* Top 10 Tab Content */}
        <TabsContent value="top10">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold">Top 10 Supplements with Expert Insights</h2>
            </div>
            <p className="text-muted-foreground">
              These are the highest-ROI supplements backed by scientific research and recommended by leading health experts. 
              Each provides significant benefits with minimal downsides when used appropriately.
            </p>
          </div>
          
          <div className="space-y-10">
            {topSupplements.map((supplement) => (
              <div key={supplement.id} className="relative border-l-4 border-primary pl-6 pb-6">
                <div className="absolute -left-6 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                  {supplement.id}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold">{supplement.name}</h3>
                  
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold">Benefits</h4>
                      </div>
                      <p>{supplement.benefits}</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Beaker className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold">Recommended Dosage</h4>
                      </div>
                      <p>{supplement.dosage}</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold">Expert Insights</h4>
                      </div>
                      <div className="space-y-4">
                        {supplement.expertInsights.map((insight, index) => (
                          <div key={index} className="pl-4 border-l-2 border-primary/30">
                            <div className="flex items-center gap-2">
                              <Quote className="h-4 w-4 text-primary" />
                              <span className="font-semibold">{insight.expert}</span>
                            </div>
                            <p className="mt-1 text-sm">{insight.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}