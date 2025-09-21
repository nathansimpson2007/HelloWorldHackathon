import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const parkingBuildings = buildings.filter((b) => b.type === 'parking');

export default function ParkingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Parking Locations
        </h1>
        <p className="text-muted-foreground">
          Find parking garages and lots across campus.
        </p>
      </div>
      <BuildingGrid buildings={parkingBuildings} />
    </div>
  );
}
