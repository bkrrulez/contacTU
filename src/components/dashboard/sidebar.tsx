
'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Users,
  Contact,
  LayoutDashboard,
  FileText,
  UploadCloud,
  Settings,
  LogOut,
  Star,
  Download,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import type { User } from '@/lib/types';
import { usePathname } from 'next/navigation';
import React from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/contacts', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/favorites', icon: Star, label: 'Favorites' },
  { href: '/dashboard/users', icon: Users, label: 'User Management', roles: ['Admin', 'Power User'] },
  { href: '/dashboard/audit', icon: FileText, label: 'Audit Logs', roles: ['Admin', 'Power User'] },
  { href: '/dashboard/import', icon: Download, label: 'Import' },
  { href: '/dashboard/export', icon: UploadCloud, label: 'Export' },
];

const bottomNavItems = [
    { href: '/', icon: LogOut, label: 'Log Out' },
];

const settingsNavItems = [
    { href: '/dashboard/settings/organization', label: 'Organization', roles: ['Admin'] },
    { href: '/dashboard/settings/team', label: 'Team', roles: ['Admin'] },
    { href: '/dashboard/settings/data-management', label: 'Data Management', roles: ['Admin'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  // In a real app, role would come from a session context.
  // For now, we'll default to a role that can see most things.
  // The header component already fetches and displays the current user's info.
  const userRole = 'Admin';

  const isSettingsRouteActive = settingsNavItems.some(item => pathname.startsWith(item.href));
  const canViewSettings = settingsNavItems.some(item => !item.roles || item.roles.includes(userRole));


  return (
    <Sidebar
      className="border-r"
    >
      <SidebarContent className="flex flex-col">
        <SidebarHeader className="h-16 flex items-center justify-start px-4">
            <Link href="/dashboard">
                <Logo />
            </Link>
        </SidebarHeader>
        <div className="flex-1">
            <SidebarMenu className="p-2">
                {navItems.map((item) => (
                    (!item.roles || item.roles.includes(userRole)) && (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                        asChild
                        tooltip={{ children: item.label }}
                        isActive={pathname === item.href}
                        className={pathname === item.href ? "shadow-md" : ""}
                        >
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </div>
        <SidebarFooter className="p-2">
            <Separator className="my-2" />
             {canViewSettings && (
                <div className="space-y-1">
                    <SidebarMenuButton
                        isActive={isSettingsRouteActive}
                        className={cn("pointer-events-none w-full", isSettingsRouteActive && 'bg-primary text-primary-foreground shadow-md')}
                    >
                            <Settings />
                            <span>Settings</span>
                    </SidebarMenuButton>
                    <div className="ml-7 flex flex-col gap-1 border-l pl-2">
                        {settingsNavItems.map(item => (
                            (!item.roles || item.roles.includes(userRole)) && (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "block rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        pathname === item.href && "bg-accent text-accent-foreground"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            )}
            <SidebarMenu>
                {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        tooltip={{ children: item.label }}
                        isActive={pathname === item.href}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
