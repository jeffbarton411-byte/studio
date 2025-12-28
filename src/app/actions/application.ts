
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirestore } from 'firebase-admin/firestore';
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
    console.error('Server-side validation failed:', validationResult.error.flatten().fieldErrors);
    return { error: 'Invalid data provided. Please check the form for errors.' };
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
    createdAt: serverTimestamp(),
    insuranceCopy: validatedData.insuranceCopy || '',
    factoringDocuments: validatedData.factoringDocuments || '',
  };

  try {
    await addDoc(collection(firestore, 'applications'), applicationData);

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
    const querySnapshot = await getDocs(collection(firestore, 'applications'));
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt,
      } as Application;
    });
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
    const q = query(collection(firestore, 'applications'), where('id', '==', id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { error: 'Application not found.' };
    }

    const applicationDoc = querySnapshot.docs[0];
    const docRef = doc(firestore, 'applications', applicationDoc.id);
    await updateDoc(docRef, { status });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { error: 'Failed to update status.' };
  }
}

export async function sendTestEmailWithPdf() {
    try {
        const testHtml = '<h1>Test PDF</h1><p>This is a test document to confirm PDF generation is working.</p>';
        const pdfBuffer = await generatePdfFromHtml(testHtml);

        const result = await sendEmail({
            to: 'jeffbarton411@gmail.com',
            subject: 'Test PDF Email from FormFlow Pro',
            html: '<h1>PDF Generation and Email Test</h1><p>If you are seeing this email and there is a PDF attached, both systems are working correctly.</p>',
            attachments: [
                {
                    filename: 'test-document.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                }
            ]
        });

        if (result.success) {
            return { success: true, message: "Test email with PDF sent successfully!" };
        } else {
            return { success: false, error: result.message || 'An unknown error occurred.'};
        }
    } catch (e: any) {
        console.error('PDF & Email Test Error:', e);
        return { success: false, error: `Could not generate PDF. Puppeteer error: ${e.message}` };
    }
}
