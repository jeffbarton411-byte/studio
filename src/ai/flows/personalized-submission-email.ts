
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
  emailBody: z.string().describe('The personalized email body as a full HTML document.'),
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
  prompt: `You are an AI assistant that generates a professional, well-formatted, self-contained HTML document that looks like a service agreement. This single HTML output will be used for both the email body and a file attachment.

**Instructions:**
1.  Generate a single, complete, and self-contained HTML document. Use inline CSS for all styling. Do not use external stylesheets, images, or fonts, except for the logo.
2.  The main container should have a white background, be centered, with a max-width of 800px, have a subtle box-shadow, and padding.
3.  Use the Redwood logo: 'https://i.imgur.com/Puhj54j.png'.
4.  The document should precisely follow the structure, titles, and data fields from the user's example. Use horizontal rules (<hr>) to separate sections.
5.  All submitted user data must be included and clearly labeled.

**User & Submission Data:**
- User Name: {{{userName}}}
- Tracking ID: {{{trackingId}}}
- Form Data:
    - Dispatch Company: {{{formData.companyName}}}
    - Carrier Full Name: {{{formData.carrierFullName}}}
    - Carrier Company Name: {{{formData.carrierCompanyName}}}
    - MC Number: {{{formData.mcNumber}}}
    - DOT Number: {{{formData.dotNumber}}}
    - Phone Number: {{{formData.phoneNumber}}}
    - Services: {{{formData.services}}}
    - Payment Option: {{{formData.paymentMethod}}}
    - Signature: {{{formData.signature}}}
    - Print Name: {{{formData.printName}}}
    - Date: {{{formData.date}}}
    - Email: {{{formData.email}}}
    - How you get paid: {{{formData.howYouGetPaid}}}
    - Insurance Copy URL: {{{formData.insuranceCopy}}}
    - Factoring Documents URL: {{{formData.factoringDocuments}}}

**HTML Structure and Content:**

- **Logo:** Centered Redwood logo.
- **Main Title:** "TRUCKING SERVICE AGREEMENT" (bold, large font).
- **Subtitle:** "(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)" (centered, smaller font).
- **Introductory Text:** "This Agreement is made and entered into on {{{formData.date}}}, by and between {{{formData.companyName}}}".
- **Company Information Section:**
    - Title: "Company Information"
    - dispatchCompany: {{{formData.companyName}}}
- **Carrier Details Section:**
    - Title: "Carrier Details"
    - carrierFullName: {{{formData.carrierFullName}}}
    - companyName: {{{formData.carrierCompanyName}}}
    - mcNumber: {{{formData.mcNumber}}}
    - dotNumber: {{{formData.dotNumber}}}
    - phoneNumber: {{{formData.phoneNumber}}}
    - servicesWithFees: {{{formData.services}}}
- **Payment Section:**
    - Title: "Payment"
    - paymentOption: {{{formData.paymentMethod}}}
- **Final Agreement Section:**
    - Title: "Final Agreement"
    - signature: {{{formData.signature}}}
    - printName: {{{formData.printName}}}
    - email: {{{formData.email}}}
    - howYouGetPaid: {{{formData.howYouGetPaid}}}
- **Documents Section (New):**
    - Title: "Documents"
    - Copy of Insurance: [Link to formData.insuranceCopy or 'Not Provided']
    - Factoring Documents: [Link to formData.factoringDocuments or 'Not Provided']
- **Signature Area:**
    - Title: "Signature"
    - A box for the signature (use a styled div).
    - Below the box: "Signed by: {{{formData.printName}}}"
    - "Date: {{{formData.date}}}"

Begin the complete HTML document now.
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
