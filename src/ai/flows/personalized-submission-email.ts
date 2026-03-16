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
  logoUrl: z.string().url().describe('The public URL to the company logo.'),
});

export type PersonalizedEmailInput = z.infer<typeof PersonalizedEmailInputSchema>;

const PersonalizedEmailOutputSchema = z.object({
  htmlBody: z.string().describe('A single, self-contained, and well-formatted HTML document for the email body.'),
  htmlAttachment: z.string().describe('A single, self-contained, and well-formatted HTML document for the attachment, styled as a service agreement.'),
});

export type PersonalizedEmailOutput = z.infer<typeof PersonalizedEmailOutputSchema>;

export async function generatePersonalizedEmail(input: PersonalizedEmailInput): Promise<PersonalizedEmailOutput> {
  return personalizedEmailFlow(input);
}

const personalizedEmailPrompt = ai.definePrompt({
  name: 'personalizedEmailPrompt',
  input: {schema: PersonalizedEmailInputSchema},
  output: {schema: PersonalizedEmailOutputSchema},
  prompt: `You are an AI assistant. Your task is to generate TWO distinct, well-formatted, self-contained HTML documents based on the provided user submission data.

**CRITICAL INSTRUCTIONS:**
1.  **Generate TWO Documents:** You must populate two fields in the output: \`htmlBody\` and \`htmlAttachment\`.
2.  **Inline CSS ONLY:** For both documents, all styling MUST be inline using the 'style' attribute. Do NOT use <style> blocks. This is for email client compatibility.
3.  **Readable HTML Source:** The generated HTML source code for both documents must be well-formatted with proper indentation. Do NOT minify the HTML.

---

**DOCUMENT 1: Email Body (\`htmlBody\`)**

**Purpose:** This is a confirmation email.
**Content:**
*   A "Thank You" message.
*   The user's tracking ID.
*   A prominent "Track Your Submission" button that links to the provided \`trackingUrl\`.
*   A highly visible warning for the user to download the attachment.
*   A list of all the user's submitted data, neatly organized.
*   A section for "Uploaded Documents" with links to view them.
*   The company regards and footer.

**Data to use:**
- User Name: {{{userName}}}
- Tracking ID: {{{trackingId}}}
- Tracking URL: {{{trackingUrl}}}
- Form Data: {{{formData}}}
- Insurance Copy URL: {{{formData.insuranceCopy}}}
- Factoring Documents URL: {{{formData.factoringDocuments}}}

**HTML Structure for \`htmlBody\`:**
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Form Submission Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #ffffff; border-radius: 8px;">
    <h1 style="font-size: 24px; text-align: center; margin-bottom: 20px;">Form Submission Confirmation</h1>
    <p>Dear {{{userName}}},</p>
    <p>Thank you for your submission. Your application has been received and is being processed. You can track the status of your application using the button below.</p>
    
    <div style="margin: 20px 0; padding: 15px; background-color: #fffbe6; border: 1px solid #ffe58f; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #d46b08;">
        &#9888; IMPORTANT: For best results, please DOWNLOAD the attached service agreement to your computer before viewing. Do not open it directly in your email client.
      </p>
    </div>
    
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
    <h2>Submission Summary</h2>
    <p><strong>Tracking ID:</strong> {{{trackingId}}}</p>
    <p><strong>Status:</strong> Submitted</p>
    
    <h3 style="margin-top:20px; border-bottom: 1px solid #eee; padding-bottom: 5px;">General Information</h3>
    <p><strong>Name:</strong> {{{userName}}}</p>
    <p><strong>Email:</strong> {{{formData.email}}}</p>
    <p><strong>Phone:</strong> {{{formData.phoneNumber}}}</p>
    
    <h3 style="margin-top:20px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Company & Carrier Details</h3>
    <p><strong>Dispatch Company:</strong> {{{formData.companyName}}}</p>
    <p><strong>Carrier Full Name:</strong> {{{formData.carrierFullName}}}</p>
    <p><strong>Carrier Company Name:</strong> {{{formData.carrierCompanyName}}}</p>
    <p><strong>MC Number:</strong> {{{formData.mcNumber}}}</p>
    <p><strong>DOT Number:</strong> {{{formData.dotNumber}}}</p>

    <h3 style="margin-top:20px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Services & Payment</h3>
    <p><strong>Selected Services:</strong> {{{formData.services}}}</p>
    <p><strong>Service Fee Payment:</strong> {{{formData.paymentMethod}}}</p>
    <p><strong>How you get paid:</strong> {{{formData.howYouGetPaid}}}</p>

    <h3 style="margin-top:20px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Uploaded Documents</h3>
    <p><strong>Copy of Insurance:</strong> <a href="{{{formData.insuranceCopy}}}">View Document</a></p>
    <p><strong>Factoring Documents:</strong> <a href="{{{formData.factoringDocuments}}}">View Document</a></p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="{{{trackingUrl}}}" style="display: inline-block; padding: 12px 25px; background-color: #1581C6; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Track Your Submission</a>
    </div>
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
    <p>Regards,</p>
<p>The Global Tranz Team</p>

<p style="margin: 0;">
  <strong style="color: #1581C6;">Global Tranz</strong><br>
  DALLAS HEADQUARTERS<br>
  14785 Preston Road, Suite 850<br>
  Dallas, TX 75254<br>
  <a href="tel:8004348881" style="color: #1581C6; text-decoration: none;">
    800.434.8881
  </a>
</p>

  </div>
</body>
</html>

---

**DOCUMENT 2: HTML Attachment (\`htmlAttachment\`)**

**Purpose:** This is a formal service agreement document for the user to keep. It must precisely match the layout and content of the user's reference image.
**Content:**
*   The "Global Tranz" logo (use the provided \`logoUrl\`).
*   The title "TRUCKING SERVICE AGREEMENT".
*   The agreement date.
*   Sections for "Company Information", "Carrier Details", "Payment", and "Final Agreement".
*   A placeholder for a signature.

**Data to use:**
- Logo URL: {{{logoUrl}}}
- Agreement Date: {{{formData.date}}}
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

**HTML Structure for \`htmlAttachment\` (Must be a replica of the user's image):**
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Trucking Service Agreement - {{{trackingId}}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fff;">
  <div style="width: 800px; margin: 40px auto; padding: 40px; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 40px;">
      <img src="{{{logoUrl}}}" alt="Global Tranz Logo" style="width: 200px; height: auto;">
    </div>
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; margin: 0;">TRUCKING SERVICE AGREEMENT</h1>
      <p style="font-size: 14px; color: #555;">(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)</p>
    </div>
    <p style="font-size: 14px; margin-bottom: 30px;">This Agreement is made and entered into on {{{formData.date}}}, by and between Global Tranz and the carrier.</p>
    
    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Company Information</h2>
      <p style="font-size: 14px;"><strong>dispatchCompany:</strong> {{{formData.companyName}}}</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Carrier Details</h2>
      <p style="font-size: 14px;"><strong>carrierFullName:</strong> {{{formData.carrierFullName}}}</p>
      <p style="font-size: 14px;"><strong>companyName:</strong> {{{formData.carrierCompanyName}}}</p>
      <p style="font-size: 14px;"><strong>mcNumber:</strong> {{{formData.mcNumber}}}</p>
      <p style="font-size: 14px;"><strong>dotNumber:</strong> {{{formData.dotNumber}}}</p>
      <p style="font-size: 14px;"><strong>phoneNumber:</strong> {{{formData.phoneNumber}}}</p>
      <p style="font-size: 14px;"><strong>servicesWithFees:</strong> {{{formData.services}}}</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Payment</h2>
      <p style="font-size: 14px;"><strong>paymentOption:</strong> {{{formData.paymentMethod}}}</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px;">Final Agreement</h2>
      <p style="font-size: 14px;"><strong>signature:</strong> {{{formData.signature}}}</p>
      <p style="font-size: 14px;"><strong>printName:</strong> {{{formData.printName}}}</p>
      <p style="font-size: 14px;"><strong>email:</strong> {{{formData.email}}}</p>
      <p style="font-size: 14px;"><strong>howYouGetPaid:</strong> {{{formData.howYouGetPaid}}}</p>
    </div>

    <div style="margin-top: 50px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">Signature:</h2>
        <div style="border: 1px solid #000; height: 100px; width: 300px; margin-bottom: 10px;"></div>
        <p style="font-size: 14px;"><strong>Signed by:</strong> {{{formData.printName}}}</p>
        <p style="font-size: 14px;"><strong>Date:</strong> {{{formData.date}}}</p>
    </div>
  </div>
</body>
</html>
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
    if (!output || !output.htmlBody || !output.htmlAttachment) {
      console.error("AI failed to generate email content, using fallback.");
      const fallbackHtmlBody = `
        <h1>Submission Received</h1>
        <p>Thank you, ${input.userName}.</p>
        <p>Your tracking ID is: ${input.trackingId}</p>
        <a href="${input.trackingUrl}">Track your submission</a>
      `;
       const fallbackHtmlAttachment = `<h1>Service Agreement for ${input.trackingId}</h1><p>Data: ${JSON.stringify(input.formData)}</p>`;

      return { htmlBody: fallbackHtmlBody, htmlAttachment: fallbackHtmlAttachment };
    }

    return output;
  }
);