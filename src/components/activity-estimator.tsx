'use client';

import { useState, useTransition, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { buildings } from '@/lib/data';
import { ActivityDisplay } from './activity-display';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { addActivityReport } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function ActivityEstimator() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState([3]);
  const [details, setDetails] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const selectedBuilding = buildings.find(b => b.id.toString() === selectedBuildingId);

  const handleFormSubmit = async (formData: FormData) => {
    if (!selectedBuildingId) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please select a building.',
        });
        return;
    }

    formData.set('buildingId', selectedBuildingId);
    formData.set('activityLevel', activityLevel[0].toString());
    formData.set('details', details);
    
    startTransition(async () => {
        try {
            await addActivityReport(formData);
            toast({
                title: 'Success',
                description: 'Activity report submitted successfully.',
            });
            // Reset form fields
            // setSelectedBuildingId(null); // This would clear the display, maybe not ideal
            setActivityLevel([3]);
            setDetails('');
            formRef.current?.reset();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to submit activity report.',
            });
        }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Contribute Data</CardTitle>
          <CardDescription>
            Submit an activity report for a building.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={handleFormSubmit} ref={formRef} className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="building">Building</Label>
                    <Select onValueChange={setSelectedBuildingId} name="buildingId">
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
                    <Label htmlFor="activity-level">Activity Level: {activityLevel[0]}</Label>
                    <Slider
                        id="activity-level"
                        min={1}
                        max={5}
                        step={1}
                        value={activityLevel}
                        onValueChange={setActivityLevel}
                        name="activityLevel"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="details">Additional Details (Optional)</Label>
                    <Textarea
                        id="details"
                        placeholder="e.g., 'The basement is completely full.'"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        name="details"
                    />
                </div>
                
                <Button type="submit" disabled={isPending || !selectedBuildingId}>
                    {isPending ? 'Submitting...' : 'Submit Report'}
                </Button>
            </form>
        </CardContent>
      </Card>
      
      {selectedBuildingId && selectedBuilding ? (
        <ActivityDisplay buildingId={selectedBuildingId} buildingName={selectedBuilding.name} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Activity Estimate</CardTitle>
            <CardDescription>
              Select a building to see its activity level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No building selected.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
