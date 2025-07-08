// import { useState } from "react"; // Removed
// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  CheckCircle, 
  Link, 
  Calendar, 
  Clock, 
  Award, 
  StickyNote, 
  ListTodo, 
  Layers, 
  Target, 
  Eye, 
  Smile, 
  ThumbsUp, 
  Sparkles,
  PlusCircle,
  BarChart2,
  Users
} from "lucide-react";

interface HabitBook {
  id: string;
  title: string;
  author: string;
  description: string;
  keyPrinciples: string[];
  color: string;
}

interface HabitMethod {
  id: string;
  name: string;
  description: string;
  steps: string[];
  category: "building" | "tracking" | "psychology";
  icon: React.ReactNode;
}

export default function HabitBuilding() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed

  // Top books on habit building
  const habitBooks: HabitBook[] = [
    {
      id: "atomic-habits",
      title: "Atomic Habits",
      author: "James Clear",
      description: "A bestseller that focuses on the idea that small, incremental changes (atomic habits) lead to remarkable results through compound growth.",
      keyPrinciples: [
        "Make it obvious (cue)",
        "Make it attractive (craving)",
        "Make it easy (response)",
        "Make it satisfying (reward)"
      ],
      color: "bg-blue-100 border-blue-300"
    },
    {
      id: "compound-effect",
      title: "The Compound Effect",
      author: "Darren Hardy",
      description: "Reveals how small, daily choices compound over time to create significant life changes, emphasizing consistency and tracking.",
      keyPrinciples: [
        "Small, smart choices + consistency + time = radical difference",
        "Track all actions and habits",
        "Activate the momentum multiplier by building routines",
        "Identify and change your core influences"
      ],
      color: "bg-indigo-100 border-indigo-300"
    },
    {
      id: "power-of-habit",
      title: "The Power of Habit",
      author: "Charles Duhigg",
      description: "Explores the science behind why habits exist and how they can be changed using the habit loop concept.",
      keyPrinciples: [
        "Identify the cue",
        "Experiment with rewards",
        "Isolate the craving",
        "Have a plan (implementation intention)"
      ],
      color: "bg-purple-100 border-purple-300"
    },
    {
      id: "tiny-habits",
      title: "Tiny Habits",
      author: "BJ Fogg",
      description: "A behavior scientist's method for starting with incredibly small actions that are easy to do.",
      keyPrinciples: [
        "Behavior = Motivation + Ability + Prompt (B=MAP)",
        "Make habits tiny to increase ability",
        "Use existing routines as anchors",
        "Celebrate small successes immediately"
      ],
      color: "bg-green-100 border-green-300"
    },
    {
      id: "better-than-before",
      title: "Better Than Before",
      author: "Gretchen Rubin",
      description: "Explores how we can change our habits by understanding ourselves better through the Four Tendencies framework.",
      keyPrinciples: [
        "Know yourself (Upholder, Questioner, Obliger, Rebel)",
        "Different strategies work for different people",
        "Convenience is a major driver of habits",
        "Monitoring creates accountability"
      ],
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      id: "7-habits",
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen Covey",
      description: "Offers timeless principles for personal and interpersonal effectiveness that form the foundation of good habits.",
      keyPrinciples: [
        "Be proactive",
        "Begin with the end in mind",
        "Put first things first",
        "Think win-win"
      ],
      color: "bg-red-100 border-red-300"
    }
  ];

  // Effective methods for habit building
  const habitMethods: HabitMethod[] = [
    {
      id: "two-minute-rule",
      name: "Two-Minute Rule / Micro-Habits",
      description: "Make the starting ritual so easy that you can't say no. Begin with incredibly small actions that take less than two minutes.",
      steps: [
        "Scale down your habit to something that takes 2 minutes or less",
        "Focus only on starting, not on finishing",
        "Gradually increase duration once the habit is established",
        "Example: Instead of 'read for an hour,' start with 'read one page'"
      ],
      category: "building",
      icon: <Clock className="h-5 w-5 text-blue-500" />
    },
    {
      id: "habit-stacking",
      name: "Habit Stacking",
      description: "Link a new habit to an existing one, using the existing habit as a trigger for the new one.",
      steps: [
        "Identify a current habit you do consistently",
        "Choose a new habit you want to establish",
        "Use the formula: After [current habit], I will [new habit]",
        "Example: 'After I brush my teeth, I will do 5 push-ups'"
      ],
      category: "building",
      icon: <Layers className="h-5 w-5 text-indigo-500" />
    },
    {
      id: "implementation-intentions",
      name: "Implementation Intentions",
      description: "Be specific about when and where you'll perform a habit using if-then planning.",
      steps: [
        "Set a specific time and location",
        "Use the formula: I will [behavior] at [time] in [location]",
        "Create if-then plans for potential obstacles",
        "Example: 'I will meditate at 7am in my bedroom'"
      ],
      category: "building",
      icon: <Calendar className="h-5 w-5 text-purple-500" />
    },
    {
      id: "dont-break-chain",
      name: "Don't Break the Chain",
      description: "Track consecutive days of completing a habit to build momentum and consistency.",
      steps: [
        "Mark each day you complete your habit on a calendar",
        "Try to maintain an unbroken streak",
        "Focus on not breaking the visual chain",
        "If you miss a day, get back on track immediately"
      ],
      category: "tracking",
      icon: <Link className="h-5 w-5 text-green-500" />
    },
    {
      id: "habit-tracking",
      name: "Habit Tracking Systems",
      description: "Record your habits consistently using manual or digital methods to increase awareness and accountability.",
      steps: [
        "Choose a tracking method (app, journal, calendar)",
        "Record each successful completion",
        "Review progress regularly",
        "Adjust your system as needed for sustainability"
      ],
      category: "tracking",
      icon: <ListTodo className="h-5 w-5 text-red-500" />
    },
    {
      id: "identity-based",
      name: "Identity-Based Habits",
      description: "Focus on becoming the type of person who performs the habit rather than just the outcome.",
      steps: [
        "Decide on the type of person you want to be",
        "Reframe your goal as an identity ('I am a runner' vs 'I want to run')",
        "Start with small behaviors that confirm this identity",
        "Look for evidence that supports your new identity"
      ],
      category: "psychology",
      icon: <Target className="h-5 w-5 text-amber-500" />
    },
    {
      id: "environment-design",
      name: "Environment Design",
      description: "Modify your environment to make good habits obvious and bad habits invisible.",
      steps: [
        "Make cues for good habits visible in your environment",
        "Remove triggers for bad habits from your space",
        "Prepare your environment in advance (e.g., lay out gym clothes)",
        "Use visual cues and reminders strategically"
      ],
      category: "psychology",
      icon: <Eye className="h-5 w-5 text-teal-500" />
    },
    {
      id: "reward-system",
      name: "Reward System",
      description: "Create immediate rewards for completing habits to make them more satisfying and reinforce behavior.",
      steps: [
        "Identify meaningful rewards that aren't counterproductive",
        "Make rewards immediate after completing the habit",
        "Start with external rewards if needed",
        "Gradually shift to intrinsic rewards (pride, satisfaction)"
      ],
      category: "psychology",
      icon: <Smile className="h-5 w-5 text-yellow-500" />
    },
    {
      id: "accountability",
      name: "Accountability Partners",
      description: "Share your goals and progress with others to increase your commitment and consistency.",
      steps: [
        "Find a reliable accountability partner or group",
        "Set up regular check-ins",
        "Be specific about your commitments",
        "Consider using stakes or consequences"
      ],
      category: "psychology",
      icon: <Users className="h-5 w-5 text-pink-500" />
    }
  ];

  // Filter methods by category
  const buildingMethods = habitMethods.filter(method => method.category === "building");
  const trackingMethods = habitMethods.filter(method => method.category === "tracking");
