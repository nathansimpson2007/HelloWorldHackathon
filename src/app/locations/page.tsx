import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

export default function BuildingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Explore All Locations
        </h1>
        <p className="text-muted-foreground">
          Find maps, hours, and resources for locations across campus.
        </p>
      </div>
      <BuildingGrid buildings={buildings} />
    </div>
  );
}
