'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { startWork } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play } from 'lucide-react';

export default function StartWorkButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStartWork = () => {
    startTransition(async () => {
      try {
        await startWork(jobId);
        toast({
          title: 'Work Started!',
          description: 'The customer has been notified that you are starting the job.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update job status. Please try again.',
        });
      }
    });
  };

  return (
    <Button className="w-full" onClick={handleStartWork} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Start Work
        </>
      )}
    </Button>
  );
}
