
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
import { BusynessDisplay } from './busyness-display';
import { Label } from './ui/label';

export function BusynessEstimator() {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const selectedBuilding = buildings.find(b => b.id.toString() === selectedBuildingId);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Select a Building</CardTitle>
          <CardDescription>
            Choose a building to see the current busyness estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Select onValueChange={setSelectedBuildingId}>
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
        </CardContent>
      </Card>
      
      {selectedBuildingId && selectedBuilding ? (
        <BusynessDisplay buildingId={selectedBuildingId} buildingName={selectedBuilding.name} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Busyness Estimate</CardTitle>
            <CardDescription>
              Select a building to see its busyness level.
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
