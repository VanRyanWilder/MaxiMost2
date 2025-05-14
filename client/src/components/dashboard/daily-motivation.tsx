import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeX, Volume2, Quote } from "lucide-react";

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

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <CardHeader className="pb-2">
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
      
      <CardContent>
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
        <CardFooter className="pt-1">
          <div className="text-sm text-gray-300">
            — {content.author}{content.source ? `, ${content.source}` : ''}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}