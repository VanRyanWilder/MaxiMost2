import { useState } from "react";
import { ModernLayout } from "@/components/layout/modern-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Scroll, 
  BookOpen, 
  Search, 
  Filter, 
  Quote, 
  Star, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  Share2,
  Heart,
  BookMarked
} from "lucide-react";

// Sample stoic principles data - in a real app, this would come from an API
const stoicPrinciples = [
  {
    id: 1,
    title: "The Dichotomy of Control",
    author: "Epictetus",
    source: "Enchiridion",
    description: "Focus solely on what you can control - your judgments, actions, and intentions. Everything else is beyond your control and should not disturb your peace of mind.",
    quote: "Make the best use of what is in your power, and take the rest as it happens.",
    categories: ["Core Principle", "Mental Freedom", "Perspective"],
    application: "When facing uncertainty or challenges, identify what aspects you control and what you don't. Direct your energy only to what you can influence.",
    readTime: "4 min",
    featured: true
  },
  {
    id: 2,
    title: "Negative Visualization",
    author: "Seneca",
    source: "Letters from a Stoic",
    description: "Regularly contemplate the loss of what you value—health, relationships, possessions—not to induce anxiety, but to deepen gratitude and reduce attachment.",
    quote: "He who fears he shall suffer, already suffers what he fears.",
    categories: ["Practice", "Gratitude", "Detachment"],
    application: "Spend a few minutes each day imaging life without something you value. This practice reduces hedonic adaptation and increases appreciation.",
    readTime: "5 min",
    featured: true
  },
  {
    id: 3,
    title: "Amor Fati (Love of Fate)",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Embrace everything that happens as necessary and beneficial, even difficulties and setbacks. Don't merely tolerate circumstances but welcome them.",
    quote: "Love everything that happens to you. Everything was written.",
    categories: ["Core Principle", "Resilience", "Acceptance"],
    application: "When facing adversity, ask 'How can I use this as an opportunity?' rather than resisting what cannot be changed.",
    readTime: "4 min",
    featured: true
  },
  {
    id: 4,
    title: "Memento Mori (Remember Death)",
    author: "Seneca",
    source: "On the Shortness of Life",
    description: "Regular contemplation of mortality as a way to prioritize what truly matters and live with urgency and appreciation.",
    quote: "You live as if you were destined to live forever, no thought of your frailty ever enters your head.",
    categories: ["Practice", "Perspective", "Focus"],
    application: "Ask yourself: 'If I had one year to live, would I still spend my time this way?' Use this perspective to eliminate trivialities.",
    readTime: "6 min",
    featured: false
  },
  {
    id: 5,
    title: "The Inner Citadel",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Your mind is a fortress that cannot be breached without your permission. External events cannot harm your inner self unless you allow them to.",
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    categories: ["Core Principle", "Mental Freedom", "Resilience"],
    application: "When external circumstances seem overwhelming, retreat into your inner citadel through mindfulness or reflection.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 6,
    title: "Premeditatio Malorum (Premeditation of Evils)",
    author: "Seneca",
    source: "On Tranquility of Mind",
    description: "Mentally rehearsing potential difficulties to reduce their impact and develop resilience in advance.",
    quote: "He who has anticipated the coming of troubles takes away their power when they arrive.",
    categories: ["Practice", "Preparation", "Resilience"],
    application: "Before important events, spend time considering what could go wrong and how you would respond, not with anxiety but with calm preparation.",
    readTime: "5 min",
    featured: false
  },
  {
    id: 7,
    title: "The View From Above",
    author: "Marcus Aurelius",
    source: "Meditations",
    description: "Gaining perspective by imagining viewing your circumstances from a great height, revealing the smallness of your concerns in the cosmos.",
    quote: "Think of the whole universe of matter and how small your share. Think about the expanse of time and how brief your moment.",
    categories: ["Practice", "Perspective", "Humility"],
    application: "When caught in petty concerns, imagine viewing Earth from space, seeing your situation from this cosmic perspective.",
    readTime: "4 min",
    featured: false
  }
];

// Available categories for filtering
const categories = [
  "All Categories",
  "Core Principle",
  "Practice",
  "Perspective",
  "Resilience",
  "Mental Freedom",
  "Acceptance",
  "Gratitude",
  "Focus"
];

