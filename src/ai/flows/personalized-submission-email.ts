
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
  htmlBody: z.string().describe('A single, self-contained, and well-formatted HTML document summarizing the submission.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant tasked with generating a single, professional, and well-formatted HTML document for a form submission confirmation. This document will be used as both an email body and an HTML file attachment.

**CRITICAL INSTRUCTIONS:**
1.  **Single HTML Output:** Generate ONE complete, self-contained HTML document. The final output must be a single string in the 'htmlBody' field.
2.  **Inline CSS ONLY:** All styling MUST be inline using the 'style' attribute on each HTML tag. Do NOT use <style> blocks or external stylesheets. This is for maximum email client compatibility.
3.  **Readable HTML:** The generated HTML source code itself must be well-formatted with proper indentation and line breaks. Do NOT minify the HTML.
4.  **Layout and Content:** The design must precisely follow the user's reference image structure and content.
    *   Use a centered main container (max-width: 600px) with a white background, padding, a subtle border, and a readable, web-safe font like Arial.
    *   Use horizontal rules (<hr>) to separate the logical sections.
    *   Include all user data, clearly labeled.
    *   Create a prominent blue "Track Your Submission" button linking to the provided trackingUrl.

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

**HTML Structure Template (Follow this structure):**
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Form Submission Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #ffffff; border-radius: 8px;">
    
    <h1 style="font-size: 28px; text-align: center; margin-bottom: 20px;">Form Submission Confirmation</h1>
    <p>Dear {{{userName}}},</p>
    <p>Thank you for your submission...</p>
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">

    <h2>General Information</h2>
    <p><strong>Tracking ID:</strong> {{{trackingId}}}</p>
    <p><strong>Status:</strong> Submitted</p>
    <p><strong>Name:</strong> {{{userName}}}</p>
    <p><strong>Email:</strong> {{{formData.email}}}</p>
    <p><strong>Phone:</strong> {{{formData.phoneNumber}}}</p>
    <hr>
    
    <!-- Add other sections (Company, Carrier, Payment, Signature, Documents) following this pattern -->
    
    <h2>Uploaded Documents</h2>
    <p><strong>Copy of Insurance:</strong> <a href="{{{formData.insuranceCopy}}}">View Document</a></p>
    <p><strong>Factoring Documents:</strong> <a href="{{{formData.factoringDocuments}}}">View Document</a></p>
    <hr>

    <div style="text-align: center; margin-top: 30px;">
      <a href="{{{trackingUrl}}}" style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Submission</a>
    </div>
    <hr>

    <p>Regards,</p>
    <p>The w-wex.com Team</p>
    <p style="font-size: 13px; color: #888888;">WORLDWIDE EXPRESS OPERATIONS LLC | ...</p>
  </div>
</body>
</html>

Generate the complete, well-formatted HTML document now.
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
    if (!output || !output.htmlBody) {
      console.error("AI failed to generate email body, using fallback.");
      const fallbackHtml = `
        <h1>Submission Received</h1>
        <p>Thank you, ${input.userName}.</p>
        <p>Your tracking ID is: ${input.trackingId}</p>
        <a href="${input.trackingUrl}">Track your submission</a>
      `;
      return { htmlBody: fallbackHtml };
    }

    return output;
  }
);
