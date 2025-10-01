
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { acceptBid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';

export default function AcceptBidButton({ jobId, bidId, disabled }: { jobId: string; bidId: string; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAccept = () => {
    if (disabled) {
       toast({
          variant: 'destructive',
          title: 'Payment Method Required',
          description: 'Please add a payment method before accepting a bid.',
        });
      return;
    }

    startTransition(async () => {
      try {
        await acceptBid(jobId, bidId);
        toast({
          title: 'Bid Accepted!',
          description: 'The provider has been notified. Waiting for them to confirm.',
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
          Accepting...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          Accept Bid
        </>
      )}
    </Button>
  );
}
