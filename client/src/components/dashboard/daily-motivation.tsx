import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeX, Volume2, Quote, ChevronDown, ChevronUp, Plus, BookOpen, Droplets, Brain, Dumbbell, Heart, Users, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MotivationalContent {
  id: number;
  title: string;
  content: string;
  author: string;
  source?: string;
  audioUrl?: string;
}

export function DailyMotivation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [content, setContent] = useState<MotivationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(true);

  // Mock data - in a real app, this would come from your API
  const mockContent: MotivationalContent = {
    id: 1,
    title: "The Obstacle Is The Way",
    content: "The impediment to action advances action. What stands in the way becomes the way. Our actions may be impeded, but there can be no impeding our intentions or dispositions. Because we can accommodate and adapt. The mind adapts and converts to its own purposes the obstacle to our acting.",
    author: "Marcus Aurelius",
    source: "Meditations",
    audioUrl: undefined, // In a real app, this would be the URL to the audio file
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContent(mockContent);
      setLoading(false);
    }, 1000);

    // Initialize audio if URL exists
    if (mockContent.audioUrl) {
      const audioElement = new Audio(mockContent.audioUrl);
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, []);

  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Pre-filled quick-add habit templates
  const quickAddHabits = [
    {
      title: "Cold Shower",
      description: "Take a cold shower for 2-5 minutes for improved circulation, mental resilience, and reduced inflammation.",
      icon: <Droplets className="h-4 w-4" />,
      impact: 8,
      effort: 4,
      timeCommitment: "5 min",
      frequency: "daily",
      category: "health"
    },
    {
      title: "Meditation",
      description: "Practice mindfulness meditation to reduce stress, improve focus, and promote mental clarity.",
      icon: <Brain className="h-4 w-4" />,
      impact: 9,
      effort: 3,
      timeCommitment: "10 min",
      frequency: "daily",
      category: "mind"
    },
    {
      title: "Push-ups",
      description: "Perform a set of push-ups to build upper body strength and core stability.",
      icon: <Dumbbell className="h-4 w-4" />,
      impact: 7,
      effort: 5,
      timeCommitment: "5 min",
      frequency: "daily",
      category: "fitness"
    },
    {
      title: "Reading",
      description: "Read from a book (not digital) to improve knowledge, vocabulary, and reduce screen time.",
      icon: <BookOpen className="h-4 w-4" />,
      impact: 8,
      effort: 2,
      timeCommitment: "20 min",
      frequency: "daily",
      category: "mind"
    },
    {
      title: "Daily Dad Quote",
      description: "Read Ryan Holiday's Daily Dad email for fatherhood and character development wisdom.",
      icon: <Users className="h-4 w-4" />,
      impact: 7,
      effort: 1,
      timeCommitment: "2 min",
      frequency: "daily",
      category: "mind"
    },
    {
      title: "Morning Prayer",
      description: "Begin the day with prayer for spiritual centering and intentional living.",
      icon: <Sun className="h-4 w-4" />,
      impact: 9,
      effort: 2,
      timeCommitment: "5 min",
      frequency: "daily",
      category: "mind"
    },
  ];

  // Function to handle adding a pre-filled habit (would be connected to the streak tracker component in a real app)
  const addPrefilledHabit = (habit: any) => {
    console.log("Adding prefilled habit:", habit);
    // In a real app, this would trigger the add habit dialog in the streak tracker with pre-filled values
  };

  return (
    <Card className="overflow-hidden">
      {/* Quick Add Habits Section */}
      <div className="border-b">
        <div className="px-4 py-3 bg-muted/40 flex justify-between items-center">
          <h3 className="font-medium text-sm flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-primary" />
            Quick Add Habits
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => setShowQuickAdd(!showQuickAdd)}
          >
            {showQuickAdd ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {showQuickAdd && (
          <div className="p-3 grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto">
            {quickAddHabits.map((habit, index) => (
              <div 
                key={index}
                className="flex items-center p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group border border-border/40"
                onClick={() => addPrefilledHabit(habit)}
              >
                <div className="mr-3 bg-primary/10 p-1.5 rounded-md text-primary">
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{habit.title}</h4>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5 items-center">
                    <span>{habit.timeCommitment}</span>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 px-1.5 border-primary/20 bg-primary/5">
                      ROI: {(habit.impact / habit.effort * 10).toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    
      {/* Daily Motivation Section */}
      <CardHeader className="pb-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Quote className="h-5 w-5 text-amber-400" />
            Daily Motivation
          </CardTitle>
          
          {content?.audioUrl && (
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white" 
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        {!loading && content && (
          <CardDescription className="text-gray-300">
            {content.title}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-0">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="bg-gray-700 h-4 rounded w-4/5"></div>
            <div className="bg-gray-700 h-4 rounded w-full"></div>
            <div className="bg-gray-700 h-4 rounded w-3/4"></div>
          </div>
        ) : content ? (
          <blockquote className="border-l-4 border-amber-500 pl-4 italic text-lg">
            {content.content}
          </blockquote>
        ) : (
          <p className="text-gray-400 text-center">No motivational content available today.</p>
        )}
      </CardContent>
      
      {!loading && content && (
        <CardFooter className="pt-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="text-sm text-gray-300">
            — {content.author}{content.source ? `, ${content.source}` : ''}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}