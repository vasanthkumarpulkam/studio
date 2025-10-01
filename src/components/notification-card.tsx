
'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';
import { markNotificationAsRead } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

type NotificationCardProps = {
  notification: Notification;
  onRead: () => void;
};

export default function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const [isPending, startTransition] = useTransition();
  const { t, isTranslationReady } = useTranslation();


  const handleClick = () => {
    if (!notification.isRead) {
      startTransition(async () => {
        await markNotificationAsRead(notification.id);
        onRead();
      });
    } else {
        onRead();
    }
  };

  const translatedMessage = isTranslationReady
    ? t(notification.messageKey, notification.messageParams)
    : notification.message;

  return (
    <Link href={notification.link} onClick={handleClick} className="block">
      <div
        className={cn(
          'p-4 hover:bg-muted/50',
          !notification.isRead && 'bg-blue-50/50'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-sm">{translatedMessage}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          {isPending ? (
            <Loader2 className="mt-1 h-3 w-3 animate-spin" />
          ) : (
            !notification.isRead && (
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
            )
          )}
        </div>
      </div>
    </Link>
  );
}
