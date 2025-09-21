import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const healthBuildings = buildings.filter((b) => b.type === 'health');

export default function HealthPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Health Facilities
        </h1>
        <p className="text-muted-foreground">
          Explore health and wellness centers on campus.
        </p>
      </div>
      <BuildingGrid buildings={healthBuildings} />
    </div>
  );
}
