import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useCoach, CoachPersonaId } from '@/context/CoachContext';
import { coachPersonaData, CoachPersonaDetails } from '@/data/coachPersonaData'; // Use CoachPersonaDetails
import ChatMessage from '@/components/ai/ChatMessage';

// This local 'coachSelectorButtons' array is for the selector UI
const coachSelectorButtons: { id: CoachPersonaId, name: string }[] = [
  { id: 'stoic', name: 'The Stoic' },
  { id: 'operator', name: 'The Operator' },
  { id: 'nurturer', name: 'The Nurturer' },
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

const AICoachPage: React.FC = () => {
  const { selectedCoachId, setSelectedCoachId } = useCoach();
  // Ensure currentCoach uses CoachPersonaDetails type
  const currentCoach: CoachPersonaDetails = coachPersonaData[selectedCoachId as keyof typeof coachPersonaData] || coachPersonaData.stoic;

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting from the coach when selected or when component mounts with a default coach
  useEffect(() => {
    setMessages([]); // Clear previous messages when coach changes
    const greeting = currentCoach.cannedResponses[0] || "How can I assist you today?";
    // Add initial greeting with a slight delay to ensure UI is ready
    setTimeout(() => {
        setMessages([{ id: `ai-greeting-${Date.now()}`, text: greeting, sender: 'ai', timestamp: new Date().toLocaleTimeString() }]);
    }, 100);
  }, [selectedCoachId, currentCoach]); // Depend on currentCoach directly as well


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage; // Capture current message before clearing
    setCurrentMessage('');

    // Simulate AI response
    setTimeout(() => {
      const cannedResponses = currentCoach.cannedResponses;
      // Simple logic: if user message is short, pick first response, else random.
      const aiResponseText = messageToSend.length < 10 && cannedResponses.length > 1 ? cannedResponses[1] : cannedResponses[Math.floor(Math.random() * cannedResponses.length)];

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponseText || "I'm listening. Tell me more.", // Fallback response
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000 + Math.random() * 500); // Simulate a slightly shorter delay
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 text-neutral-100">
      <header className="p-4 border-b border-neutral-700 bg-neutral-800/50">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            {currentCoach.imageUrl && (
              <img src={currentCoach.imageUrl} alt={currentCoach.name} className="w-10 h-10 rounded-full border-2" style={{borderColor: currentCoach.glowColor || '#FFFFFF'}} />
            )}
            <div>
              <h1 className="text-xl font-semibold text-neutral-100">{currentCoach.name}</h1>
              <p className="text-xs text-neutral-400">{currentCoach.description}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {coachSelectorButtons.map((persona) => (
            <Button
              key={persona.id}
              variant={selectedCoachId === persona.id ? 'default' : 'outline'}
              onClick={() => setSelectedCoachId(persona.id)}
              className={selectedCoachId === persona.id
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-100'}
            >
              {persona.name}
            </Button>
          ))}
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-2 bg-neutral-800/60"> {/* Adjusted spacing and bg */}
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            messageText={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
            aiTheme={msg.sender === 'ai' ? currentCoach.theme : undefined}
          />
        ))}
        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
      </div>

      <div className="p-4 border-t border-neutral-700 bg-neutral-800/50">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <Input
            type="text"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-grow bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-400 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AICoachPage;
