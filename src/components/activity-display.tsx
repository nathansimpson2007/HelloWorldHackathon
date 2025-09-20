'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Progress } from './ui/progress';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';

interface ActivityDisplayProps {
    buildingId: string;
    buildingName: string;
}

export function ActivityDisplay({ buildingId, buildingName }: ActivityDisplayProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [averageActivity, setAverageActivity] = useState(0);

  useEffect(() => {
    if (!buildingId) {
      setReports([]);
      setAverageActivity(0);
      return;
    }

    const q = query(
      collection(db, 'activityReports'),
      where('buildingId', '==', buildingId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs.map((doc) => doc.data());
      setReports(fetchedReports);

      if (fetchedReports.length > 0) {
        const totalActivity = fetchedReports.reduce(
          (acc, cur) => acc + cur.activityLevel,
          0
        );
        setAverageActivity(Math.round(totalActivity / fetchedReports.length));
      } else {
        setAverageActivity(0);
      }
    });

    return () => unsubscribe();
  }, [buildingId]);

  const activityPercentage = (averageActivity / 5) * 100;

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Activity Estimate: {buildingName}
          </CardTitle>
          <CardDescription>
            {buildingName === 'N/A'
              ? 'Select a building to see its activity level.'
              : 'Based on the latest community reports.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-muted-foreground">
                Level: {averageActivity}/5
              </span>
              <span className="font-medium text-muted-foreground">
                {averageActivity === 0
                  ? 'No Data'
                  : averageActivity <= 2
                  ? 'Not Busy'
                  : averageActivity <= 4
                  ? 'Moderately Busy'
                  : 'Very Busy'}
              </span>
            </div>
            <Progress value={activityPercentage} />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recent Reports:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {reports.length > 0 ? (
                reports.map((r, index) => (
                  <p key={index} className="border-l-2 pl-3">
                    Level {r.activityLevel}/5
                    {r.details && `: "${r.details}"`}
                  </p>
                ))
              ) : (
                <p>No reports submitted yet for this building. Be the first!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
