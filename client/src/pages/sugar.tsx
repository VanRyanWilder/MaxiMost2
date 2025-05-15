import { useState } from "react";
import { ModernLayout } from "@/components/layout/modern-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CandyCane, 
  Brain, 
  Heart, 
  Scale, 
  AlertTriangle, 
  Dumbbell, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Share2, 
  ExternalLink,
  Apple,
  Coffee,
  UtensilsCrossed,
  Leaf,
  HeartPulse
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample sugar dangers resources - in a real app, this would come from an API
const sugarResources = [
  {
    id: 1,
    title: "The Impact of Sugar on Brain Function",
    description: "Research shows excessive sugar consumption affects cognitive function, memory, and may increase risk of neurodegenerative diseases.",
    category: "Brain Health",
    tags: ["Cognitive Function", "Memory", "Neuroscience"],
    readTime: "7 min",
    featured: true,
    content: "Chronic consumption of added sugar dulls the brain's mechanism for telling you to stop eating. Large amounts of added sugar reduce production of brain-derived neurotrophic factor (BDNF), a molecule essential for new memory formation and learning. Lower BDNF levels have been linked to dementia and Alzheimer's disease. Sugar also triggers inflammation within the brain, potentially damaging brain cells and contributing to depression, anxiety, and poor cognitive outcomes."
  },
  {
    id: 2,
    title: "How Sugar Drives Inflammation",
    description: "The mechanism behind sugar's role in chronic inflammation and how it affects nearly every system in the body.",
    category: "Inflammation",
    tags: ["Chronic Inflammation", "Metabolic Health", "Immune System"],
    readTime: "6 min",
    featured: true,
    content: "Excessive sugar consumption triggers the release of pro-inflammatory cytokines in the body. This systemic inflammation affects multiple systems and organs, contributing to metabolic disorders, cardiovascular disease, and even mental health conditions. Studies show that limiting added sugar intake can measurably reduce inflammatory markers in as little as two weeks. Complex carbohydrates and fiber-rich foods, in contrast, tend to be anti-inflammatory."
  },
  {
    id: 3,
    title: "The Sugar-Insulin Connection",
    description: "Understanding insulin resistance, blood sugar regulation, and the path to metabolic dysfunction.",
    category: "Metabolism",
    tags: ["Insulin Resistance", "Blood Sugar", "Metabolic Health"],
    readTime: "8 min",
    featured: true,
    content: "Frequent consumption of high-sugar foods forces your pancreas to produce excess insulin, eventually leading to decreased insulin sensitivity. As cells become resistant to insulin's effects, the pancreas compensates by producing even more insulin, creating a destructive cycle. This metabolic dysfunction is a precursor to type 2 diabetes and contributes to obesity, heart disease, and other chronic conditions. Limiting added sugars is one of the most effective ways to maintain healthy insulin sensitivity."
  },
  {
    id: 4,
    title: "Fructose: The Most Problematic Sugar",
    description: "Why fructose (especially in high-fructose corn syrup) poses unique metabolic challenges compared to other sugars.",
    category: "Nutrition Science",
    tags: ["Fructose", "Liver Health", "Food Industry"],
    readTime: "6 min",
    featured: false,
    content: "Unlike glucose, which can be used by every cell in the body, fructose is processed almost exclusively by the liver. When consumed in excess (especially in liquid form like sodas), fructose overloads the liver and is converted directly to fat. This contributes to non-alcoholic fatty liver disease, a condition affecting up to 25% of the population. Fructose also fails to suppress ghrelin (the hunger hormone) and doesn't stimulate leptin (the satiety hormone), which is why high-fructose foods don't make you feel full despite their high calorie content."
  },
  {
    id: 5,
    title: "Sugar Addiction: Neurochemistry and Reality",
    description: "The science behind sugar cravings, dopamine response, and whether sugar addiction is real.",
    category: "Brain Health",
    tags: ["Addiction", "Dopamine", "Cravings"],
    readTime: "7 min",
    featured: false,
    content: "Sugar activates the reward circuitry in the brain similarly to addictive drugs. It triggers the release of dopamine, creating a pleasure sensation that the brain seeks to repeat. Over time, tolerance develops, requiring more sugar to achieve the same dopamine response. This leads to a cycle of cravings and consumption. Studies show sugar withdrawal can cause symptoms like irritability, fatigue, and intense cravings. Unlike recreational drugs, however, sugar is socially accepted, legally available, and embedded in our food culture, making it particularly challenging to moderate."
  },
  {
    id: 6,
    title: "Practical Guide to Sugar Alternatives",
    description: "Comprehensive analysis of natural and artificial sweeteners, their metabolic effects, and best uses.",
    category: "Alternatives",
    tags: ["Sweeteners", "Stevia", "Monk Fruit", "Practical Tips"],
    readTime: "5 min",
    featured: false,
    content: "Not all sugar alternatives are created equal. Natural options like stevia, monk fruit, and allulose have minimal impact on blood sugar and insulin levels, making them generally better choices. However, artificial sweeteners like sucralose and aspartame may negatively impact gut bacteria and glucose tolerance in some people. Even with healthier alternatives, the goal should be to gradually reduce overall sweetness preference rather than simply substituting. Whole foods with natural sweetness, like berries, can help retrain your palate to appreciate subtler sweet flavors."
  }
];

