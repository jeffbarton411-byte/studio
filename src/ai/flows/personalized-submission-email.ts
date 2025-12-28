
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
  pdfContent: z.string().describe('A self-contained HTML document string to be converted to a PDF.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant that generates personalized thank you emails and formats submission data into a self-contained HTML document for PDF conversion.

  Given the following form data from user {{{userName}}} ({{{userEmail}}}):

  {{#each formData}}
    {{@key}}: {{{this}}}
  {{/each}}

  1.  **Generate a personalized thank you email body.** The tone should be appreciative and professional.
  2.  **Generate a self-contained HTML document string for the PDF.** This HTML should include all necessary styles inline or in a <style> tag. It must be a complete HTML document starting with <!DOCTYPE html>. It should be a clean, professional summary of the submitted data.
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
