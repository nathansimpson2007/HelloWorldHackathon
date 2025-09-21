import { ActivityEstimator } from '@/components/activity-estimator';
import { ActivityReporter } from '@/components/activity-reporter';

export default function ActivityToolPage({
  searchParams,
}: {
  searchParams?: { locationId?: string };
}) {
  const locationId = searchParams?.locationId;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Location Activity
        </h1>
        <p className="text-muted-foreground">
          Check how active a location is right now and submit your own report.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <ActivityEstimator initialLocationId={locationId} />
        <ActivityReporter initialLocationId={locationId} />
      </div>
    </div>
  );
}
