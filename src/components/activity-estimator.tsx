'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { buildings, Building } from '@/lib/data';
import { ActivityDisplay } from './activity-display';
import { LocationSearch } from './location-search';

interface ActivityEstimatorProps {
  initialLocationId?: string;
}

function ActivityEstimatorContent({
  initialLocationId,
}: ActivityEstimatorProps) {
  const [selectedBuildingId, setSelectedBuildingId] = React.useState<
    string | undefined
  >(initialLocationId);

  React.useEffect(() => {
    if (initialLocationId) {
      setSelectedBuildingId(initialLocationId);
    }
  }, [initialLocationId]);

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuildingId(building.id.toString());
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
          <LocationSearch
            onSelectBuilding={handleBuildingSelect}
            initialValue={
              selectedBuilding ? selectedBuilding.name : undefined
            }
          />
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

export function ActivityEstimator({
  initialLocationId,
}: ActivityEstimatorProps) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ActivityEstimatorContent initialLocationId={initialLocationId} />
    </React.Suspense>
  );
}
