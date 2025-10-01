
'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
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
import { Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { ChatMessage, User, Provider } from '@/types';
import { sendMessage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';

type ChatModalProps = {
  triggerButton: React.ReactNode;
  jobTitle: string;
  recipient: User | Provider;
  currentUser: User | Provider;
  jobId: string;
  providerId: string;
};

export default function ChatModal({
  triggerButton,
  jobTitle,
  recipient,
  currentUser,
  jobId,
  providerId,
}: ChatModalProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useTranslation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => query(
      collection(db, 'chats'), 
      where('jobId', '==', jobId), 
      where('providerId', '==', providerId),
      orderBy('timestamp', 'asc')
    ), [jobId, providerId]);

  const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || isPending) return;

    startTransition(async () => {
      try {
        const optimisticMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
          jobId,
          providerId,
          senderId: currentUser.uid,
          text: newMessage,
        };

        setNewMessage('');
        await sendMessage(optimisticMessage);
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to send message. Please try again.',
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] grid-rows-[auto_1fr_auto] p-0 max-h-[90vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>
            Chat with {recipient.name} about "{jobTitle}"
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {isLoading && <Loader2 className="mx-auto h-6 w-6 animate-spin" />}
            {messages && messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser.uid;
              const sender = isCurrentUser ? currentUser : recipient;
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
                      <AvatarImage src={sender.avatarUrl} alt={sender.name} />
                      <AvatarFallback>{sender.name?.charAt(0)}</AvatarFallback>
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
                        {format(new Date(message.timestamp), 'p', { locale: language === 'es' ? es : undefined })}
                    </p>
                  </div>
                  {isCurrentUser && (
                     <Avatar className="h-8 w-8">
                      <AvatarImage alt={currentUser.name} src={currentUser.avatarUrl} />
                      <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
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
              disabled={isPending}
            />
            <Button type="submit" size="icon" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    