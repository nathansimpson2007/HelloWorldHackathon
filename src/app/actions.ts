
'use server';

import { z } from 'zod';
import { buildings } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Schema for validating activity report submissions
const activityReportSchema = z.object({
  report: z.string().optional(),
  buildingId: z.string().min(1, 'Please select a building.'),
  activity: z.number().min(1).max(5),
});

/**
 * Server action to save a new activity report to Firestore.
 * @param data - The activity report data from the form.
 */
export async function submitActivityReport(data: unknown) {
  const validatedFields = activityReportSchema.safeParse(data);

  if (!validatedFields.success) {
    // Construct a more informative error message
    const errorMessages = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      success: false,
      error: `Invalid form data: ${errorMessages}`,
    };
  }

  const { buildingId, report, activity } = validatedFields.data;

  // Verify the building exists
  const buildingInfo = buildings.find((b) => b.id.toString() === buildingId);
  if (!buildingInfo) {
    return {
        success: false,
        error: 'Invalid building selected.'
    };
  }

  try {
    // Add the validated document to Firestore
    await addDoc(collection(db, 'activityReports'), {
      buildingId,
      report,
      activity,
      timestamp: serverTimestamp(),
    });
    return { success: true, buildingName: buildingInfo.name };
  } catch (error) {
    console.error('Error adding document to Firestore: ', error);
    return {
      success: false,
      error: 'Could not save your report. Please try again later.',
    };
  }
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
