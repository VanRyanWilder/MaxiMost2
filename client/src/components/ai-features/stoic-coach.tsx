import React, { useState } from 'react';
import { Habit, HabitCompletion } from '@/types/habit';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedHabitIcon } from '@/components/ui/enhanced-habit-icon';
import { Leaf, RefreshCcw, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface StoicCoachProps {
  habits: Habit[];
  completions: HabitCompletion[];
  streaks: Record<string, number>;
}

// Collection of stoic quotes
const STOIC_QUOTES = [
  {
    quote: "You have power over your mind — not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    quote: "The key is to keep company only with people who uplift you, whose presence calls forth your best.",
    author: "Epictetus"
  },
  {
    quote: "He who fears death will never do anything worthy of a living man.",
    author: "Seneca"
  },
  {
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius"
  },
  {
    quote: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus"
  },
  {
    quote: "No man is free who is not master of himself.",
    author: "Epictetus"
  },
  {
    quote: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus"
  },
  {
    quote: "If it is not right, do not do it, if it is not true, do not say it.",
    author: "Marcus Aurelius"
  },
  {
    quote: "Begin at once to live, and count each separate day as a separate life.",
    author: "Seneca"
  },
  {
    quote: "He who is brave is free.",
    author: "Seneca"
  },
  {
    quote: "The obstacle is the way.",
    author: "Marcus Aurelius"
  },
  {
    quote: "You become what you give your attention to.",
    author: "Epictetus"
  }
];

// Personalized stoic advice based on habit streaks and consistency
const getPersonalizedAdvice = (habit: Habit, streak: number) => {
  if (streak >= 10) {
    return {
      message: `Excellent consistency with your "${habit.title}" habit. Remember, true progress comes not from the outcome but from the dedicated practice itself. Each day you maintain this habit builds your inner citadel of discipline.`,
      type: 'success'
    };
  } else if (streak >= 5) {
    return {
      message: `Good progress with your "${habit.title}" habit. The path to excellence is not always linear. Focus on the process, not the result, and maintain your daily commitment regardless of external circumstances.`,
      type: 'success'
    };
  } else if (streak >= 2) {
    return {
      message: `You've begun your journey with "${habit.title}". Remember that consistency matters more than intensity. Fate leads the willing and drags the unwilling - choose to embrace this habit willingly each day.`,
      type: 'neutral'
    };
  } else {
    return {
      message: `Consider what obstacles are preventing consistency with "${habit.title}". Are these obstacles within your control or outside it? Focus energy only on what you can change, and remember that struggle is where growth happens.`,
      type: 'challenge'
    };
  }
};

// Stoic reframing of common obstacles
const getObstacleReframing = (habit: Habit) => {
  const obstacles = {
    physical: [
      "Pain is temporary, but the knowledge that you pushed through it lasts forever.",
      "The body will only protest until it adapts. Every discomfort today makes tomorrow easier.",
      "The strength you seek comes precisely from overcoming the resistance you feel now."
    ],
    nutrition: [
      "Each food choice is a vote for the person you wish to become.",
      "Temporary pleasure from poor food choices creates permanent obstacles to your goals.",
      "Self-control in eating is mastery over one of life's strongest primal urges."
    ],
    sleep: [
      "Quality sleep is not luxury but necessity—it is the foundation upon which your day's virtue is built.",
      "Screen temptations before bed are tests of character. Choose wisely.",
      "The discipline to maintain consistent sleep patterns shows mastery over modern life's chaos."
    ],
    mental: [
      "The mind becomes what it consistently focuses on. Guard your attention as your most precious resource.",
      "Mental strength comes from deliberate practice and repeated challenges, not from comfort.",
      "Your thoughts create your reality—cultivate them with the same care as a garden."
    ],
    relationships: [
      "True connection requires presence. Be fully where you are, with whom you're with.",
      "The quality of your relationships reflects the quality of your communication and presence.",
      "Social connections are not distractions from your path but essential parts of your humanity."
    ],
    financial: [
      "Wealth is not in having many possessions, but in having few needs.",
      "Financial freedom comes not from abundance, but from reasonable desires.",
      "Each purchase is a statement about what you value. Ensure your spending aligns with your principles."
    ]
  };

  // Get relevant obstacle reframing based on habit category
  const category = (habit.category || 'physical') as keyof typeof obstacles;
  const relevantObstacles = obstacles[category] || obstacles.physical;
  
  // Pick a random obstacle reframing
  return relevantObstacles[Math.floor(Math.random() * relevantObstacles.length)];
};

export function StoicCoach({ habits, completions, streaks }: StoicCoachProps) {
  const [randomQuoteIndex, setRandomQuoteIndex] = useState(
    Math.floor(Math.random() * STOIC_QUOTES.length)
  );

  // Get a new random quote
  const refreshQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * STOIC_QUOTES.length);
    } while (newIndex === randomQuoteIndex);
    setRandomQuoteIndex(newIndex);
  };

  // Get habits with their streaks, sorted by streak
  const habitsWithStreaks = habits
    .map(habit => ({
      habit,
      streak: streaks[habit.id] || 0
    }))
    .sort((a, b) => b.streak - a.streak);

  // Get overall consistency score based on completion ratio
  const calculateConsistencyScore = () => {
    if (!habits.length || !completions.length) return 0;
    
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const possibleCompletions = habits.length * 7;
    const actualCompletions = completions.filter(c => 
      last7Days.includes(c.date.split('T')[0]) && c.completed
    ).length;
    
    return Math.round((actualCompletions / possibleCompletions) * 100);
  };

  const consistencyScore = calculateConsistencyScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-green-500" />
        <h2 className="text-xl font-semibold">Stoic Coach</h2>
      </div>
      
      <Alert>
        <AlertDescription>
          Receive personalized stoic wisdom and reframing based on your habit progress and challenges.
        </AlertDescription>
      </Alert>
      
      {/* Inspirational Quote Card */}
      <Card className="overflow-hidden border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Quote className="h-5 w-5 text-amber-500" />
              Stoic Wisdom
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshQuote} 
              className="h-8 w-8 p-0"
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Refresh quote</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <p className="text-lg italic font-serif">"{STOIC_QUOTES[randomQuoteIndex].quote}"</p>
          <p className="text-right text-sm text-muted-foreground mt-2">— {STOIC_QUOTES[randomQuoteIndex].author}</p>
        </CardContent>
      </Card>
      
      {/* Overall Consistency Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Overall Consistency</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Past 7 days</span>
              <span className="font-medium">{consistencyScore}%</span>
            </div>
            <Progress value={consistencyScore} className="h-2" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {consistencyScore >= 80 
              ? "Excellent discipline. Remember that virtue is its own reward." 
              : consistencyScore >= 50 
                ? "Good progress. The obstacle is the way forward."
                : "Focus on small, consistent steps. How we do anything is how we do everything."}
          </p>
        </CardContent>
      </Card>
      
      {/* Personalized Habit Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habitsWithStreaks.slice(0, 4).map(({ habit, streak }) => {
          const advice = getPersonalizedAdvice(habit, streak);
          const obstacleReframing = getObstacleReframing(habit);
          
          return (
            <Card key={habit.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <EnhancedHabitIcon 
                    icon={habit.icon} 
                    color={habit.iconColor}
                    size="sm" 
                  />
                  <CardTitle className="text-base">{habit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Current streak</span>
                  <span className={`font-medium ${
                    streak >= 10 ? 'text-green-600' : 
                    streak >= 5 ? 'text-blue-600' : 
                    'text-muted-foreground'
                  }`}>{streak} days</span>
                </div>
                
                <p className={`text-sm mt-2 p-2 rounded-md ${
                  advice.type === 'success' ? 'bg-green-50 text-green-900' :
                  advice.type === 'challenge' ? 'bg-amber-50 text-amber-900' :
                  'bg-blue-50 text-blue-900'
                }`}>
                  {advice.message}
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <p className="text-xs text-muted-foreground border-t pt-2 italic">
                  <span className="font-medium">Obstacle reframing:</span> {obstacleReframing}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}