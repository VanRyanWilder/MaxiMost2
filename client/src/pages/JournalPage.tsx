import React from 'react';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // For date input
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';

interface JournalEntry {
  date: string; // YYYY-MM-DD
  content: string;
}

const JournalPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [currentEntry, setCurrentEntry] = useState<string>('');
  // Store entries in local state, keyed by date string
  const [journalEntries, setJournalEntries] = useState<Record<string, string>>({});

  // Load entry when selectedDate changes
  useEffect(() => {
    setCurrentEntry(journalEntries[selectedDate] || '');
  }, [selectedDate, journalEntries]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (isValid(parseISO(dateValue))) {
      setSelectedDate(dateValue);
    } else {
      // Handle invalid date input if necessary, or allow it and rely on native picker
      setSelectedDate(dateValue);
    }
  };

  const handleSaveEntry = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    setJournalEntries(prevEntries => ({
      ...prevEntries,
      [selectedDate]: currentEntry,
    }));
    alert(`Journal entry for ${format(parseISO(selectedDate), 'MMMM d, yyyy')} saved! (Locally)`);
    // TODO: API call to save journal entry to backend
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Daily Journal</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Reflect on your day, capture insights, and track your journey.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">
            Journal Entry for:
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="ml-2 inline-block w-auto p-1 border-gray-300 rounded text-lg"
              // Max date can be set to today if desired: max={format(new Date(), 'yyyy-MM-dd')}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder={`What's on your mind for ${selectedDate ? format(parseISO(selectedDate), 'MMMM d') : 'today'}?`}
            rows={12}
            className="w-full text-base leading-relaxed p-3 border rounded-md focus:ring-2 focus:ring-primary"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveEntry} className="bg-primary hover:bg-primary/90">
            Save Entry
          </Button>
        </CardFooter>
      </Card>

      {/* Optional: Display a list of recent entries or a calendar to select dates */}
      {Object.keys(journalEntries).length > 0 && (
        <div className="mt-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Entries (Locally Saved)</h3>
          <div className="space-y-3">
            {Object.entries(journalEntries)
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Sort descending by date
              .slice(0, 5) // Show last 5
              .map(([date, content]) => (
              <details key={date} className="border p-3 rounded-md bg-card hover:shadow-sm">
                <summary className="cursor-pointer font-medium text-primary hover:underline">
                  {format(parseISO(date), 'MMMM d, yyyy')}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{content.substring(0,150)}{content.length > 150 ? '...' : ''}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
