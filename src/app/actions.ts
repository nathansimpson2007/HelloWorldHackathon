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

// Schema for busyness report
const busynessReportSchema = z.object({
  buildingId: z.string().min(1, 'Building is required.'),
  busyness: z.coerce.number().min(1).max(5),
  report: z.string().optional(),
});

export type BusynessState = {
  error?: string;
  success?: boolean;
  lastSubmittedBuilding?: string;
  reportsByBuilding: {
    [buildingId: string]: any[];
  };
};

// Action to add a busyness report to Firestore
export async function estimateBusynessAction(
  prevState: BusynessState,
  formData: FormData
): Promise<BusynessState> {
  const validatedFields = busynessReportSchema.safeParse({
    buildingId: formData.get('buildingId'),
    busyness: formData.get('busyness'),
    report: formData.get('report'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: validatedFields.error.flatten().fieldErrors.toString(),
    };
  }

  try {
    await addDoc(collection(db, 'busynessReports'), {
      ...validatedFields.data,
      timestamp: serverTimestamp(),
    });

    revalidatePath('/busyness-tool');
    revalidatePath(`/buildings/${validatedFields.data.buildingId}`);

    return {
      ...prevState,
      success: true,
      error: undefined,
      lastSubmittedBuilding: validatedFields.data.buildingId,
    };
  } catch (error) {
    console.error('Error adding busyness report: ', error);
    return {
      ...prevState,
      error: 'Could not save report to the database.',
    };
  }
}
