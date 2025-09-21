import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const commercialBuildings = buildings.filter((b) => b.type === 'commercial');

export default function CommercialPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Commercial Locations
        </h1>
        <p className="text-muted-foreground">
          Explore stores and commercial services near campus.
        </p>
      </div>
      <BuildingGrid buildings={commercialBuildings} />
    </div>
  );
}
