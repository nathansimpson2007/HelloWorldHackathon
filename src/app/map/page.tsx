
'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState, useRef, useEffect } from 'react';
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
import type { Map } from 'leaflet';
import { cn } from '@/lib/utils';

const buildingTypes = [...new Set(buildings.map((b) => b.type))].sort();

type CheckedState = Record<string, boolean>;

export default function MapPage() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
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
  
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, []);


  return (
    <div className="h-full flex flex-col ml-4">
      <div className="flex flex-wrap items-center gap-4 p-4 bg-background/80 backdrop-blur-sm border-b z-10">
        <div className="flex-1 min-w-[250px]">
          <BuildingSearch onSelectBuilding={setSelectedBuilding} />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
        </div>
        <p className="w-full text-sm text-muted-foreground">
          Search for a location or click on the map to report an alert.
        </p>
      </div>

      <div className="flex-1">
        <InteractiveCampusMap
          setMapRef={(map) => (mapRef.current = map)}
          selectedBuilding={selectedBuilding}
          filters={activeFilters}
        />
      </div>
    </div>
  );
}

