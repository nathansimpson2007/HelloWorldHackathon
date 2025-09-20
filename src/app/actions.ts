'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Action to add an alert to Firestore
const alertSchema = z.object({
  category: z.string().min(1),
  details: z.string().min(1),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export async function addAlert(data: unknown) {
  const validatedFields = alertSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid alert data');
  }

  try {
    await addDoc(collection(db, 'alerts'), {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Could not save alert to the database.');
  }
}

const activityReportSchema = z.object({
  buildingId: z.string().min(1, 'Building is required.'),
  activityLevel: z.coerce.number().min(1).max(5),
  details: z.string().optional(),
});

export async function addActivityReport(data: FormData) {
    const validatedFields = activityReportSchema.safeParse({
        buildingId: data.get('buildingId'),
        activityLevel: data.get('activityLevel'),
        details: data.get('details'),
    });

    if (!validatedFields.success) {
        throw new Error('Invalid report data.');
    }

    try {
        await addDoc(collection(db, 'activityReports'), {
            ...validatedFields.data,
            timestamp: serverTimestamp(),
        });
        revalidatePath('/activity-tool');
        revalidatePath(`/buildings/${validatedFields.data.buildingId}`);
    } catch (error) {
        console.error('Error adding activity report: ', error);
        throw new Error('Could not save activity report.');
    }
}
