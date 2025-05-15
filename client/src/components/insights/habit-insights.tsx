import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpCircle, 
  RefreshCw, 
  BarChart3,
  TrendingUp,
  Zap,
  Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HabitInsight, HabitAnalysis, generateHabitInsights } from "@/lib/ai-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Habit, HabitCompletion } from "@/types/habit";

interface HabitInsightsProps {
  habits: Habit[];
  completions: HabitCompletion[];
  timeframe?: 'week' | 'month';
}

export function HabitInsights({ habits, completions, timeframe = 'week' }: HabitInsightsProps) {
  const [insights, setInsights] = useState<HabitAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load insights on initial render or when habits change
  useEffect(() => {
    if (habits.length === 0) return;
    loadInsights();
  }, [habits, completions, timeframe]);

  const loadInsights = async () => {
    if (habits.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await generateHabitInsights(habits, completions, timeframe);
      setInsights(analysis);
    } catch (e) {
      console.error("Error generating insights:", e);
      setError("Couldn't generate insights. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to generate habit insights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'tip':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'suggestion':
        return <ArrowUpCircle className="h-5 w-5 text-indigo-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  if (habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Habit Insights</CardTitle>
          <CardDescription>
            Add some habits to get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No habits to analyze yet</p>
            <p className="text-sm mt-1">Add habits to receive AI-powered insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-28" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Habit Insights</CardTitle>
          <CardDescription>
            Analysis of your habit performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500 mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={loadInsights} className="w-full" variant="outline">
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
              AI Habit Insights
              <Badge variant="outline" className={insights?.overallScore && insights.overallScore > 70 ? "bg-green-100 text-green-800 border-green-500" : ""}>
                Score: {insights?.overallScore || 0}/100
              </Badge>
            </CardTitle>
            <CardDescription>
              Your {timeframe === 'week' ? 'weekly' : 'monthly'} habit performance analysis
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadInsights}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Overall progress</span>
            </div>
            <span className="font-medium">{insights?.overallScore || 0}%</span>
          </div>
          <Progress value={insights?.overallScore || 0} className="h-2" />
        </div>
        
        {/* Insights */}
        <div className="space-y-4">
          {insights?.insights.map((insight: HabitInsight, i: number) => (
            <div key={i} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                  
                  {insight.habitIds && insight.habitIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {insight.habitIds.map((habitId) => {
                        const habit = habits.find(h => h.id === habitId);
                        return habit && (
                          <Badge key={habitId} variant="outline" className="text-xs">
                            {habit.title}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Areas of Strength
            </h3>
            <ul className="text-sm space-y-1.5">
              {insights?.strengthAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-muted-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Areas for Improvement
            </h3>
            <ul className="text-sm space-y-1.5">
              {insights?.improvementAreas.map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-indigo-500 mt-0.5" />
                  <span className="text-muted-foreground">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Recommendation */}
        {insights?.recommendation && (
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Key Recommendation</h4>
                <p className="text-sm text-muted-foreground">{insights.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <div className="text-xs text-muted-foreground w-full text-center">
          Insights generated by AI based on your habit data
        </div>
      </CardFooter>
    </Card>
  );
}