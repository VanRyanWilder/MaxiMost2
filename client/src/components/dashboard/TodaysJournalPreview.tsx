import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, PencilLine } from 'lucide-react'; // BookText for journal icon
import { Link } from 'wouter'; // Or your preferred routing library

interface TodaysJournalPreviewProps {
  // For now, we'll use a simple string for the preview.
  // In the future, this could come from a context or be fetched.
  entrySnippet?: string | null;
  currentDate: Date; // To display the relevant date
}

export const TodaysJournalPreview: React.FC<TodaysJournalPreviewProps> = ({
  entrySnippet,
  currentDate,
}) => {
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookText className="h-5 w-5 text-indigo-500" />
            <CardTitle className="text-lg font-semibold">Today's Journal</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
      </CardHeader>
      <CardContent>
        {entrySnippet ? (
          <p className="text-sm text-foreground italic whitespace-pre-wrap">
            "{entrySnippet}"
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No journal entry for today yet. Take a moment to reflect.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/journal">
          <Button variant="outline" className="w-full">
            <PencilLine className="mr-2 h-4 w-4" />
            {entrySnippet ? 'View or Edit Journal' : 'Write in Journal'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
