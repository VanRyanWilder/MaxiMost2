import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PillarCard } from "@/components/pillars/pillar-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModernLayout } from "@/components/layout/modern-layout";
import { 
  Pill, 
  BookOpen, 
  FlaskConical, 
  Scroll, 
  CandyCane, 
  ThumbsUp, 
  Search, 
  Dumbbell, 
  Brain,
  Sparkles,
  Heart,
  BookMarked,
  GraduationCap
} from "lucide-react";

// Sample data for content sections - in a real app, this would come from a database
const physicalTherapyExperts = `
Kelly Starrett: A physical therapist and founder of The Ready State (formerly MobilityWOD). Known for his work on movement mechanics and mobility.

Gray Cook: Creator of the Functional Movement Screen (FMS), a system used to assess movement quality and identify imbalances.

Jill Miller: Creator of Yoga Tune Up® and The Roll Model® Method, focusing on self-myofascial release and corrective exercise.

Sue Falsone: First female head athletic trainer in major American professional sports (MLB) and expert in movement assessment.

Dr. Stuart McGill: World-renowned spine biomechanist and professor emeritus, known for his research on spine mechanics and back pain.
`;

const topSupplements = `
1. Omega-3 Fatty Acids (EPA and DHA)
Benefits: Reduces inflammation, supports heart and brain health, improves joint function
Dosage: 1-3g daily
Quality matters: Look for third-party tested brands with high EPA/DHA content

2. Vitamin D3
Benefits: Immune function, bone health, mood regulation, hormone production
Dosage: 1,000-5,000 IU daily based on blood levels
Best taken with: Vitamin K2 and magnesium for optimal calcium metabolism

3. Magnesium
Benefits: Muscle relaxation, sleep quality, energy production, stress management
Forms: Glycinate (best absorbed), citrate, malate, threonate (for brain)
Dosage: 200-400mg daily

4. Creatine Monohydrate
Benefits: Increased strength, power, muscle recovery, and cognitive function
Dosage: 3-5g daily (no loading phase necessary)
Note: Extremely well-researched with excellent safety profile

5. Vitamin B Complex
Benefits: Energy production, nervous system support, stress management
Key forms: Methylated versions for those with MTHFR gene variants
Timing: Morning with food
`;

const topBooks = `
Atomic Habits by James Clear
This is a bestseller for a reason. Clear breaks down habit formation into practical, actionable steps using the habit loop framework. His 1% better approach aligns perfectly with MaxiMost's philosophy.

Tiny Habits by BJ Fogg
Dr. Fogg's behavior model (B=MAP) explains how Motivation, Ability, and Prompts create habits. His tiny habits approach makes change almost effortless.

The Power of Habit by Charles Duhigg
Duhigg explores the science of habit formation through engaging stories. His cue-routine-reward framework helps understand how habits work.

Mindset by Carol Dweck
Not strictly about habits, but crucial for understanding how our beliefs affect our ability to grow and change habits. The growth mindset concept is essential.

The Willpower Instinct by Kelly McGonigal
Explains why willpower alone isn't enough and how to work with your brain rather than against it when forming habits.
`;

const pillars = [
  {
    id: "supplements",
    title: "Supplements",
    description: "Research-backed supplements with the highest ROI for your health and performance",
    icon: <Pill className="h-5 w-5 text-indigo-600" />,
    color: "border-indigo-500",
    tags: ["Vitamins", "Minerals", "Nootropics", "Adaptogens", "Protein"],
    count: 42,
    path: "/supplements",
    content: topSupplements
  },
  {
    id: "research",
    title: "Scientific Research",
    description: "The latest peer-reviewed research on health, fitness, and wellness",
    icon: <FlaskConical className="h-5 w-5 text-blue-600" />,
    color: "border-blue-500",
    tags: ["Longevity", "Metabolism", "Sleep", "Exercise", "Nutrition"],
    count: 36,
    path: "/research",
    content: ""
  },
  {
    id: "principles",
    title: "Core Stoic Principles",
    description: "Ancient wisdom for modern life, focusing on clarity, resilience, and virtue",
    icon: <Scroll className="h-5 w-5 text-amber-600" />,
    color: "border-amber-500",
    tags: ["Discipline", "Virtue", "Resilience", "Focus", "Mindfulness"],
    count: 24,
    path: "/principles",
    content: ""
  },
  {
    id: "sugar",
    title: "Sugar Dangers",
    description: "Educational resources on the hidden impacts of sugar on health and cognition",
    icon: <CandyCane className="h-5 w-5 text-rose-600" />,
    color: "border-rose-500",
    tags: ["Inflammation", "Metabolism", "Brain Health", "Addiction", "Alternatives"],
    count: 18,
    path: "/sugar",
    content: ""
  }
];

