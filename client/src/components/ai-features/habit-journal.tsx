import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Book, Bookmark, Edit, Sparkles, Save, Zap } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  prompt?: string;
}

interface HabitJournalProps {
  userId: string;
}

// Stoic-inspired journal prompts
const JOURNAL_PROMPTS = [
  "What is one small habit I'm grateful I maintained today?",
  "What obstacle did I encounter in my habits today, and how can I reframe it as an opportunity?",
  "What is under my control with my habits, and what isn't?",
  "Which habit is serving my growth the most right now, and why?",
  "What is one habit I should let go of because it no longer serves me?",
  "What is something new I observed about myself today through my habits?",
  "How did my habits today align with my core values?",
  "What is one habit that might help me become more resilient?",
  "How can I make my most challenging habit 1% easier tomorrow?",
  "What emotion arises most often when I think about my habits?",
  "What habit would make me proud to maintain for the next year?",
  "What would make tomorrow better than today?"
];

export function HabitJournal({ userId }: HabitJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<string>('');
  const [currentMood, setCurrentMood] = useState<string>('neutral');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const { toast } = useToast();
  
  // Load journal entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem(`journal_entries_${userId}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [userId]);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(`journal_entries_${userId}`, JSON.stringify(entries));
    }
  }, [entries, userId]);
  
  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Cannot save empty entry",
        description: "Please write something in your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry,
      mood: currentMood,
      prompt: selectedPrompt || undefined
    };
    
    setEntries([newEntry, ...entries]);
    setCurrentEntry('');
    setSelectedPrompt('');
    
    toast({
      title: "Journal entry saved",
      description: "Your reflection has been successfully saved.",
    });
  };
  
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setSelectedPrompt(JOURNAL_PROMPTS[randomIndex]);
  };
  
  const moodOptions = [
    { label: 'Great', value: 'great', icon: '😃' },
    { label: 'Good', value: 'good', icon: '🙂' },
    { label: 'Neutral', value: 'neutral', icon: '😐' },
    { label: 'Down', value: 'down', icon: '😕' },
    { label: 'Struggling', value: 'struggling', icon: '😢' }
  ];
  
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Habit Journal</CardTitle>
          </div>
        </div>
        <CardDescription>
          Track your habit journey with reflections and insights
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="write" className="flex items-center gap-1.5">
            <Edit className="h-3.5 w-3.5" />
            <span>Write</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="space-y-4 p-4">
          {selectedPrompt && (
            <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mb-3">
              <div className="flex gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800">{selectedPrompt}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.value}
                  variant={currentMood === mood.value ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setCurrentMood(mood.value)}
                >
                  <span>{mood.icon}</span>
                  <span>{mood.label}</span>
                </Button>
              ))}
            </div>
            
            <Textarea
              placeholder="Reflect on your habit journey today..."
              rows={6}
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="resize-none"
            />
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={getRandomPrompt}
              >
                <Zap className="h-3.5 w-3.5" />
                Prompt Me
              </Button>
              
              <Button
                size="sm"
                className="gap-1"
                onClick={saveEntry}
              >
                <Save className="h-3.5 w-3.5" />
                Save Entry
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="min-h-[300px]">
          {entries.length > 0 ? (
            <div className="space-y-4 p-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <CardHeader className="py-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">
                        {format(new Date(entry.date), 'MMMM d, yyyy • h:mm a')}
                      </div>
                      {entry.mood && (
                        <Badge variant="outline">
                          {moodOptions.find(m => m.value === entry.mood)?.icon} {entry.mood}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    {entry.prompt && (
                      <div className="text-sm italic text-muted-foreground mb-2">
                        Prompt: {entry.prompt}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <Book className="h-12 w-12 text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-600">No entries yet</h3>
              <p className="text-gray-500 max-w-xs">
                Start journaling about your habit journey to see your entries here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}