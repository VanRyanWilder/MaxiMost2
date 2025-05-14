import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  Brain, 
  Dumbbell, 
  Heart, 
  Microscope,
  Activity,
  Flame,
  SunMedium
} from "lucide-react";

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
}

export default function ExpertsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Expert data
  const experts: Expert[] = [
    {
      id: "kelly-starrett",
      name: "Kelly Starrett",
      title: "Physical Therapist, Founder of The Ready State",
      category: "mobility",
      description: "Renowned for his work on mobility and injury prevention. His book Supple Leopard is a go-to resource for athletes, including CrossFit elites, looking to optimize movement and reduce injury risk through practical techniques.",
      specialty: ["Mobility", "Injury Prevention", "Movement Optimization"],
      primaryAudience: ["CrossFit Athletes", "Strength Athletes", "General Fitness"],
      notableWorks: ["Becoming a Supple Leopard", "Ready to Run"]
    },
    {
      id: "stuart-mcgill",
      name: "Stuart McGill",
      title: "Biomechanics Expert, Former Professor",
      category: "mobility",
      description: "A biomechanics expert and former professor, Dr. McGill focuses on spine health and injury prevention. His research and methods are widely used by elite athletes to strengthen their backs and avoid injuries during intense training like CrossFit or ultra-marathons.",
      specialty: ["Spine Health", "Back Mechanics", "Injury Prevention"],
      primaryAudience: ["Strength Athletes", "CrossFit Athletes", "Back Pain Sufferers"],
      notableWorks: ["Back Mechanic", "Ultimate Back Fitness and Performance"]
    },
    {
      id: "chris-hinshaw",
      name: "Chris Hinshaw",
      title: "Endurance Coach",
      category: "endurance",
      description: "An endurance coach with a background in competitive athletics, Hinshaw works with CrossFit athletes and ultra-marathoners to enhance aerobic capacity and prevent overtraining injuries. His Aerobic Capacity program is popular among elites seeking sustained performance.",
      specialty: ["Aerobic Capacity", "Endurance Training", "CrossFit Conditioning"],
      primaryAudience: ["CrossFit Athletes", "Ultra-Marathoners", "Endurance Athletes"]
    },
    {
      id: "phil-maffetone",
      name: "Phil Maffetone",
      title: "Coach and Author",
      category: "endurance",
      description: "A coach and author, Maffetone developed the MAF (Maximum Aerobic Function) method, emphasizing low-heart-rate training to build endurance and prevent burnout. His approach has been adopted by ultra-marathoners and other endurance athletes.",
      specialty: ["Low Heart-Rate Training", "Aerobic Base Building", "Sustainable Endurance"],
      primaryAudience: ["Endurance Athletes", "Ultra-Marathoners", "Triathletes"],
      notableWorks: ["The Big Book of Endurance Training and Racing"]
    },
    {
      id: "rhonda-patrick",
      name: "Rhonda Patrick, Ph.D.",
      title: "Biomedical Scientist",
      category: "nutrition",
      description: "A Ph.D. in biomedical science, Dr. Patrick focuses on nutrition, supplementation, and lifestyle strategies to optimize athletic performance and recovery. Her research on micronutrients and sauna use appeals to athletes aiming for peak performance and injury resilience.",
      specialty: ["Micronutrients", "Supplementation", "Heat Stress Adaptation"],
      primaryAudience: ["Elite Athletes", "Biohackers", "Health Optimizers"]
    },
    {
      id: "cate-shanahan",
      name: "Cate Shanahan, M.D.",
      title: "Physician and Nutrition Expert",
      category: "nutrition",
      description: "A physician and nutrition expert, Dr. Shanahan works with elite athletes (including NBA players) to optimize diet for performance and healing. Her book Deep Nutrition emphasizes nutrient-dense foods to support recovery and prevent injury.",
      specialty: ["Nutrient-Dense Diets", "Metabolic Health", "Performance Nutrition"],
      primaryAudience: ["Professional Athletes", "NBA Players", "General Population"],
      notableWorks: ["Deep Nutrition", "The Fatburn Fix"]
    },
    {
      id: "andy-galpin",
      name: "Andy Galpin, Ph.D.",
      title: "Sports Scientist",
      category: "strength",
      description: "A sports scientist with a Ph.D. in human bioenergetics, Dr. Galpin researches muscle physiology and performance optimization. He collaborates with elite athletes to design training programs that maximize strength and minimize injury risk.",
      specialty: ["Muscle Physiology", "Energy Systems", "Strength Development"],
      primaryAudience: ["Elite Athletes", "Strength Competitors", "Combat Athletes"],
      notableWorks: ["Unplugged"]
    },
    {
      id: "brad-schoenfeld",
      name: "Brad Schoenfeld, Ph.D.",
      title: "Muscle Hypertrophy Researcher",
      category: "strength",
      description: "A leading researcher in muscle hypertrophy and strength training, Dr. Schoenfeld's evidence-based approaches help athletes like CrossFit elites build resilience and power while avoiding overuse injuries.",
      specialty: ["Hypertrophy", "Strength Development", "Periodization"],
      primaryAudience: ["Bodybuilders", "Strength Athletes", "CrossFit Athletes"],
      notableWorks: ["Science and Development of Muscle Hypertrophy", "The MAX Muscle Plan"]
    },
    {
      id: "mike-israetel",
      name: "Mike Israetel, Ph.D.",
      title: "Sports Scientist, Co-founder of Renaissance Periodization",
      category: "strength",
      description: "A sports scientist and co-founder of Renaissance Periodization, Dr. Israetel specializes in hypertrophy and strength training. His programming balances intensity and recovery, making it ideal for elite athletes seeking peak performance without burnout.",
      specialty: ["Volume Landmarks", "Periodization", "Recovery Optimization"],
      primaryAudience: ["Bodybuilders", "Strength Athletes", "CrossFit Athletes"],
      notableWorks: ["Scientific Principles of Strength Training", "The Renaissance Diet 2.0"]
    },
    {
      id: "michael-gervais",
      name: "Michael Gervais, Ph.D.",
      title: "Sports Psychologist",
      category: "mental",
      description: "A sports psychologist, Dr. Gervais works with elite athletes (including Olympians) to enhance mental toughness and focus. His Finding Mastery podcast and coaching help athletes prevent mental fatigue and maintain peak performance.",
      specialty: ["Mental Toughness", "Performance Psychology", "Flow States"],
      primaryAudience: ["Olympic Athletes", "Professional Athletes", "Extreme Sports Athletes"]
    },
    {
      id: "peter-attia",
      name: "Peter Attia, M.D.",
      title: "Physician focused on Longevity and Performance",
      category: "longevity",
      description: "A physician focused on longevity and performance, Dr. Attia combines medical expertise with practical strategies for athletes. His work on exercise physiology and recovery is valuable for CrossFit elites and ultra-marathoners aiming to sustain excellence.",
      specialty: ["Exercise Physiology", "Recovery Optimization", "Metabolic Health"],
      primaryAudience: ["Endurance Athletes", "Health Optimizers", "Aging Athletes"],
      notableWorks: ["Outlive"]
    },
    {
      id: "tim-noakes",
      name: "Tim Noakes, M.D., Ph.D.",
      title: "Sports Scientist, Emeritus Professor",
      category: "endurance",
      description: "A sports scientist and emeritus professor, Dr. Noakes is known for his research on endurance sports and hydration. His insights help ultra-marathoners optimize performance and avoid injuries related to fatigue or improper fueling.",
      specialty: ["Hydration Science", "Central Governor Theory", "Endurance Performance"],
      primaryAudience: ["Ultra-Marathoners", "Endurance Athletes", "Sports Scientists"],
      notableWorks: ["Waterlogged", "The Lore of Running"]
    },
    {
      id: "ben-greenfield",
      name: "Ben Greenfield",
      title: "Biohacker and Fitness Expert",
      category: "longevity",
      description: "A biohacker and fitness expert, Greenfield advises elite athletes on cutting-edge performance and recovery techniques, including nutrition, supplementation, and injury prevention strategies tailored to CrossFit and endurance sports.",
      specialty: ["Biohacking", "Recovery Modalities", "Performance Optimization"],
      primaryAudience: ["Endurance Athletes", "CrossFit Athletes", "Biohackers"],
      notableWorks: ["Beyond Training", "Boundless"]
    }
  ];

  // Category mapping for icons and labels
  const categoryMap = {
    mobility: {
      icon: <Activity className="h-5 w-5" />,
      label: "Mobility & PT",
      color: "bg-blue-100 text-blue-800"
    },
    endurance: {
      icon: <Activity className="h-5 w-5" />,
      label: "Endurance",
      color: "bg-green-100 text-green-800"
    },
    nutrition: {
      icon: <Heart className="h-5 w-5" />,
      label: "Nutrition",
      color: "bg-red-100 text-red-800"
    },
    strength: {
      icon: <Dumbbell className="h-5 w-5" />,
      label: "Strength",
      color: "bg-amber-100 text-amber-800"
    },
    mental: {
      icon: <Brain className="h-5 w-5" />,
      label: "Mental",
      color: "bg-purple-100 text-purple-800"
    },
    longevity: {
      icon: <SunMedium className="h-5 w-5" />,
      label: "Longevity",
      color: "bg-cyan-100 text-cyan-800"
    }
  };

  // Filter experts based on category and search
  const filteredExperts = experts.filter(expert => {
    const matchesCategory = selectedCategory === "all" || expert.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      expert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer title="Health & Performance Experts">
      <div className="space-y-6">
        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search experts, specialties..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:flex sm:flex-row">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="mobility">Mobility</TabsTrigger>
              <TabsTrigger value="endurance">Endurance</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="strength">Strength</TabsTrigger>
              <TabsTrigger value="mental">Mental</TabsTrigger>
              <TabsTrigger value="longevity">Longevity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Experts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map(expert => (
            <Card key={expert.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                  </div>
                  <Badge className={categoryMap[expert.category].color + " flex items-center gap-1"}>
                    {categoryMap[expert.category].icon}
                    <span>{categoryMap[expert.category].label}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{expert.description}</p>
                
                <div>
                  <h4 className="text-xs font-medium mb-1">Areas of Expertise:</h4>
                  <div className="flex flex-wrap gap-1">
                    {expert.specialty.map(spec => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {expert.notableWorks && (
                  <div>
                    <h4 className="text-xs font-medium mb-1 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>Notable Works:</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {expert.notableWorks.map(work => (
                        <li key={work}>{work}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredExperts.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Microscope className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p>No experts match your search criteria.</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}