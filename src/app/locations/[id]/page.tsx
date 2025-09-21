import { ActivityDisplay } from '@/components/activity-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buildings } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BarChart, Clock, Navigation } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from 'next/link';

export default async function BuildingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const building = buildings.find((b) => b.slug === params.id);
  if (!building) {
    notFound();
  }

  const buildingImage = PlaceHolderImages.find(
    (img) => img.id === building.imageSeed
  );
  const mapImage = PlaceHolderImages.find((img) => img.id === 'indoor-map-1');

  const allResources = [
    ...building.resources,
    ...building.studyAreas.map(sa => ({name: sa.name, type: 'Study Area' as const}))
  ].sort((a, b) => a.name.localeCompare(b.name));

  const walcFloors = {
    Basement: building.resources.filter(r => r.name.includes('B0')),
    'First Floor': building.resources.filter(r => r.name.match(/WALC 1\d{3}/)),
    'Second Floor': building.resources.filter(r => r.name.match(/WALC 2\d{3}/)),
    'Third Floor': building.resources.filter(r => r.name.match(/WALC 3\d{3}/)),
    'Other': building.resources.filter(r => !r.name.match(/WALC [B123]\d{2,3}/) && r.type !== 'Study Area')
  };
  
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${building.coords[0]},${building.coords[1]}`;

  const menuByStation = building.menu?.reduce((acc, item) => {
    if (!acc[item.station]) {
      acc[item.station] = [];
    }
    acc[item.station].push(item);
    return acc;
  }, {} as Record<string, typeof building.menu>);


  return (
    <div className="flex flex-col gap-8">
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          {buildingImage && (
            <Image
              src={buildingImage.imageUrl}
              alt={buildingImage.description}
              data-ai-hint={buildingImage.imageHint}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full aspect-video"
            />
          )}
        </div>
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            {building.name}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            A central hub for students and faculty.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <Link href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                <Navigation className="mr-2" />
                Get Directions
              </Button>
            </Link>
            <Link href={`/activity-tool?locationId=${building.id}`}>
              <Button size="lg" variant="outline">
                <BarChart className="mr-2" />
                Report Activity
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ActivityDisplay buildingId={building.id.toString()} buildingName={building.name} />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Info</TabsTrigger>
          {building.type === 'dining' && <TabsTrigger value="menu">Menu</TabsTrigger>}
          <TabsTrigger value="map">Indoor Map</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2 font-headline">History</h3>
                <p className="text-muted-foreground">{building.history}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 font-headline">Hours</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{building.hours}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
         {building.type === 'dining' && menuByStation && (
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Today's Menu</CardTitle>
                <CardDescription>Menu items are subject to change.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={Object.keys(menuByStation)} className="w-full">
                  {Object.entries(menuByStation).map(([station, items]) => (
                    <AccordionItem key={station} value={station}>
                      <AccordionTrigger className="text-lg font-headline">{station}</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {items.map(item => <li key={item.name}>{item.name}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Indoor Map</CardTitle>
              <CardDescription>Floor Plan</CardDescription>
            </CardHeader>
            <CardContent>
              {building.floorPlanImages && building.floorPlanImages.length > 0 ? (
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {building.floorPlanImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent className="flex aspect-video items-center justify-center p-0">
                               <Image
                                src={image}
                                alt={`Floor plan ${index + 1}`}
                                width={800}
                                height={600}
                                className="rounded-md object-contain w-full h-full border"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : mapImage ? (
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  data-ai-hint={mapImage.imageHint}
                  width={800}
                  height={600}
                  className="rounded-md object-cover w-full border"
                />
              ) : (
                <p>No indoor map available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                Rooms & Resources
              </CardTitle>
              <CardDescription>
                Search for lecture halls, labs, study areas, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {building.slug === 'walc' ? (
                 <Accordion type="multiple" defaultValue={['Other', 'First Floor']} className="w-full">
                  {Object.entries(walcFloors).map(([floor, resources]) => 
                    resources.length > 0 && (
                      <AccordionItem key={floor} value={floor}>
                        <AccordionTrigger className="text-lg font-headline">{floor}</AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {resources.map((resource) => (
                                <TableRow key={resource.name}>
                                  <TableCell className="font-medium">{resource.name}</TableCell>
                                  <TableCell>{resource.type}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allResources.map((resource) => (
                      <TableRow key={resource.name}>
                        <TableCell className="font-medium">
                          {resource.name}
                        </TableCell>
                        <TableCell>{resource.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
