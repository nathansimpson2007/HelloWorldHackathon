import { ActivityEstimator } from '@/components/activity-estimator';

export default function ActivityToolPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Location Activity
        </h1>
        <p className="text-muted-foreground">
          Check how active a location is right now based on community reports.
        </p>
      </div>
      <ActivityEstimator />
    </div>
  );
}
