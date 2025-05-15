import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeX, Volume2, Quote, ChevronDown, ChevronUp, Plus, BookOpen, Droplets, Brain, Dumbbell, Heart, Users, Sun, Layers, CheckCircle } from "lucide-react";
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
  const [showHabitStacks, setShowHabitStacks] = useState(true);

  // Mock motivational content rotation - in a real app, this would come from your API
  const motivationalContents: MotivationalContent[] = [
    {
      id: 1,
      title: "The Obstacle Is The Way",
      content: "The impediment to action advances action. What stands in the way becomes the way. Our actions may be impeded, but there can be no impeding our intentions or dispositions. Because we can accommodate and adapt. The mind adapts and converts to its own purposes the obstacle to our acting.",
      author: "Marcus Aurelius",
      source: "Meditations",
      audioUrl: undefined,
    },
    {
      id: 2,
      title: "Discipline Equals Freedom",
      content: "The more you sweat in training, the less you bleed in combat. The more disciplined your daily habits, the more freedom you'll have to pursue your goals without constraint. Your discipline today creates your freedom tomorrow.",
      author: "Jocko Willink",
      source: "Discipline Equals Freedom",
      audioUrl: undefined,
    },
    {
      id: 3,
      title: "The 1% Rule",
      content: "Improvement isn't about radical change. It's about small improvements consistently applied. Getting 1% better each day compounds to remarkable results over time. Today's action, however small, determines tomorrow's outcome.",
      author: "James Clear",
      source: "Atomic Habits",
      audioUrl: undefined,
    },
    {
      id: 4,
      title: "Memento Mori",
      content: "Remember that you will die. Let this truth be a constant reminder to focus on what truly matters. Don't postpone the meaningful life you could live today for a tomorrow that isn't guaranteed. Use your finite time with wisdom and purpose.",
      author: "Marcus Aurelius",
      source: "Meditations",
      audioUrl: undefined,
    },
    {
      id: 5,
      title: "The Cookie Jar Method",
      content: "When facing your greatest challenges, remember and draw strength from your past victories. Pull out those tough moments you've already conquered from your mental cookie jar. You've overcome difficulty before, and you will do it again.",
      author: "David Goggins",
      source: "Can't Hurt Me",
      audioUrl: undefined,
    }
  ];
  
  // Select a random piece of content based on the day
  const todayIndex = new Date().getDate() % motivationalContents.length;
  const mockContent = motivationalContents[todayIndex];

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
    // Basic hygiene habits
    {
      title: "Brush Teeth",
      description: "Brush teeth at least twice daily for dental health and fresh breath.",
      icon: <Heart className="h-4 w-4" />,
      impact: 7,
      effort: 1,
      timeCommitment: "2 min",
      frequency: "daily",
      category: "health",
      isAbsolute: true
    },
    {
      title: "Wash Face",
      description: "Cleanse your face in the morning and evening for skin health and hygiene.",
      icon: <Droplets className="h-4 w-4" />,
      impact: 6,
      effort: 1,
      timeCommitment: "1 min",
      frequency: "daily",
      category: "health",
      isAbsolute: true
    },
    {
      title: "Make Bed",
      description: "Start your day with a small accomplishment that sets the tone for productivity.",
      icon: <Sun className="h-4 w-4" />,
      impact: 5,
      effort: 1,
      timeCommitment: "1 min",
      frequency: "daily",
      category: "health",
      isAbsolute: true
    },
    
    // Other high-impact habits
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

  // Habit stacks (morning routines from experts)
  const habitStacks = [
    {
      name: "Huberman Morning Stack",
      description: "Andrew Huberman's science-based morning routine",
      icon: <Brain className="h-4 w-4" />,
      habits: [
        {
          title: "Morning Sunlight",
          description: "Get 2-10 minutes of morning sunlight exposure within 30-60 minutes of waking",
          icon: <Sun className="h-4 w-4" />,
          impact: 9,
          effort: 1,
          timeCommitment: "5 min",
          frequency: "daily",
          category: "health",
          isAbsolute: true
        },
        {
          title: "Delay Caffeine",
          description: "Wait 90-120 minutes after waking before consuming caffeine",
          icon: <CheckCircle className="h-4 w-4" />,
          impact: 7,
          effort: 3,
          timeCommitment: "0 min",
          frequency: "daily",
          category: "health",
          isAbsolute: true
        },
        {
          title: "Cold Exposure",
          description: "Brief cold exposure via shower or cold plunge",
          icon: <Droplets className="h-4 w-4" />,
          impact: 8,
          effort: 6,
          timeCommitment: "2 min",
          frequency: "daily",
          category: "health"
        }
      ]
    },
    {
      name: "Goggins Morning Stack",
      description: "David Goggins' discipline-focused morning routine",
      icon: <Dumbbell className="h-4 w-4" />,
      habits: [
        {
          title: "Early Wake-Up",
          description: "Wake up at 4:30-5:00 AM",
          icon: <Sun className="h-4 w-4" />,
          impact: 8,
          effort: 8,
          timeCommitment: "0 min",
          frequency: "daily",
          category: "mind",
          isAbsolute: true
        },
        {
          title: "Running",
          description: "Morning run (3-10 miles)",
          icon: <Dumbbell className="h-4 w-4" />,
          impact: 9,
          effort: 9,
          timeCommitment: "30-60 min",
          frequency: "daily",
          category: "fitness"
        },
        {
          title: "Push-ups/Pull-ups",
          description: "Complete morning calisthenics set",
          icon: <Dumbbell className="h-4 w-4" />,
          impact: 8,
          effort: 7,
          timeCommitment: "15 min",
          frequency: "daily",
          category: "fitness"
        }
      ]
    },
    {
      name: "Jocko Morning Stack",
      description: "Jocko Willink's discipline-equals-freedom routine",
      icon: <CheckCircle className="h-4 w-4" />,
      habits: [
        {
          title: "4:30 AM Wake-Up",
          description: "Wake up at 4:30 AM for early start advantage",
          icon: <Sun className="h-4 w-4" />,
          impact: 8,
          effort: 8,
          timeCommitment: "0 min",
          frequency: "daily",
          category: "mind",
          isAbsolute: true
        },
        {
          title: "Workout",
          description: "Intense morning workout (weight training or calisthenics)",
          icon: <Dumbbell className="h-4 w-4" />,
          impact: 9,
          effort: 7,
          timeCommitment: "45-60 min",
          frequency: "daily",
          category: "fitness"
        },
        {
          title: "Strategic Planning",
          description: "Plan your day with strategic priorities",
          icon: <BookOpen className="h-4 w-4" />,
          impact: 8,
          effort: 3,
          timeCommitment: "10 min",
          frequency: "daily",
          category: "mind"
        }
      ]
    }
  ];

  // Function to handle adding a pre-filled habit
  const addPrefilledHabit = (habit: any) => {
    console.log("Adding prefilled habit:", habit);
    // In a real app, this would trigger the add habit dialog in the streak tracker with pre-filled values
    
    // Create a custom event to pass the habit data to the streak tracker
    const event = new CustomEvent('add-prefilled-habit', { 
      detail: habit,
      bubbles: true 
    });
    document.dispatchEvent(event);
  };
  
  // Function to add a whole habit stack directly
  const addHabitStack = (stack: any) => {
    console.log("Adding habit stack:", stack);
    
    // Create an array of properly formatted habit objects with unique IDs for each
    const timestamp = Date.now();
    const formattedHabits = stack.habits.map((habit: any, index: number) => ({
      id: `h-${timestamp}-${index}`,
      title: habit.title,
      description: habit.description,
      icon: typeof habit.icon === 'object' ? habit.icon.type.name.toLowerCase() : 'zap',
      impact: habit.impact || 8,
      effort: habit.effort || 3,
      timeCommitment: habit.timeCommitment || '10 min',
      frequency: habit.frequency || 'daily',
      isAbsolute: habit.isAbsolute || false,
      category: habit.category || 'health',
      streak: 0,
      createdAt: new Date()
    }));
    
    console.log(`Created ${formattedHabits.length} habits for ${stack.name} stack`, formattedHabits);
    
    // Directly dispatch the event with the full habit data
    const event = new CustomEvent('add-habit-stack', { 
      detail: {
        stackName: stack.name,
        habits: formattedHabits
      },
      bubbles: true 
    });
    document.dispatchEvent(event);
    
    // Also set the window property as a fallback for the manual method
    (window as any).addStackHabits = formattedHabits;
    
    // Dispatch the manual event as a backup method
    const manualEvent = new CustomEvent('add-manual-habit-stack', { 
      detail: stack.name,
      bubbles: true 
    });
    document.dispatchEvent(manualEvent);
    
    // Show confirmation
    alert(`Added ${stack.name} with ${stack.habits.length} habits!`);
  };

  return (
    <Card className="overflow-hidden">
    
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