
'use client';

import { useState } from 'react';
import { submitBusynessReport } from '@/app/actions';
import { buildings } from '@/lib/data';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

const MESSAGE_CHAR_LIMIT = 100;

export function ActivityReporter() {
  const [locationId, setLocationId] = useState('');
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!locationId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a location.',
      });
      return;
    }
    setIsSubmitting(true);

    const submissionTimeout = setTimeout(() => {
      setIsSubmitting(false);
      toast({
        variant: 'destructive',
        title: 'Submission Timed Out',
        description: 'The request took too long. Please try again.',
      });
    }, 5000);

    try {
      await submitBusynessReport(locationId, rating, message);
      clearTimeout(submissionTimeout);
      toast({
        title: 'Report Submitted',
        description: 'Thank you for helping keep the campus updated!',
      });
      setLocationId('');
      setRating(3);
      setMessage('');
    } catch (error) {
      clearTimeout(submissionTimeout);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your report. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Report Activity</CardTitle>
        <CardDescription>
          How busy is a location right now? Let others know.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={locationId}
            onValueChange={setLocationId}
            name="locationId"
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select a location" />
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
          <Label htmlFor="rating">Activity Level: {rating}/5</Label>
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs text-muted-foreground">Not Busy</span>
            <Slider
              id="rating"
              min={1}
              max={5}
              step={1}
              value={[rating]}
              onValueChange={(value) => setRating(value[0])}
              disabled={isSubmitting}
            />
            <span className="text-xs text-muted-foreground">Very Busy</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Optional Message</Label>
          <Textarea
            id="message"
            placeholder="e.g., 'All the tables on the 2nd floor are taken.'"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={MESSAGE_CHAR_LIMIT}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {message.length} / {MESSAGE_CHAR_LIMIT}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !locationId}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </CardFooter>
    </Card>
  );
}
