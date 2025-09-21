'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
} from 'firebase/firestore';

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
  message: z.string().max(100).optional(),
});

export async function submitBusynessReport(
  locationId: string,
  rating: number,
  message?: string
) {
  const validatedFields = busynessReportSchema.safeParse({
    locationId,
    rating,
    message,
  });

  if (!validatedFields.success) {
    throw new Error('Invalid busyness report data');
  }

  const { locationId: buildingId, rating: activityLevel, message: reportMessage } = validatedFields.data;
  const locationActivityRef = doc(db, 'locations_activity', buildingId);

  try {
    await runTransaction(db, async (transaction) => {
      const locationDoc = await transaction.get(locationActivityRef);

      let newRatingCount = 1;
      let newRatingSum = activityLevel;

      if (locationDoc.exists()) {
        const data = locationDoc.data();
        newRatingCount = (data.ratingCount || 0) + 1;
        newRatingSum = (data.ratingSum || 0) + activityLevel;
      }
      
      const newAverageRating = newRatingSum / newRatingCount;

      // The reports are now in a subcollection, create the reference inside the transaction
      const newReportRef = doc(collection(db, `locations_activity/${buildingId}/reports`));

      transaction.set(
        locationActivityRef,
        {
          ratingCount: newRatingCount,
          ratingSum: newRatingSum,
          averageRating: newAverageRating,
          lastReportTimestamp: serverTimestamp(),
        },
        { merge: true }
      );
      
      const reportData: { activityLevel: number; timestamp: any; message?: string } = {
        activityLevel,
        timestamp: serverTimestamp(),
      };

      if (reportMessage) {
        reportData.message = reportMessage;
      }

      transaction.set(newReportRef, reportData);
    });
  } catch (error) {
    console.error('Error submitting busyness report: ', error);
    // This generic error is what the user sees. The console.error will have the specific reason (e.g., permission denied).
    throw new Error('Could not save busyness report to the database.');
  }
}
