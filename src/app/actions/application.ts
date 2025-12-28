
'use server';

import { z } from 'zod';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { generatePersonalizedEmail } from '@/ai/flows/personalized-submission-email';
import { sendEmail } from '@/lib/email';


const formSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  signature: z.string().min(1, 'Signature is required'),
  printName: z.string().min(1, 'Printed Name is required'),
  date: z.string().min(1, 'Date is required'),
  email: z.string().email('Invalid email address'),
  howYouGetPaid: z.string().min(1, 'Payment method is required'),
  carrierFullName: z.string().min(1, 'Carrier Full Name is required'),
  carrierCompanyName: z.string().optional(),
  mcNumber: z.string().min(1, 'MC Number is required'),
  dotNumber: z.string().min(1, 'DOT Number is required'),
  phoneNumber: z.string().min(1, 'Phone Number is required'),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  insuranceCopy: z.string().optional(),
  factoringDocuments: z.string().optional(),
});


async function generatePdfFromHtml(htmlContent: string): Promise<Buffer> {
  // The AI will provide the actual content.
  try {
    return Buffer.from(htmlContent, 'utf-8');
  } catch (error) {
    console.error('Error in generatePdfFromHtml:', error);
    throw new Error('Could not generate PDF content.');
  }
}


export async function submitApplication(values: z.infer<typeof formSchema>) {
  const validationResult = formSchema.safeParse(values);

  if (!validationResult.success) {
    console.error('Server-side validation failed:', validationResult.error.flatten());
    const errorMessage = 'Invalid data provided. Please check the form for errors. Details: ' + JSON.stringify(validationResult.error.flatten());
    return { error: errorMessage };
  }

  const validatedData = validationResult.data;

  const app = getFirebaseAdminApp();
  const firestore = getFirestore(app);
  const trackingId = `FFP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const adminEmail = 'jeffbarton411@gmail.com';
  
  const applicationData = {
    ...validatedData,
    id: trackingId,
    status: ApplicationStatus.Submitted,
    createdAt: FieldValue.serverTimestamp(),
    insuranceCopy: validatedData.insuranceCopy || '',
    factoringDocuments: validatedData.factoringDocuments || '',
  };

  try {
    const collectionRef = firestore.collection('applications');
    await collectionRef.add(applicationData);

    generatePersonalizedEmail({
      formData: validatedData,
      userEmail: validatedData.email,
      userName: validatedData.printName,
    }).then(async emailOutput => {
      console.log('Successfully generated email content for', trackingId);
      
      const pdfBuffer = Buffer.from(emailOutput.pdfBase64, 'base64');

      await sendEmail({
          to: validatedData.email,
          subject: `Your Application Submission (${trackingId})`,
          html: emailOutput.emailBody,
          attachments: [
              {
                  filename: `submission-${trackingId}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf',
              }
          ]
      });
      console.log('Successfully sent email to user for', trackingId);

      await sendEmail({
        to: adminEmail,
        subject: `New Application Received: ${validatedData.printName} (${trackingId})`,
        html: emailOutput.emailBody,
         attachments: [
              {
                  filename: `submission-${trackingId}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf',
              }
          ]
      });
      console.log('Successfully sent email to admin for', trackingId);


    }).catch(err => {
      console.error('Failed to generate or send personalized email for', trackingId, err);
    });

  } catch (e: any) {
    console.error('Error adding document: ', e);
    return { error: e.message || 'Failed to save application to the database.' };
  }

  redirect(`/success/${trackingId}`);
}

export async function getApplications(): Promise<Application[]> {
  try {
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);
    const querySnapshot = await firestore.collection('applications').get();
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt, // This will be a Firestore Timestamp
      } as Application;
    });
    // @ts-ignore
    applications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  try {
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);
    const q = firestore.collection('applications').where('id', '==', id);
    const querySnapshot = await q.get();
    
    if (querySnapshot.empty) {
      return { error: 'Application not found.' };
    }

    const applicationDoc = querySnapshot.docs[0];
    const docRef = firestore.collection('applications').doc(applicationDoc.id);
    await docRef.update({ status });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { error: 'Failed to update status.' };
  }
}

export async function sendTestEmailWithPdf() {
    try {
        const { generatePersonalizedEmail } = await import('@/ai/flows/personalized-submission-email');
        const emailOutput = await generatePersonalizedEmail({
            formData: {
                test: "This is a test submission from the debug page.",
                anotherField: 12345
            },
            userEmail: "test@example.com",
            userName: "Debug User"
        });

        if (!emailOutput.pdfBase64) {
            throw new Error("AI did not return PDF content.");
        }
        
        const pdfBuffer = Buffer.from(emailOutput.pdfBase64, 'base64');

        const result = await sendEmail({
            to: 'jeffbarton411@gmail.com',
            subject: 'Test PDF Email from FormFlow Pro',
            html: `<h1>AI-Generated PDF & Email Test</h1><p>The AI-generated email body is below:</p><hr>${emailOutput.emailBody}`,
            attachments: [
                {
                    filename: 'test-document.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]
        });

        if (result.success) {
            return { success: true, message: "Test email with AI-generated PDF sent successfully!" };
        } else {
            return { success: false, error: result.message || 'An unknown error occurred.'};
        }
    } catch (e: any) {
        console.error('PDF & Email Test Error:', e);
        return { success: false, error: `Could not generate or send PDF. Error: ${e.message}` };
    }
}
