
'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { confirmJob } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ThumbsUp } from 'lucide-react';

export default function ConfirmJobButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await confirmJob(jobId);
        toast({
          title: 'Job Confirmed!',
          description: 'You can now start the work. The customer has been notified.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to confirm job. Please try again.',
        });
      }
    });
  };

  return (
    <Button className="w-full" onClick={handleConfirm} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Confirming...
        </>
      ) : (
        <>
          <ThumbsUp className="mr-2 h-4 w-4" />
          Confirm Job
        </>
      )}
    </Button>
  );
}
