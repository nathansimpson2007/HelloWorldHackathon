import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const landmarkBuildings = buildings.filter((b) => b.type === 'landmarks');

export default function LandmarksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Landmarks
        </h1>
        <p className="text-muted-foreground">
          Explore iconic landmarks across campus.
        </p>
      </div>
      <BuildingGrid buildings={landmarkBuildings} />
    </div>
  );
}
