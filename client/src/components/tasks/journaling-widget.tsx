import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save, Clock, Sparkles, Brain, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function JournalingWidget() {
  const { toast } = useToast();
  const [entryType, setEntryType] = useState<'morning' | 'evening'>('morning');
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<{ date: string; type: string; content: string; }[]>([]);
  const [hasEntryToday, setHasEntryToday] = useState(false);
  
  // Check if date is today
  const isTodayEntry = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };
  
  // Get prompt based on entry type
  const getPrompt = () => {
    if (entryType === 'morning') {
      return {
        title: "Morning Brain Dump",
        instructions: "Clear your mind of any noise, worries, or random thoughts. Write freely for 5-10 minutes without judgment. Then, set your 3 most important tasks for today.",
        prompts: [
          "What's on my mind this morning?",
          "What am I feeling right now?",
          "What are my top 3 priorities today?",
          "What would make today great?"
        ]
      };
    } else {
      return {
        title: "Evening Reflection",
        instructions: "Review your day and capture your thoughts before sleeping. This helps process experiences and prepare for tomorrow.",
        prompts: [
          "What went well today?",
          "What did I learn today?",
          "What am I grateful for?",
          "What could I have done better?"
        ]
      };
    }
  };
  
  // Load saved entries from localStorage on component mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    if (storedEntries) {
      const entries = JSON.parse(storedEntries);
      setSavedEntries(entries);
      
      // Check if there's an entry for today
      const todayEntries = entries.filter((entry: any) => isTodayEntry(entry.date));
      const hasMorningEntry = todayEntries.some((e: any) => e.type === 'morning');
      
      // Default to evening entry if morning entry exists
      if (hasMorningEntry) {
        setEntryType('evening');
      }
      
      setHasEntryToday(todayEntries.length > 0);
    }
    
    // Set entry type based on time of day
    const currentHour = new Date().getHours();
    if (currentHour >= 15) {
      setEntryType('evening');
    }
  }, []);
  
  const saveEntry = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Entry cannot be empty",
        description: "Please write something before saving",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      type: entryType,
      content: journalEntry
    };
    
    const updatedEntries = [...savedEntries, newEntry];
    setSavedEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    
    setHasEntryToday(true);
    setJournalEntry('');
    
    toast({
      title: "Journal entry saved",
      description: `Your ${entryType} reflection has been saved.`,
      variant: "default"
    });
  };
  
  const toggleEntryType = () => {
    setEntryType(entryType === 'morning' ? 'evening' : 'morning');
  };
  
  const prompt = getPrompt();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>{prompt.title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleEntryType}>
            {entryType === 'morning' ? (
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> <span>Switch to Evening</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Brain className="h-4 w-4" /> <span>Switch to Morning</span>
              </div>
            )}
          </Button>
        </div>
        <CardDescription className="mt-1">
          {entryType === 'morning' ? (
            <span className="flex items-center text-amber-600">
              <Clock className="h-4 w-4 mr-1" /> Best completed first thing in the morning
            </span>
          ) : (
            <span className="flex items-center text-indigo-600">
              <Clock className="h-4 w-4 mr-1" /> Best completed before bed
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{prompt.instructions}</p>
        
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Prompts:</h4>
          <ul className="space-y-1">
            {prompt.prompts.map((p, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <div className="text-primary mt-0.5">•</div> {p}
              </li>
            ))}
          </ul>
        </div>
        
        <Textarea
          placeholder="Start writing your thoughts here..."
          className="min-h-[200px] resize-none"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {hasEntryToday ? (
            <span className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" /> You've already journaled today
            </span>
          ) : (
            <span>Write freely without judgment</span>
          )}
        </div>
        <Button onClick={saveEntry} className="flex items-center gap-1">
          <Save className="h-4 w-4" /> Save Entry
        </Button>
      </CardFooter>
    </Card>
  );
}