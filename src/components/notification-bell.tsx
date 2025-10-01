
'use client';

import { useState, useTransition } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import NotificationCard from './notification-card';
import { markAllNotificationsAsRead } from '@/app/actions';
import { ScrollArea } from './ui/scroll-area';
import { useTranslation } from '@/hooks/use-translation';
import { useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Notification } from '@/types';

export default function NotificationBell({ userId }: { userId: string }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { t, isTranslationReady } = useTranslation();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Admins can see all, users only see their own
    if (user.role === 'admin') {
      return collection(db, 'notifications');
    }
    return query(collection(db, 'notifications'), where('userId', '==', userId))
  }, [userId, user]);

  const { data: notifications } = useCollection<Notification>(notificationsQuery);
  
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead(userId);
    });
  };

  if (!isTranslationReady) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 md:w-96">
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <CardTitle className="text-lg font-headline">{t('notifications_title')}</CardTitle>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={handleMarkAllRead}
              disabled={isPending || unreadCount === 0}
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : t('notifications_mark_all_read')}
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72">
              {notifications && notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onRead={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                  <p>{t('notifications_none')}</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t px-4 py-3">
            <Button size="sm" variant="ghost" className="w-full" disabled>
              {t('notifications_view_all')}
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

    