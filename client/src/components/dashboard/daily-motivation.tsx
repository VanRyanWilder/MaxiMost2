import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from 'lucide-react';

interface DailyMotivationProps {
  quote?: string;
  author?: string;
}

export function DailyMotivation({ 
  quote = "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.",
  author = "Mark Twain"
}: DailyMotivationProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="italic text-sm text-muted-foreground">
          "{quote}"
        </blockquote>
        <p className="text-xs mt-2 text-right font-medium">- {author}</p>
      </CardContent>
    </Card>
  );
}