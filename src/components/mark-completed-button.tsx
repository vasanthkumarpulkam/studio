'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { markJobAsCompleted } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

export default function MarkCompletedButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await markJobAsCompleted(jobId);
        toast({
          title: 'Job Marked as Completed!',
          description: 'Once both parties confirm, payment will be released.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to mark job as completed. Please try again.',
        });
      }
    });
  };

  return (
    <Button className="w-full" onClick={handleComplete} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark as Completed
        </>
      )}
    </Button>
  );
}
