
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
  prompt: `You are an AI assistant that generates a professional, well-formatted, self-contained HTML email to confirm a user's form submission. The design should closely match the provided user example.

  **Instructions:**
  1.  Generate a single, complete, and self-contained HTML document. This same HTML will be used for both the 'emailBody' and 'htmlSummary' output fields.
  2.  The HTML must include inline CSS for styling. Do not use external or hosted stylesheets, images, or fonts.
  3.  The main content should be in a centered container with a white background and subtle box shadow.
  4.  The email must contain all the user's submitted data, organized into the sections shown in the example.
  5.  Include a "Track Your Submission" button that links to \`https://[YOUR_APP_URL]/track/{{{trackingId}}}\`. The button should be styled with a blue background.
  6.  Add a new "Step 5: Documents" section to display links to the uploaded documents. If a document URL is present, display a link; otherwise, state "Not Provided".
  7.  The footer should contain the specified company details.

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
    - Email: {{{formData.email}}}
    - How you get paid: {{{formData.howYouGetPaid}}}
    - Insurance Copy URL: {{{formData.insuranceCopy}}}
    - Factoring Documents URL: {{{formData.factoringDocuments}}}

  **HTML Structure and Content:**

  - **Header:** "Form Submission Confirmation"
  - **Greeting:** "Dear {{{userName}}},"
  - **Intro:** "Thank you for your submission. We have received your details and will process them shortly. Below is a summary of your submission."
  - **General Information:**
    - Tracking ID: {{{trackingId}}}
    - Status: Submitted
    - Name: {{{formData.printName}}}
    - Email: {{{formData.email}}}
    - Phone: {{{formData.phoneNumber}}}
  - **Step 1: Company Information**
    - Dispatch Company: {{{formData.companyName}}}
  - **Step 2: Carrier Details**
    - Carrier Full Name: {{{formData.carrierFullName}}}
    - Company Name: {{{formData.carrierCompanyName}}}
    - MC Number: {{{formData.mcNumber}}}
    - DOT Number: {{{formData.dotNumber}}}
    - Phone Number: {{{formData.phoneNumber}}}
    - Services: {{{formData.services}}}
  - **Step 3: Payment**
    - Payment Option: {{{formData.paymentMethod}}}
  - **Step 4: Signature**
    - Print Name: {{{formData.printName}}}
    - Email: {{{formData.email}}}
    - How you get paid: {{{formData.howYouGetPaid}}}
  - **Step 5: Documents**
    - Copy of Insurance: [Link to formData.insuranceCopy or 'Not Provided']
    - Factoring Documents: [Link to formData.factoringDocuments or 'Not Provided']
  - **Button:** "Track Your Submission"
  - **Footer:** "Regards, The w-wex.com Team", "WORLDWIDE EXPRESS OPERATIONS LLC | 2700 COMMERCE STREET SUITE 1500 DALLAS, TX 75226", "Contact: +1 307 204 4313 | Email: stevebrown@w-wex.com"

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
