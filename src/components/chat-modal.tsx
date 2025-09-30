'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ChatMessage, User, Provider } from '@/types';

type ChatModalProps = {
  triggerButton: React.ReactNode;
  messages: ChatMessage[];
  jobTitle: string;
  providerName: string;
  currentUser: User | Provider;
};

export default function ChatModal({
  triggerButton,
  messages: initialMessages,
  jobTitle,
  providerName,
  currentUser,
}: ChatModalProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      jobId: initialMessages[0]?.jobId || 'job-1', // Fallback for safety
      providerId: initialMessages[0]?.providerId || 'user-2', // Fallback
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // In a real app, you would send this to your backend/Firestore
    // and receive the new message via a real-time subscription.
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] grid-rows-[auto_1fr_auto] p-0 max-h-[90vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            Chat with {providerName} about "{jobTitle}"
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser.id;
              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-2',
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage alt={providerName} />
                      <AvatarFallback>{providerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-lg p-3 text-sm lg:max-w-md',
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p>{message.text}</p>
                    <p className={cn(
                        'text-xs mt-1',
                        isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                        {format(new Date(message.timestamp), 'p')}
                    </p>
                  </div>
                  {isCurrentUser && (
                     <Avatar className="h-8 w-8">
                      <AvatarImage alt={currentUser.name} src={currentUser.avatarUrl} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="p-4 border-t">
          <form
            onSubmit={handleSendMessage}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    