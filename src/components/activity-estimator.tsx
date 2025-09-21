'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { buildings } from '@/lib/data';
import { ActivityDisplay } from './activity-display';

interface ActivityEstimatorProps {
  initialLocationId?: string;
}

function ActivityEstimatorContent({ initialLocationId }: ActivityEstimatorProps) {
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<
    string | undefined
  >(initialLocationId);

  React.useEffect(() => {
    if (initialLocationId) {
      setSelectedBuildingId(initialLocationId);
    }
  }, [initialLocationId]);

  const handleBuildingSelect = (buildingId: string) => {
    setSelectedBuildingId(buildingId);
  };

  const selectedBuilding = buildings.find(
    (b) => b.id.toString() === selectedBuildingId
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">View Activity</CardTitle>
          <CardDescription>
            Select a location to see its current activity level.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={handleBuildingSelect}
            defaultValue={selectedBuildingId}
            value={selectedBuildingId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem
                  key={building.id}
                  value={building.id.toString()}
                >
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBuildingId && selectedBuilding ? (
        <ActivityDisplay
          buildingId={selectedBuildingId}
          buildingName={selectedBuilding.name}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Activity Estimate</CardTitle>
            <CardDescription>
              Select a location to see its activity level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No location selected.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function ActivityEstimator({ initialLocationId }: ActivityEstimatorProps) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ActivityEstimatorContent initialLocationId={initialLocationId} />
    </React.Suspense>
  );
}
