import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Heart,
  Waypoints,
  Map,
  BarChart,
  Users,
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

      <div className="grid gap-6">
        <Link href="/map">
          <Card className="h-full hover:border-primary transition-colors transform hover:-translate-y-1">
            <CardHeader className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <Waypoints className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl mb-1">
                    Interactive Map
                  </CardTitle>
                  <CardDescription>
                    View real-time location activity, campus alerts, and find your way around.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/locations">
          <Card className="h-full hover:border-primary transition-colors transform hover:-translate-y-1">
            <CardHeader className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <Map className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl mb-1">
                    Explore Locations
                  </CardTitle>
                  <CardDescription>
                    Find detailed information, hours, and resources for every building on campus.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/activity-tool">
          <Card className="h-full hover:border-primary transition-colors transform hover:-translate-y-1">
            <CardHeader className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <BarChart className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl mb-1">
                    Location Activity
                  </CardTitle>
                  <CardDescription>
                    Report and view real-time activity levels to find the perfect study spot or avoid crowds.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
         <Link href="/mission">
          <Card className="h-full hover:border-primary transition-colors transform hover:-translate-y-1">
            <CardHeader className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary p-4 rounded-lg">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-headline text-xl mb-1">
                    Our Mission
                  </CardTitle>
                  <CardDescription>
                    Learn more about the purpose of Campus Compass and the team behind it.
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
