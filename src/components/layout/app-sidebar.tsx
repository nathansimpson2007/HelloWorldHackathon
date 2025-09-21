
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  Building,
  Compass,
  Waypoints,
  Utensils,
  Building2,
  GraduationCap,
  Dumbbell,
  Store,
  Landmark,
  HeartPulse,
  Banknote,
  BarChart,
  Car,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Interactive Map', icon: Waypoints },
  { href: '/activity-tool', label: 'Location Activity', icon: BarChart },
  { href: '/mission', label: 'Our Mission', icon: Users },
];

const buildingMenuItems = [
  { href: '/locations', label: 'All Locations', icon: Building2 },
  { href: ' /academic', label: 'Academic', icon: GraduationCap },
  { href: '/residential', label: 'Residential', icon: Building },
  { href: '/dining', label: 'Dining', icon: Utensils },
  { href: '/recreational', label: 'Recreational', icon: Dumbbell },
  { href: '/commercial', label: 'Commercial', icon: Store },
  { href: '/administrative', label: 'Administrative', icon: Landmark },
  { href: '/health', label: 'Health', icon: HeartPulse },
  { href: '/landmarks', label: 'Landmarks', icon: Banknote },
  { href: '/parking', label: 'Parking', icon: Car },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block">
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader>
          <div
            className={cn(
              'flex items-center gap-2 px-2 py-1',
              'group-data-[collapsible=icon]:justify-center'
            )}
          >
            <Compass className="h-7 w-7 text-primary" />
            <span
              className={cn(
                'font-bold font-headline text-lg',
                'group-data-[collapsible=icon]:hidden'
              )}
            >
              CampusNow
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={pathname === item.href}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="buildings" className="border-none">
                <AccordionTrigger
                  className={cn(
                    'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50',
                    'group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
                    'hover:no-underline',
                    buildingMenuItems.some((item) => pathname.startsWith(item.href)) &&
                      'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  )}
                >
                   <div className="flex items-center gap-2">
                    <Building2 />
                    <span className="group-data-[collapsible=icon]:hidden">Locations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 group-data-[collapsible=icon]:hidden">
                  <SidebarMenu className="pl-7">
                    {buildingMenuItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                           <SidebarMenuButton
                            tooltip={item.label}
                            isActive={pathname === item.href}
                            className="!p-1 !h-auto !justify-start"
                          >
                            <item.icon className="h-3.5 w-3.5" />
                            <span className="text-xs">{item.label}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
