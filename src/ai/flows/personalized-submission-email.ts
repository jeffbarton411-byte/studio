'use server';

/**
 * @fileOverview Generates a personalized drive4mmm confirmation email.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedEmailInputSchema = z.object({
  formData: z.record(z.any()).describe('The form data submitted by the user.'),
  userEmail: z.string().email().describe('The email address of the user.'),
  userName: z.string().describe('The name of the user.'),
  trackingId: z.string().describe('The unique tracking ID for the submission.'),
  trackingUrl: z.string().url().describe('The URL to the tracking page for this submission.'),
  logoUrl: z.string().url().describe('The public URL to the company logo.'),
});

export type PersonalizedEmailInput = z.infer<typeof PersonalizedEmailInputSchema>;

const PersonalizedEmailOutputSchema = z.object({
  htmlBody: z.string().describe('HTML document for the email body.'),
  htmlAttachment: z.string().describe('HTML document for the service agreement attachment.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant for drive4mmm. Generate confirmation documents.

**CRITICAL:** Use #20.5 90.2% 48.2% (Orange) as the primary branding color. Use Dark UI aesthetics.

**EMAIL BODY:**
Subject: drive4mmm Onboarding Initiated [{{{trackingId}}}]
- Welcome {{{userName}}} to drive4mmm.
- Tracking ID: {{{trackingId}}}
- Link to {{{trackingUrl}}}
- Warning to download agreement.

**ATTACHMENT:**
Title: drive4mmm SERVICE AGREEMENT
Includes all fields from {{{formData}}} neatly styled as a modern elite contract.
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
    
    if (!output || !output.htmlBody || !output.htmlAttachment) {
      return { 
        htmlBody: `<h1>drive4mmm Received</h1><p>Thanks ${input.userName}. ID: ${input.trackingId}</p>`, 
        htmlAttachment: `<h1>Agreement for ${input.trackingId}</h1>` 
      };
    }

    return output;
  }
);
