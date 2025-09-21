import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const diningHalls = buildings.filter((building) => building.type === 'dining');

export default function DiningPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dining Halls
        </h1>
        <p className="text-muted-foreground">
          Explore dining options across campus.
        </p>
      </div>
      <BuildingGrid buildings={diningHalls} />
    </div>
  );
}
