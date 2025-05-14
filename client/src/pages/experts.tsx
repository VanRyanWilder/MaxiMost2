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
  const experts: Expert[] = [
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
              {experts.map(expert => (
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're currently curating a collection of top nutrition experts for this section.
                Check back soon for evidence-based nutrition specialists.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="strength">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're currently curating a collection of top strength and performance experts for this section.
                Check back soon for evidence-based strength training specialists.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="longevity">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                We're currently curating a collection of top longevity experts for this section.
                Check back soon for evidence-based longevity and healthspan specialists.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}