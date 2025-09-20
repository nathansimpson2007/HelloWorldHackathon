
'use server';

import { z } from 'zod';
import { buildings } from '@/lib/data';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const MAX_REPORTS_PER_AREA = 10;

export interface BusynessReport {
  report: string;
  busyness: number;
}

export interface BusynessData {
  reports: BusynessReport[];
  average: number;
  name: string;
}

export interface BusynessState {
  reportsByBuilding: Record<string, BusynessData>;
  lastSubmittedBuilding?: string;
  error?: string;
}

const formSchema = z.object({
  report: z.string(),
  buildingId: z.string().min(1, 'Please select a building.'),
  busyness: z.string(),
});

export async function estimateBusynessAction(
  prevState: BusynessState,
  formData: FormData
): Promise<BusynessState> {
  const validatedFields = formSchema.safeParse({
    report: formData.get('report'),
    buildingId: formData.get('buildingId'),
    busyness: formData.get('busyness'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid form data.',
    };
  }

  const { report, buildingId, busyness: busynessString } = validatedFields.data;
  const busyness = parseInt(busynessString, 10);

  const buildingInfo = buildings.find((b) => b.id.toString() === buildingId);

  if (!buildingInfo) {
    return { ...prevState, error: 'Invalid building selected.' };
  }

  const newReport: BusynessReport = { report, busyness };

  const currentBuildingReports = prevState.reportsByBuilding?.[buildingId]?.reports || [];

  // Prepend new report and keep the list at max size
  const newReports = [newReport, ...currentBuildingReports].slice(
    0,
    MAX_REPORTS_PER_AREA
  );

  const totalBusyness = newReports.reduce(
    (acc, cur) => acc + cur.busyness,
    0
  );
  const averageBusyness =
    newReports.length > 0 ? Math.round(totalBusyness / newReports.length) : 0;
  
  const updatedReportsByBuilding = {
    ...prevState.reportsByBuilding,
    [buildingId]: {
      name: buildingInfo.name,
      reports: newReports,
      average: averageBusyness,
    },
  };

  return {
    reportsByBuilding: updatedReportsByBuilding,
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
