
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buildings } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const diningHalls = buildings.filter((building) => building.type === 'dining');

export default function DiningPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Dining Halls
        </h1>
        <p className="text-muted-foreground">
          Explore dining options across campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diningHalls.map((diningHall) => {
          const image = PlaceHolderImages.find((img) => img.id === diningHall.imageSeed);
          return (
            <Link key={diningHall.id} href={`/locations/${diningHall.slug}`} className="block">
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
                  <CardTitle className="font-headline">{diningHall.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{diningHall.history}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
