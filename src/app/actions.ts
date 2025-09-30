// src/app/actions.ts
'use server';

import { suggestInitialBid } from '@/ai/flows/suggest-initial-bid';
import type { SuggestInitialBidOutput } from '@/ai/flows/suggest-initial-bid';

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
