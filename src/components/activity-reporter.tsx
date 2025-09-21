'use client';

import React, { useState, useEffect } from 'react';
import { submitBusynessReport } from '@/app/actions';
import { Building, buildings } from '@/lib/data';
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
import { Slider } from './ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import { LocationSearch } from './location-search';

const MESSAGE_CHAR_LIMIT = 100;

interface ActivityReporterProps {
  initialLocationId?: string;
}

export function ActivityReporter({ initialLocationId }: ActivityReporterProps) {
  const [locationId, setLocationId] = useState(initialLocationId || '');
  const [rating, setRating] = useState(3);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialLocationId) {
      setLocationId(initialLocationId);
    }
  }, [initialLocationId]);

  const handleBuildingSelect = (building: Building | null) => {
    setLocationId(building ? building.id.toString() : '');
  };

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

    try {
      await submitBusynessReport(locationId, rating, message);
      toast({
        title: 'Report Submitted',
        description: 'Thank you for helping keep the campus updated!',
      });
      // Do not clear locationId if it was passed as a prop
      if (!initialLocationId) {
        setLocationId('');
      }
      setRating(3);
      setMessage('');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: errorMessage,
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
          <LocationSearch
            onSelectBuilding={handleBuildingSelect}
            initialBuildingId={locationId}
          />
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
