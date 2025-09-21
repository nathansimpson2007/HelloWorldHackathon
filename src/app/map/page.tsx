
'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { Building } from '@/lib/data';
import { BuildingSearch } from '@/components/building-search';
import { Button } from '@/components/ui/button';
import { Expand, ListFilter, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buildings } from '@/lib/data';

const buildingTypes = [
  ...new Set(buildings.map((b) => b.type)),
].sort();

type CheckedState = Record<string, boolean>;

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState<CheckedState>(
    buildingTypes.reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );

  const handleFilterChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [type]: checked }));
  };

  const activeFilters = Object.keys(filters).filter((key) => filters[key]);

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
        'h-full flex flex-col',
        isFullscreen &&
          'fixed inset-0 bg-background z-50 p-4 flex flex-col'
      )}
    >
      <div className={cn('flex flex-col items-center w-full', 'mb-4')}>
        <h1 className={cn('text-3xl font-bold font-headline tracking-tight', isFullscreen && 'text-xl')}>
          Interactive Campus Map
        </h1>
        <p className={cn('text-muted-foreground', isFullscreen && 'hidden')}>
          Search for a location or click on the map to report an alert.
        </p>
      </div>
      
      <div className="relative flex-1 flex flex-col items-center">
        <div className={cn('flex items-center justify-center gap-4 w-full mb-4')}>
            <div className={cn('w-full max-w-sm', isFullscreen && 'hidden')}>
              <BuildingSearch onSelectBuilding={setSelectedBuilding} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-background/80 hover:bg-background/100">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Location Types</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {buildingTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                      key={type}
                      checked={filters[type]}
                      onCheckedChange={(checked) => handleFilterChange(type, !!checked)}
                      onSelect={(e) => e.preventDefault()}
                      className="capitalize"
                  >
                      {type}
                  </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
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

        <div className="relative w-full flex-1">
            <div className="h-full w-full border rounded-lg overflow-hidden min-h-[70vh]">
              <InteractiveCampusMap
                  selectedBuilding={selectedBuilding}
                  isFullscreen={isFullscreen}
                  filters={activeFilters}
              />
            </div>
        </div>
      </div>
    </div>
  );
}
