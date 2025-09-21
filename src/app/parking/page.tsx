
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buildings } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const parkingBuildings = buildings.filter((b) => b.type === 'parking');

export default function ParkingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Parking Locations
        </h1>
        <p className="text-muted-foreground">
          Find parking garages and lots across campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parkingBuildings.map((building) => {
          const image = PlaceHolderImages.find((img) => img.id === building.imageSeed);
          return (
            <Link key={building.id} href={`/locations/${building.slug}`} className="block">
              <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      data-ai-hint={image.imageHint}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="font-headline">{building.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{building.history}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
