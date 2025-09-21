'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, Unsubscribe } from 'firebase/firestore';

/**
 * Sets up a real-time listener for the busyness of a specific location.
 *
 * @param locationId The ID of the location to listen to.
 * @param callback The function to call with the new averageBusyness value.
 * @returns The unsubscribe function to detach the listener.
 */
export function listenToLocationBusyness(
  locationId: string,
  callback: (averageBusyness: number) => void
): Unsubscribe {
  const locationDocRef = doc(db, 'locations', locationId);

  const unsubscribe = onSnapshot(locationDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // Assuming the field is named averageBusyness
      const averageBusyness = data.averageBusyness;
      if (typeof averageBusyness === 'number') {
        callback(averageBusyness);
      }
    }
  });

  return unsubscribe;
}
