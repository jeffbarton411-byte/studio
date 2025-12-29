
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
  
  const applicationData: Omit<Application, 'createdAt'> = {
    ...validatedData,
    id: trackingId,
    status: ApplicationStatus.Submitted,
    insuranceCopy: validatedData.insuranceCopy || '',
    factoringDocuments: validatedData.factoringDocuments || '',
  };

  try {
    const docRef = firestore.collection('applications').doc(trackingId);
    await docRef.set({
      ...applicationData,
      createdAt: FieldValue.serverTimestamp()
    });

    // Fire-and-forget the email generation and sending
    generatePersonalizedEmail({
      formData: validatedData,
      userEmail: validatedData.email,
      userName: validatedData.printName,
      trackingId: trackingId
    }).then(async emailOutput => {
      console.log('Successfully generated email content for', trackingId);
      
      const htmlAttachment = Buffer.from(emailOutput.htmlSummary, 'utf-8');

      // Send to user
      await sendEmail({
          to: validatedData.email,
          subject: `Your Application Submission (${trackingId})`,
          html: emailOutput.emailBody,
          attachments: [
              {
                  filename: `submission-${trackingId}.pdf`,
                  content: htmlAttachment,
                  contentType: 'application/pdf',
              }
          ]
      });
      console.log('Successfully sent email to user for', trackingId);

      // Send to admin
      await sendEmail({
        to: adminEmail,
        subject: `New Application Received: ${validatedData.printName} (${trackingId})`,
        html: emailOutput.emailBody,
         attachments: [
              {
                  filename: `submission-${trackingId}.pdf`,
                  content: htmlAttachment,
                  contentType: 'application/pdf',
              }
          ]
      });
      console.log('Successfully sent email to admin for', trackingId);

    }).catch(err => {
      // Log the error but don't block the user flow
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
    const querySnapshot = await firestore.collection('applications').orderBy('createdAt', 'desc').get();
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt, // This will be a Firestore Timestamp
      } as Application;
    });
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export async function getApplicationById(id: string): Promise<Application | null> {
    try {
        const app = getFirebaseAdminApp();
        const firestore = getFirestore(app);
        const docRef = firestore.collection('applications').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            return {
                ...data,
                 // @ts-ignore
                createdAt: data.createdAt.toDate().toISOString(),
            } as Application;
        }
        return null;
    } catch (error) {
        console.error("Error fetching application by ID:", error);
        return null;
    }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  try {
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);
    const docRef = firestore.collection('applications').doc(id);
    await docRef.update({ status });

    revalidatePath('/admin');
    revalidatePath(`/track/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { error: 'Failed to update status.' };
  }
}
