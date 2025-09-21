import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const recreationalBuildings = buildings.filter((b) => b.type === 'recreational');

export default function RecreationalPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Recreational Facilities
        </h1>
        <p className="text-muted-foreground">
          Explore gyms, courts, and other recreational spots across campus.
        </p>
      </div>
      <BuildingGrid buildings={recreationalBuildings} />
    </div>
  );
}
