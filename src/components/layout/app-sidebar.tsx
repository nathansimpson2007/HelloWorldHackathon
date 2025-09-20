
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
  BookOpen,
  Home,
  Map,
  MessageSquareWarning,
  Compass,
  Waypoints,
  Utensils,
  Building,
  GraduationCap,
  Dumbbell,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/map', label: 'Interactive Map', icon: Waypoints },
  { href: '/academic', label: 'Academic', icon: GraduationCap },
  { href: '/residential', label: 'Residential', icon: Building },
  { href: '/dining', label: 'Dining', icon: Utensils },
  { href: '/recreational', label: 'Recreational', icon: Dumbbell },
  { href: '/activity-tool', label: 'Report Activity', icon: BookOpen },
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
              Campus Compass
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
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
