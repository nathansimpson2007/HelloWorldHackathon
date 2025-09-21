import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const residentialBuildings = buildings.filter((b) => b.type === 'residential');

export default function ResidentialPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Residential Locations
        </h1>
        <p className="text-muted-foreground">
          Find maps, hours, and resources for residential locations across campus.
        </p>
      </div>
      <BuildingGrid buildings={residentialBuildings} />
    </div>
  );
}