import ContentPageLayout from '@/components/layout/ContentPageLayout'; // Added import

// ... (interface definitions and data arrays remain the same, ensure they are within the component or scoped correctly) ...

// Renamed component
const HabitBuildingBasicsPage: React.FC = () => {

  // Top books on habit building (assuming data is defined within this component scope or imported)
  const habitBooks: HabitBook[] = [
    {
      id: "atomic-habits",
      title: "Atomic Habits",
      author: "James Clear",
      description: "A bestseller that focuses on the idea that small, incremental changes (atomic habits) lead to remarkable results through compound growth.",
      keyPrinciples: [
        "Make it obvious (cue)",
        "Make it attractive (craving)",
        "Make it easy (response)",
        "Make it satisfying (reward)"
      ],
      color: "bg-blue-100 border-blue-300"
    },
    {
      id: "compound-effect",
      title: "The Compound Effect",
      author: "Darren Hardy",
      description: "Reveals how small, daily choices compound over time to create significant life changes, emphasizing consistency and tracking.",
      keyPrinciples: [
        "Small, smart choices + consistency + time = radical difference",
        "Track all actions and habits",
        "Activate the momentum multiplier by building routines",
        "Identify and change your core influences"
      ],
      color: "bg-indigo-100 border-indigo-300"
    },
    {
      id: "power-of-habit",
      title: "The Power of Habit",
      author: "Charles Duhigg",
      description: "Explores the science behind why habits exist and how they can be changed using the habit loop concept.",
      keyPrinciples: [
        "Identify the cue",
        "Experiment with rewards",
        "Isolate the craving",
        "Have a plan (implementation intention)"
      ],
      color: "bg-purple-100 border-purple-300"
    },
    {
      id: "tiny-habits",
      title: "Tiny Habits",
      author: "BJ Fogg",
      description: "A behavior scientist's method for starting with incredibly small actions that are easy to do.",
      keyPrinciples: [
        "Behavior = Motivation + Ability + Prompt (B=MAP)",
        "Make habits tiny to increase ability",
        "Use existing routines as anchors",
        "Celebrate small successes immediately"
      ],
      color: "bg-green-100 border-green-300"
    },
    {
      id: "better-than-before",
      title: "Better Than Before",
      author: "Gretchen Rubin",
      description: "Explores how we can change our habits by understanding ourselves better through the Four Tendencies framework.",
      keyPrinciples: [
        "Know yourself (Upholder, Questioner, Obliger, Rebel)",
        "Different strategies work for different people",
        "Convenience is a major driver of habits",
        "Monitoring creates accountability"
      ],
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      id: "7-habits",
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen Covey",
      description: "Offers timeless principles for personal and interpersonal effectiveness that form the foundation of good habits.",
      keyPrinciples: [
        "Be proactive",
        "Begin with the end in mind",
        "Put first things first",
        "Think win-win"
      ],
      color: "bg-red-100 border-red-300"
    }
  ];

  // Effective methods for habit building (assuming data is defined within this component scope or imported)
  const habitMethods: HabitMethod[] = [
    {
      id: "two-minute-rule",
      name: "Two-Minute Rule / Micro-Habits",
      description: "Make the starting ritual so easy that you can't say no. Begin with incredibly small actions that take less than two minutes.",
      steps: [
        "Scale down your habit to something that takes 2 minutes or less",
        "Focus only on starting, not on finishing",
        "Gradually increase duration once the habit is established",
        "Example: Instead of 'read for an hour,' start with 'read one page'"
      ],
      category: "building",
      icon: <Clock className="h-5 w-5 text-blue-500" />
    },
    {
      id: "habit-stacking",
      name: "Habit Stacking",
      description: "Link a new habit to an existing one, using the existing habit as a trigger for the new one.",
      steps: [
        "Identify a current habit you do consistently",
        "Choose a new habit you want to establish",
        "Use the formula: After [current habit], I will [new habit]",
        "Example: 'After I brush my teeth, I will do 5 push-ups'"
      ],
      category: "building",
      icon: <Layers className="h-5 w-5 text-indigo-500" />
    },
    {
      id: "implementation-intentions",
      name: "Implementation Intentions",
      description: "Be specific about when and where you'll perform a habit using if-then planning.",
      steps: [
        "Set a specific time and location",
        "Use the formula: I will [behavior] at [time] in [location]",
        "Create if-then plans for potential obstacles",
        "Example: 'I will meditate at 7am in my bedroom'"
      ],
      category: "building",
      icon: <Calendar className="h-5 w-5 text-purple-500" />
    },
    {
      id: "dont-break-chain",
      name: "Don't Break the Chain",
      description: "Track consecutive days of completing a habit to build momentum and consistency.",
      steps: [
        "Mark each day you complete your habit on a calendar",
        "Try to maintain an unbroken streak",
        "Focus on not breaking the visual chain",
        "If you miss a day, get back on track immediately"
      ],
      category: "tracking",
      icon: <Link className="h-5 w-5 text-green-500" />
    },
    {
      id: "habit-tracking",
      name: "Habit Tracking Systems",
      description: "Record your habits consistently using manual or digital methods to increase awareness and accountability.",
      steps: [
        "Choose a tracking method (app, journal, calendar)",
        "Record each successful completion",
        "Review progress regularly",
        "Adjust your system as needed for sustainability"
      ],
      category: "tracking",
      icon: <ListTodo className="h-5 w-5 text-red-500" />
    },
    {
      id: "identity-based",
      name: "Identity-Based Habits",
      description: "Focus on becoming the type of person who performs the habit rather than just the outcome.",
      steps: [
        "Decide on the type of person you want to be",
        "Reframe your goal as an identity ('I am a runner' vs 'I want to run')",
        "Start with small behaviors that confirm this identity",
        "Look for evidence that supports your new identity"
      ],
      category: "psychology",
      icon: <Target className="h-5 w-5 text-amber-500" />
    },
    {
      id: "environment-design",
      name: "Environment Design",
      description: "Modify your environment to make good habits obvious and bad habits invisible.",
      steps: [
        "Make cues for good habits visible in your environment",
        "Remove triggers for bad habits from your space",
        "Prepare your environment in advance (e.g., lay out gym clothes)",
        "Use visual cues and reminders strategically"
      ],
      category: "psychology",
      icon: <Eye className="h-5 w-5 text-teal-500" />
    },
    {
      id: "reward-system",
      name: "Reward System",
      description: "Create immediate rewards for completing habits to make them more satisfying and reinforce behavior.",
      steps: [
        "Identify meaningful rewards that aren't counterproductive",
        "Make rewards immediate after completing the habit",
        "Start with external rewards if needed",
        "Gradually shift to intrinsic rewards (pride, satisfaction)"
      ],
      category: "psychology",
      icon: <Smile className="h-5 w-5 text-yellow-500" />
    },
    {
      id: "accountability",
      name: "Accountability Partners",
      description: "Share your goals and progress with others to increase your commitment and consistency.",
      steps: [
        "Find a reliable accountability partner or group",
        "Set up regular check-ins",
        "Be specific about your commitments",
        "Consider using stakes or consequences"
      ],
      category: "psychology",
      icon: <Users className="h-5 w-5 text-pink-500" />
    }
  ];

  const buildingMethods = habitMethods.filter(method => method.category === "building");
  const trackingMethods = habitMethods.filter(method => method.category === "tracking");
  const psychologyMethods = habitMethods.filter(method => method.category === "psychology");

  return (
    <ContentPageLayout title="Habit Building Basics">
      {/* Page Sub-header / Intro section */}
      <div className="mb-6">
        <p className="text-lg text-muted-foreground mt-1 dark:text-gray-400">Learn the proven methods for building lasting habits from world-class experts.</p>
        <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Evidence-Based</span>
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Actionable Advice</span>
                </Badge>
              </div>
            </div>
            
            {/* Introduction */}
            <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">The Science of Habit Formation</h2>
                    <p className="text-gray-700 mb-4">
                      Habits are the compound interest of self-improvement. Small changes in daily routines might seem 
                      insignificant at first, but they can deliver remarkable results over time through the power of consistency and compounding.
                    </p>
                    <p className="text-gray-700">
                      The latest research in neuroscience and behavioral psychology has identified proven frameworks 
                      that make building positive habits easier and more sustainable. By understanding the habit loop 
                      (cue, craving, response, reward) and applying strategic methods, you can transform your habits and achieve lasting change.
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Key Principles for Successful Habits
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <p><span className="font-medium">Consistency over intensity:</span> Small actions done consistently outperform occasional intense efforts</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <p><span className="font-medium">Systems over goals:</span> Focus on the daily system rather than just the end result</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <p><span className="font-medium">Identity over outcomes:</span> Change your identity first, and your actions will follow</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <p><span className="font-medium">Environment over willpower:</span> Design your environment to make good habits easier</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* The Compound Effect and 1% Improvements */}
            <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                  The Compound Effect: The Power of 1% Improvements
                </CardTitle>
                <CardDescription>
                  How tiny improvements lead to extraordinary results over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">The Mathematics of Tiny Gains</h3>
                    <p className="text-gray-700 mb-4">
                      If you improve by just 1% each day for one year, you'll end up 37 times better than when you started. 
                      Conversely, if you get 1% worse each day, you'll decline nearly to zero. This isn't just inspiring philosophy—it's mathematics.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg border border-blue-100 mb-4">
                      <h4 className="font-medium text-blue-800 mb-2">The Formula:</h4>
                      <p className="text-sm text-gray-600">
                        <span className="font-mono bg-blue-50 px-2 py-1 rounded">1.01<sup>365</sup> = 37.78</span> (Getting 1% better every day for a year)
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-mono bg-red-50 px-2 py-1 rounded">0.99<sup>365</sup> = 0.03</span> (Getting 1% worse every day for a year)
                      </p>
                    </div>
                    
                    <p className="text-gray-700">
                      This mathematical reality demonstrates why small habits make a big difference. Success is the product of daily habits—not once-in-a-lifetime transformations. 
                      What matters is whether your habits are putting you on the path toward success.
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3 text-blue-700">How to Apply the Compound Effect</h3>
                    <ul className="space-y-3">
                      <li className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                        <h4 className="font-medium">Focus on Systems, Not Goals</h4>
                        <p className="text-sm text-gray-600">
                          Don't focus on losing 30 pounds. Focus on showing up at the gym every day and eating well consistently.
                        </p>
                      </li>
                      <li className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                        <h4 className="font-medium">Embrace "Atomic" Habits</h4>
                        <p className="text-sm text-gray-600">
                          Break big habits into tiny ones that take less than two minutes to start. Make them so easy you can't say no.
                        </p>
                      </li>
                      <li className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                        <h4 className="font-medium">Value the Long Game</h4>
                        <p className="text-sm text-gray-600">
                          Habits often appear to make no difference until you cross a critical threshold and unlock a new level of performance.
                        </p>
                      </li>
                      <li className="bg-white p-3 rounded-lg border-l-4 border-l-blue-500 shadow-sm">
                        <h4 className="font-medium">Track and Measure</h4>
                        <p className="text-sm text-gray-600">
                          You can't improve what you don't measure. Track your habits to make the invisible progress visible.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Real-World Examples of The Compound Effect
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900">British Cycling Team</h4>
                      <p className="text-sm text-gray-600">
                        By making 1% improvements in everything from nutrition to bike seats to massage gel, the team went from mediocrity to winning 178 world championships in 5 years.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Warren Buffett</h4>
                      <p className="text-sm text-gray-600">
                        Started investing at age 11 but accumulated 99% of his wealth after age 50, showing the power of long-term compound growth.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Daily Writing</h4>
                      <p className="text-sm text-gray-600">
                        Writing just 500 words daily (two pages) would result in 182,500 words in a year—the equivalent of 2-3 books.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Books on Habit Building */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Top Books on Habit Building
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {habitBooks.map((book) => (
                <Card key={book.id} className={`${book.color} border-2`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{book.title}</CardTitle>
                    <CardDescription className="text-gray-700 font-medium">by {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{book.description}</p>
                    <h4 className="font-semibold text-sm mb-2">Key Principles:</h4>
                    <ul className="space-y-1">
                      {book.keyPrinciples.map((principle, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Effective Methods for Habit Building */}
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <StickyNote className="h-6 w-6 text-primary" />
              Effective Methods for Habit Building
            </h2>
            
            <Tabs defaultValue="building" className="mb-10">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="building">Building Techniques</TabsTrigger>
                <TabsTrigger value="tracking">Tracking Methods</TabsTrigger>
                <TabsTrigger value="psychology">Psychological Tools</TabsTrigger>
              </TabsList>
              
              <TabsContent value="building" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {buildingMethods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {method.icon}
                          {method.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-3">{method.description}</p>
                        <h4 className="font-semibold text-sm mb-2">How to Apply:</h4>
                        <ol className="space-y-1 list-decimal pl-5 text-sm">
                          {method.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80"
                          onClick={() => window.location.href = "/dashboard"}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Apply this method
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tracking" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trackingMethods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {method.icon}
                          {method.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-3">{method.description}</p>
                        <h4 className="font-semibold text-sm mb-2">How to Apply:</h4>
                        <ol className="space-y-1 list-decimal pl-5 text-sm">
                          {method.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80"
                          onClick={() => window.location.href = "/dashboard"}
                        >
                          <BarChart2 className="h-4 w-4 mr-1" />
                          Track your habits
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="psychology" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {psychologyMethods.map((method) => (
                    <Card key={method.id} className="border-l-4 border-l-amber-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {method.icon}
                          {method.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-3">{method.description}</p>
                        <h4 className="font-semibold text-sm mb-2">How to Apply:</h4>
                        <ol className="space-y-1 list-decimal pl-5 text-sm">
                          {method.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80"
                          onClick={() => window.location.href = "/dashboard"}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Use this approach
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Common Habit Building Mistakes */}
            <h2 className="text-2xl font-bold mb-4">Common Habit Building Mistakes</h2>
            <Card className="mb-10">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">What Doesn't Work</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-red-500">✖</div>
                        <div>
                          <p className="font-medium">Relying on motivation alone</p>
                          <p className="text-sm text-gray-600">Motivation fluctuates daily; systems need to work even on low-motivation days</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-red-500">✖</div>
                        <div>
                          <p className="font-medium">Starting too big</p>
                          <p className="text-sm text-gray-600">Ambitious habits often fail because they require too much energy and willpower</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-red-500">✖</div>
                        <div>
                          <p className="font-medium">Focusing only on goals, not systems</p>
                          <p className="text-sm text-gray-600">Goals set direction, but systems determine progress</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-red-500">✖</div>
                        <div>
                          <p className="font-medium">Changing too many habits at once</p>
                          <p className="text-sm text-gray-600">Spreading willpower too thin leads to failure on all fronts</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-600">Better Approaches</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-green-500">✓</div>
                        <div>
                          <p className="font-medium">Design systems and environments</p>
                          <p className="text-sm text-gray-600">Create a setup where good habits are the path of least resistance</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-green-500">✓</div>
                        <div>
                          <p className="font-medium">Start with tiny habits</p>
                          <p className="text-sm text-gray-600">Begin with 1-2 minute versions that are easy to accomplish</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-green-500">✓</div>
                        <div>
                          <p className="font-medium">Focus on processes</p>
                          <p className="text-sm text-gray-600">Commit to the process and let the outcomes follow naturally</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0 text-green-500">✓</div>
                        <div>
                          <p className="font-medium">Master one habit at a time</p>
                          <p className="text-sm text-gray-600">Focus on establishing a single keystone habit before adding more</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center py-4">
                  <h2 className="text-2xl font-bold mb-3">Ready to Build Better Habits?</h2>
                  <p className="text-gray-700 mb-6 max-w-2xl">
                    Apply these evidence-based methods to your own habit journey using our habit tracking dashboard. 
                    Start small, be consistent, and watch as tiny daily improvements compound into remarkable results.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button className="gap-2" size="lg" onClick={() => window.location.href = "/dashboard"}>
                      <CheckCircle className="h-5 w-5" />
                      Go to Habit Dashboard
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => window.location.href = "/community"}>
                      <Users className="h-5 w-5 mr-1" />
                      Join Accountability Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  );
}