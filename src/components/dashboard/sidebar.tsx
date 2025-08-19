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
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import type { User } from '@/lib/types';
import { usePathname } from 'next/navigation';
import React from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/contacts', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/users', icon: Users, label: 'User Management', roles: ['Admin', 'Power User'] },
  { href: '/dashboard/audit', icon: FileText, label: 'Audit Logs', roles: ['Admin', 'Power User'] },
  { href: '/dashboard/import', icon: UploadCloud, label: 'Import' },
];

const bottomNavItems = [
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
    { href: '/', icon: LogOut, label: 'Log Out' },
];

// This is a placeholder for fetching user data.
// In a real app, you'd get the current user from the session.
const currentUser: User = {
    id: 1,
    name: 'Admin User',
    email: 'admin@cardbase.com',
    role: 'Admin',
    avatar: 'https://placehold.co/100x100.png'
};

export function AppSidebar() {
  const pathname = usePathname();
  // Default to a restrictive role if no user is found
  const userRole = currentUser?.role || 'Read-Only';

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
