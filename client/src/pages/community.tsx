import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ChevronUp, ChevronDown, Filter, PlusCircle, Search, MessageCircle } from "lucide-react";
import { useUser } from "@/context/user-context";

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  isPinned: boolean;
}

export default function Community() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("question");
  const { user } = useUser();

  // Mock data (this would come from your backend normally)
  const categories = [
    { id: "all", name: "All Topics", count: 142 },
    { id: "question", name: "Questions", count: 57 },
    { id: "motivation", name: "Motivation", count: 35 },
    { id: "nutrition", name: "Nutrition", count: 23 },
    { id: "workout", name: "Workouts", count: 19 },
    { id: "mindfulness", name: "Mindfulness", count: 8 }
  ];

  const mockPosts: Post[] = [
    {
      id: 1,
      title: "Tips for staying consistent with morning meditation?",
      content: "I've been trying to establish a morning meditation routine but find myself skipping days. Any suggestions for staying consistent?",
      author: {
        id: 1,
        name: "Marcus A.",
        avatar: undefined
      },
      category: "mindfulness",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      upvotes: 23,
      downvotes: 2,
      commentCount: 8,
      isPinned: true
    },
    {
      id: 2,
      title: "Best supplements for recovery after intense workouts?",
      content: "I've been following the BeastMode strength program and experiencing some muscle soreness. What supplements do you recommend for better recovery?",
      author: {
        id: 2,
        name: "Seneca",
        avatar: undefined
      },
      category: "nutrition",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      upvotes: 18,
      downvotes: 1,
      commentCount: 12,
      isPinned: false
    },
    {
      id: 3,
      title: "How do you apply 'Dichotomy of Control' to fitness goals?",
      content: "I'm trying to apply Stoic principles to my fitness journey. How do you distinguish between what you can and cannot control when it comes to fitness objectives?",
      author: {
        id: 3,
        name: "Epictetus",
        avatar: undefined
      },
      category: "question",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      upvotes: 42,
      downvotes: 3,
      commentCount: 15,
      isPinned: false
    }
  ];

  const filteredPosts = mockPosts
    .filter(post => activeCategory === "all" || post.category === activeCategory)
    .filter(post => 
      searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned posts always go first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by selected criteria
      if (sortBy === "recent") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        // sort by popularity (upvotes - downvotes)
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      }
    });

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const getCategoryColor = (category: string) => {
    const categoryMap: Record<string, string> = {
      "question": "bg-blue-100 text-blue-800",
      "motivation": "bg-amber-100 text-amber-800",
      "nutrition": "bg-green-100 text-green-800",
      "workout": "bg-red-100 text-red-800",
      "mindfulness": "bg-purple-100 text-purple-800"
    };
    
    return categoryMap[category] || "bg-gray-100 text-gray-800";
  };

  const handleCreatePost = () => {
    // This would send the new post to your backend
    console.log({
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      userId: user?.id
    });
    
    // Reset form and close dialog
    setNewPostTitle("");
    setNewPostContent("");
    setNewPostCategory("question");
    setNewPostOpen(false);
  };

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Community Forum</h1>
                <p className="text-gray-600 mt-1">Connect, share, and learn with the BeastMode community</p>
              </div>
              
              <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogDescription>
                      Share your question, insight, or experience with the community. 
                      Be clear and detailed to get the best responses.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="title" className="text-right font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="col-span-3"
                        placeholder="What's your post about?"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="category" className="text-right font-medium">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value)}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="question">Question</option>
                        <option value="motivation">Motivation</option>
                        <option value="nutrition">Nutrition</option>
                        <option value="workout">Workout</option>
                        <option value="mindfulness">Mindfulness</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <label htmlFor="content" className="text-right font-medium">
                        Content
                      </label>
                      <Textarea
                        id="content"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="col-span-3 min-h-[150px]"
                        placeholder="Share your thoughts, tips, or questions..."
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewPostOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} disabled={!newPostTitle || !newPostContent}>
                      Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left sidebar */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 px-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm  transition-colors ${
                            activeCategory === category.id 
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
                
                <Card className="mt-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Community Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Be respectful and supportive</li>
                      <li>No self-promotion or spam</li>
                      <li>Give helpful, actionable advice</li>
                      <li>Back claims with evidence when possible</li>
                      <li>Keep topics related to health, fitness, and self-improvement</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main content */}
              <div className="md:col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="relative w-full sm:max-w-[300px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search discussions..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="rounded-md border-gray-200 text-sm"
                        >
                          <option value="popular">Popular</option>
                          <option value="recent">Recent</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    {filteredPosts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium mb-1">No discussions found</h3>
                        <p className="text-gray-500 text-center max-w-md mb-4">
                          {searchQuery 
                            ? `No results found for "${searchQuery}". Try a different search.`
                            : "There are no discussions in this category yet. Be the first to start one!"}
                        </p>
                        <Button onClick={() => setNewPostOpen(true)}>
                          Start a Discussion
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredPosts.map(post => (
                          <div key={post.id} className={`p-4 hover:bg-gray-50 ${post.isPinned ? "bg-yellow-50/50" : ""}`}>
                            {post.isPinned && (
                              <div className="flex items-center gap-1 text-amber-600 text-xs font-medium mb-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
                                  <path d="M15 3v6h6"/>
                                </svg>
                                <span>Pinned Post</span>
                              </div>
                            )}
                            
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center space-y-1 pt-1">
                                <button className="text-gray-500 hover:text-blue-500 transition-colors">
                                  <ChevronUp className="h-5 w-5" />
                                </button>
                                <span className="text-sm font-medium">{post.upvotes - post.downvotes}</span>
                                <button className="text-gray-500 hover:text-red-500 transition-colors">
                                  <ChevronDown className="h-5 w-5" />
                                </button>
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="text-lg font-medium leading-tight hover:text-primary transition-colors">
                                  <a href="#">{post.title}</a>
                                </h3>
                                
                                <p className="mt-1 text-gray-600 line-clamp-2">
                                  {post.content}
                                </p>
                                
                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                  <Badge className={getCategoryColor(post.category)}>
                                    {categories.find(c => c.id === post.category)?.name || post.category}
                                  </Badge>
                                  
                                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.commentCount} comments</span>
                                  </div>
                                  
                                  <div className="flex items-center text-gray-500 text-sm">
                                    <span>{formatTimeAgo(post.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <Avatar className="h-10 w-10">
                                  {post.author.avatar && <AvatarImage src={post.author.avatar} alt={post.author.name} />}
                                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}