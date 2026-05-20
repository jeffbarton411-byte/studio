
'use server';

import { z } from 'zod';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { generatePersonalizedEmail } from '@/ai/flows/personalized-submission-email';
import { sendEmail } from '@/lib/email';
import { headers } from 'next/headers';

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
    return { error: 'Invalid data provided.' };
  }

  const validatedData = validationResult.data;
  const app = getFirebaseAdminApp();
  const firestore = getFirestore(app);
  const trackingId = `MMM-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const adminEmail = 'jeffbarton@mode-transportation.com';
  
  const applicationData = {
    ...validatedData,
    id: trackingId,
    status: ApplicationStatus.Submitted,
    insuranceCopy: validatedData.insuranceCopy || '',
    factoringDocuments: validatedData.factoringDocuments || '',
    carrierCompanyName: validatedData.carrierCompanyName || '',
  };

  try {
    // 1. Attempt to save to Firestore
    const docRef = firestore.collection('applications').doc(trackingId);
    await docRef.set({
      ...applicationData,
      createdAt: FieldValue.serverTimestamp()
    });

    // 2. Attempt to send emails (non-critical, won't block success)
    try {
      const host = (await headers()).get('host');
      const isDevelopment = process.env.NODE_ENV === 'development';
      const baseUrl = isDevelopment ? `http://${host}` : 'https://drive4mmm.vercel.app';
      const trackingUrl = `${baseUrl}/track/${trackingId}`;
      const logoUrl = `${baseUrl}/logomm.png`;

      const emailOutput = await generatePersonalizedEmail({
        formData: validatedData,
        userEmail: validatedData.email,
        userName: validatedData.printName,
        trackingId: trackingId,
        trackingUrl: trackingUrl,
        logoUrl: logoUrl,
      });

      const htmlAttachment = Buffer.from(emailOutput.htmlAttachment, 'utf-8');

      await sendEmail({
          to: validatedData.email,
          subject: `drive4mmm Carrier Onboarding - ID: ${trackingId}`,
          html: emailOutput.htmlBody,
          attachments: [{
              filename: `drive4mmm-agreement-${trackingId}.html`,
              content: htmlAttachment,
              contentType: 'text/html',
          }]
      });

      await sendEmail({
        to: adminEmail,
        subject: `[NEW] drive4mmm Application - ${trackingId}`,
        html: emailOutput.htmlBody,
        attachments: [{
            filename: `drive4mmm-agreement-${trackingId}.html`,
            content: htmlAttachment,
            contentType: 'text/html',
        }]
      });
    } catch (emailError) {
      console.error('Application saved but email failed:', emailError);
    }

  } catch (dbError: any) {
    console.error('CRITICAL: Failed to save application to Firestore:', dbError);
    return { error: 'Failed to save application. Please try again or contact support.' };
  }

  // Redirect only after successful database write
  redirect(`/success/${trackingId}`);
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
                createdAt: data?.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            } as Application;
        }
        return null;
    } catch (error) {
        console.error('Error fetching application:', error);
        return null;
    }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  try {
    const app = getFirebaseAdminApp();
    const firestore = getFirestore(app);
    const docRef = firestore.collection('applications').doc(id);
    await docRef.update({ status });
    revalidatePath(`/track/${id}`); 
    return { success: true };
  } catch (error) {
    console.error('Error updating status:', error);
    return { error: 'Failed to update status.' };
  }
}
