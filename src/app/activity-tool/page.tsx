import { BusynessEstimator } from '@/components/busyness-estimator';

export default function BusynessToolPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Report Activity
        </h1>
        <p className="text-muted-foreground">
          Help others by reporting how busy a study area is right now.
        </p>
      </div>
      <BusynessEstimator />
    </div>
  );
}
