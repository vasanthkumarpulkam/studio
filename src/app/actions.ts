'use server';

import { suggestInitialBid } from '@/ai/flows/suggest-initial-bid';
import type { SuggestInitialBidOutput } from '@/ai/flows/suggest-initial-bid';
import { jobs } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function getAiBidSuggestion(jobDescription: string, jobCategory: string): Promise<SuggestInitialBidOutput> {
  // In a real app, you'd fetch this data from your database
  const dummyData = {
    providerId: 'provider-123',
    userJobHistory: 'User has previously paid $50 for grass cutting and $200 for a small plumbing repair. Tends to accept bids slightly below the average.',
    providerBiddingHistory: 'Provider has successfully bid on 5 similar jobs in the last month, with an average bid of $70. Win rate is 60% when bidding in the $65-$75 range.',
    jobDescription,
    jobCategory,
  };

  try {
    const suggestion = await suggestInitialBid(dummyData);
    return suggestion;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // Return a structured error or re-throw
    throw new Error('Failed to get AI suggestion.');
  }
}

export async function acceptBid(jobId: string, bidId: string) {
    // In a real app, you would update this in your database
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'open') {
        job.status = 'in-progress';
        job.acceptedBid = bidId;
        console.log(`Bid ${bidId} accepted for job ${jobId}. Job status updated to in-progress.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
    } else {
        console.error('Job not found or not available for bidding.');
        throw new Error('Job not found or not available for bidding.');
    }
}

export async function markJobAsCompleted(jobId: string) {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status === 'in-progress') {
        job.status = 'completed';
        console.log(`Job ${jobId} marked as completed.`);
        revalidatePath(`/dashboard/jobs/${jobId}`);
        revalidatePath('/dashboard/my-bids');
    } else {
        console.error('Job not found or not in progress.');
        throw new Error('Job not found or not in progress.');
    }
}
