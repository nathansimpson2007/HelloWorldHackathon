import { BusynessEstimator } from '@/components/busyness-estimator';

export default function BusynessToolPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Building Busyness
        </h1>
        <p className="text-muted-foreground">
          Check how busy a study area is right now based on community reports.
        </p>
      </div>
      <BusynessEstimator />
    </div>
  );
}