// Additional related resources
const expertResources = [
  {
    id: "experts",
    title: "Expert Profiles",
    description: "Learn from the leading experts in health, fitness, and personal development",
    icon: <ThumbsUp className="h-5 w-5 text-emerald-600" />,
    color: "border-emerald-500",
    tags: ["Doctors", "Coaches", "Authors", "Researchers", "Athletes"],
    count: 28,
    path: "/experts",
    content: physicalTherapyExperts
  },
  {
    id: "habit-building",
    title: "Habit Building",
    description: "Science-backed strategies for creating lasting habits and breaking bad ones",
    icon: <Brain className="h-5 w-5 text-purple-600" />,
    color: "border-purple-500",
    tags: ["Behavior Change", "Motivation", "Systems", "Tracking", "Psychology"],
    count: 32,
    path: "/habit-building",
    content: topBooks
  },
  {
    id: "workouts",
    title: "Effective Workouts",
    description: "Minimalist, high-ROI workout protocols based on scientific principles",
    icon: <Dumbbell className="h-5 w-5 text-cyan-600" />,
    color: "border-cyan-500",
    tags: ["Strength", "Mobility", "Recovery", "Cardio", "Bodyweight"],
    count: 26,
    path: "/workouts",
    content: ""
  }
];

export default function FourPillarsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const allCategories = [...pillars, ...expertResources];
  const displayedItems = activeTab === "all" 
    ? allCategories 
    : activeTab === "pillars" 
      ? pillars 
      : expertResources;
  
  return (
    <ModernLayout pageTitle="Four Pillars">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col">
          {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Four Pillars of Maximum Performance</h1>
              <p className="text-muted-foreground mt-1 text-lg">
                The core foundations for optimal health, performance, and well-being
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search resources..."
                  className="pl-9 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-full text-white">
                  <Sparkles className="h-10 w-10" />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">The Maximum ROI Approach</h2>
                  <p className="text-muted-foreground mb-4">
                    Our curated collection focuses on the highest return-on-investment strategies for your health, performance, and well-being. 
                    These resources have been carefully selected based on scientific evidence, expert consensus, and real-world results.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-indigo-100 dark:bg-indigo-900 p-1.5 rounded-full mt-0.5">
                        <Pill className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Evidence-Based</p>
                        <p className="text-xs text-muted-foreground">Backed by rigorous research</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full mt-0.5">
                        <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">High Impact</p>
                        <p className="text-xs text-muted-foreground">Maximum benefit for your effort</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-100 dark:bg-amber-900 p-1.5 rounded-full mt-0.5">
                        <BookMarked className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Actionable</p>
                        <p className="text-xs text-muted-foreground">Practical strategies you can implement today</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 dark:bg-emerald-900 p-1.5 rounded-full mt-0.5">
                        <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Continuously Updated</p>
                        <p className="text-xs text-muted-foreground">Reflecting the latest research</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="pillars">Core Pillars</TabsTrigger>
              <TabsTrigger value="related">Related Topics</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((pillar) => (
                <PillarCard
                  key={pillar.id}
                  id={pillar.id}
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  color={pillar.color}
                  tags={pillar.tags}
                  count={pillar.count}
                  path={pillar.path}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pillars" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((pillar) => (
                <PillarCard
                  key={pillar.id}
                  id={pillar.id}
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  color={pillar.color}
                  tags={pillar.tags}
                  count={pillar.count}
                  path={pillar.path}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((pillar) => (
                <PillarCard
                  key={pillar.id}
                  id={pillar.id}
                  title={pillar.title}
                  description={pillar.description}
                  icon={pillar.icon}
                  color={pillar.color}
                  tags={pillar.tags}
                  count={pillar.count}
                  path={pillar.path}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Featured Content */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Featured Content</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Supplements with Expert Insights</CardTitle>
                <CardDescription>Scientifically-backed supplements with the highest return on investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto prose prose-sm dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: topSupplements.replace(/\n/g, '<br/>') }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Physical Therapy and Mobility Experts</CardTitle>
                <CardDescription>Leading experts in mobility, movement and physical therapy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto prose prose-sm dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: physicalTherapyExperts.replace(/\n/g, '<br/>') }} />
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