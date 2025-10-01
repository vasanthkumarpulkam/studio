
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { acceptBid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function AcceptBidButton({ jobId, bidId, disabled }: { jobId: string; bidId: string; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAccept = () => {
    if (disabled) {
       toast({
          variant: 'destructive',
          title: t('payment_alert_title'),
          description: t('accept_bid_payment_alert_desc'),
        });
      return;
    }

    startTransition(async () => {
      try {
        await acceptBid(jobId, bidId);
        toast({
          title: t('accept_bid_success_title'),
          description: t('accept_bid_success_desc'),
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to accept bid. Please try again.',
        });
      }
    });
  };

  return (
    <Button size="sm" onClick={handleAccept} disabled={isPending || disabled}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('accept_bid_button_pending')}
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          {t('accept_bid_button')}
        </>
      )}
    </Button>
  );
}