export default function PrinciplesPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPrinciples, setSavedPrinciples] = useState<number[]>([]);
  
  const toggleSave = (id: number) => {
    setSavedPrinciples(prev => 
      prev.includes(id) ? prev.filter(principleId => principleId !== id) : [...prev, id]
    );
  };
  
  const filteredPrinciples = stoicPrinciples.filter(principle => {
    // Apply category filter
    if (activeCategory !== "All Categories" && !principle.categories.includes(activeCategory)) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        principle.title.toLowerCase().includes(query) ||
        principle.description.toLowerCase().includes(query) ||
        principle.author.toLowerCase().includes(query) ||
        principle.quote.toLowerCase().includes(query) ||
        principle.categories.some(category => category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured principles at the top
  const featuredPrinciples = filteredPrinciples.filter(p => p.featured);
  const regularPrinciples = filteredPrinciples.filter(p => !p.featured);
  
  return (
    <ModernLayout pageTitle="Core Stoic Principles">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Core Stoic Principles</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Ancient wisdom for modern challenges and maximum effectiveness
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search principles..."
                    className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" title="Filter principles">
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
          
          {/* Featured Principles Section */}
          {featuredPrinciples.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Essential Principles
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {featuredPrinciples.map(principle => (
                  <PrincipleCard 
                    key={principle.id} 
                    principle={principle} 
                    isSaved={savedPrinciples.includes(principle.id)} 
                    onToggleSave={() => toggleSave(principle.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Principles Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">All Principles</h2>
            
            {regularPrinciples.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {regularPrinciples.map(principle => (
                  <PrincipleCard 
                    key={principle.id} 
                    principle={principle} 
                    isSaved={savedPrinciples.includes(principle.id)} 
                    onToggleSave={() => toggleSave(principle.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No principles found matching your criteria.</p>
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
          <Card className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-amber-100 dark:bg-amber-900 p-4 rounded-full text-amber-600 dark:text-amber-300">
                  <Scroll className="h-10 w-10" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Why Stoicism?</h2>
                  <p className="text-muted-foreground mb-4">
                    Stoicism offers practical wisdom for thriving in an unpredictable world. These ancient principles 
                    have endured for over 2,000 years because they focus on what truly matters: developing inner 
                    resilience, maintaining perspective, and taking effective action. Stoicism doesn't just help you
                    endure life's challenges—it provides a framework for flourishing despite them.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-orange-100 dark:bg-orange-900 p-1.5 rounded-full mt-0.5">
                        <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time-Tested Wisdom</p>
                        <p className="text-xs text-muted-foreground">From ancient Rome to modern CEOs and athletes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-red-100 dark:bg-red-900 p-1.5 rounded-full mt-0.5">
                        <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Practical Application</p>
                        <p className="text-xs text-muted-foreground">Actionable exercises for daily challenges</p>
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

// Principle Card Component
interface PrincipleCardProps {
  principle: {
    id: number;
    title: string;
    author: string;
    source: string;
    description: string;
    quote: string;
    categories: string[];
    application: string;
    readTime: string;
    featured: boolean;
  };
  isSaved: boolean;
  onToggleSave: () => void;
}

function PrincipleCard({ principle, isSaved, onToggleSave }: PrincipleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {principle.categories.map(category => (
              <Badge key={category} variant="secondary" className="font-normal">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="h-4 w-4" />
            <span>{principle.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-xl mb-1">{principle.title}</CardTitle>
        <CardDescription className="text-sm">
          {principle.author} • {principle.source}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4 bg-secondary/20 dark:bg-secondary/10 p-4 rounded-md relative">
          <Quote className="absolute top-2 left-2 h-5 w-5 text-secondary opacity-40" />
          <p className="pl-4 pt-2 italic text-muted-foreground">
            "{principle.quote}"
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {principle.description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Practical Application:</h4>
          <p className="text-sm text-muted-foreground">{principle.application}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Button variant="outline" className="gap-2" size="sm">
            <BookMarked className="h-4 w-4" />
            <span>Learn More</span>
            <ArrowRight className="h-3 w-3" />
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