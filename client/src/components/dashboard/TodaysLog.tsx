import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, PencilLine, Zap } from 'lucide-react';
import { Link } from 'wouter';

// Placeholder for fetching/storing journal entries
// In a real app, this would come from a context, Zustand, or API call
const getJournalEntryForDate = (date: Date): string | null => {
  // For now, return a mock entry for demonstration if it's today, otherwise null
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    // return "Feeling great today, worked on the MaxiMost project and made good progress. Remembered to take a break and stretch. Had a healthy lunch. Looking forward to the evening run.";
    return null; // Start with no entry to show the prompt
  }
  return null;
};

export const TodaysLog: React.FC = () => {
  const [entrySnippet, setEntrySnippet] = useState<string | null>(null);
  const [fullEntryExists, setFullEntryExists] = useState<boolean>(false);
  const currentDate = new Date();

  useEffect(() => {
    // Simulate fetching journal entry
    const fetchedEntry = getJournalEntryForDate(currentDate);
    if (fetchedEntry) {
      setFullEntryExists(true);
      // Create a snippet (e.g., first 100 characters)
      setEntrySnippet(fetchedEntry.substring(0, 100) + (fetchedEntry.length > 100 ? "..." : ""));
    } else {
      setFullEntryExists(false);
      setEntrySnippet(null);
    }
  }, [currentDate]);

  // Static Daily Spark content (from DailyMotivation.tsx defaults)
  const dailySpark = {
    quote: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.",
    author: "Mark Twain"
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-xl font-semibold flex items-center tracking-tight">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          Daily Spark of Wisdom
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <blockquote className="text-base italic leading-relaxed text-foreground">
          "{dailySpark.quote}"
        </blockquote>
        <p className="text-sm mt-3 text-right font-medium text-muted-foreground">- {dailySpark.author}</p>
      </CardContent>

      <div className="border-t my-0"></div> {/* Separator */}

      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BookText className="h-5 w-5 mr-2 text-indigo-500" />
          Today's Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {entrySnippet ? (
          <p className="text-sm text-muted-foreground italic whitespace-pre-wrap">
            "{entrySnippet}"
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No journal entry for today. What's on your mind?
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/journal">
          <Button variant="outline" className="w-full">
            <PencilLine className="mr-2 h-4 w-4" />
            {fullEntryExists ? 'View or Edit Journal' : 'Write in Journal'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
