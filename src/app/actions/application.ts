
'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { generatePersonalizedEmail } from '@/ai/flows/personalized-submission-email';

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
  paymentMethod: zstring().min(1, 'Payment method is required'),
  insuranceCopy: z.string().optional(),
  factoringDocuments: z.string().optional(),
});


export async function submitApplication(values: z.infer<typeof formSchema>) {
  const validationResult = formSchema.safeParse(values);

  if (!validationResult.success) {
    // Log the detailed validation errors for debugging
    console.error('Validation failed:', validationResult.error.flatten().fieldErrors);
    return { error: 'Invalid data provided. Please check the form for errors.' };
  }

  const app = getFirebaseAdminApp();
  const firestore = getFirestore(app);
  const trackingId = `FFP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const applicationData = {
    id: trackingId,
    ...validationResult.data,
    status: ApplicationStatus.Submitted,
    createdAt: serverTimestamp(),
  };

  try {
    // Save to Firestore
    await addDoc(collection(firestore, 'applications'), applicationData);

    // Concurrently generate and send the email
    // We don't need to `await` this if we don't want to block the user's redirect.
    // The email sending will happen in the background.
    generatePersonalizedEmail({
      formData: validationResult.data,
      userEmail: validationResult.data.email,
      userName: validationResult.data.printName,
    }).then(emailOutput => {
      console.log('Successfully generated email content for', trackingId);
      // Here you would integrate with your email sending service (e.g., Nodemailer, SendGrid)
      // For now, we are just logging the output.
      // console.log('Email Body:', emailOutput.emailBody);
      // console.log('PDF Content:', emailOutput.pdfContent);
    }).catch(err => {
      console.error('Failed to generate personalized email for', trackingId, err);
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
    // sort by creation date
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
