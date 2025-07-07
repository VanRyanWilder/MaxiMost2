// import { Sidebar } from "@/components/layout/sidebar"; // Removed
// import { MobileHeader } from "@/components/layout/mobile-header"; // Removed
// import { useState } from "react"; // Removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MeditationGuide {
  title: string;
  duration: string;
  description: string;
  steps: string[];
}

interface StoicPractice {
  title: string;
  author: string;
  description: string;
  practice: string;
}

export default function MindSpirit() {
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Removed
  
  const meditationGuides: MeditationGuide[] = [
    {
      title: "Morning Mindfulness",
      duration: "10 minutes",
      description: "Start your day with clarity and intention",
      steps: [
        "Find a comfortable seated position in a quiet space",
        "Close your eyes and take 3 deep breaths",
        "Begin to notice your natural breathing pattern",
        "When thoughts arise, acknowledge them without judgment and return to your breath",
        "Focus on gratitude for the new day ahead",
        "Set an intention for how you want to approach the day"
      ]
    },
    {
      title: "Stress Reduction",
      duration: "15 minutes",
      description: "Release tension and restore calm",
      steps: [
        "Sit or lie down in a comfortable position",
        "Scan your body for areas of tension",
        "Breathe deeply into any tight areas",
        "Visualize stress leaving your body with each exhale",
        "Repeat the mantra: 'I am calm, I am in control'",
        "Gradually bring awareness back to your surroundings"
      ]
    },
    {
      title: "Focus Enhancement",
      duration: "20 minutes",
      description: "Sharpen concentration and mental clarity",
      steps: [
        "Sit upright with a straight spine",
        "Focus your attention on a single object or point",
        "When your mind wanders, gently return focus to your object",
        "Count your breaths from 1 to 10, then start again",
        "With each breath, imagine mental fog clearing",
        "Notice the space between thoughts growing wider"
      ]
    }
  ];
  
  const stoicPractices: StoicPractice[] = [
    {
      title: "Negative Visualization",
      author: "Seneca",
      description: "Practicing the anticipation of loss to appreciate what you have",
      practice: "Take 5 minutes each morning to imagine losing something you value—good health, relationships, material possessions. Don't dwell on the loss, but use the exercise to cultivate gratitude for having these things now. This practice builds resilience against actual setbacks and increases daily appreciation."
    },
    {
      title: "Voluntary Discomfort",
      author: "Epictetus",
      description: "Deliberately experiencing mild discomfort to build mental toughness",
      practice: "Once per week, deliberately experience some form of discomfort: take a cold shower, skip a meal, sleep on the floor, or exercise to exhaustion. This practice builds your tolerance for discomfort, reduces anxiety about future hardships, and helps you distinguish between genuine hardship and mere inconvenience."
    },
    {
      title: "Morning and Evening Reflection",
      author: "Marcus Aurelius",
      description: "Bookend your day with philosophical reflection",
      practice: "Morning: Each morning, journal about potential challenges you might face and how virtue can guide your response. Evening: Each night, review your day's actions without judgment. Ask: 'What did I do well? Where did I fail? What could I do better tomorrow?' This practice promotes continual improvement and mindfulness."
    },
    {
      title: "View From Above",
      author: "Marcus Aurelius",
      description: "Gaining perspective by imagining seeing yourself from a cosmic viewpoint",
      practice: "Picture yourself from increasingly greater distances—from above your room, your city, the planet, and the universe. Notice how your problems shrink in cosmic perspective. This practice helps reduce emotional reactivity to daily concerns and fosters a more objective, philosophical outlook."
    }
  ];

  return (
    // Outer divs, Sidebar, MobileHeader removed
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Mind & Spirit Development</h1>
            
            <div className="bg-gradient-to-r from-primary to-progress rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Daily Wisdom</h2>
              <p className="text-white text-opacity-90 max-w-3xl">"You have power over your mind—not outside events. Realize this, and you will find strength." — Marcus Aurelius</p>
            </div>
            
            <Tabs defaultValue="meditation" className="mb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="meditation">Meditation Guides</TabsTrigger>
                <TabsTrigger value="stoicism">Stoic Practices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="meditation">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meditationGuides.map((guide, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{guide.title}</CardTitle>
                          <span className="bg-progress bg-opacity-10 text-progress text-xs px-2 py-1 rounded">
                            {guide.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{guide.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          {guide.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="stoicism">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stoicPractices.map((practice, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{practice.title}</CardTitle>
                          <span className="bg-dark bg-opacity-10 text-dark text-xs px-2 py-1 rounded">
                            {practice.author}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{practice.description}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{practice.practice}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
  );
}
