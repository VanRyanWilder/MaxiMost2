import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ModernLayout } from "@/components/layout/modern-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  ShoppingCart,
  Star,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ArrowLeft,
  ListChecks,
  ShieldCheck,
  Droplet,
  Scale,
  AlertCircle,
  Bookmark,
  CheckCircle2,
  Share2,
  FileText,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { ReviewList } from "@/components/supplements/review-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// This would be fetched from an API in a real implementation
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
    longDescription: "Omega-3 fatty acids EPA and DHA are essential nutrients that play critical roles in brain function, cardiovascular health, and controlling inflammation. These fatty acids are considered essential because your body can't produce them efficiently, so they must be obtained from diet or supplements. Fish oil is one of the most concentrated natural sources of EPA and DHA, which are crucial for cell membrane health throughout the body.",
    benefits: [
      "Reduces inflammation throughout the body",
      "Supports cardiovascular health by lowering triglycerides and blood pressure",
      "Enhances brain function and may help protect against age-related cognitive decline",
      "May improve mood and help with symptoms of depression",
      "Supports eye health and visual development",
      "Can help reduce joint pain and stiffness in rheumatoid arthritis"
    ],
    sideEffects: [
      "Fishy aftertaste or breath (can be minimized with high-quality supplements)",
      "Occasionally causes mild digestive discomfort",
      "May interact with blood thinning medications",
      "High doses can potentially increase bleeding risk"
    ],
    dosage: "1-2 grams daily of combined EPA/DHA (usually 2-4 standard fish oil capsules) with food",
    timing: "Can be taken any time of day with a meal containing fat for optimal absorption",
    quality: "Look for products with high EPA/DHA content (not just total fish oil), molecular distillation, and third-party testing for contaminants",
    interactions: [
      "Blood thinners (warfarin, aspirin, etc.)",
      "Blood pressure medications",
      "Weight loss drugs (orlistat)"
    ],
    faq: [
      {
        question: "Is krill oil better than fish oil?",
        answer: "Krill oil contains the same omega-3 fatty acids (EPA and DHA) as fish oil, but in slightly different forms. Some research suggests the phospholipid form in krill oil may be more bioavailable, but you typically get less EPA and DHA per capsule. Both can be effective, with krill oil sometimes causing fewer digestive side effects but costing significantly more."
      },
      {
        question: "Can I get enough omega-3s from my diet alone?",
        answer: "It's possible, especially if you regularly consume fatty fish like salmon, mackerel, sardines, or herring 2-3 times per week. However, many people don't eat enough of these foods consistently, making supplementation a practical option. Vegetarian sources like flaxseed provide ALA, which converts inefficiently to EPA and DHA in the body."
      },
      {
        question: "Should I take omega-3 if I eat fish regularly?",
        answer: "If you consistently consume 2-3 servings of fatty fish weekly, you may not need supplementation. However, if your fish consumption is inconsistent or you're targeting specific health conditions that benefit from higher doses, supplementation might still be beneficial. Consider having your omega-3 index tested if you're unsure about your status."
      }
    ],
    amazonUrl: "https://amazon.com/best-omega3",
    featured: true,
    sources: [
      {
        title: "Effects of Omega-3 Fatty Acids on Cardiovascular Disease",
        authors: "Wang C, et al.",
        journal: "Journal of the American Heart Association",
        year: 2019,
        url: "https://pubmed.ncbi.nlm.nih.gov/sample1"
      },
      {
        title: "Omega-3 Fatty Acids and Depression: A Review of the Evidence",
        authors: "Grosso G, et al.",
        journal: "Current Pharmaceutical Design",
        year: 2018,
        url: "https://pubmed.ncbi.nlm.nih.gov/sample2"
      }
    ]
  }
];

// Define the supplement type
interface Supplement {
  id: number;
  name: string;
  rating: number;
  votesUp: number;
  votesDown: number;
  reviewCount: number;
  category: string;
  tags: string[];
  price: number;
  image: string;
  description: string;
  longDescription: string;
  benefits: string[];
  sideEffects: string[];
  dosage: string;
  timing: string;
  quality: string;
  interactions: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  amazonUrl: string;
  featured: boolean;
  sources: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    url: string;
  }[];
}