// Sample of common hidden sugar sources
const hiddenSugarSources = [
  {
    name: "Pasta Sauce",
    sugarContent: "6-12g per serving",
    alternative: "Make homemade sauce with fresh tomatoes and herbs"
  },
  {
    name: "Yogurt",
    sugarContent: "15-29g per cup (flavored)",
    alternative: "Choose plain yogurt and add fresh fruit"
  },
  {
    name: "Granola",
    sugarContent: "10-15g per serving",
    alternative: "Make your own with oats, nuts, and minimal honey"
  },
  {
    name: "Salad Dressing",
    sugarContent: "5-7g per serving",
    alternative: "Use olive oil, vinegar, and herbs"
  },
  {
    name: "Breakfast Cereal",
    sugarContent: "10-20g per serving",
    alternative: "Opt for steel-cut oats with cinnamon"
  },
  {
    name: "Protein/Energy Bars",
    sugarContent: "15-30g per bar",
    alternative: "Choose bars with <5g sugar or have nuts and fruit instead"
  }
];

// Sugar addiction quiz questions
const sugarQuizQuestions = [
  {
    id: 1,
    question: "Do you crave sweet foods even when you're not hungry?",
    why: "Sugar activates the reward system in your brain, leading to cravings unrelated to actual hunger."
  },
  {
    id: 2,
    question: "Do you feel the need to eat something sweet after meals?",
    why: "This habit often indicates a psychological dependence rather than a physiological need."
  },
  {
    id: 3,
    question: "Have you tried to cut down on sugar but found it difficult?",
    why: "The difficulty in reducing sugar intake is a hallmark sign of dependence."
  },
  {
    id: 4,
    question: "Do you experience fatigue, irritability or headaches when you go without sugar?",
    why: "These are common withdrawal symptoms that occur when reducing sugar intake."
  },
  {
    id: 5,
    question: "Do you find yourself eating more sweets than you intended?",
    why: "Loss of control over consumption is a key characteristic of addictive behavior."
  }
];

// Available categories for filtering
const categories = [
  "All Categories",
  "Brain Health",
  "Inflammation",
  "Metabolism",
  "Nutrition Science",
  "Alternatives",
  "Practical Tips"
];

