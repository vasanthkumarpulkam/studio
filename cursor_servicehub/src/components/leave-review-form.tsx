'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Star, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating.'),
  comment: z.string().min(10, 'Review must be at least 10 characters long.').optional(),
  tipAmount: z.coerce.number().min(0, 'Tip must be a positive number.').optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type LeaveReviewFormProps = {
    jobId: string;
    revieweeId: string;
    reviewerRole: 'customer' | 'provider';
}

export default function LeaveReviewForm({ jobId, revieweeId, reviewerRole }: LeaveReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      tipAmount: undefined,
    },
  });

  const currentRating = form.watch('rating');

  function onSubmit(values: ReviewFormValues) {
    console.log({
        ...values,
        jobId,
        revieweeId,
        reviewerRole,
    });
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback.',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        className={cn(
                            'w-8 h-8 cursor-pointer transition-colors',
                            (hoverRating >= star || currentRating >= star)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        )}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => field.onChange(star)}
                        />
                    ))}
                    </div>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            {reviewerRole === 'customer' && (
                <FormField
                    control={form.control}
                    name="tipAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Add a Tip (Optional)</FormLabel>
                        <div className="relative">
                            <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                                <Input type="number" placeholder="e.g., 10.00" className="pl-10" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Describe your experience with the ${reviewerRole === 'customer' ? 'provider' : 'customer'}...`}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit Review</Button>
      </form>
    </Form>
  );
}
