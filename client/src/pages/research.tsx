import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  BookOpen, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Clock, 
  ExternalLink, 
  Heart, 
  Bookmark, 
  Share2 
} from "lucide-react";

// Sample scientific research data - in a real app, this would come from an API
const researchPapers = [
  {
    id: 1,
    title: "Effects of Intermittent Fasting on Health, Aging, and Disease",
    authors: "de Cabo, R., & Mattson, M. P.",
    journal: "New England Journal of Medicine",
    year: 2019,
    abstract: "Evidence is accumulating that eating in a 6-hour period and fasting for 18 hours can trigger a metabolic switch from glucose-based to ketone-based energy, with increased stress resistance, increased longevity, and decreased incidence of diseases, including cancer and obesity.",
    categories: ["Nutrition", "Longevity", "Metabolism"],
    downloadUrl: "https://www.nejm.org/doi/full/10.1056/NEJMra1905136",
    readTime: "16 min",
    featured: true
  },
  {
    id: 2,
    title: "Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-Analysis",
    authors: "Cappuccio, F. P., et al.",
    journal: "Sleep",
    year: 2010,
    abstract: "Both short and long duration of sleep are significant predictors of death in prospective population studies. This meta-analysis suggests that 7-8 hours of sleep per night is optimal for health.",
    categories: ["Sleep", "Longevity", "Meta-Analysis"],
    downloadUrl: "https://pubmed.ncbi.nlm.nih.gov/20469800/",
    readTime: "12 min",
    featured: true
  },
  {
    id: 3,
    title: "Strength Training as Superior Exercise for Health Promotion in Elderly",
    authors: "Vikberg, S., et al.",
    journal: "Aging Clinical and Experimental Research",
    year: 2019,
    abstract: "Strength training appears to be more effective than general physical activity in elderly for maintaining muscle mass, preventing sarcopenia, and improving quality of life. This study recommends resistance training as a primary intervention for older adults.",
    categories: ["Exercise", "Aging", "Strength Training"],
    downloadUrl: "https://pubmed.ncbi.nlm.nih.gov/30515724/",
    readTime: "14 min",
    featured: true
  },
  {
    id: 4,
    title: "The Neuroscience of Mindfulness Meditation",
    authors: "Tang, Y. Y., Hölzel, B. K., & Posner, M. I.",
    journal: "Nature Reviews Neuroscience",
    year: 2015,
    abstract: "Mindfulness meditation practices lead to significant changes in brain structure and function, particularly in areas related to attention, emotion regulation, and self-awareness. These neurobiological changes may underlie the positive effects of mindfulness on health and cognition.",
    categories: ["Neuroscience", "Meditation", "Mental Health"],
    downloadUrl: "https://www.nature.com/articles/nrn3916",
    readTime: "18 min",
    featured: false
  },
  {
    id: 5,
    title: "Time-Restricted Feeding without Reducing Caloric Intake Prevents Metabolic Diseases in Mice Fed a High-Fat Diet",
    authors: "Hatori, M., et al.",
    journal: "Cell Metabolism",
    year: 2012,
    abstract: "Restricting feeding to an 8-hour period without reducing caloric intake protected mice against obesity, hyperinsulinemia, hepatic steatosis, and inflammation when compared to mice eating the same number of calories in a 24-hour period.",
    categories: ["Nutrition", "Metabolism", "Time-Restricted Eating"],
    downloadUrl: "https://pubmed.ncbi.nlm.nih.gov/22608008/",
    readTime: "15 min",
    featured: false
  },
  {
    id: 6,
    title: "Association Between Physical Exercise and Mental Health in 1.2 Million Individuals",
    authors: "Chekroud, S. R., et al.",
    journal: "The Lancet Psychiatry",
    year: 2018,
    abstract: "Regular exercise was associated with better mental health, with team sports, cycling, and aerobic exercise having the strongest associations. The relationship was U-shaped, with too much exercise potentially being detrimental.",
    categories: ["Exercise", "Mental Health", "Population Study"],
    downloadUrl: "https://pubmed.ncbi.nlm.nih.gov/30099000/",
    readTime: "17 min",
    featured: false
  }
];

// Available categories for filtering
const categories = [
  "All Categories",
  "Nutrition",
  "Exercise",
  "Sleep",
  "Longevity",
  "Mental Health",
  "Metabolism",
  "Neuroscience",
  "Aging"
];

export default function ResearchPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPapers, setSavedPapers] = useState<number[]>([]);
  
  const toggleSave = (id: number) => {
    setSavedPapers(prev => 
      prev.includes(id) ? prev.filter(paperId => paperId !== id) : [...prev, id]
    );
  };
  
  const filteredPapers = researchPapers.filter(paper => {
    // Apply category filter
    if (activeCategory !== "All Categories" && !paper.categories.includes(activeCategory)) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        paper.title.toLowerCase().includes(query) ||
        paper.abstract.toLowerCase().includes(query) ||
        paper.authors.toLowerCase().includes(query) ||
        paper.journal.toLowerCase().includes(query) ||
        paper.categories.some(category => category.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured papers at the top
  const featuredPapers = filteredPapers.filter(p => p.featured);
  const regularPapers = filteredPapers.filter(p => !p.featured);
  
  return (
    <PageContainer title="Scientific Research">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Scientific Research</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Evidence-based research on health, performance, and well-being
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search research papers..."
                    className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button variant="outline" size="icon" title="Filter papers">
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
          
          {/* Featured Research Section */}
          {featuredPapers.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Featured Research
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {featuredPapers.map(paper => (
                  <ResearchCard 
                    key={paper.id} 
                    paper={paper} 
                    isSaved={savedPapers.includes(paper.id)} 
                    onToggleSave={() => toggleSave(paper.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* All Research Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">All Research</h2>
            
            {regularPapers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {regularPapers.map(paper => (
                  <ResearchCard 
                    key={paper.id} 
                    paper={paper} 
                    isSaved={savedPapers.includes(paper.id)} 
                    onToggleSave={() => toggleSave(paper.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No research papers found matching your criteria.</p>
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
          <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full text-blue-600 dark:text-blue-300">
                  <FlaskConical className="h-10 w-10" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Understanding Research</h2>
                  <p className="text-muted-foreground mb-4">
                    Scientific research is the foundation of evidence-based health practices. Our curated collection 
                    focuses on peer-reviewed studies with strong methodologies and significant findings. We prioritize 
                    research that has practical applications for improving health and performance.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-indigo-100 dark:bg-indigo-900 p-1.5 rounded-full mt-0.5">
                        <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Original Research</p>
                        <p className="text-xs text-muted-foreground">Primary studies from leading journals</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full mt-0.5">
                        <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Simplified Summaries</p>
                        <p className="text-xs text-muted-foreground">Complex research explained clearly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

// Research Card Component
interface ResearchCardProps {
  paper: {
    id: number;
    title: string;
    authors: string;
    journal: string;
    year: number;
    abstract: string;
    categories: string[];
    downloadUrl: string;
    readTime: string;
    featured: boolean;
  };
  isSaved: boolean;
  onToggleSave: () => void;
}

function ResearchCard({ paper, isSaved, onToggleSave }: ResearchCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between mb-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {paper.categories.map(category => (
              <Badge key={category} variant="secondary" className="font-normal">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
            <Clock className="h-4 w-4" />
            <span>{paper.readTime}</span>
          </div>
        </div>
        <CardTitle className="text-xl mb-1">{paper.title}</CardTitle>
        <CardDescription className="text-sm">
          {paper.authors} • {paper.journal} • {paper.year}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {paper.abstract}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <a href={paper.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2" size="sm">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
          
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