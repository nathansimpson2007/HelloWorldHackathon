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
  onSnapshot,
  orderBy,
  limit,
  doc,
} from 'firebase/firestore';

interface Report {
  activityLevel: number;
  timestamp: any;
  message?: string;
}

interface ActivityDisplayProps {
  buildingId: string;
  buildingName: string;
}

export function ActivityDisplay({
  buildingId,
  buildingName,
}: ActivityDisplayProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [averageActivity, setAverageActivity] = useState(0);

  useEffect(() => {
    if (!buildingId) {
      setReports([]);
      setAverageActivity(0);
      return;
    }

    // Listener for the average rating on the main location activity document
    const locationActivityDocRef = doc(db, 'locations_activity', buildingId);
    const unsubscribeLocation = onSnapshot(locationActivityDocRef, (doc) => {
      if (doc.exists()) {
        setAverageActivity(doc.data().averageRating || 0);
      } else {
        setAverageActivity(0);
      }
    });

    // Listener for recent individual reports in the subcollection
    const reportsQuery = query(
      collection(db, `locations_activity/${buildingId}/reports`),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribeReports = onSnapshot(reportsQuery, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs.map(
        (doc) => doc.data() as Report
      );
      setReports(fetchedReports);
    });

    // Cleanup both listeners on component unmount
    return () => {
      unsubscribeLocation();
      unsubscribeReports();
    };
  }, [buildingId]);

  const activityPercentage = (averageActivity / 5) * 100;
  const roundedAverage = Math.round(averageActivity * 10) / 10;
  const reportsWithMessage = reports.filter((r) => r.message);

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
              Level: {roundedAverage}/5
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
          <div className="space-y-3 text-sm text-muted-foreground">
            {reportsWithMessage.length > 0 ? (
              reportsWithMessage.map((r, index) => (
                <div key={index} className="border-l-2 pl-3">
                  <p className="font-medium">Level {r.activityLevel}/5</p>
                  {r.message && (
                    <p className="text-xs italic">"{r.message}"</p>
                  )}
                </div>
              ))
            ) : (
              <p>No recent reports with messages for this building.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
