'use server';

/**
 * @fileOverview Generates a personalized thank you email with a summary of the submission details and a PDF attachment.
 *
 * - generatePersonalizedEmail - A function that generates a personalized thank you email.
 * - PersonalizedEmailInput - The input type for the generatePersonalizedEmail function.
 * - PersonalizedEmailOutput - The return type for the generatePersonalizedEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEmailInputSchema = z.object({
  formData: z.record(z.any()).describe('The form data submitted by the user.'),
  userEmail: z.string().email().describe('The email address of the user.'),
  userName: z.string().describe('The name of the user.'),
});

export type PersonalizedEmailInput = z.infer<typeof PersonalizedEmailInputSchema>;

const PersonalizedEmailOutputSchema = z.object({
  emailBody: z.string().describe('The personalized email body.'),
  pdfContent: z.string().describe('The PDF content as a base64 string.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant that generates personalized thank you emails and formats submission data into PDF format.

  Given the following form data from user {{{userName}}} ({{{userEmail}}}):

  {{#each formData}}
    {{@key}}: {{{this}}}
  {{/each}}

  Create a personalized thank you email body. The tone should be appreciative and professional. Also, generate a PDF content (as a string) summarizing the user's submission in a well-formatted manner. The PDF content does not need to be valid base64, but just the raw string contents which will be converted later.
  Email Body:
  PDF Content:
  `,
});

const personalizedEmailFlow = ai.defineFlow(
  {
    name: 'personalizedEmailFlow',
    inputSchema: PersonalizedEmailInputSchema,
    outputSchema: PersonalizedEmailOutputSchema,
  },
  async input => {
    const {output} = await personalizedEmailPrompt(input);
    return output!;
  }
);
