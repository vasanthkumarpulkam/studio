'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { acceptBid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check } from 'lucide-react';

export default function AcceptBidButton({ jobId, bidId }: { jobId: string; bidId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAccept = () => {
    startTransition(async () => {
      try {
        await acceptBid(jobId, bidId);
        toast({
          title: 'Bid Accepted!',
          description: 'The provider has been notified and payment is now in escrow.',
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
    <Button size="sm" onClick={handleAccept} disabled={isPending}>
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
