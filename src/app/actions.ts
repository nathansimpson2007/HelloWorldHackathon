'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const busynessReportSchema = z.object({
  locationId: z.string().min(1),
  rating: z.number().min(1).max(5),
});

export async function submitBusynessReport(
  locationId: string,
  rating: number
) {
  const validatedFields = busynessReportSchema.safeParse({
    locationId,
    rating,
  });

  if (!validatedFields.success) {
    throw new Error('Invalid busyness report data');
  }

  try {
    await addDoc(collection(db, 'activityReports'), {
      buildingId: validatedFields.data.locationId,
      activityLevel: validatedFields.data.rating,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Could not save busyness report to the database.');
  }
}
