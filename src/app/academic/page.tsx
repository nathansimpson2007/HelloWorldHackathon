import { buildings } from '@/lib/data';
import { BuildingGrid } from '@/components/building-grid';

const academicBuildings = buildings.filter((b) => b.type === 'academic');

export default function AcademicPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Academic Locations
        </h1>
        <p className="text-muted-foreground">
          Find maps, hours, and resources for academic locations across campus.
        </p>
      </div>
      <BuildingGrid buildings={academicBuildings} />
    </div>
  );
}
