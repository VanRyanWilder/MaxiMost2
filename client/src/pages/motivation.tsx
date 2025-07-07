import { useState, useEffect } from "react";
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DailyMotivation } from "@/components/dashboard/daily-motivation";
import { Play, Pause, Calendar, Quote, BookOpen, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface MotivationalQuote {
  id: number;
  content: string;
  author: string;
  source?: string;
  category: string;
}

interface MotivationalSpeech {
  id: number;
  title: string;
  content: string;
  audioUrl?: string;
  duration: string;
  author: string;
  category: string;
  tags: string[];
}

export default function Motivation() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Mock data for motivational content
  const motivationalSpeeches: MotivationalSpeech[] = [
    {
      id: 1,
      title: "Embrace the Obstacle",
      content: "Your obstacles are not in your way, they ARE the way. The very thing that seems to block your path is actually the path itself. Resistance is the training ground for mental toughness. What stands in the way becomes the way. Remember that every obstacle is an opportunity to strengthen your resolve and practice Stoic principles. The impediment to action advances action.",
      duration: "5:12",
      author: "Marcus Aurelius",
      category: "stoicism",
      tags: ["obstacles", "mental toughness", "stoicism"]
    },
    {
      id: 2,
      title: "The 5 Second Rule",
      content: "When you feel hesitation before an important action, count 5-4-3-2-1 and move. That's it. This simple rule breaks the habit of hesitation and helps you move past the moment your mind is trying to persuade you to stay in your comfort zone. Remember, your brain is designed to protect you from risk and discomfort, but growth happens outside the comfort zone. The 5 Second Rule is a tool to override that natural resistance and take action before your mind talks you out of it.",
      duration: "4:45",
      author: "Mel Robbins",
      category: "action",
      tags: ["action", "hesitation", "courage", "decision-making"]
    },
    {
      id: 3,
      title: "The Power of Atomic Habits",
      content: "Forget about setting goals. Focus on your system instead. We don't rise to the level of our goals, we fall to the level of our systems. You do not rise to the level of your goals. You fall to the level of your systems. What you repeatedly do is who you become. Small habits compound into remarkable results, but only if you stick with them long enough to break through the Plateau of Latent Potential. Remember, success is the product of daily habits—not once-in-a-lifetime transformations.",
      duration: "6:20",
      author: "James Clear",
      category: "habits",
      tags: ["habits", "systems", "consistency", "growth"]
    },
    {
      id: 4,
      title: "Mastering Your Thoughts",
      content: "Your thoughts shape your reality. What you think, you become. As a man thinketh in his heart, so is he. Every action begins as a thought, and your character is the sum of all your thoughts. Watch your thoughts carefully, for they become your words. Watch your words, for they become your actions. Watch your actions, for they become your habits. Watch your habits, for they become your character. And your character becomes your destiny. Begin today to monitor and direct your thought patterns toward what you wish to create in your life.",
      duration: "4:30",
      author: "James Allen",
      category: "mindset",
      tags: ["thought control", "mindset", "self-development"]
    }
  ];

  const motivationalQuotes: MotivationalQuote[] = [
    {
      id: 1,
      content: "The first rule of compounding: Never interrupt it unnecessarily.",
      author: "Charlie Munger",
      category: "wealth"
    },
    {
      id: 2,
      content: "The impediment to action advances action. What stands in the way becomes the way.",
      author: "Marcus Aurelius",
      source: "Meditations",
      category: "stoicism"
    },
    {
      id: 3,
      content: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      author: "Aristotle",
      category: "habits"
    },
    {
      id: 4,
      content: "Man is not worried by real problems so much as by his imagined anxieties about real problems.",
      author: "Epictetus",
      category: "stoicism"
    },
    {
      id: 5,
      content: "You will never change your life until you change something you do daily. The secret of your success is found in your daily routine.",
      author: "John C. Maxwell",
      category: "habits"
    },
    {
      id: 6,
      content: "Energy, not time, is the fundamental currency of high performance.",
      author: "Jim Loehr",
      category: "performance"
    },
    {
      id: 7,
      content: "We don't rise to the level of our goals, we fall to the level of our systems.",
      author: "James Clear",
      source: "Atomic Habits",
      category: "habits"
    },
    {
      id: 8,
      content: "The quality of your life is a direct reflection of the quality of your questions.",
      author: "Tony Robbins",
      category: "mindset"
    }
  ];

  const filteredSpeeches = selectedCategory === "all" 
    ? motivationalSpeeches 
    : motivationalSpeeches.filter(speech => speech.category === selectedCategory || speech.tags.includes(selectedCategory));

  const filteredQuotes = selectedCategory === "all"
    ? motivationalQuotes
    : motivationalQuotes.filter(quote => quote.category === selectedCategory);

  const categories = [
    { id: "all", name: "All", count: motivationalSpeeches.length + motivationalQuotes.length },
    { id: "stoicism", name: "Stoicism", count: motivationalSpeeches.filter(s => s.category === "stoicism" || s.tags.includes("stoicism")).length + motivationalQuotes.filter(q => q.category === "stoicism").length },
    { id: "mindset", name: "Mindset", count: motivationalSpeeches.filter(s => s.category === "mindset" || s.tags.includes("mindset")).length + motivationalQuotes.filter(q => q.category === "mindset").length },
    { id: "habits", name: "Habits", count: motivationalSpeeches.filter(s => s.category === "habits" || s.tags.includes("habits")).length + motivationalQuotes.filter(q => q.category === "habits").length },
    { id: "action", name: "Action", count: motivationalSpeeches.filter(s => s.category === "action" || s.tags.includes("action")).length + motivationalQuotes.filter(q => q.category === "action").length }
  ];

  const togglePlay = (id: number) => {
    if (isPlaying === id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(id);
    }
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
    // Outer divs, Sidebar, MobileHeader removed
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Daily Motivation</h1>
                <p className="text-gray-600 mt-1">Your daily dose of wisdom and inspiration</p>
              </div>
              
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 shadow-sm">
                <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{formatDate(currentDate)}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={goToNextDay}
                  disabled={currentDate.toDateString() === new Date().toDateString()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left sidebar for categories */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 px-3 pb-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                            {category.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <DailyMotivation />
                </div>
              </div>
              
              {/* Main content area */}
              <div className="lg:col-span-3">
                <Tabs defaultValue="speeches" className="mb-6">
                  <TabsList className="mb-6">
                    <TabsTrigger value="speeches">Motivational Speeches</TabsTrigger>
                    <TabsTrigger value="quotes">Inspiring Quotes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="speeches" className="space-y-6">
                    {filteredSpeeches.length === 0 ? (
                      <div className="text-center py-12">
                        <Quote className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium">No content found</h3>
                        <p className="mt-2 text-gray-500">Try selecting a different category</p>
                      </div>
                    ) : (
                      filteredSpeeches.map(speech => (
                        <Card key={speech.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-xl">{speech.title}</CardTitle>
                                <CardDescription>{speech.author}</CardDescription>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => toggleFavorite(speech.id)}
                                className={favorites.includes(speech.id) ? "text-red-500" : "text-gray-400"}
                              >
                                <Heart className="h-5 w-5" fill={favorites.includes(speech.id) ? "currentColor" : "none"} />
                              </Button>
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <p className="text-gray-700 leading-relaxed mb-4">{speech.content}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {speech.tags.map(tag => (
                                <Badge key={tag} variant="outline" onClick={() => setSelectedCategory(tag)} className="cursor-pointer hover:bg-gray-100">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <BookOpen className="h-4 w-4" />
                              <span>Category: {speech.category}</span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => togglePlay(speech.id)}
                            >
                              {isPlaying === speech.id ? (
                                <>
                                  <Pause className="h-4 w-4" /> Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4" /> Listen ({speech.duration})
                                </>
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="quotes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredQuotes.length === 0 ? (
                        <div className="text-center py-12 col-span-2">
                          <Quote className="mx-auto h-12 w-12 text-gray-300" />
                          <h3 className="mt-4 text-lg font-medium">No quotes found</h3>
                          <p className="mt-2 text-gray-500">Try selecting a different category</p>
                        </div>
                      ) : (
                        filteredQuotes.map(quote => (
                          <Card key={quote.id} className="relative overflow-hidden">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleFavorite(quote.id)}
                              className={`absolute top-3 right-3 ${favorites.includes(quote.id) ? "text-red-500" : "text-gray-400"}`}
                            >
                              <Heart className="h-4 w-4" fill={favorites.includes(quote.id) ? "currentColor" : "none"} />
                            </Button>
                            
                            <CardContent className="pt-8 pb-6">
                              <blockquote className="border-l-4 border-primary pl-4 italic text-lg mb-4">
                                "{quote.content}"
                              </blockquote>
                              
                              <div className="text-right">
                                <p className="font-medium">— {quote.author}</p>
                                {quote.source && (
                                  <p className="text-sm text-gray-500">{quote.source}</p>
                                )}
                              </div>
                            </CardContent>
                            
                            <CardFooter className="bg-gray-50 border-t border-gray-100 py-2">
                              <Badge variant="outline">{quote.category}</Badge>
                            </CardFooter>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}