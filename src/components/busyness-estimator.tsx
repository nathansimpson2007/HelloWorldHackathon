
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { estimateBusynessAction, type BusynessState } from '@/app/actions';
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

const initialState: BusynessState = {
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

export function BusynessEstimator() {
  const [state, formAction] = useFormState(
    estimateBusynessAction,
    initialState
  );
  const { toast } = useToast();
  const [busyness, setBusyness] = useState([3]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [reports, setReports] = useState<any[]>([]);
  const [averageBusyness, setAverageBusyness] = useState(0);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
    if (state.lastSubmittedBuilding) {
      setSelectedBuildingId(state.lastSubmittedBuilding);
    }
  }, [state, toast]);

  useEffect(() => {
    if (!selectedBuildingId) {
      setReports([]);
      setAverageBusyness(0);
      return;
    }

    const q = query(
      collection(db, 'busynessReports'),
      where('buildingId', '==', selectedBuildingId),
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
  }, [selectedBuildingId]);

  const buildingName =
    buildings.find((b) => b.id.toString() === selectedBuildingId)?.name ?? 'N/A';
  const busynessPercentage = (averageBusyness / 5) * 100;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Contribute Data</CardTitle>
            <CardDescription>
              Help others by sharing how busy a building is right now.
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
              <Label htmlFor="busyness">Busyness Level: {busyness[0]}/5</Label>
              <Slider
                id="busyness"
                name="busyness"
                min={1}
                max={5}
                step={1}
                value={busyness}
                onValueChange={setBusyness}
              />
              <input type="hidden" name="busyness" value={busyness[0]} />
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
    </div>
  );
}
