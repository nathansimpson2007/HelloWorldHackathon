'use client';

import { useState } from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buildings as allBuildings, Building } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

interface BuildingGridProps {
  buildings: Building[];
}

export function BuildingGrid({ buildings }: BuildingGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full max-w-sm">
        <Input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredBuildings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === building.imageSeed
            );
            return (
              <Link
                key={building.id}
                href={`/locations/${building.slug}`}
                className="block"
              >
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
                    <CardDescription className="line-clamp-2">
                      {building.history}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-8">
          <p className="text-lg">No locations found.</p>
          <p>Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
