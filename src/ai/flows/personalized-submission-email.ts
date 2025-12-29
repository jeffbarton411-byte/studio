
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
  trackingUrl: z.string().url().describe('The URL to the tracking page for this submission.'),
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
  prompt: `You are an AI assistant that generates a professional, well-formatted, self-contained HTML document for a form submission confirmation email. This single HTML output will be used for both the email body and a file attachment.

**Instructions:**
1.  Generate a single, complete, and self-contained HTML document. Use inline CSS for all styling to ensure maximum email client compatibility. Do not use external or even embedded stylesheets.
2.  The main container should have a white background, be centered with a max-width of 600px, have a subtle border, and consistent padding. Use a common, web-safe font like Arial.
3.  The document must precisely follow the structure and titles from the user's reference image. Use horizontal rules (<hr>) to separate sections.
4.  All submitted user data must be included and clearly labeled.
5.  Create a prominent "Track Your Submission" button that links to the provided trackingUrl.

**User & Submission Data:**
- User Name: {{{userName}}}
- Tracking ID: {{{trackingId}}}
- Tracking URL: {{{trackingUrl}}}
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

- **Main Title:** "Form Submission Confirmation" (centered, large font).
- **Greeting:** "Dear {{{userName}}},"
- **Introductory Text:** "Thank you for your submission. We have received your details and will process them shortly. Below is a summary of your submission."
- **General Information Section:**
    - Title: "General Information"
    - Tracking ID: {{{trackingId}}}
    - Status: Submitted
    - Name: {{{userName}}}
    - Email: {{{formData.email}}}
    - Phone: {{{formData.phoneNumber}}}
- **Step 1: Company Information Section:**
    - Title: "Step 1: Company Information"
    - Dispatch Company: {{{formData.companyName}}}
- **Step 2: Carrier Details Section:**
    - Title: "Step 2: Carrier Details"
    - Carrier Full Name: {{{formData.carrierFullName}}}
    - Company Name: {{{formData.carrierCompanyName}}}
    - MC Number: {{{formData.mcNumber}}}
    - DOT Number: {{{formData.dotNumber}}}
    - Phone Number: {{{formData.phoneNumber}}}
    - Services: {{{formData.services}}}
- **Step 3: Payment Section:**
    - Title: "Step 3: Payment"
    - Payment Option: {{{formData.paymentMethod}}}
- **Step 4: Signature Section:**
    - Title: "Step 4: Signature"
    - Print Name: {{{formData.printName}}}
    - Email: {{{formData.email}}}
    - How you get paid: {{{formData.howYouGetPaid}}}
- **Tracking Button:**
    - A styled blue button with the text "Track Your Submission" that links to {{{trackingUrl}}}.
- **Footer:**
    - "Regards,"
    - "The w-wex.com Team"
    - "WORLDWIDE EXPRESS OPERATIONS LLC | 2700 COMMERCE STREET SUITE 1500 DALLAS, TX 75226"
    - "Contact: +1 307 204 4313 | Email: stevebrown@w-wex.com"

Generate the complete HTML document now.
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
    
    // Fallback: If AI fails, generate a simpler HTML body.
    if (!output || !output.emailBody) {
      console.error("AI failed to generate email body, using fallback.");
      const fallbackHtml = `
        <h1>Submission Received</h1>
        <p>Thank you, ${input.userName}.</p>
        <p>Your tracking ID is: ${input.trackingId}</p>
        <a href="${input.trackingUrl}">Track your submission</a>
      `;
      return { emailBody: fallbackHtml, htmlSummary: fallbackHtml };
    }

    return output;
  }
);
