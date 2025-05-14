import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  RefreshCw, 
  Award, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  Quote, 
  BookOpen,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/context/user-context";
import { generateMotivationalContent } from "@/lib/gemini";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AIMotivationalCompanionProps {
  className?: string;
}

export function AIMotivationalCompanion({ className }: AIMotivationalCompanionProps) {
  const { user } = useUser();
  const [content, setContent] = useState<{
    headline: string;
    message: string;
    advice: string;
    quote: string;
    author: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [customization, setCustomization] = useState({
    style: "stoic",
    topics: ["mindset", "habits", "discipline"],
    figures: ["Marcus Aurelius", "James Clear", "David Goggins"]
  });

  const getMotivationalContent = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      // Mock progress data - in a real application this would come from the user's actual metrics
      const recentProgress = [
        {
          metric: "Workouts",
          value: 4,
          trend: "up" as const
        },
        {
          metric: "Meditation",
          value: 10,
          trend: "stable" as const
        },
        {
          metric: "Sleep Quality",
          value: 7.5,
          trend: "down" as const
        }
      ];

      const result = await generateMotivationalContent({
        username: user.name,
        goals: ["Build muscle", "Reduce stress", "Improve sleep quality"],
        struggles: ["Consistency with workouts", "Managing evening screen time"],
        preferences: {
          motivationalStyle: customization.style,
          authors: customization.figures,
          topics: customization.topics
        },
        recentProgress
      });

      if (result) {
        setContent(result);
      } else {
        setError("Could not generate motivational content. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching motivational content:", err);
      setError("An error occurred while generating your motivation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Log that we're attempting to get content
      console.log("Attempting to get motivational content...");
      getMotivationalContent();
    }
  }, [user, customization]);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    // In a real app, we would send this feedback to an API to improve the AI over time
    toast({
      title: type === "positive" ? "Thanks for the positive feedback!" : "Thanks for your feedback",
      description: type === "positive" 
        ? "We're glad you found this motivational content helpful." 
        : "We'll use your feedback to improve future motivational content.",
      duration: 3000
    });
  };

  const styles = [
    { id: "stoic", name: "Stoic" },
    { id: "energetic", name: "Energetic" },
    { id: "philosophical", name: "Philosophical" },
    { id: "practical", name: "Practical" },
    { id: "scientific", name: "Scientific" }
  ];

  // Create a fallback motivational message in case the API doesn't work
  const fallbackContent = {
    headline: "Your Daily Dose of Motivation",
    message: "Every day presents a new opportunity to become the best version of yourself. Remember, consistency is key - small actions performed daily lead to remarkable transformations over time.",
    advice: "Focus on establishing one small positive habit today that you can build upon tomorrow.",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-lg">AI Motivational Companion</CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          Personalized motivation based on your progress and goals
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-3/4 rounded" />
            </div>
            <Skeleton className="h-24 w-full rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold mb-2 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {fallbackContent.headline}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {fallbackContent.message}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <Award className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{fallbackContent.advice}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Separator className="my-2" />
              <div className="flex items-start gap-2">
                <Quote className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="italic text-gray-600">"{fallbackContent.quote}"</p>
                  <p className="text-right text-sm text-gray-500 mt-1">— {fallbackContent.author}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-amber-600 text-sm mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                {error || "Gemini AI is currently unavailable."}
              </p>
              <Button 
                variant="outline" 
                onClick={getMotivationalContent}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        ) : content ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold mb-2 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {content.headline}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {content.message}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <Award className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{content.advice}</p>
              </div>
            </div>
            
            {content.quote && (
              <div className="pt-2">
                <Separator className="my-2" />
                <div className="flex items-start gap-2">
                  <Quote className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="italic text-gray-600">"{content.quote}"</p>
                    {content.author && (
                      <p className="text-right text-sm text-gray-500 mt-1">— {content.author}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold mb-2 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {fallbackContent.headline}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {fallbackContent.message}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <Award className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{fallbackContent.advice}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Separator className="my-2" />
              <div className="flex items-start gap-2">
                <Quote className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="italic text-gray-600">"{fallbackContent.quote}"</p>
                  <p className="text-right text-sm text-gray-500 mt-1">— {fallbackContent.author}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={getMotivationalContent}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" /> Try with AI
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {(content || !loading) && (
        <CardFooter className="flex-col border-t bg-gray-50/50 px-6 py-4">
          <div className="flex items-center justify-between w-full mb-3">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-1 ${feedback === "positive" ? "bg-green-100 text-green-700" : ""}`}
                onClick={() => handleFeedback("positive")}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:inline-block text-xs">Helpful</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-1 ${feedback === "negative" ? "bg-red-100 text-red-700" : ""}`}
                onClick={() => handleFeedback("negative")}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:inline-block text-xs">Not Helpful</span>
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-xs"
              onClick={getMotivationalContent}
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
          </div>
          
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-2">Customize your motivation style:</p>
            <div className="flex flex-wrap gap-1.5">
              {styles.map(style => (
                <Badge 
                  key={style.id}
                  variant={customization.style === style.id ? "default" : "outline"}
                  className={`cursor-pointer ${customization.style === style.id ? "" : "hover:bg-gray-100"}`}
                  onClick={() => setCustomization({...customization, style: style.id})}
                >
                  {style.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}