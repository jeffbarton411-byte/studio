'use server';

import { z } from 'zod';
import { collection, addDoc, serverTimestamp, getDocs, query, where, getDoc, doc, updateDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { generatePersonalizedEmail } from '@/ai/flows/personalized-submission-email';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { getSdks } from '@/firebase';

const formSchema = z.object({
  companyName: z.string(),
  signature: z.string(),
  printName: z.string(),
  date: z.string(),
  email: z.string().email(),
  howYouGetPaid: z.string(),
  carrierFullName: z.string(),
  carrierCompanyName: z.string().optional(),
  mcNumber: z.string(),
  dotNumber: z.string(),
  phoneNumber: z.string(),
  services: z.array(z.string()),
  paymentMethod: z.string(),
  insuranceCopy: z.string().optional(),
  factoringDocuments: z.string().optional(),
});

export async function submitApplication(values: z.infer<typeof formSchema>) {
  const validationResult = formSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: 'Invalid data provided.' };
  }

  const { firestore } = getSdks();
  const trackingId = `FFP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    const docRef = await addDoc(collection(firestore, 'applications'), {
      id: trackingId,
      ...validationResult.data,
      status: ApplicationStatus.Submitted,
      createdAt: serverTimestamp(),
    });

    console.log('Document written with ID: ', docRef.id);

    // // Call GenAI flow to generate email content
    // try {
    //   const emailContent = await generatePersonalizedEmail({
    //     formData: validationResult.data,
    //     userEmail: validationResult.data.email,
    //     userName: `${validationResult.data.firstName} ${validationResult.data.lastName}`,
    //   });
    //   // In a real application, you would use this content to send an email.
    //   console.log('Generated Email Body:', emailContent.emailBody);
    //   console.log('Generated PDF Content (Base64):', emailContent.pdfContent ? 'PDF content present' : 'No PDF content');
    // } catch (aiError) {
    //   console.error("AI flow failed:", aiError);
    //   // We don't block submission if AI fails, but we log the error.
    // }

  } catch (e) {
    console.error('Error adding document: ', e);
    return { error: 'Failed to save application to the database.' };
  }

  redirect(`/success/${trackingId}`);
}

export async function getApplications(): Promise<Application[]> {
  try {
    const { firestore } = getSdks();
    const querySnapshot = await getDocs(collection(firestore, 'applications'));
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        // Firestore Timestamps need to be converted for client-side use if not using a converter
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
    const { firestore } = getSdks();
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
