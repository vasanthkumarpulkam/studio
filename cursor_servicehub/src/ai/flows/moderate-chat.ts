'use server';
/**
 * @fileOverview An AI agent that moderates chat messages to prevent the sharing of personal contact information.
 *
 * - moderateChatFlow - A function that takes a message and redacts sensitive information.
 * - ModerateChatInput - The input type for the moderateChatFlow function.
 * - ModerateChatOutput - The return type for the moderateChatFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ModerateChatInputSchema = z.string();
export type ModerateChatInput = z.infer<typeof ModerateChatInputSchema>;

const ModerateChatOutputSchema = z.object({
  moderatedText: z.string().describe('The moderated text, with any personal contact information redacted.'),
});
export type ModerateChatOutput = z.infer<typeof ModerateChatOutputSchema>;


const prompt = ai.definePrompt({
  name: 'moderateChatPrompt',
  input: { schema: ModerateChatInputSchema },
  output: { schema: ModerateChatOutputSchema },
  prompt: `You are a chat message moderator for a service marketplace. Your role is to prevent users from sharing personal contact information.

  Review the following message. If it contains any personal contact details (like email addresses, phone numbers, physical addresses, or links to social media profiles), you must redact them by replacing them with a placeholder like [REDACTED].

  If the message does not contain any personal contact information, return the original message.

  Original Message:
  "{{{prompt}}}"
  `,
});

export const moderateChatFlow = ai.defineFlow(
  {
    name: 'moderateChatFlow',
    inputSchema: ModerateChatInputSchema,
    outputSchema: ModerateChatOutputSchema,
  },
  async (message) => {
    const { output } = await prompt(message);
    return output!;
  }
);
