import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, BookOpen, Clock, Calendar, Zap, Brain, Target, Users, BarChart } from "lucide-react";

export default function Principles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const principles = [
    {
      id: "journaling",
      title: "Brain Dumping & Journaling",
      author: "Various Practitioners",
      description: "Clear your mind through structured morning and evening journaling practices to gain clarity and track growth.",
      icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
      key_principles: [
        "Morning brain dump to clear mental clutter and set intentions",
        "Evening reflection to process the day's events and lessons",
        "Gratitude journaling to develop a positive mindset",
        "Stream of consciousness writing to access deeper thoughts",
        "Tracking patterns over time to identify growth and opportunities"
      ],
      application: "Begin each day with 15 minutes of unfiltered writing to empty your mind, and end with structured reflection on wins, lessons, and gratitude.",
      color: "emerald"
    },
    {
      id: "12-week-year",
      title: "The 12 Week Year",
      author: "Brian P. Moran",
      description: "Accomplish more in 12 weeks than others do in 12 months by focusing on shorter execution cycles.",
      icon: <Calendar className="h-6 w-6 text-amber-500" />,
      key_principles: [
        "Think of a year as 12 weeks instead of 12 months",
        "Create a compelling vision of your future",
        "Plan weekly, focusing only on activities that drive results",
        "Measure your execution to maintain accountability",
        "Work with a strong sense of urgency"
      ],
      application: "Break goals into 12-week sprints with clear weekly milestones. Measure your execution with weekly scorecards.",
      color: "amber"
    },
    {
      id: "5-second-rule",
      title: "The 5 Second Rule",
      author: "Mel Robbins",
      description: "Use a simple 5-4-3-2-1 countdown to break procrastination and take immediate action.",
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      key_principles: [
        "Count 5-4-3-2-1, then take physical action",
        "Activate your prefrontal cortex to override hesitation",
        "Use the rule to interrupt destructive thought patterns",
        "Convert intention into action immediately",
        "Build momentum through consistent application"
      ],
      application: "Use the 5 Second Rule to start your most challenging tasks, especially morning workouts and difficult calls.",
      color: "purple"
    },
    {
      id: "atomic-habits",
      title: "Atomic Habits",
      author: "James Clear",
      description: "Transform your life with tiny changes in behavior, starting with 1% improvements.",
      icon: <Target className="h-6 w-6 text-blue-500" />,
      key_principles: [
        "Focus on identity-based habits (be the type of person who...)",
        "Make habits obvious, attractive, easy, and satisfying",
        "Use habit stacking to build routines",
        "Create an environment that promotes good habits",
        "Track habits visually to maintain accountability"
      ],
      application: "Design your environment for success by removing friction from good habits and adding friction to bad ones.",
      color: "blue"
    },
    {
      id: "eat-that-frog",
      title: "Eat That Frog",
      author: "Brian Tracy",
      description: "Tackle your most challenging task first thing each day for maximum productivity.",
      icon: <Zap className="h-6 w-6 text-green-500" />,
      key_principles: [
        "Identify your most important task (your 'frog')",
        "Tackle it first thing in the morning",
        "Prepare everything the night before",
        "Apply the 80/20 rule to focus on high-impact tasks",
        "Practice single-handling to complete tasks without interruption"
      ],
      application: "Identify your 'frog' the night before and complete it before checking email or social media.",
      color: "green"
    },
    {
      id: "how-to-win-friends",
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
      description: "Build stronger relationships by focusing on others' interests and making them feel valued.",
      icon: <Users className="h-6 w-6 text-cyan-500" />,
      key_principles: [
        "Don't criticize, condemn, or complain",
        "Give honest and sincere appreciation",
        "Become genuinely interested in other people",
        "Remember and use people's names",
        "Be a good listener and encourage others to talk about themselves"
      ],
      application: "Practice active listening during conversations and look for opportunities to give sincere compliments.",
      color: "cyan"
    },
    {
      id: "stoicism",
      title: "Stoic Philosophy",
      author: "Marcus Aurelius, Seneca, Epictetus, Ryan Holiday",
      description: "Develop resilience and inner peace by focusing on what you can control and accepting what you cannot.",
      icon: <Brain className="h-6 w-6 text-indigo-500" />,
      key_principles: [
        "Focus on what is within your control (Marcus Aurelius' dichotomy of control)",
        "Practice negative visualization to appreciate what you have",
        "Turn obstacles into opportunities ('The impediment to action advances action')",
        "Practice voluntary discomfort to build resilience",
        "Daily self-examination and reflection as taught in 'Meditations'"
      ],
      application: "Begin and end each day with a Stoic journal practice modeled after Marcus Aurelius' 'Meditations,' reflecting on your actions, thoughts, and potential for improvement.",
      color: "indigo"
    },
    {
      id: "as-a-man-thinketh",
      title: "As a Man Thinketh",
      author: "James Allen",
      description: "Your thoughts determine your character, circumstances, and destiny—the mind is the master weaver of your life experience.",
      icon: <Brain className="h-6 w-6 text-sky-500" />,
      key_principles: [
        "Thought is the source of all action, life, and manifestation",
        "Mind is the master weaver of character and circumstance",
        "Thoughts of doubt and fear produce failure",
        "Thoughts of confidence and courage lead to success",
        "Aim to achieve purity of thought for inner peace"
      ],
      application: "Practice conscious thought observation throughout the day, redirecting negative thought patterns toward constructive alternatives.",
      color: "sky"
    },
    {
      id: "discipline-equals-freedom",
      title: "Discipline Equals Freedom",
      author: "Jocko Willink",
      description: "Master your mind, conquer weakness, and develop unwavering discipline to attain true freedom in all aspects of life.",
      icon: <Target className="h-6 w-6 text-slate-500" />,
      key_principles: [
        "Wake up early - own the morning to own your day",
        "Physical training builds mental toughness",
        "Focus on things you can control, detach from what you cannot",
        "Prioritize and execute - handle problems one at a time",
        "Develop balanced discipline across all life domains"
      ],
      application: "Begin with consistent 4:30am wake-ups, immediate physical training, and strategic prioritization of the day's tasks.",
      color: "slate"
    },
    {
      id: "field-manual",
      title: "The Field Manual",
      author: "Jocko Willink",
      description: "A tactical guide to overcoming procrastination, pursuing excellence, and winning the war against weakness.",
      icon: <Zap className="h-6 w-6 text-zinc-500" />,
      key_principles: [
        "No Bad Days - maintain unwavering standards regardless of circumstances",
        "Extreme Ownership - take complete responsibility for your actions and results",
        "Discipline = Freedom - structure creates true autonomy",
        "Balanced approach to fitness and nutrition",
        "Psychological warfare against your own weakness"
      ],
      application: "Apply 'default aggressive' mindset by moving toward challenges rather than avoiding them, starting with your most difficult tasks each day.",
      color: "zinc"
    },
    {
      id: "cant-hurt-me",
      title: "Can't Hurt Me",
      author: "David Goggins",
      description: "Master your mind and defy the odds through a journey of self-discovery, extreme discipline, and mental toughness.",
      icon: <Brain className="h-6 w-6 text-rose-500" />,
      key_principles: [
        "The 40% Rule - when your mind says you're done, you're only 40% done",
        "The accountability mirror - face your failures and weaknesses honestly",
        "Take souls - outwork everyone around you",
        "Remove the governor from your mind through callusing",
        "Embrace suffering as the path to growth"
      ],
      application: "Apply the Cookie Jar method: collect and mentally catalog your achievements to draw strength during difficult challenges.",
      color: "rose"
    },
    {
      id: "never-finished",
      title: "Never Finished",
      author: "David Goggins",
      description: "Continue the journey beyond physical limits into mental mastery, sustained excellence, and perpetual improvement.",
      icon: <BarChart className="h-6 w-6 text-orange-500" />,
      key_principles: [
        "Uncommon among uncommon - constantly raise your standards",
        "Visualization of success and obstacles in advance",
        "Develop 'armor' through deliberate hardship",
        "The true value of rest and recovery in sustained performance",
        "Finding purpose beyond personal achievement"
      ],
      application: "Schedule regular 'forced discomfort' sessions weekly to strengthen mental resilience and prevent complacency.",
      color: "orange"
    }
  ];

  return (
    <div className="bg-gray-50 font-sans">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">BeastMode Principles</h1>
                <p className="text-gray-600 mt-1">Core wisdom from top self-development books</p>
              </div>
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">11 Core Methodologies</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-2">Applied Wisdom</h2>
                <p className="text-white text-opacity-90 max-w-3xl">
                  "We don't rise to the level of our goals, we fall to the level of our systems." — James Clear, <span className="italic">Atomic Habits</span>
                </p>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Daily Application
                  </div>
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Practical Examples
                  </div>
                  <div className="bg-white bg-opacity-10 px-3 py-1.5 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Actionable Steps
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="principles" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="principles">Core Principles</TabsTrigger>
                <TabsTrigger value="integration">Daily Application</TabsTrigger>
              </TabsList>
              
              <TabsContent value="principles">
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  {principles.map((principle) => (
                    <Card key={principle.id} className="overflow-hidden">
                      <div className={`h-2 bg-${principle.color}-500 w-full`}></div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          {principle.icon}
                          <div>
                            <CardTitle>{principle.title}</CardTitle>
                            <CardDescription>{principle.author}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{principle.description}</p>
                        
                        <h4 className="font-medium text-gray-900 mb-2">Key Principles:</h4>
                        <ul className="space-y-2 mb-4">
                          {principle.key_principles.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className={`h-4 w-4 text-${principle.color}-500 mt-1 flex-shrink-0`} />
                              <span className="text-sm text-gray-600">{item}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <h4 className="font-medium text-gray-900 mb-2">BeastMode Application:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{principle.application}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="integration">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Integration Framework</CardTitle>
                    <CardDescription>Combining multiple methodologies into a cohesive system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Morning Routine</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Calendar className="h-4 w-4 text-amber-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">12-Week Planning</h4>
                              <p className="text-sm text-gray-600">Review your 12-week goals and identify the week's critical tasks</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <Zap className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Eat Your Frog</h4>
                              <p className="text-sm text-gray-600">Identify your most challenging task and complete it first thing</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <Clock className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">5-Second Rule</h4>
                              <p className="text-sm text-gray-600">Use 5-4-3-2-1 countdown to start your morning workout without hesitation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Daily Productivity</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-slate-100 p-2 rounded-full">
                              <Target className="h-4 w-4 text-slate-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Discipline Equals Freedom</h4>
                              <p className="text-sm text-gray-600">Wake early, train consistently, and maintain unwavering standards across all domains</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Target className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Atomic Habits</h4>
                              <p className="text-sm text-gray-600">Stack new habits onto existing routines and track them visually</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Mental & Social Development</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <Brain className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Stoic Practices</h4>
                              <p className="text-sm text-gray-600">Morning and evening reflection on what's within your control and practicing negative visualization</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="bg-cyan-100 p-2 rounded-full">
                              <Users className="h-4 w-4 text-cyan-500" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Connection Principles</h4>
                              <p className="text-sm text-gray-600">Practice active listening, use people's names, and find opportunities for genuine appreciation</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-3">Weekly Review Process</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          End each week with a comprehensive review process that integrates all methodologies:
                        </p>
                        <ol className="space-y-2 list-decimal list-inside text-sm text-gray-600">
                          <li>Review 12-week goal progress and adjust as needed</li>
                          <li>Evaluate habit tracking data and optimize your environment</li>
                          <li>Identify the biggest wins and areas for improvement</li>
                          <li>Plan your "frogs" for each day of the upcoming week</li>
                          <li>Clear inboxes and prepare your environment for a fresh start</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}