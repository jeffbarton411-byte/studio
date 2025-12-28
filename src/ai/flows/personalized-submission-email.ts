
'use server';

/**
 * @fileOverview Generates a personalized thank you email and a summary of the submission details as an HTML document.
 *
 * - generatePersonalizedEmail - A function that generates a personalized thank you email and HTML summary.
 * - PersonalizedEmailInput - The input type for the generatePersonalizedEmail function.
 * - PersonalizedEmailOutput - The return type for the generatePersonalizedEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEmailInputSchema = z.object({
  formData: z.record(z.any()).describe('The form data submitted by the user.'),
  userEmail: z.string().email().describe('The email address of the user.'),
  userName: z.string().describe('The name of the user.'),
  trackingId: z.string().describe('The unique tracking ID for the submission.'),
});

export type PersonalizedEmailInput = z.infer<typeof PersonalizedEmailInputSchema>;

const PersonalizedEmailOutputSchema = z.object({
  emailBody: z.string().describe('The personalized email body.'),
  htmlSummary: z.string().describe('A self-contained HTML document summarizing the submission.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant that generates personalized thank you emails and creates an HTML summary of a form submission.

  Given the following form data for user {{{userName}}} ({{{userEmail}}}) with tracking ID {{{trackingId}}}:

  {{#each formData}}
    {{@key}}: {{{this}}}
  {{/each}}

  1.  **Generate a personalized thank you email body.** The tone should be appreciative and professional. Mention that a summary of their submission is attached.

  2.  **Generate a professional, self-contained HTML document for the 'htmlSummary' output field.**
      - The HTML should have a proper header with the company name "FormFlow Pro" and the title "Application Submission Summary".
      - It must include the user's name and the tracking ID.
      - It must display ALL key-value pairs from the formData in a clean, readable table or formatted list.
      - Style it nicely using inline CSS. Do not use any external stylesheets or fonts.
      - Ensure the HTML is a complete, single-file document starting with <!DOCTYPE html> and ending with </html>.
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
