
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

interface BusynessDisplayProps {
    buildingId: string;
    buildingName: string;
}

export function BusynessDisplay({ buildingId, buildingName }: BusynessDisplayProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [averageBusyness, setAverageBusyness] = useState(0);

  useEffect(() => {
    if (!buildingId) {
      setReports([]);
      setAverageBusyness(0);
      return;
    }

    const q = query(
      collection(db, 'busynessReports'),
      where('buildingId', '==', buildingId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs.map((doc) => doc.data());
      setReports(fetchedReports);

      if (fetchedReports.length > 0) {
        const totalBusyness = fetchedReports.reduce(
          (acc, cur) => acc + cur.busyness,
          0
        );
        setAverageBusyness(Math.round(totalBusyness / fetchedReports.length));
      } else {
        setAverageBusyness(0);
      }
    });

    return () => unsubscribe();
  }, [buildingId]);

  const busynessPercentage = (averageBusyness / 5) * 100;

  return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            Busyness Estimate: {buildingName}
          </CardTitle>
          <CardDescription>
            {buildingName === 'N/A'
              ? 'Select a building to see its busyness level.'
              : 'Based on the latest community reports.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-muted-foreground">
                Level: {averageBusyness}/5
              </span>
              <span className="font-medium text-muted-foreground">
                {averageBusyness === 0
                  ? 'No Data'
                  : averageBusyness <= 2
                  ? 'Not Busy'
                  : averageBusyness <= 4
                  ? 'Moderately Busy'
                  : 'Very Busy'}
              </span>
            </div>
            <Progress value={busynessPercentage} />
          </div>

          <div>
            <h4 className="font-semibold mb-2">Recent Reports:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {reports.length > 0 ? (
                reports.map((r, index) => (
                  <p key={index} className="border-l-2 pl-3">
                    Level {r.busyness}/5
                    {r.report && `: "${r.report}"`}
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