export default function SugarPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedResources, setSavedResources] = useState<number[]>([]);
  
  const toggleSave = (id: number) => {
    setSavedResources(prev => 
      prev.includes(id) ? prev.filter(resourceId => resourceId !== id) : [...prev, id]
    );
  };
  
  const filteredResources = sugarResources.filter(resource => {
    // Apply category filter
    if (activeCategory !== "All Categories" && 
        resource.category !== activeCategory && 
        !resource.tags.includes(activeCategory)) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured resources at the top
  const featuredResources = filteredResources.filter(r => r.featured);
  const regularResources = filteredResources.filter(r => !r.featured);
  
  return (
    <ModernLayout pageTitle="Sugar Dangers">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Sugar Dangers</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Understanding the hidden impact of sugar on health and performance
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search resources..."
                    className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" title="Filter resources">
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
          
          {/* Key Effects Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Key Effects of Sugar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/50 dark:to-background border-rose-200 dark:border-rose-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full mb-1">
                      <Brain className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="font-semibold">Cognitive Decline</h3>
                    <p className="text-sm text-muted-foreground">Impairs memory, focus, and may increase risk of neurodegenerative disorders</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-orange-50 to-white dark:from-orange-950/50 dark:to-background border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full mb-1">
                      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold">Chronic Inflammation</h3>
                    <p className="text-sm text-muted-foreground">Triggers inflammatory responses linked to chronic diseases and pain</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/50 dark:to-background border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full mb-1">
                      <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold">Metabolic Dysfunction</h3>
                    <p className="text-sm text-muted-foreground">Disrupts hormones, contributes to insulin resistance and weight gain</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-red-50 to-white dark:from-red-950/50 dark:to-background border-red-200 dark:border-red-800">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full mb-1">
                      <HeartPulse className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="font-semibold">Cardiovascular Risk</h3>
                    <p className="text-sm text-muted-foreground">Increases blood pressure, triglycerides, and risk of heart disease</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Featured Resources Section */}
          {featuredResources.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CandyCane className="h-5 w-5 text-rose-500" />
                Essential Reading
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {featuredResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    isSaved={savedResources.includes(resource.id)} 
                    onToggleSave={() => toggleSave(resource.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Resources Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">All Resources</h2>
            
            {regularResources.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {regularResources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    isSaved={savedResources.includes(resource.id)} 
                    onToggleSave={() => toggleSave(resource.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No resources found matching your criteria.</p>
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
          
          {/* Hidden Sugar Sources Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Hidden Sugar Sources</h2>
            <p className="text-muted-foreground mb-4">
              Sugar hides in many unexpected places. Here are some common foods that contain surprising amounts of added sugar.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hiddenSugarSources.map((source, index) => (
                <Card key={index} className="overflow-hidden border-red-100 dark:border-red-900">
                  <div className="flex">
                    <div className="bg-red-50 dark:bg-red-950 p-4 flex items-center justify-center">
                      <CandyCane className="h-10 w-10 text-red-400 dark:text-red-500" />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold">{source.name}</h3>
                      <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{source.sugarContent}</p>
                      <p className="text-xs text-muted-foreground mt-1">Alternative: {source.alternative}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Sugar Quiz Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Sugar Dependency Quiz</h2>
            <p className="text-muted-foreground mb-4">
              Answer these questions honestly to assess your relationship with sugar.
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              {sugarQuizQuestions.map((q) => (
                <AccordionItem key={q.id} value={`q-${q.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-2 text-left">
                      <div className="bg-orange-100 dark:bg-orange-900 p-1.5 rounded-full mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <span>{q.question}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pr-4 pb-2">
                      <p className="text-sm text-muted-foreground">{q.why}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>If you answered "yes" to 3 or more questions, you may have developed a sugar dependency.</p>
            </div>
          </div>
          
          {/* Sugar Alternatives Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Healthier Alternatives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-1">
                      <Apple className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold">Whole Fruit</h3>
                    <p className="text-sm text-muted-foreground">Contains fiber, slowing sugar absorption and providing nutrients</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full mb-1">
                      <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold">Stevia & Monk Fruit</h3>
                    <p className="text-sm text-muted-foreground">Natural zero-calorie sweeteners that don't affect blood sugar</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded-full mb-1">
                      <UtensilsCrossed className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-semibold">Spices & Extracts</h3>
                    <p className="text-sm text-muted-foreground">Cinnamon, vanilla, and nutmeg enhance sweetness perception naturally</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-1">
                      <Coffee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Palate Retraining</h3>
                    <p className="text-sm text-muted-foreground">Gradually reduce sweetness preference by cutting back slowly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
}

// Resource Card Component
interface ResourceCardProps {
  resource: {
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    readTime: string;
    featured: boolean;
    content: string;
  };
  isSaved: boolean;
  onToggleSave: () => void;
}

function ResourceCard({ resource, isSaved, onToggleSave }: ResourceCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-1">
          <Badge variant="outline" className="mb-2 border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400">
            {resource.category}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="h-4 w-4" />
            <span>{resource.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
        <CardDescription className="text-base mt-1">{resource.description}</CardDescription>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className={`text-sm text-muted-foreground ${expanded ? '' : 'line-clamp-3'}`}>
            {resource.content}
          </p>
          
          {resource.content.length > 240 && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-sm mt-1" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button variant="outline" className="gap-2" size="sm">
            <ArrowRight className="h-4 w-4" />
            <span>Read Full Article</span>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1" 
              onClick={onToggleSave}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}