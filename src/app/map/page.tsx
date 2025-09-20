
'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { Building } from '@/lib/data';
import { BuildingSearch } from '@/components/building-search';
import { Button } from '@/components/ui/button';
import { Expand, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const InteractiveCampusMap = useMemo(
    () =>
      dynamic(() => import('@/components/interactive-campus-map'), {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-6 h-full',
        isFullscreen &&
          'fixed inset-0 bg-background z-50 p-4 flex'
      )}
    >
      <div className={cn(isFullscreen && 'hidden')}>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Interactive Campus Map
        </h1>
        <p className="text-muted-foreground">
          Search for a building or click on the map to report an alert.
        </p>
      </div>

      <div className={cn('flex items-center gap-4', isFullscreen && 'absolute top-4 right-4 z-[1000]')}>
        <div className={cn('w-full max-w-sm', isFullscreen && 'hidden')}>
          <BuildingSearch onSelectBuilding={setSelectedBuilding} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-background/80 hover:bg-background/100"
        >
          {isFullscreen ? (
            <Shrink className="h-4 w-4" />
          ) : (
            <Expand className="h-4 w-4" />
          )}
          <span className="sr-only">
            {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          </span>
        </Button>
      </div>

      <div className="relative flex-1">
        <div className="h-full w-full border rounded-lg overflow-hidden">
          <InteractiveCampusMap selectedBuilding={selectedBuilding} />
        </div>
      </div>
    </div>
  );
}
