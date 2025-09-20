
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { type LatLng } from 'leaflet';
import { useState } from 'react';
import { addAlert } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coords: LatLng | null;
};

export function ReportDialog({ open, onOpenChange, coords }: ReportDialogProps) {
  const [category, setCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    const finalCategory = category === 'Other' ? otherCategory : category;
    if (!finalCategory || !details || !coords) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields before submitting.',
      });
      return;
    }
    setSubmitting(true);
    try {
      await addAlert({
        category: finalCategory,
        details,
        location: {
          latitude: coords.lat,
          longitude: coords.lng,
        },
      });
      toast({
        title: 'Alert Submitted',
        description: 'Thank you for contributing!',
      });
      onOpenChange(false);
      setCategory('');
      setOtherCategory('');
      setDetails('');
    } catch (error) {
      console.error('Failed to submit alert:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not submit your alert. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Campus Alert</DialogTitle>
          <DialogDescription>
            Report something happening on campus. Your location will be pinned on the map.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Study Space">Study Space</SelectItem>
                <SelectItem value="Free Food">Free Food</SelectItem>
                <SelectItem value="Crowded Area">Crowded Area</SelectItem>
                <SelectItem value="Campus Event">Campus Event</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {category === 'Other' && (
            <div className="space-y-2">
              <Label htmlFor="other-category">Custom Category</Label>
              <Input
                id="other-category"
                placeholder="e.g., 'Long Line'"
                value={otherCategory}
                onChange={(e) => setOtherCategory(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              placeholder="e.g., Free pizza in the MSEE lobby!"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Alert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    