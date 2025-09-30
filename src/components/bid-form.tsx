'use client';

import { useState } from 'react';
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
import { getAiBidSuggestion } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { Job } from '@/types';
import { getCurrentUser } from '@/lib/data';

const bidSchema = z.object({
  amount: z.coerce.number().positive('Must be a positive number.'),
  message: z.string().optional(),
});

type BidFormValues = z.infer<typeof bidSchema>;

export default function BidForm({ job }: { job: Job }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ suggestedBid: number; reasoning: string } | null>(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const hasPaymentMethod = currentUser.hasPaymentMethod;

  const form = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: 0,
      message: '',
    },
  });

  const handleSuggestion = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };
  
  function onSubmit(values: BidFormValues) {
    if (!hasPaymentMethod) {
      toast({
        variant: 'destructive',
        title: 'Payment Method Required',
        description: 'Please add a payment method before submitting a bid.',
      });
      return;
    }
    console.log(values);
    toast({
      title: 'Bid Submitted!',
      description: `Your bid of $${values.amount} has been sent.`,
    })
    form.reset();
    setSuggestion(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-bold font-headline">Submit Your Bid</h3>
        <Button variant="outline" onClick={handleSuggestion} disabled={loading || !hasPaymentMethod}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Get AI Suggestion
        </Button>
      </div>

      {suggestion && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle className="font-headline">AI Bid Suggestion</AlertTitle>
          <AlertDescription>
            <p className="font-bold text-lg">${suggestion.suggestedBid.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <fieldset disabled={!hasPaymentMethod} className="space-y-4">
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
          <Button type="submit" className="w-full sm:w-auto" disabled={!hasPaymentMethod}>
            <HandCoins className="mr-2 h-4 w-4" />
            Submit Bid
          </Button>
        </form>
      </Form>
    </div>
  );
}
