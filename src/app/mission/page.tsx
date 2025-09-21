import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Rocket, Users } from 'lucide-react';

export default function MissionPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Our Mission
        </h1>
        <p className="text-muted-foreground">
          Learn more about CampusNow and the team behind it.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Rocket className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-2xl">
                About the App
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              CampusNow is designed to revolutionize how students, faculty,
              and visitors experience the Purdue University campus. Our mission is
              to provide a centralized, all-in-one platform for campus
              navigation and information, eliminating the need to juggle multiple
              apps for maps, dining menus, and event calendars.
            </p>
            <p>
              We leverage real-time, community-driven data to empower users with
              up-to-the-minute information. From finding the least crowded study
              spot to getting live alerts about free food, CampusNow aims
              to make campus life smarter, easier, and more connected.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-2xl">
                Meet the Team
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We are a passionate team of innovators, developers, and designers: Jake, Daniel, Nathan, and Saahil. We believe in the power of technology to improve everyday life. As members of the Purdue community ourselves, we experienced firsthand the challenges of navigating a large and dynamic campus.
            </p>
            <p>
              This personal experience fueled our ambition to create a single,
              cohesive solution. Our team is dedicated to continuous
              improvement, user-centric design, and building a tool that truly
              serves the needs of the Purdue community.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
