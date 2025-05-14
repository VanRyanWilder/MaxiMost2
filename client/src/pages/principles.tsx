import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Quote, 
  Star, 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  Compass,
  Sword,
  Shield,
  Brain,
  Heart,
  Flame,
  Clock
} from "lucide-react";

// Types for principles
interface Principle {
  id: string;
  title: string;
  quote: string;
  explanation: string;
  source: string;
  author: "jocko" | "goggins" | "marcus" | "seneca" | "epictetus" | "cato" | "other";
  category: "discipline" | "resilience" | "perspective" | "courage" | "self-mastery" | "leadership" | "virtue";
  dateAdded: string;
  day?: number; // For daily principles
}

export default function PrinciplesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  
  // Sample principles data
  const principles: Principle[] = [
    {
      id: "discipline-equals-freedom",
      title: "Discipline Equals Freedom",
      quote: "Discipline equals freedom.",
      explanation: "This principle emphasizes that by imposing discipline on yourself, you actually create freedom. By waking up early, maintaining fitness, and developing good habits, you free yourself from the constraints of poor health, lack of time, and reduced capabilities. The more disciplined your mind and body are, the more freedom you have to achieve your goals and live life on your own terms.",
      source: "Discipline Equals Freedom: Field Manual",
      author: "jocko",
      category: "discipline",
      dateAdded: "2023-01-15",
      day: 1
    },
    {
      id: "extreme-ownership",
      title: "Extreme Ownership",
      quote: "There are no bad teams, only bad leaders.",
      explanation: "Extreme Ownership means taking complete responsibility for everything in your world. If a project fails, a relationship deteriorates, or goals aren't met, the principle demands you look inward first. Instead of blaming circumstances or others, ask: 'What could I have done differently?' This mindset eliminates excuses and empowers you to control outcomes by focusing on what you can change — yourself and your actions.",
      source: "Extreme Ownership",
      author: "jocko",
      category: "leadership",
      dateAdded: "2023-01-22",
      day: 8
    },
    {
      id: "good-cookie-jar",
      title: "The Cookie Jar Method",
      quote: "The Cookie Jar became a concept that I've used numerous times in my life. When I need a boost, I open it up mentally and draw strength from it.",
      explanation: "The Cookie Jar is a mental reservoir of past accomplishments and obstacles overcome. During moments of doubt or pain, you can mentally reach into this jar to draw strength from previous victories. By remembering how you've overcome challenges in the past, you gain confidence in your ability to push through current difficulties. This mental tool converts past hardships into future strength.",
      source: "Can't Hurt Me",
      author: "goggins",
      category: "resilience",
      dateAdded: "2023-02-05",
      day: 22
    },
    {
      id: "40-percent-rule",
      title: "The 40% Rule",
      quote: "When your mind is telling you you're done, you're really only 40 percent done.",
      explanation: "The 40% Rule states that when you think you've reached your limit, you've actually only reached about 40% of your capacity. This principle challenges the idea of perceived limitations and suggests that the mind gives up long before the body actually needs to. By pushing beyond the initial signals of fatigue or discomfort, you can access untapped reserves of performance and endurance.",
      source: "Living with a SEAL",
      author: "goggins",
      category: "self-mastery",
      dateAdded: "2023-02-12",
      day: 29
    },
    {
      id: "dichotomy-of-control",
      title: "The Dichotomy of Control",
      quote: "Make the best use of what is in your power, and take the rest as it happens.",
      explanation: "The Dichotomy of Control teaches us to focus our energy only on what we can control - our thoughts, judgments, and actions - while accepting what we cannot control with equanimity. This principle eliminates wasted emotional energy on external events beyond our influence. By concentrating solely on our response to events rather than the events themselves, we gain mental clarity, reduce anxiety, and make better decisions.",
      source: "Enchiridion",
      author: "epictetus",
      category: "perspective",
      dateAdded: "2023-03-01",
      day: 46
    },
    {
      id: "memento-mori",
      title: "Memento Mori",
      quote: "You could leave life right now. Let that determine what you do and say and think.",
      explanation: "Memento Mori ('Remember that you will die') reminds us of our mortality to emphasize the urgency of living well today. This principle isn't morbid but clarifying - it strips away trivialities and focuses attention on what truly matters. By contemplating death regularly, you gain perspective on your priorities, reduce procrastination, and make more meaningful choices about how to spend your limited time.",
      source: "Meditations",
      author: "marcus",
      category: "perspective",
      dateAdded: "2023-03-15",
      day: 60
    }
  ];
  
  // Filter principles based on search query and filters
  const filteredPrinciples = principles.filter(principle => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      principle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      principle.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      principle.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      categoryFilter === "all" || 
      principle.category === categoryFilter;
    
    // Author filter
    const matchesAuthor = 
      authorFilter === "all" || 
      principle.author === authorFilter;
    
    return matchesSearch && matchesCategory && matchesAuthor;
  });
  
  // Get author display name
  function getAuthorName(authorId: Principle["author"]) {
    switch (authorId) {
      case "jocko":
        return "Jocko Willink";
      case "goggins":
        return "David Goggins";
      case "marcus":
        return "Marcus Aurelius";
      case "seneca":
        return "Seneca";
      case "epictetus":
        return "Epictetus";
      case "cato":
        return "Cato";
      default:
        return "Other";
    }
  }
  
  // Get category icon
  function getCategoryIcon(category: Principle["category"]) {
    switch (category) {
      case "discipline":
        return <Clock className="h-5 w-5 text-indigo-600" />;
      case "resilience":
        return <Shield className="h-5 w-5 text-blue-600" />;
      case "perspective":
        return <Compass className="h-5 w-5 text-green-600" />;
      case "courage":
        return <Sword className="h-5 w-5 text-red-600" />;
      case "self-mastery":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "leadership":
        return <TrendingUp className="h-5 w-5 text-amber-600" />;
      case "virtue":
        return <Heart className="h-5 w-5 text-pink-600" />;
      default:
        return <Star className="h-5 w-5 text-yellow-600" />;
    }
  }
  
  // Get category display name and color
  function getCategoryInfo(category: Principle["category"]) {
    switch (category) {
      case "discipline":
        return { name: "Discipline", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
      case "resilience":
        return { name: "Resilience", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "perspective":
        return { name: "Perspective", color: "bg-green-100 text-green-800 border-green-200" };
      case "courage":
        return { name: "Courage", color: "bg-red-100 text-red-800 border-red-200" };
      case "self-mastery":
        return { name: "Self-Mastery", color: "bg-purple-100 text-purple-800 border-purple-200" };
      case "leadership":
        return { name: "Leadership", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "virtue":
        return { name: "Virtue", color: "bg-pink-100 text-pink-800 border-pink-200" };
      default:
        return { name: "Other", color: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  }
  
  return (
    <PageContainer title="Core Stoic Principles">
      {/* Introduction */}
      <div className="mb-8 bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          High ROI Principles for Maximum Gains
        </h2>
        <p className="text-muted-foreground mb-4">
          These core principles from stoic philosophy and modern "hard men" like Jocko Willink and David Goggins 
          represent timeless wisdom that produces maximum results in life. Applying just a few of these principles 
          consistently will transform your mental toughness, discipline, and ability to handle adversity.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Discipline
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Resilience
          </Badge>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Perspective
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Courage
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Self-Mastery
          </Badge>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Leadership
          </Badge>
          <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-200">
            Virtue
          </Badge>
        </div>
      </div>
      
      {/* Daily Principle */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Daily Principle
        </h3>
        <Card className="border-2 border-primary/10">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-xl">{principles[0].title}</CardTitle>
                <CardDescription>Day 1 - {getAuthorName(principles[0].author)}</CardDescription>
              </div>
              {getCategoryIcon(principles[0].category)}
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic my-4">
              "{principles[0].quote}"
            </blockquote>
            <p className="mb-4">{principles[0].explanation}</p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {principles[0].source}
              </span>
              <Badge variant="outline" className={getCategoryInfo(principles[0].category).color}>
                {getCategoryInfo(principles[0].category).name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search principles..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={categoryFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setCategoryFilter("all")}
          >
            All Categories
          </Button>
          <Button 
            variant={authorFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setAuthorFilter("all")}
          >
            All Authors
          </Button>
        </div>
      </div>
      
      {/* Principles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {filteredPrinciples.map(principle => (
          <Card key={principle.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{principle.title}</CardTitle>
                  <CardDescription>{getAuthorName(principle.author)}</CardDescription>
                </div>
                {getCategoryIcon(principle.category)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                "{principle.quote}"
              </blockquote>
              <p className="text-sm mb-4">{principle.explanation}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {principle.source}
                </span>
                <Badge variant="outline" className={getCategoryInfo(principle.category).color}>
                  {getCategoryInfo(principle.category).name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Authors Section */}
      <div className="mb-12">
        <h3 className="text-lg font-bold mb-4">Featured Authors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">Jocko Willink</h4>
              <p className="text-slate-300 text-sm mb-4">
                Former Navy SEAL commander, author, and leadership consultant known for "Extreme Ownership" 
                and his no-excuses approach to discipline and responsibility.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">David Goggins</h4>
              <p className="text-slate-300 text-sm mb-4">
                Former Navy SEAL, ultramarathon runner, and author of "Can't Hurt Me" who transformed himself 
                from an overweight exterminator to one of the world's toughest men.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold mb-1">Marcus Aurelius</h4>
              <p className="text-slate-300 text-sm mb-4">
                Roman Emperor and philosopher whose personal journal "Meditations" contains timeless stoic wisdom 
                on self-discipline, resilience, and maintaining perspective.
              </p>
              <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700">
                View Principles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Books Section */}
      <h3 className="text-lg font-bold mb-4">Essential Reading</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Discipline Equals Freedom</h4>
            <p className="text-sm text-muted-foreground mb-2">Jocko Willink</p>
            <p className="text-xs mb-4">
              Field manual for developing mental toughness, overcoming weakness, and living a disciplined life.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Can't Hurt Me</h4>
            <p className="text-sm text-muted-foreground mb-2">David Goggins</p>
            <p className="text-xs mb-4">
              The story of mastering your mind and defying the odds through self-discipline and hard work.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">Meditations</h4>
            <p className="text-sm text-muted-foreground mb-2">Marcus Aurelius</p>
            <p className="text-xs mb-4">
              Personal writings of the Roman Emperor on Stoic philosophy and self-improvement.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-bold">The Obstacle Is the Way</h4>
            <p className="text-sm text-muted-foreground mb-2">Ryan Holiday</p>
            <p className="text-xs mb-4">
              Modern guide to Stoic philosophy focused on turning trials into triumph.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}