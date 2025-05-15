import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getHabitRecommendations } from "@/lib/ai-insights";
import type { Habit } from "@/types/habit";
import { 
  RefreshCw, 
  Plus, 
  Lightbulb,
  PlusCircle,
  Check
} from "lucide-react";

interface HabitRecommendationProps {
  habits: Habit[];
  onAddRecommendation: (recommendation: Partial<Habit>) => void;
}

export function HabitRecommendations({ habits, onAddRecommendation }: HabitRecommendationProps) {
  const [recommendations, setRecommendations] = useState<Array<{ 
    title: string;
    description: string;
    category: string;
    impact: number;
    wasAdded?: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, [habits]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const recs = await getHabitRecommendations(habits);
      setRecommendations(recs);
    } catch (e) {
      console.error("Error generating habit recommendations:", e);
      setError("Couldn't generate recommendations. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to generate habit recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = (rec: any, index: number) => {
    // Create habit object from recommendation
    const newHabit: Partial<Habit> = {
      title: rec.title,
      description: rec.description,
      category: rec.category as any, // Convert to proper category type
      impact: rec.impact,
      // Default values for remaining fields
      icon: getDefaultIconForCategory(rec.category),
      iconColor: getDefaultColorForCategory(rec.category),
      effort: 5, // Medium effort by default
      timeCommitment: "5-10 min",
      frequency: "daily",
      isAbsolute: false,
    };
    
    // Call the parent handler
    onAddRecommendation(newHabit);
    
    // Mark as added in the UI
    const updatedRecs = [...recommendations];
    updatedRecs[index] = { ...updatedRecs[index], wasAdded: true };
    setRecommendations(updatedRecs);
    
    toast({
      title: "Habit Added",
      description: `"${rec.title}" has been added to your habits.`,
    });
  };

  const getDefaultIconForCategory = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'health':
        return 'heart';
      case 'fitness':
        return 'dumbbell';
      case 'mind':
        return 'brain';
      case 'social':
        return 'users';
      default:
        return 'check-circle';
    }
  };
  
  const getDefaultColorForCategory = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'health':
        return '#10b981'; // Green
      case 'fitness':
        return '#3b82f6'; // Blue
      case 'mind':
        return '#8b5cf6'; // Purple
      case 'social':
        return '#f59e0b'; // Amber
      default:
        return '#6b7280'; // Gray
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-56" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Habit Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions for new habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>{error}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={loadRecommendations} className="w-full" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              AI Habit Recommendations
            </CardTitle>
            <CardDescription>
              Personalized habit suggestions to improve your results
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadRecommendations}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recommendations available</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div key={index} className="border rounded-lg p-4 relative">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <Badge className="w-fit">
                  {rec.category}
                </Badge>
                
                <div className="flex-1">
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <div className="text-xs text-muted-foreground">
                      Impact: <span className="font-medium">{rec.impact}/10</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-0">
                  {rec.wasAdded ? (
                    <Button variant="outline" disabled className="h-9 text-xs sm:text-sm gap-1.5">
                      <Check className="h-4 w-4" />
                      Added
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleAddRecommendation(rec, index)} 
                      size="sm"
                      className="h-9 text-xs sm:text-sm gap-1.5"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Habit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
      
      <CardFooter>
        <div className="text-xs text-muted-foreground w-full text-center">
          Recommendations based on your habit patterns and scientific research
        </div>
      </CardFooter>
    </Card>
  );
}