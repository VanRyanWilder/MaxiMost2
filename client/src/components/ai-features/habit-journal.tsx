import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookText, Plus, Save, Edit, Trash2, Calendar, PenTool, Smile, Frown, Meh } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface HabitJournalProps {
  userId: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}

// Entries sorted by date (newest first)
export function HabitJournal({ userId }: HabitJournalProps) {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal-entries', []);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('neutral');
  const [activeTab, setActiveTab] = useState('write');
  
  // Get entries for current user
  const userEntries = entries.filter(entry => entry.userId === userId).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // If editing an entry, populate the form
  useEffect(() => {
    if (editingEntry) {
      setNewEntry(editingEntry.content);
      setSelectedMood(editingEntry.mood);
      setActiveTab('write');
    }
  }, [editingEntry]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newEntry.trim() === '') return;
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, content: newEntry, mood: selectedMood, date: new Date().toISOString() }
          : entry
      );
      
      setEntries(updatedEntries);
      setEditingEntry(null);
    } else {
      // Create new entry
      const newJournalEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        userId,
        date: new Date().toISOString(),
        content: newEntry,
        mood: selectedMood,
        tags: extractTags(newEntry)
      };
      
      setEntries([...entries, newJournalEntry]);
    }
    
    // Reset form
    setNewEntry('');
    setSelectedMood('neutral');
    setActiveTab('view');
  };
  
  // Extract hashtags from the entry content
  const extractTags = (content: string): string[] => {
    const hashtagPattern = /#[\w]+/g;
    const tags = content.match(hashtagPattern) || [];
    return tags.map(tag => tag.slice(1)); // Remove the # symbol
  };
  
  // Delete an entry
  const handleDelete = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  };
  
  // Get mood emoji and text color
  const getMoodInfo = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'great':
        return { icon: <Smile className="h-5 w-5 text-green-500 fill-current" />, color: 'text-green-600' };
      case 'good':
        return { icon: <Smile className="h-5 w-5 text-blue-500" />, color: 'text-blue-600' };
      case 'neutral':
        return { icon: <Meh className="h-5 w-5 text-gray-500" />, color: 'text-gray-600' };
      case 'bad':
        return { icon: <Frown className="h-5 w-5 text-amber-500" />, color: 'text-amber-600' };
      case 'terrible':
        return { icon: <Frown className="h-5 w-5 text-red-500" />, color: 'text-red-600' };
      default:
        return { icon: <Meh className="h-5 w-5 text-gray-500" />, color: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookText className="h-5 w-5 text-purple-500" />
        <h2 className="text-xl font-semibold">Habit Journal</h2>
      </div>
      
      <Alert>
        <AlertDescription>
          Track your habit journey, reflect on your progress, and identify patterns that impact your success.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="write" className="flex items-center gap-1">
            <PenTool className="h-4 w-4" />
            <span>{editingEntry ? 'Edit Entry' : 'New Entry'}</span>
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>View Entries</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="write">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</CardTitle>
                <CardDescription>
                  {editingEntry 
                    ? 'Update your thoughts and reflections'
                    : 'Record your thoughts, experiences, and insights about your habits'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="journal-entry" className="text-sm font-medium">
                      Today's Reflection
                    </label>
                    <div className="text-xs text-muted-foreground">
                      Use #tags to categorize entries
                    </div>
                  </div>
                  <Textarea
                    id="journal-entry"
                    placeholder="How are your habits working for you? What's going well? What challenges are you facing? (use #tags to categorize)"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">How are you feeling today?</label>
                  <div className="flex flex-wrap gap-2">
                    {(['great', 'good', 'neutral', 'bad', 'terrible'] as JournalEntry['mood'][]).map(mood => (
                      <Button
                        key={mood}
                        type="button"
                        variant={selectedMood === mood ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedMood(mood)}
                        className="flex items-center gap-1"
                      >
                        {getMoodInfo(mood).icon}
                        <span className="capitalize">{mood}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {editingEntry && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingEntry(null);
                      setNewEntry('');
                      setSelectedMood('neutral');
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="view">
          {userEntries.length > 0 ? (
            <div className="space-y-4">
              {userEntries.map((entry) => (
                <Card key={entry.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getMoodInfo(entry.mood).icon}
                        <CardTitle className="text-base">
                          <span className={getMoodInfo(entry.mood).color}>
                            Feeling {entry.mood}
                          </span>
                        </CardTitle>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                    
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {entry.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 bg-violet-100 text-violet-800 rounded-md text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="pt-0 pb-3 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEntry(entry)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <BookText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No journal entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Start documenting your habit journey to track progress and insights
              </p>
              <Button onClick={() => setActiveTab('write')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Entry
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}