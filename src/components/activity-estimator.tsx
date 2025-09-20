
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { estimateActivityAction, type ActivityState } from '@/app/actions';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { buildings } from '@/lib/data';
import { Slider } from './ui/slider';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';

const initialState: ActivityState = {
  reportsByBuilding: {},
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Report'}
    </Button>
  );
}

export function ActivityEstimator() {
  const [state, formAction] = useFormState(
    estimateActivityAction,
    initialState
  );
  const { toast } = useToast();
  const [activity, setActivity] = useState([3]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [reports, setReports] = useState<any[]>([]);
  const [averageActivity, setAverageActivity] = useState(0);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.lastSubmittedBuilding) {
      toast({
        title: 'Success!',
        description: 'Your activity report has been submitted.',
      });
      setSelectedBuildingId(state.lastSubmittedBuilding);
    }
  }, [state, toast]);

  useEffect(() => {
    if (!selectedBuildingId) {
      setReports([]);
      setAverageActivity(0);
      return;
    }

    const q = query(
      collection(db, 'activityReports'),
      where('buildingId', '==', selectedBuildingId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReports = querySnapshot.docs.map((doc) => doc.data());
      setReports(fetchedReports);

      if (fetchedReports.length > 0) {
        const totalActivity = fetchedReports.reduce(
          (acc, cur) => acc + cur.activity,
          0
        );
        setAverageActivity(Math.round(totalActivity / fetchedReports.length));
      } else {
        setAverageActivity(0);
      }
    });

    return () => unsubscribe();
  }, [selectedBuildingId]);

  const buildingName =
    buildings.find((b) => b.id.toString() === selectedBuildingId)?.name ?? 'N/A';
  const activityPercentage = (averageActivity / 5) * 100;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Contribute Data</CardTitle>
            <CardDescription>
              Help others by sharing how active a building is right now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select name="buildingId" required onValueChange={setSelectedBuildingId}>
                <SelectTrigger id="building">
                  <SelectValue placeholder="Select a building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level: {activity[0]}/5</Label>
              <Slider
                id="activity"
                name="activity"
                min={1}
                max={5}
                step={1}
                value={activity}
                onValueChange={setActivity}
              />
              <input type="hidden" name="activity" value={activity[0]} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report">Additional details (optional)</Label>
              <Textarea
                id="report"
                name="report"
                placeholder="e.g., 'It's packed, no seats left.'"
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
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
                  ? 'Not Active'
                  : averageActivity <= 4
                  ? 'Moderately Active'
                  : 'Very Active'}
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
                    Level {r.activity}/5
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
    </div>
  );
}
