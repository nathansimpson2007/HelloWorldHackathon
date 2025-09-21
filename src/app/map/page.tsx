
'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState, useRef } from 'react';
import type { Building } from '@/lib/data';
import { BuildingSearch } from '@/components/building-search';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buildings } from '@/lib/data';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import type { Map } from 'leaflet';

const buildingTypes = [...new Set(buildings.map((b) => b.type))].sort();

type CheckedState = Record<string, boolean>;

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [filters, setFilters] = useState<CheckedState>(
    buildingTypes.reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );

  const mapRef = useRef<Map>(null);

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

  const handleResize = () => {
    // Invalidate map size to fix rendering issues after resize
    mapRef.current?.invalidateSize();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col items-center w-full mb-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Interactive Campus Map
        </h1>
        <p className="text-muted-foreground">
          Search for a location or click on the map to report an alert.
        </p>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20} minSize={15} className="p-4 flex flex-col gap-4 min-w-[300px]">
            <BuildingSearch onSelectBuilding={setSelectedBuilding} />
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
          </Panel>
          <PanelResizeHandle className="w-2 bg-border hover:bg-primary transition-colors" onDragging={handleResize} />
          <Panel defaultSize={80} minSize={30}>
            <div className="h-full w-full">
              <InteractiveCampusMap
                setMapRef={(map) => (mapRef.current = map)}
                selectedBuilding={selectedBuilding}
                filters={activeFilters}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
