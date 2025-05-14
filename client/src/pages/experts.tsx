import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dumbbell, 
  Heart, 
  Brain,
  Users,
  ExternalLink,
  Award,
  BookOpen
} from "lucide-react";

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

export default function ExpertsPage() {
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

  // Nutrition experts
  const nutritionExperts: Expert[] = [
    {
      id: "rhonda-patrick",
      name: "Rhonda Patrick",
      title: "Biochemist & Nutritional Scientist",
      category: "nutrition",
      description: "Dr. Rhonda Patrick focuses on the impact of micronutrients on metabolic health, aging, and disease. Through her research and communication efforts, she promotes a comprehensive approach to nutrition based on scientific evidence.",
      specialty: [
        "Micronutrient optimization",
        "Nutritional genomics",
        "Aging and longevity",
        "Metabolic health"
      ],
      primaryAudience: [
        "Health optimizers",
        "Science-minded individuals",
        "Longevity enthusiasts",
        "Athletes focusing on health"
      ],
      notableWorks: [
        "Found My Fitness Podcast",
        "Research on Vitamin D and inflammatory biomarkers"
      ],
      websiteUrl: "https://www.foundmyfitness.com/"
    },
    {
      id: "peter-attia",
      name: "Peter Attia",
      title: "Longevity Physician",
      category: "nutrition",
      description: "Dr. Peter Attia focuses on the science of longevity, combining nutritional approaches with exercise, sleep, and emotional health. His evidence-based methodology targets extending lifespan while optimizing healthspan through precise interventions.",
      specialty: [
        "Nutritional biochemistry",
        "Metabolic health",
        "Lipid science",
        "Fasting protocols"
      ],
      primaryAudience: [
        "Longevity-focused individuals",
        "Metabolic health optimizers",
        "Executives and professionals",
        "Athletes"
      ],
      notableWorks: [
        "Outlive: The Science and Art of Longevity",
        "The Drive Podcast"
      ],
      websiteUrl: "https://peterattiamd.com/"
    },
    {
      id: "andrew-huberman",
      name: "Andrew Huberman",
      title: "Neuroscientist & Nutritional Protocol Expert",
      category: "nutrition",
      description: "Dr. Andrew Huberman is a Stanford neuroscientist who translates complex research into applicable protocols for optimizing health, performance, and neuroplasticity. His nutrition recommendations focus on brain health and hormone optimization.",
      specialty: [
        "Nutrition for neurological function",
        "Hormonal health",
        "Sleep optimization",
        "Stress management"
      ],
      primaryAudience: [
        "Science-minded health optimizers",
        "Performance-focused individuals",
        "Stress and sleep-challenged people",
        "Anyone interested in brain health"
      ],
      notableWorks: [
        "Huberman Lab Podcast",
        "Stanford Research on Visual System Development"
      ],
      websiteUrl: "https://hubermanlab.com/"
    }
  ];

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
    }
  ];

  // Combined experts list for display
  const allExperts: Record<string, Expert[]> = {
    "mobility": mobilityExperts,
    "nutrition": nutritionExperts,
    "strength": strengthExperts,
    "longevity": longevityExperts
  };

  // Helper function to get category icon
  function getCategoryIcon(category: ExpertCategory) {
    switch (category) {
      case "mobility":
        return <Dumbbell className="h-5 w-5" />;
      case "endurance":
        return <Heart className="h-5 w-5" />;
      case "nutrition":
        return <Heart className="h-5 w-5" />;
      case "strength":
        return <Dumbbell className="h-5 w-5" />;
      case "mental":
        return <Brain className="h-5 w-5" />;
      case "longevity":
        return <Heart className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  }

  return (
    <PageContainer title="Health & Performance Experts">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Top Health & Performance Experts</h1>
        <p className="text-muted-foreground">
          Learn from the world's leading experts in physical therapy, mobility, and movement optimization.
          Following their teachings can help you prevent injuries and improve performance.
        </p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="mobility">
          <TabsList className="mb-6">
            <TabsTrigger value="mobility">Mobility & Physical Therapy</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="strength">Strength & Performance</TabsTrigger>
            <TabsTrigger value="longevity">Longevity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mobility">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allExperts["mobility"].map((expert) => (
                <Card key={expert.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        {getCategoryIcon(expert.category)}
                        <span>
                          {expert.category.charAt(0).toUpperCase() + expert.category.slice(1)} Expert
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">
                      {expert.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm mb-3">{expert.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialty.map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {expert.notableWorks && expert.notableWorks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Notable Works:
                          </h4>
                          <ul className="text-sm list-disc pl-5">
                            {expert.notableWorks.map((work, i) => (
                              <li key={i}>{work}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    {expert.websiteUrl && (
                      <Button size="sm" className="text-xs h-8" asChild>
                        <a href={expert.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allExperts["nutrition"].map((expert) => (
                <Card key={expert.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        {getCategoryIcon(expert.category)}
                        <span>
                          {expert.category.charAt(0).toUpperCase() + expert.category.slice(1)} Expert
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">
                      {expert.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm mb-3">{expert.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialty.map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {expert.notableWorks && expert.notableWorks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Notable Works:
                          </h4>
                          <ul className="text-sm list-disc pl-5">
                            {expert.notableWorks.map((work, i) => (
                              <li key={i}>{work}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    {expert.websiteUrl && (
                      <Button size="sm" className="text-xs h-8" asChild>
                        <a href={expert.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="strength">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allExperts["strength"].map((expert) => (
                <Card key={expert.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        {getCategoryIcon(expert.category)}
                        <span>
                          {expert.category.charAt(0).toUpperCase() + expert.category.slice(1)} Expert
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">
                      {expert.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm mb-3">{expert.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialty.map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {expert.notableWorks && expert.notableWorks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Notable Works:
                          </h4>
                          <ul className="text-sm list-disc pl-5">
                            {expert.notableWorks.map((work, i) => (
                              <li key={i}>{work}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    {expert.websiteUrl && (
                      <Button size="sm" className="text-xs h-8" asChild>
                        <a href={expert.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="longevity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allExperts["longevity"].map((expert) => (
                <Card key={expert.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="flex gap-1.5 items-center">
                        {getCategoryIcon(expert.category)}
                        <span>
                          {expert.category.charAt(0).toUpperCase() + expert.category.slice(1)} Expert
                        </span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">
                      {expert.title}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm mb-3">{expert.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Specialties:</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specialty.map((specialty, i) => (
                            <Badge key={i} variant="secondary" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {expert.notableWorks && expert.notableWorks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-1 flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Notable Works:
                          </h4>
                          <ul className="text-sm list-disc pl-5">
                            {expert.notableWorks.map((work, i) => (
                              <li key={i}>{work}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button size="sm" variant="outline" className="text-xs h-8">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      View Profile
                    </Button>
                    {expert.websiteUrl && (
                      <Button size="sm" className="text-xs h-8" asChild>
                        <a href={expert.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}