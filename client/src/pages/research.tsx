import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { GeminiResearch } from "@/components/research/gemini-research";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Sparkles, Bot, Info, Users, Heart, Dumbbell, Award, ExternalLink } from "lucide-react";

// Define expert types
type ExpertCategory = 
  | "mobility" 
  | "endurance" 
  | "nutrition" 
  | "strength" 
  | "mental" 
  | "longevity";

interface Expert {
  id: string;
  name: string;
  title: string;
  category: ExpertCategory;
  description: string;
  specialty: string[];
  primaryAudience: string[];
  notableWorks?: string[];
  imageUrl?: string;
  websiteUrl?: string;
}

// Helper function to get border color based on category
function getBorderColor(category: ExpertCategory): string {
  switch (category) {
    case "mobility":
      return "#3b82f6"; // blue-500
    case "endurance":
      return "#ef4444"; // red-500
    case "nutrition":
      return "#22c55e"; // green-500
    case "strength":
      return "#f59e0b"; // amber-500
    case "mental":
      return "#8b5cf6"; // purple-500
    case "longevity":
      return "#6366f1"; // indigo-500
    default:
      return "#6b7280"; // gray-500
  }
}

export default function Research() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mobility and Physical Therapy experts
  const mobilityExperts: Expert[] = [
    {
      id: "kelly-starrett",
      name: "Kelly Starrett",
      title: "Physical Therapist & Mobility Expert",
      category: "mobility",
      description: "A physical therapist and founder of The Ready State (formerly MobilityWOD), Kelly is renowned for revolutionizing how athletes think about movement and mobility. He emphasizes a proactive approach to injury prevention and performance optimization through proper movement mechanics.",
      specialty: [
        "Movement optimization",
        "Mobility techniques",
        "Recovery protocols",
        "Joint health maintenance"
      ],
      primaryAudience: [
        "Athletes",
        "CrossFit practitioners",
        "Fitness professionals",
        "Anyone experiencing movement limitations"
      ],
      notableWorks: [
        "Becoming a Supple Leopard",
        "Ready to Run",
        "Deskbound: Standing Up to a Sitting World"
      ],
      websiteUrl: "https://thereadystate.com/"
    },
    {
      id: "aaron-horschig",
      name: "Aaron Horschig",
      title: "Physical Therapist & Weightlifting Coach",
      category: "mobility",
      description: "Creator of Squat University, Aaron combines his expertise in physical therapy with Olympic weightlifting coaching. He focuses on teaching proper movement patterns and addressing common limitations to improve performance and reduce injury risk in strength sports.",
      specialty: [
        "Squat and hip mechanics",
        "Olympic weightlifting technique",
        "Injury prevention strategies",
        "Rehabilitation protocols"
      ],
      primaryAudience: [
        "Weightlifters",
        "Powerlifters",
        "Strength athletes",
        "CrossFit enthusiasts"
      ],
      notableWorks: [
        "Squat Bible",
        "Rebuilding Milo"
      ],
      websiteUrl: "https://squatuniversity.com/"
    },
    {
      id: "jill-miller",
      name: "Jill Miller",
      title: "Connective Tissue Specialist",
      category: "mobility",
      description: "Creator of Yoga Tune Up® and The Roll Model® Method, Jill specializes in helping people overcome pain, improve performance, and enhance body awareness through self-care fitness. She pioneered innovative techniques using therapy balls to address fascial health.",
      specialty: [
        "Fascia and connective tissue health",
        "Self-myofascial release techniques",
        "Breath work",
        "Pain management"
      ],
      primaryAudience: [
        "Yoga practitioners",
        "Athletes with chronic pain",
        "Fitness professionals",
        "Rehabilitation specialists"
      ],
      notableWorks: [
        "The Roll Model: A Step-by-Step Guide to Erase Pain",
        "Body by Breath"
      ],
      websiteUrl: "https://www.jillmiller.com/"
    },
    {
      id: "ido-portal",
      name: "Ido Portal",
      title: "Movement Specialist",
      category: "mobility",
      description: "As a movement teacher, Ido takes a philosophical and practical approach to human movement. He developed the 'Movement Culture' that transcends traditional exercise modalities and focuses on developing complete movement competency across multiple disciplines.",
      specialty: [
        "Movement literacy",
        "Hand balancing",
        "Locomotion patterns",
        "Movement improvisation"
      ],
      primaryAudience: [
        "Martial artists",
        "Dancers",
        "Athletes seeking movement mastery",
        "Movement enthusiasts"
      ],
      websiteUrl: "https://www.idoportal.com/"
    },
    {
      id: "sue-falsone",
      name: "Sue Falsone",
      title: "Sports Physical Therapist",
      category: "mobility",
      description: "The first female head athletic trainer in major American professional sports (MLB), Sue specializes in integrating physical therapy and performance training. She focuses on bridging the gap between rehabilitation and high-level athletic performance.",
      specialty: [
        "Integration of rehabilitation and performance",
        "Thoracic spine mobility",
        "Shoulder mechanics",
        "Sports-specific recovery protocols"
      ],
      primaryAudience: [
        "Professional athletes",
        "Sports physical therapists",
        "Athletic trainers",
        "Strength coaches"
      ],
      notableWorks: [
        "Bridging the Gap from Rehab to Performance"
      ],
      websiteUrl: "https://suefalsone.com/"
    },
    {
      id: "brian-mackenzie",
      name: "Brian MacKenzie",
      title: "Human Performance Specialist",
      category: "mobility",
      description: "Founder of Power Speed ENDURANCE and XPT, Brian integrates breathing, movement, and recovery approaches for improved athletic performance. He developed innovative training methodologies that focus on functional fitness and stress adaptation.",
      specialty: [
        "Breath work optimization",
        "Environmental training",
        "Stress adaptation",
        "Endurance performance"
      ],
      primaryAudience: [
        "Endurance athletes",
        "CrossFit practitioners",
        "Performance-focused individuals",
        "Coaches"
      ],
      notableWorks: [
        "Unbreakable Runner",
        "Power Speed ENDURANCE",
        "Unplugged"
      ],
      websiteUrl: "https://powerspeedendurance.com/"
    }
  ];

  // Nutrition experts - we already have these in the Research tab, so we'll reuse this data
  
  // Strength and Performance experts
  const strengthExperts: Expert[] = [
    {
      id: "andy-galpin",
      name: "Andy Galpin",
      title: "Exercise Physiologist & Performance Specialist",
      category: "strength",
      description: "Dr. Andy Galpin specializes in the molecular adaptations to exercise and how humans can optimize training, nutrition, and recovery for maximum physical performance. His evidence-based approach balances scientific rigor with practical application.",
      specialty: [
        "Exercise physiology",
        "Muscle fiber type optimization",
        "Concurrent training",
        "Performance nutrition"
      ],
      primaryAudience: [
        "Strength athletes",
        "Mixed-modal athletes",
        "Fitness professionals",
        "Sport scientists"
      ],
      notableWorks: [
        "Unplugged: Evolve from Technology to Upgrade Your Fitness",
        "Body of Knowledge Podcast"
      ],
      websiteUrl: "https://www.andygalpin.com/"
    },
    {
      id: "brad-schoenfeld",
      name: "Brad Schoenfeld",
      title: "Hypertrophy Researcher & Training Specialist",
      category: "strength",
      description: "Dr. Brad Schoenfeld is one of the world's leading experts on muscle hypertrophy, with extensive research on the mechanisms of muscle growth and science-based approaches to resistance training. His work bridges the gap between lab research and practical application.",
      specialty: [
        "Muscle hypertrophy mechanisms",
        "Resistance training program design",
        "Training volume optimization",
        "Protein intake strategies"
      ],
      primaryAudience: [
        "Bodybuilders",
        "Resistance training enthusiasts",
        "Strength coaches",
        "Rehabilitation specialists"
      ],
      notableWorks: [
        "Science and Development of Muscle Hypertrophy",
        "The MAX Muscle Plan"
      ],
      websiteUrl: "https://www.lookgreatnaked.com/"
    },
    {
      id: "layne-norton",
      name: "Layne Norton",
      title: "Physique Scientist & Nutritional Biochemist",
      category: "strength",
      description: "Dr. Layne Norton combines his expertise in nutritional biochemistry with practical strength training to create evidence-based approaches to body composition and performance. He's known for his no-nonsense, science-first approach to debunking fitness myths.",
      specialty: [
        "Protein metabolism",
        "Energy balance",
        "Powerlifting technique",
        "Contest preparation"
      ],
      primaryAudience: [
        "Bodybuilders",
        "Powerlifters",
        "Physique competitors",
        "Evidence-based fitness enthusiasts"
      ],
      notableWorks: [
        "Fat Loss Forever",
        "The Complete Contest Prep Guide"
      ],
      websiteUrl: "https://www.biolayne.com/"
    },
    {
      id: "stuart-mcgill",
      name: "Stuart McGill",
      title: "Spine Biomechanist",
      category: "strength",
      description: "Dr. Stuart McGill is a world-renowned spine biomechanist known for his research on spine function, injury mechanisms, and rehabilitation approaches. His work has revolutionized how we understand core training and back pain management.",
      specialty: [
        "Spine biomechanics",
        "Core stability training",
        "Back pain rehabilitation",
        "Performance optimization"
      ],
      primaryAudience: [
        "Back pain sufferers",
        "Strength coaches",
        "Combat athletes",
        "Physical therapists"
      ],
      notableWorks: [
        "Back Mechanic",
        "Ultimate Back Fitness and Performance",
        "McGill Big 3 core exercises"
      ],
      websiteUrl: "https://www.backfitpro.com/"
    },
    {
      id: "mark-rippetoe",
      name: "Mark Rippetoe",
      title: "Strength Coach & Author",
      category: "strength",
      description: "Mark Rippetoe is a strength training coach and author known for his advocacy of simple, effective barbell training programs. His Starting Strength methodology has become one of the most widely used approaches to teaching proper strength technique.",
      specialty: [
        "Barbell training technique",
        "Linear progression methodology",
        "Strength program design",
        "Coaching cues and principles"
      ],
      primaryAudience: [
        "Novice lifters",
        "Strength enthusiasts",
        "Athletic coaches",
        "Powerlifters"
      ],
      notableWorks: [
        "Starting Strength: Basic Barbell Training",
        "Practical Programming for Strength Training"
      ],
      websiteUrl: "https://startingstrength.com/"
    }
  ];

  // Longevity experts
  const longevityExperts: Expert[] = [
    {
      id: "david-sinclair",
      name: "David Sinclair",
      title: "Geneticist & Longevity Researcher",
      category: "longevity",
      description: "Dr. David Sinclair is a professor of genetics at Harvard Medical School who focuses on understanding why we age and how to slow its effects. His research explores interventions that may help extend human healthspan through cellular mechanisms and gene expression.",
      specialty: [
        "Epigenetics of aging",
        "NAD+ metabolism",
        "Sirtuin activation",
        "Cellular reprogramming"
      ],
      primaryAudience: [
        "Longevity enthusiasts",
        "Health optimizers",
        "Aging-concerned individuals",
        "Scientists and researchers"
      ],
      notableWorks: [
        "Lifespan: Why We Age—and Why We Don't Have To",
        "Research on resveratrol and NAD+ precursors"
      ],
      websiteUrl: "https://sinclair.hms.harvard.edu/"
    },
    {
      id: "matthew-walker",
      name: "Matthew Walker",
      title: "Neuroscientist & Sleep Expert",
      category: "longevity",
      description: "Dr. Matthew Walker is a professor of neuroscience and psychology at UC Berkeley, specializing in the relationship between sleep, health, and longevity. His research demonstrates the critical role of quality sleep in disease prevention and cognitive performance.",
      specialty: [
        "Sleep physiology",
        "Circadian rhythm optimization",
        "Sleep's impact on health outcomes",
        "Cognitive performance enhancement"
      ],
      primaryAudience: [
        "Sleep-deprived individuals",
        "Health optimizers",
        "Performance-focused professionals",
        "Mental health-conscious people"
      ],
      notableWorks: [
        "Why We Sleep: Unlocking the Power of Sleep and Dreams",
        "TED Talk: Sleep is your superpower"
      ],
      websiteUrl: "https://www.sleepdiplomat.com/"
    },
    {
      id: "valter-longo",
      name: "Valter Longo",
      title: "Biogerontologist & Fasting Expert",
      category: "longevity",
      description: "Dr. Valter Longo is a leading researcher in the field of longevity and aging. His work focuses on the relationship between nutrition, fasting, and longevity, with particular emphasis on cellular protection mechanisms activated by dietary interventions.",
      specialty: [
        "Fasting mimicking diet protocols",
        "Nutrition's impact on longevity",
        "Cellular stress response",
        "Disease prevention"
      ],
      primaryAudience: [
        "Health-conscious individuals",
        "Fasting enthusiasts",
        "Cancer patients",
        "Anti-aging researchers"
      ],
      notableWorks: [
        "The Longevity Diet",
        "Research on Fasting-Mimicking Diet"
      ],
      websiteUrl: "https://valterlongo.com/"
    },
    {
      id: "bryan-johnson",
      name: "Bryan Johnson",
      title: "Biohacker & Longevity Entrepreneur",
      category: "longevity",
      description: "Bryan Johnson is an entrepreneur and biohacker who has developed the Blueprint protocol, a comprehensive system for measuring and optimizing biological age. His approach includes rigorous testing, data collection, and interventions across multiple health domains.",
      specialty: [
        "Biomarker tracking and optimization",
        "Anti-aging interventions",
        "Data-driven health protocols",
        "Biological age reversal"
      ],
      primaryAudience: [
        "Biohackers",
        "Health optimizers",
        "Tech-oriented health enthusiasts",
        "Anti-aging advocates"
      ],
      notableWorks: [
        "Blueprint Protocol",
        "Rejuvenation Olympics"
      ],
      websiteUrl: "https://blueprint.bryanjohnson.co/"
    },
    {
      id: "andrew-huberman-longevity",
      name: "Andrew Huberman",
      title: "Neuroscientist & Longevity Protocol Expert",
      category: "longevity",
      description: "Dr. Andrew Huberman offers science-based protocols for optimizing health and extending healthspan through neurological and physiological interventions. His work connects neuroscience with practical applications for improving vitality and cognitive function.",
      specialty: [
        "Neuroplasticity for longevity",
        "Stress mitigation techniques",
        "Light exposure protocols",
        "Heat/cold exposure benefits"
      ],
      primaryAudience: [
        "Science-minded health optimizers",
        "Performance enthusiasts",
        "Stress-management seekers",
        "Sleep optimization seekers"
      ],
      notableWorks: [
        "Huberman Lab Podcast - Longevity episodes",
        "Time-restricted eating protocols"
      ],
      websiteUrl: "https://hubermanlab.com/"
    }
  ];

  // Combined experts list for display
  const allExperts: Record<string, Expert[]> = {
    "mobility": mobilityExperts,
    "strength": strengthExperts,
    "longevity": longevityExperts
  };

  // Helper function to get category icon
  function getCategoryIcon(category: ExpertCategory) {
    switch (category) {
      case "mobility":
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case "endurance":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "nutrition":
        return <Heart className="h-5 w-5 text-green-500" />;
      case "strength":
        return <Dumbbell className="h-5 w-5 text-amber-500" />;
      case "mental":
        return <Brain className="h-5 w-5 text-purple-500" />;
      case "longevity":
        return <Heart className="h-5 w-5 text-indigo-500" />;
      default:
        return <Users className="h-5 w-5" />;
    }
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
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Brain className="h-8 w-8 text-primary" />
                  Research & Knowledge
                </h1>
                <p className="text-gray-600 mt-1">AI-powered research on health, fitness, and self-improvement</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span>Powered by Gemini</span>
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Advanced AI</span>
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Evidence-Based Insights
                    </CardTitle>
                    <CardDescription>
                      Access research from leading experts like Andrew Huberman and Dr. Brecka
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Dive into cutting-edge research on sleep optimization, hormone balance, nutrition, and mental performance.
                      Our AI-powered research assistant can generate detailed reports on topics from scientific literature
                      and expert sources including Huberman Lab, Peter Attia, and Dr. Brecka.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-medium text-blue-700 mb-2 text-sm">Scientific Research</h3>
                        <p className="text-sm text-gray-600">
                          Access evidence-based information from peer-reviewed journals and studies.
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-medium text-purple-700 mb-2 text-sm">Expert Knowledge</h3>
                        <p className="text-sm text-gray-600">
                          Insights from leading figures in health, fitness, and performance.
                        </p>
                      </div>
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h3 className="font-medium text-green-700 mb-2 text-sm">Practical Application</h3>
                        <p className="text-sm text-gray-600">
                          Turn research into actionable steps for your fitness and health journey.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      About Our AI Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-4">
                      Our AI research assistant uses Google's Gemini technology to provide you with the most relevant and 
                      accurate information on health, fitness, and personal development topics.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Synthesizes information from scientific studies</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Provides insights from top researchers like Andrew Huberman</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Offers practical applications of complex concepts</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary font-medium">•</span>
                        <p className="text-sm text-gray-700">Generates custom visualizations related to your topics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Tabs defaultValue="experts" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="experts">Health Experts</TabsTrigger>
                <TabsTrigger value="ai-research">AI Research Assistant</TabsTrigger>
              </TabsList>
              
              <TabsContent value="experts" className="mt-6">
                <h2 className="text-2xl font-bold mb-6">Leading Health Optimization Experts</h2>
                <p className="text-gray-700 mb-6">
                  Our supplement recommendations are based on research and protocols from these trusted experts in health optimization,
                  longevity, and performance. Each brings a unique scientific perspective based on their expertise.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Andrew Huberman */}
                  <Card className="overflow-hidden border-l-4 border-l-blue-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Andrew Huberman</CardTitle>
                        <Badge className="mb-3">Neuroscientist</Badge>
                        <CardDescription className="mb-3">
                          Professor of Neurobiology at Stanford School of Medicine and host of the Huberman Lab podcast
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>Magnesium (glycinate/threonate)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>Creatine Monohydrate</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-blue-500">•</span>
                              <span>EPA/DHA (Omega-3)</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Neurocircuitry of vision, stress, focus, and neuroplasticity. Applies neuroscience 
                            research to improve sleep, manage stress and optimize performance.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://hubermanlab.com", "_blank")}>
                          Visit Huberman Lab
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Peter Attia */}
                  <Card className="overflow-hidden border-l-4 border-l-purple-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Peter Attia</CardTitle>
                        <Badge className="mb-3">Longevity Physician</Badge>
                        <CardDescription className="mb-3">
                          Physician focusing on the science of longevity and host of The Drive podcast
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Vitamin D3 with K2</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Athletic Greens (multivitamin)</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-purple-500">•</span>
                              <span>Magnesium</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Specializes in nutritional biochemistry, exercise physiology, lipidology, and 
                            pharmacology with a focus on extending lifespan and improving healthspan.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://peterattiamd.com", "_blank")}>
                          Visit Peter Attia MD
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gary Brecka */}
                  <Card className="overflow-hidden border-l-4 border-l-green-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Gary Brecka</CardTitle>
                        <Badge className="mb-3">Human Biologist</Badge>
                        <CardDescription className="mb-3">
                          Biologist and health optimization specialist focusing on hormone optimization and longevity
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Vitamin D3</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Zinc with Copper</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-green-500">•</span>
                              <span>Protein supplements</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Specializes in analyzing bloodwork and biomarkers to optimize health, hormones, and performance.
                            Focuses on practical interventions for improved energy and longevity.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://www.10xhealth.com", "_blank")}>
                          Visit 10X Health System
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Dr. Rhonda Patrick */}
                  <Card className="overflow-hidden border-l-4 border-l-amber-500">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full p-5">
                        <CardTitle className="mb-2 text-xl">Dr. Rhonda Patrick</CardTitle>
                        <Badge className="mb-3">Biomedical Scientist</Badge>
                        <CardDescription className="mb-3">
                          Researcher specializing in nutrigenomics, aging, and cancer prevention
                        </CardDescription>
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-semibold">Top Recommended Supplements:</h4>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Omega-3 fatty acids</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Vitamin D3</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-amber-500">•</span>
                              <span>Sulforaphane (broccoli sprout extract)</span>
                            </li>
                          </ul>
                          <h4 className="text-sm font-semibold mt-3">Research Focus:</h4>
                          <p className="text-sm text-gray-600">
                            Studies how nutrition, micronutrients, and lifestyle factors influence gene expression, 
                            aging, and disease. Special focus on micronutrient deficiencies and their impacts.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => window.open("https://www.foundmyfitness.com", "_blank")}>
                          Visit Found My Fitness
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-semibold mb-3">How We Use Expert Research</h3>
                  <p className="text-gray-700 mb-4">
                    Our supplement recommendations synthesize research and protocols from these experts, prioritizing:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Scientific consensus</span> - We prioritize supplements recommended by multiple experts
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Research quality</span> - We favor supplements with strong clinical evidence
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Cost-effectiveness</span> - We highlight supplements offering the best value for health impact
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-medium mt-1">•</span>
                      <p className="text-gray-700">
                        <span className="font-medium">Safety profile</span> - We carefully consider potential side effects and interactions
                      </p>
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="ai-research" className="mt-6">
                <GeminiResearch />
              </TabsContent>
            </Tabs>
            
            {/* Additional Health Experts Section */}
            <div className="mt-12 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Additional Health Experts</h2>
              </div>
              
              <p className="text-gray-700 mb-8">
                Beyond our primary health researchers, here are additional experts in various fields who can help you optimize
                specific aspects of your health and performance. Following their teachings can help you prevent injuries and improve performance.
              </p>
              
              <Tabs defaultValue="mobility">
                <TabsList className="mb-6">
                  <TabsTrigger value="mobility">Mobility & Physical Therapy</TabsTrigger>
                  <TabsTrigger value="strength">Strength & Performance</TabsTrigger>
                  <TabsTrigger value="longevity">Longevity</TabsTrigger>
                </TabsList>
                
                {Object.entries(allExperts).map(([category, experts]) => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {experts.map((expert) => (
                        <Card key={expert.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: getBorderColor(expert.category) }}>
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full p-5">
                              <div className="flex items-center gap-2 mb-2">
                                {getCategoryIcon(expert.category)}
                                <CardTitle className="text-xl">{expert.name}</CardTitle>
                              </div>
                              <Badge className="mb-3">{expert.title}</Badge>
                              <CardDescription className="mb-3">
                                {expert.description}
                              </CardDescription>
                              <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-semibold">Top Specialties:</h4>
                                <ul className="text-sm space-y-1">
                                  {expert.specialty.slice(0, 3).map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <span style={{ color: getBorderColor(expert.category) }}>•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                                
                                {expert.notableWorks && expert.notableWorks.length > 0 && (
                                  <>
                                    <h4 className="text-sm font-semibold mt-3">Notable Work:</h4>
                                    <ul className="text-sm space-y-1">
                                      {expert.notableWorks.slice(0, 2).map((work, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                          <span style={{ color: getBorderColor(expert.category) }}>•</span>
                                          <span>{work}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                              
                              {expert.websiteUrl && (
                                <Button variant="outline" size="sm" className="mt-4 flex items-center gap-1" 
                                  onClick={() => window.open(expert.websiteUrl, "_blank")}
                                >
                                  <span>Visit Website</span>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}