export default function SupplementDetailPage() {
  const [, params] = useRoute("/supplement-detail/:id");
  const [supplement, setSupplement] = useState<Supplement | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userVote, setUserVote] = useState<string | null>(null);
  
  useEffect(() => {
    if (params?.id) {
      // In a real app, this would be an API call
      const foundSupplement = supplements.find(s => s.id === parseInt(params.id));
      if (foundSupplement) {
        setSupplement(foundSupplement as Supplement);
      }
    }
  }, [params?.id]);
  
  if (!supplement) {
    return (
      <ModernLayout pageTitle="Supplement Details">
        <div className="container mx-auto px-4 py-10 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Supplement Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the supplement you're looking for.
          </p>
          <Link href="/supplements">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to All Supplements</span>
            </Button>
          </Link>
        </div>
      </ModernLayout>
    );
  }
  
  const handleVote = (voteType: string) => {
    setUserVote(prev => prev === voteType ? null : voteType);
    // In a real app, this would make an API call to update the vote
  };
  
  return (
    <ModernLayout pageTitle={supplement.name}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <Link href="/supplements">
            <Button variant="ghost" className="gap-2 pl-1">
              <ChevronLeft className="h-4 w-4" />
              <span>All Supplements</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="col-span-2">
            {/* Header Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start mb-1">
                  <Badge className="mb-2">{supplement.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold">{supplement.rating}</span>
                    <span className="text-sm text-muted-foreground">({supplement.reviewCount} reviews)</span>
                  </div>
                </div>
                <CardTitle className="text-3xl">{supplement.name}</CardTitle>
                <CardDescription className="text-base mt-1">{supplement.description}</CardDescription>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {supplement.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-1 ${userVote === 'up' ? 'text-green-600' : ''}`}
                        onClick={() => handleVote('up')}
                      >
                        <ThumbsUp className={`h-4 w-4 ${userVote === 'up' ? 'fill-green-600' : ''}`} />
                        <span>{supplement.votesUp + (userVote === 'up' ? 1 : 0)}</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`gap-1 ${userVote === 'down' ? 'text-rose-600' : ''}`}
                        onClick={() => handleVote('down')}
                      >
                        <ThumbsDown className={`h-4 w-4 ${userVote === 'down' ? 'fill-rose-600' : ''}`} />
                        <span>{supplement.votesDown + (userVote === 'down' ? 1 : 0)}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Bookmark className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tabs Content */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About {supplement.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-muted-foreground mb-4">{supplement.longDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Key Benefits
                      </h3>
                      <ul className="space-y-2 pl-4">
                        {supplement.benefits.map((benefit, idx) => (
                          <li key={idx} className="list-disc pl-2">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Potential Side Effects
                      </h3>
                      <ul className="space-y-2 pl-4">
                        {supplement.sideEffects.map((effect, idx) => (
                          <li key={idx} className="list-disc pl-2">{effect}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                        Recommended Dosage
                      </h3>
                      <p>{supplement.dosage}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{supplement.timing}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="research" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Research & Evidence</CardTitle>
                    <CardDescription>Scientific research supporting the efficacy of {supplement.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Key Studies</h3>
                      {supplement.sources.map((source, idx) => (
                        <div key={idx} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-1">{source.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {source.authors} • {source.journal} • {source.year}
                          </p>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary flex items-center gap-1"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>View Source</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Quality Considerations</h3>
                      <p className="text-sm text-muted-foreground">{supplement.quality}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="usage" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Guidelines</CardTitle>
                    <CardDescription>How to use {supplement.name} for maximum benefit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-blue-600" />
                        Dosage
                      </h3>
                      <p>{supplement.dosage}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <Scale className="h-5 w-5 text-purple-600" />
                        Timing
                      </h3>
                      <p>{supplement.timing}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        Potential Interactions
                      </h3>
                      <p className="mb-2">May interact with:</p>
                      <ul className="space-y-1 pl-4">
                        {supplement.interactions.map((interaction, idx) => (
                          <li key={idx} className="list-disc pl-2">{interaction}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Frequently Asked Questions</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {supplement.faq.map((item, idx) => (
                          <AccordionItem key={idx} value={`faq-${idx}`}>
                            <AccordionTrigger className="text-base font-medium">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-muted-foreground pt-2 pb-1">{item.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Reviews</CardTitle>
                    <CardDescription>
                      What other users are saying about {supplement.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Import and use the ReviewList component */}
                    <ReviewList 
                      supplementId={supplement.id}
                      supplementName={supplement.name}
                      overallRating={supplement.rating}
                      reviewCount={supplement.reviewCount}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar Column */}
          <div>
            {/* Purchase Card */}
            <Card className="sticky top-24 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">${supplement.price}</CardTitle>
                <CardDescription>Best value options from trusted suppliers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={supplement.amazonUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>View on Amazon</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </a>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>We earn a small commission on purchases</span>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium mb-2">What to Look For:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">High EPA/DHA content per serving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Molecularly distilled to remove contaminants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">Third-party tested and certified</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                Last price check: May 15, 2023
              </CardFooter>
            </Card>
            
            {/* Related Supplements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complementary Supplements</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground mb-2">
                  Related supplements coming soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}