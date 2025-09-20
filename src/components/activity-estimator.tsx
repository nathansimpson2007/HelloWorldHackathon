'use client';

import { useState } from 'react';
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

export function ActivityEstimator() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  
  const selectedBuilding = buildings.find(b => b.id.toString() === selectedBuildingId);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">View Activity</CardTitle>
          <CardDescription>
            Select a location to see its current activity level.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="building">Location</Label>
                    <Select onValueChange={setSelectedBuildingId} name="buildingId">
                    <SelectTrigger id="building">
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
            </div>
        </CardContent>
      </Card>
      
      {selectedBuildingId && selectedBuilding ? (
        <ActivityDisplay buildingId={selectedBuildingId} buildingName={selectedBuilding.name} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Activity Estimate</CardTitle>
            <CardDescription>
              Select a location to see its activity level.
            </CardDescription>
          </Header>
          <CardContent>
            <p className="text-muted-foreground">No location selected.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
