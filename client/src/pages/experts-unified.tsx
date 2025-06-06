import { useState } from "react";
import { 
  Search, 
  Filter, 
  Users, 
  Youtube, 
  BookOpen, 
  Instagram, 
  Twitter, 
  Podcast, 
  Globe, 
  Link, 
  Bookmark, 
  Star,
  Medal,
  PencilRuler,
  Brain,
  Dumbbell,
  Utensils,
  Activity,
  Calendar
} from "lucide-react";

import { expertsData, expertCategories, Expert, ExpertCategory } from '@/data/experts-data';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageContainer } from '@/components/layout/page-container';

const ExpertsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [followedExperts, setFollowedExperts] = useState<number[]>([]); // Assuming expert ID is number based on old data

  const getCategoryIconComponent = (categoryId: string): React.ReactNode => {
    switch (categoryId) {
      case 'Longevity': return <Calendar className="w-4 h-4" />;
      case 'Neuroscience': return <Brain className="w-4 h-4" />;
      case 'Physical Training': return <Dumbbell className="w-4 h-4" />;
      case 'Nutrition': return <Utensils className="w-4 h-4" />;
      case 'Sleep': return <Activity className="w-4 h-4" />;
      default: return null; // Or a default icon like <Users className="w-4 h-4" /> for 'all'
    }
  };
  
  const toggleFollow = (id: number) => {
    setFollowedExperts(prev => 
      prev.includes(id) ? prev.filter(expertId => expertId !== id) : [...prev, id]
    );
  };
  
  const filteredExperts = expertsData.filter(expert => {
    // Apply category filter
    if (selectedCategory !== "all" && expert.category !== selectedCategory) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expert.name.toLowerCase().includes(query) ||
        expert.title.toLowerCase().includes(query) ||
        expert.bio.toLowerCase().includes(query) ||
        expert.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Featured experts at the top
  const featuredExperts = filteredExperts.filter(e => e.featured);
  const regularExperts = filteredExperts.filter(e => !e.featured);
  
  return (
    <PageContainer title="Experts">
      <div className="flex flex-col space-y-8 pb-16">
        {/* Hero section */}
        <section className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">MaxiMost Health & Performance Experts</h1>
              <p className="text-lg mb-4">
                Follow the world's top evidence-based experts in health, longevity, and human performance
              </p>
              <div className="flex items-center gap-2">
                <PencilRuler className="h-5 w-5" />
                <span className="text-sm">Rated for expertise, actionability, and no-nonsense advice</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h2 className="text-2xl font-bold">Browse Experts</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search experts..."
                className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon" title="Filter experts">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            {expertCategories.map(category => (
              <TabsTrigger 
                key={category.id}
                value={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-1.5"
              >
                {getCategoryIconComponent(category.id)}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Top Experts Section */}
        {featuredExperts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Top Experts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExperts.map(expert => (
                <ExpertCard 
                  key={expert.id} 
                  expert={expert} 
                  isFollowed={followedExperts.includes(expert.id)} 
                  onToggleFollow={() => toggleFollow(expert.id)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* All Experts Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">All Experts</h2>
          
          {regularExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularExperts.map(expert => (
                <ExpertCard 
                  key={expert.id} 
                  expert={expert} 
                  isFollowed={followedExperts.includes(expert.id)} 
                  onToggleFollow={() => toggleFollow(expert.id)}
                />
              ))}
            </div>
          ) : (
            searchQuery || selectedCategory !== "all" ? (
              <Card className="bg-muted/40">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No experts found matching your criteria.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            ) : null
          )}
        </div>
        
        {/* Information Section */}
        <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full text-indigo-600 dark:text-indigo-300">
                <Users className="h-10 w-10" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Why Follow Health Experts?</h2>
                <p className="text-muted-foreground mb-4">
                  Learning from qualified experts saves you time, prevents misinformation, and accelerates your results. 
                  The experts featured here have dedicated their careers to understanding the science of health and performance,
                  translating complex research into actionable advice you can implement immediately.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded-full mt-0.5">
                      <Medal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vetted Credentials</p>
                      <p className="text-xs text-muted-foreground">Experts with proven academic background and research</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mt-0.5">
                      <Link className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Direct Resources</p>
                      <p className="text-xs text-muted-foreground">Books, podcasts, and articles from primary sources</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

// Expert Card Component
interface ExpertCardProps {
  expert: Expert; // Changed from inline object to imported Expert type
  isFollowed: boolean;
  onToggleFollow: () => void;
}

function ExpertCard({ expert, isFollowed, onToggleFollow }: ExpertCardProps) {
  // Calculate overall rating
  const overallRating = ((expert.expertise + expert.evidenceBased + expert.actionability + expert.noNonsense) / 4).toFixed(1);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Get icon for link type
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'podcast':
        return <Podcast className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              {expert.avatarUrl ? (
                <AvatarImage src={expert.avatarUrl} alt={expert.name} />
              ) : (
                <AvatarFallback>{getInitials(expert.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-lg">{expert.name}</CardTitle>
              <CardDescription className="text-sm">
                {expert.title}
              </CardDescription>
              <div className="flex mt-1 items-center">
                <Badge variant="outline" className="text-xs bg-amber-50 border-amber-200 text-amber-700">
                  {overallRating}/10
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">{expert.category}</span>
              </div>
            </div>
          </div>
          <Button
            variant={isFollowed ? "default" : "outline"}
            size="sm"
            onClick={onToggleFollow}
            className={isFollowed ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isFollowed ? "Following" : "Follow"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0 flex-grow">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {expert.bio}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {expert.topics.slice(0, 4).map((topic, index) => (
            <Badge key={index} variant="secondary" className="text-xs font-normal">
              {topic}
            </Badge>
          ))}
          {expert.topics.length > 4 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{expert.topics.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
          <div className="text-xs">
            <span className="text-muted-foreground">Expertise: </span>
            <span className="font-medium">{expert.expertise}/10</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Evidence-Based: </span>
            <span className="font-medium">{expert.evidenceBased}/10</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Actionability: </span>
            <span className="font-medium">{expert.actionability}/10</span>
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">No-Nonsense: </span>
            <span className="font-medium">{expert.noNonsense}/10</span>
          </div>
        </div>
        
        {/* Top resources */}
        {expert.resources.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Top Resources</h4>
            <div className="space-y-2">
              {expert.resources.slice(0, 2).map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline block"
                >
                  {resource.title} ({resource.type})
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 pb-3">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {expert.links.slice(0, 4).map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title={`${expert.name}'s ${link.type}`}
              >
                {getLinkIcon(link.type)}
              </a>
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ExpertsPage;