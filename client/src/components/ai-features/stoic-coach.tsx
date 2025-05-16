import { useState } from 'react';
import { Sparkles, Quote, RefreshCw } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Habit } from '@/types/habit';

interface StoicCoachProps {
  habits: Habit[];
  completions: any[];
  streaks: Record<string, number>;
}

// Stoic quotes for encouragement
const STOIC_QUOTES = [
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    quote: "The obstacle is the way.",
    author: "Marcus Aurelius"
  },
  {
    quote: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus"
  },
  {
    quote: "He who fears death will never do anything worthy of a man who is alive.",
    author: "Seneca"
  },
  {
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius"
  },
  {
    quote: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius"
  },
  {
    quote: "If it is not right, do not do it, if it is not true, do not say it.",
    author: "Marcus Aurelius"
  },
  {
    quote: "He who is brave is free.",
    author: "Seneca"
  },
  {
    quote: "Man is disturbed not by things, but by the views he takes of them.",
    author: "Epictetus"
  },
  {
    quote: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius"
  }
];

// Quotes from Jocko Willink's "Discipline Equals Freedom"
const DISCIPLINE_QUOTES = [
  {
    quote: "Discipline equals freedom.",
    author: "Jocko Willink"
  },
  {
    quote: "Don't expect to be motivated every day to get out there and make things happen. You won't be. Don't count on motivation. Count on discipline.",
    author: "Jocko Willink"
  },
  {
    quote: "The temptation to take the easy road is always there. It is as easy as staying in bed in the morning and sleeping in. But discipline is paramount to ultimate success.",
    author: "Jocko Willink"
  },
  {
    quote: "If you want to be better, truly better, you have to put in the work.",
    author: "Jocko Willink"
  },
  {
    quote: "Waking up early was the first example I noticed in the SEAL Teams in which discipline was really the difference between being good and being exceptional.",
    author: "Jocko Willink"
  },
  {
    quote: "It's not about having time, it's about making time.",
    author: "Jocko Willink"
  },
  {
    quote: "When you think you can't take anymore – take more.",
    author: "Jocko Willink"
  },
  {
    quote: "Don't let your mind control you. Control your mind.",
    author: "Jocko Willink"
  },
  {
    quote: "There are no hacks. There are no shortcuts. There's only one way: Hard work that never ends.",
    author: "Jocko Willink"
  },
  {
    quote: "Don't fight stress. Embrace it. Turn it on itself. Use it to make yourself sharper and more alert. Use it to make you think and learn and get better and smarter and more effective.",
    author: "Jocko Willink"
  }
];

// Reframes for missed habits
const STOIC_REFRAMES = [
  "Remember that missing a habit is not a reflection of your character, but an opportunity to practice resilience.",
  "Every missed day is data, not failure. Use it to understand your obstacles better.",
  "The path to mastery includes setbacks. A Stoic uses these moments to strengthen resolve.",
  "What matters is not that you missed your habit, but how you respond to this moment now.",
  "Consider what you can control: not yesterday's miss, but today's action.",
  "A temporary setback does not define your journey unless you allow it to.",
  "The obstacle becomes the way. What can this missed habit teach you?",
  "Find the lesson in the setback - perhaps there is a pattern to address.",
  "Remember that consistency, not perfection, is the goal.",
  "Use this moment to reflect: was this habit truly aligned with your values?",
  "A Stoic views each setback as training for resilience.",
  "The struggle itself is valuable - it strengthens your will for the next attempt."
];

// Encouragements for successful streaks
const STREAK_ENCOURAGEMENTS = [
  "Your consistent practice is building not just habits, but character.",
  "This streak represents your commitment to your own growth. Well done.",
  "A Stoic values the process, and your process is strong.",
  "Each day of your streak represents a victory of will over impulse.",
  "Your discipline is becoming freedom, just as the Stoics taught.",
  "The daily choice to continue this habit reveals your inner strength.",
  "Remember that this streak's value lies not in numbers, but in the person you're becoming.",
  "You're proving that consistency compounds into excellence.",
  "Excellent habits lead to an excellent life - you're on the path.",
  "Your streak is evidence of your ability to honor commitments to yourself."
];

export function StoicCoach({ habits, completions, streaks }: StoicCoachProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [quote, setQuote] = useState<{quote: string, author: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Find habits with good streaks to encourage
  const getStreakEncouragement = () => {
    // Find habits with streaks of 3 or more
    const goodStreakHabits = habits.filter(h => streaks[h.id] >= 3);
    
    if (goodStreakHabits.length > 0) {
      // Pick a random habit with a good streak
      const randomHabit = goodStreakHabits[Math.floor(Math.random() * goodStreakHabits.length)];
      const encouragement = STREAK_ENCOURAGEMENTS[Math.floor(Math.random() * STREAK_ENCOURAGEMENTS.length)];
      
      return `${randomHabit.title} - ${streaks[randomHabit.id]} day streak: ${encouragement}`;
    }
    
    return null;
  };
  
  // Find missed habits to reframe
  const getMissedHabitReframe = () => {
    // Find habits that were missed recently (this is a simplification - would be based on actual completion data)
    const missedHabits = habits.filter(habit => {
      const today = new Date();
      const habitCompletions = completions.filter(c => c.habitId === habit.id);
      return habitCompletions.length === 0 || 
             !habitCompletions.some(c => new Date(c.date).toDateString() === today.toDateString());
    });
    
    if (missedHabits.length > 0) {
      // Pick a random missed habit
      const randomMissedHabit = missedHabits[Math.floor(Math.random() * missedHabits.length)];
      const reframe = STOIC_REFRAMES[Math.floor(Math.random() * STOIC_REFRAMES.length)];
      
      return `${randomMissedHabit.title}: ${reframe}`;
    }
    
    return null;
  };
  
  // Get random quote
  const getRandomQuote = () => {
    const allQuotes = [...STOIC_QUOTES, ...DISCIPLINE_QUOTES];
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
  };

  const generateFeedback = () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // First try to give streak encouragement
      const streakMessage = getStreakEncouragement();
      
      // If no streak to encourage, try to reframe a missed habit
      const reframeMessage = getMissedHabitReframe();
      
      // Set the message
      setMessage(streakMessage || reframeMessage || "Focus on today's habits. What one small action would move you forward?");
      
      // Always provide a quote
      setQuote(getRandomQuote());
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="border border-indigo-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg">Stoic Coach</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={generateFeedback}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Thinking...' : 'Get Insight'}
          </Button>
        </div>
        <CardDescription>
          Personalized Stoic wisdom for your habit journey
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        {message ? (
          <div className="space-y-4">
            <p className="text-gray-700">{message}</p>
            
            {quote && (
              <>
                <Separator />
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <Quote className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 italic mb-1">{quote.quote}</p>
                      <p className="text-sm text-gray-500">— {quote.author}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Click "Get Insight" for personalized Stoic coaching based on your habits and progress.
          </div>
        )}
      </CardContent>
    </Card>
  );
}