import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Map,
  Waypoints,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome to Campus Compass
        </h1>
        <p className="text-muted-foreground">
          Your guide to navigating Purdue University.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/map">
          <Card className="h-full hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Waypoints className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="font-headline">
                    Interactive Map
                  </CardTitle>
                  <CardDescription>
                    View buildings and live campus alerts.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/buildings">
          <Card className="h-full hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <Map className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="font-headline">
                    Explore Buildings
                  </CardTitle>
                  <CardDescription>
                    Find maps, hours, and resources.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/busyness-tool">
          <Card className="h-full hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="font-headline">
                    Report Busyness
                  </CardTitle>
                  <CardDescription>
                    Report real-time busyness levels.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
