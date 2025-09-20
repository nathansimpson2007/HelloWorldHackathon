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
  reportsByArea: Record<string, BusynessData>;
  lastSubmittedArea?: string;
  error?: string;
}

const formSchema = z.object({
  report: z.string(),
  studyArea: z.string().min(1, 'Please select an area.'),
  busyness: z.string(),
});

export async function estimateBusynessAction(
  prevState: BusynessState,
  formData: FormData
): Promise<BusynessState> {
  const validatedFields = formSchema.safeParse({
    report: formData.get('report'),
    studyArea: formData.get('studyArea'),
    busyness: formData.get('busyness'),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      error: 'Invalid form data.',
    };
  }

  const { report, studyArea: studyAreaId, busyness: busynessString } = validatedFields.data;
  const busyness = parseInt(busynessString, 10);

  const studyAreaInfo = buildings
    .flatMap((b) => b.studyAreas)
    .find((sa) => sa.id === studyAreaId);

  if (!studyAreaInfo) {
    return { ...prevState, error: 'Invalid area selected.' };
  }

  const newReport: BusynessReport = { report, busyness };

  const currentAreaReports = prevState.reportsByArea?.[studyAreaId]?.reports || [];

  // Prepend new report and keep the list at max size
  const newReports = [newReport, ...currentAreaReports].slice(
    0,
    MAX_REPORTS_PER_AREA
  );

  const totalBusyness = newReports.reduce(
    (acc, cur) => acc + cur.busyness,
    0
  );
  const averageBusyness =
    newReports.length > 0 ? Math.round(totalBusyness / newReports.length) : 0;
  
  const updatedReportsByArea = {
    ...prevState.reportsByArea,
    [studyAreaId]: {
      name: studyAreaInfo.name,
      reports: newReports,
      average: averageBusyness,
    },
  };

  return {
    reportsByArea: updatedReportsByArea,
    lastSubmittedArea: studyAreaId,
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
