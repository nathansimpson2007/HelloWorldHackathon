
'use server';

import { z } from 'zod';
import { buildings } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MAX_REPORTS_PER_AREA = 10;

export interface ActivityReport {
  report: string;
  activity: number;
}

export interface ActivityData {
  reports: ActivityReport[];
  average: number;
  name: string;
}

export interface ActivityState {
  reportsByBuilding: Record<string, ActivityData>;
  lastSubmittedBuilding?: string;
  error?: string;
}

const formSchema = z.object({
  report: z.string(),
  buildingId: z.string().min(1, 'Please select a building.'),
  activity: z.string(),
});

export async function estimateActivityAction(
  prevState: ActivityState,
  formData: FormData
): Promise<ActivityState> {
  const validatedFields = formSchema.safeParse({
    report: formData.get('report'),
    buildingId: formData.get('buildingId'),
    activity: formData.get('activity'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid form data.',
    };
  }

  const { report, buildingId, activity: activityString } = validatedFields.data;
  const activity = parseInt(activityString, 10);

  const buildingInfo = buildings.find((b) => b.id.toString() === buildingId);

  if (!buildingInfo) {
    return { ...prevState, error: 'Invalid building selected.' };
  }

  try {
    await addDoc(collection(db, 'activityReports'), {
      buildingId,
      report,
      activity,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    return {
      ...prevState,
      error: 'Could not save report to the database.',
    };
  }

  // The client will now fetch data directly from Firestore,
  // so we just need to signal which building was updated.
  return {
    ...prevState,
    lastSubmittedBuilding: buildingId,
    error: undefined,
  };
}


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
