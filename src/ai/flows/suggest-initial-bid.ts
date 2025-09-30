'use server';

/**
 * @fileOverview An AI agent that suggests an initial bid price for a provider
 * based on their past bidding history and the user's job history.
 *
 * - suggestInitialBid - A function that suggests an initial bid price.
 * - SuggestInitialBidInput - The input type for the suggestInitialBid function.
 * - SuggestInitialBidOutput - The return type for the suggestInitialBid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInitialBidInputSchema = z.object({
  providerId: z.string().describe('The ID of the provider submitting the bid.'),
  jobDescription: z.string().describe('The description of the job posted by the user.'),
  userJobHistory: z.string().describe('The past job history of the user requesting the service.'),
  providerBiddingHistory: z.string().describe('The past bidding history of the provider.'),
  jobCategory: z.string().describe('The category of the job (e.g., plumbing, grass cutting).'),
});
export type SuggestInitialBidInput = z.infer<typeof SuggestInitialBidInputSchema>;

const SuggestInitialBidOutputSchema = z.object({
  suggestedBid: z.number().describe('The suggested initial bid price for the job.'),
  reasoning: z.string().describe('The reasoning behind the suggested bid price.'),
});
export type SuggestInitialBidOutput = z.infer<typeof SuggestInitialBidOutputSchema>;

export async function suggestInitialBid(input: SuggestInitialBidInput): Promise<SuggestInitialBidOutput> {
  return suggestInitialBidFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInitialBidPrompt',
  input: {schema: SuggestInitialBidInputSchema},
  output: {schema: SuggestInitialBidOutputSchema},
  prompt: `You are an AI assistant helping service providers to determine initial bid prices for jobs.

  Based on the following information, suggest an initial bid price and explain your reasoning:

  Job Description: {{{jobDescription}}}
  User Job History: {{{userJobHistory}}}
  Provider Bidding History: {{{providerBiddingHistory}}}
  Job Category: {{{jobCategory}}}

  Consider factors such as the complexity of the job, the user's past spending habits, the provider's success rate with similar bids, and the typical pricing for the job category.

  Provide the suggested bid price as a number and the reasoning in a clear and concise manner.
  `,
});

const suggestInitialBidFlow = ai.defineFlow(
  {
    name: 'suggestInitialBidFlow',
    inputSchema: SuggestInitialBidInputSchema,
    outputSchema: SuggestInitialBidOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
