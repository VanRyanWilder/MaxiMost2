import React from 'react';
import { cn } from '@/lib/utils'; // For conditional classes

interface ChatMessageProps {
  messageText: string;
  sender: 'user' | 'ai';
  timestamp?: string; // Optional timestamp
  aiTheme?: { // Optional theme for AI messages
    primaryColor: string;
    textColor: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messageText, sender, timestamp, aiTheme }) => {
  const isUser = sender === 'user';

  // Default AI theme if not provided or if sender is user
  const currentAiTheme = isUser ? null : (aiTheme || { primaryColor: 'bg-neutral-700', textColor: 'text-neutral-100' });

  return (
    <div className={cn('flex mb-3', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'py-2 px-4 rounded-xl max-w-[70%] md:max-w-[60%]',
          isUser
            ? 'bg-blue-600 text-white rounded-br-none' // User message style
            : `${currentAiTheme?.primaryColor} ${currentAiTheme?.textColor} rounded-bl-none` // AI message style using theme
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{messageText}</p>
        {timestamp && (
          <p className={cn(
            'text-xs mt-1',
            isUser ? 'text-blue-200 text-right' : (currentAiTheme ? `${currentAiTheme.textColor} opacity-70 text-left` : 'text-neutral-400 text-left')
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
