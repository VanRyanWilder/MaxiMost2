import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
// Note: PageContainer might add unwanted padding for a full-height chat UI.
// We'll manage height and padding directly for this specific layout.

const AICoachPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-var(--header-height)-var(--applayout-padding-y))] md:max-h-[calc(100vh-var(--header-height)-var(--applayout-padding-y-md))] lg:max-h-[calc(100vh-var(--header-height)-var(--applayout-padding-y-lg))] bg-background">
      {/*
        The max-h calculation attempts to make the chat UI fill the space available
        within AppLayout. AppLayout has a header and its main content area has padding.
        We need to define CSS variables for --header-height and AppLayout's y-padding
        or use known Tailwind values if AppLayout's structure is consistent.
        For now, this is a conceptual approach to height management.
        A simpler approach for now might be to let it scroll within AppLayout's default flow.
        Let's simplify for V1 of this page and allow normal scrolling within AppLayout's padded area.
      */}

      {/* Chat messages area - Placeholder */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/30 rounded-t-lg">
        {/* Placeholder Messages */}
        <div className="flex justify-start">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs lg:max-w-md">
            Hello! I am your AI Coach. How can I help you achieve your goals today?
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-secondary text-secondary-foreground p-3 rounded-lg max-w-xs lg:max-w-md">
            I want to build a consistent morning routine.
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs lg:max-w-md">
            Great goal! What's one small step you can take tomorrow to start?
          </div>
        </div>
      </div>

      {/* Message input form - Pinned to bottom */}
      <div className="p-4 border-t bg-background rounded-b-lg">
        <form className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-grow"
            // Add state and onChange handler later
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AICoachPage;
