'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { generatePersonalizedEmail } from '@/ai/flows/personalized-submission-email';
import { ApplicationStatus, type Application } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
});

export async function submitApplication(values: z.infer<typeof formSchema>) {
  const validationResult = formSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: 'Invalid data provided.' };
  }

  const trackingId = `FFP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      id: trackingId,
      ...validationResult.data,
      status: ApplicationStatus.Submitted,
      createdAt: serverTimestamp(),
    });

    console.log('Document written with ID: ', docRef.id);

    // Call GenAI flow to generate email content
    try {
      const emailContent = await generatePersonalizedEmail({
        formData: validationResult.data,
        userEmail: validationResult.data.email,
        userName: `${validationResult.data.firstName} ${validationResult.data.lastName}`,
      });
      // In a real application, you would use this content to send an email.
      console.log('Generated Email Body:', emailContent.emailBody);
      console.log('Generated PDF Content (Base64):', emailContent.pdfContent ? 'PDF content present' : 'No PDF content');
    } catch (aiError) {
      console.error("AI flow failed:", aiError);
      // We don't block submission if AI fails, but we log the error.
    }

  } catch (e) {
    console.error('Error adding document: ', e);
    return { error: 'Failed to save application to the database.' };
  }

  redirect(`/success/${trackingId}`);
}

export async function getApplications(): Promise<Application[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'applications'));
    const applications = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        // Firestore Timestamps need to be converted for client-side use if not using a converter
        createdAt: data.createdAt,
      } as Application;
    });
    // sort by creation date
    applications.sort((a, b) => b.createdAt.toMillis() - a.toMillis());
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  try {
    const querySnapshot = await getDocs(collection(db, 'applications'));
    const applicationDoc = querySnapshot.docs.find(doc => doc.data().id === id);

    if (!applicationDoc) {
      return { error: 'Application not found.' };
    }

    const docRef = doc(db, 'applications', applicationDoc.id);
    await updateDoc(docRef, { status });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { error: 'Failed to update status.' };
  }
}
