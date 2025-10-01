
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Loader2, HandCoins } from 'lucide-react';
import { getAiBidSuggestion, submitBid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/types';
import { getCurrentUser } from '@/lib/data';
import { Separator } from './ui/separator';

const bidSchema = z.object({
  amount: z.coerce.number().positive('Must be a positive number.'),
  completionTime: z.string().min(1, 'Please provide an estimated completion time.'),
  message: z.string().optional(),
});

type BidFormValues = z.infer<typeof bidSchema>;

export default function BidForm({ job }: { job: Job }) {
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [isSubmitting, startSubmitting] = useTransition();
  const [suggestion, setSuggestion] = useState<{ suggestedBid: number; reasoning: string } | null>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const hasPaymentMethod = currentUser?.hasPaymentMethod ?? false;

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: 0,
      completionTime: '',
      message: '',
    },
  });

  const handleSuggestion = async () => {
    setLoadingSuggestion(true);
    setSuggestion(null);
    try {
      const result = await getAiBidSuggestion(job.description, job.category);
      setSuggestion(result);
      form.setValue('amount', result.suggestedBid);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI suggestion. Please try again.',
      });
    } finally {
      setLoadingSuggestion(false);
    }
  };
  
  function onSubmit(values: BidFormValues) {
    if (!currentUser) {
        toast({
            variant: 'destructive',
            title: 'Not Logged In',
            description: 'You must be logged in to submit a bid.',
        });
        return;
    }
    if (!hasPaymentMethod) {
      toast({
        variant: 'destructive',
        title: 'Payment Method Required',
        description: 'Please add a payment method before submitting a bid.',
      });
      return;
    }
    
    startSubmitting(async () => {
      try {
        await submitBid({
          ...values,
          jobId: job.id,
          providerId: currentUser.id,
        });
        toast({
          title: 'Bid Submitted!',
          description: `Your bid of $${values.amount} has been sent.`,
        });
        form.reset();
        setSuggestion(null);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to submit bid. Please try again.',
        });
      }
    });
  }

  return (
    <div className="space-y-6">
       <div className="space-y-2">
         <h3 className="text-xl font-bold font-headline">Submit Your Bid</h3>
         <p className="text-sm text-muted-foreground">
            Once your bid is accepted, you will be able to chat with the job poster to finalize details.
         </p>
       </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={!hasPaymentMethod || isSubmitting} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Bid Amount ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 75.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="completionTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Completion Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2-3 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Introduce yourself or add details about your bid..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
            
          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto" disabled={!hasPaymentMethod || isSubmitting}>
                {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <HandCoins className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Bid'}
            </Button>
            <Button variant="outline" type="button" className="w-full sm:w-auto" onClick={handleSuggestion} disabled={loadingSuggestion || !hasPaymentMethod || isSubmitting}>
                {loadingSuggestion ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get AI Suggestion
            </Button>
          </div>
        </form>
      </Form>
        {suggestion && (
            <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-headline">AI Bid Suggestion</AlertTitle>
            <AlertDescription>
                <p className="font-bold text-lg">${suggestion.suggestedBid.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
            </AlertDescription>
            </Alert>
        )}
    </div>
  );
}
