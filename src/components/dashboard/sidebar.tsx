import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  Users,
  Contact,
  LayoutDashboard,
  FileText,
  UploadCloud,
  Settings,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import { db } from '@/lib/db';
import type { User } from '@/lib/types';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/contacts', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/users', icon: Users, label: 'User Management', roles: ['Admin', 'Power User'] },
  { href: '/dashboard/audit', icon: FileText, label: 'Audit Logs', roles: ['Admin', 'Power User'] },
];

const secondaryNavItems = [
    { href: '/dashboard/import', icon: UploadCloud, label: 'Import' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export async function AppSidebar() {
  // In a real app, you'd get the current user from the session.
  // For this prototype, we'll fetch the admin user to determine role.
  const currentUser: User | undefined = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.role, 'Admin'),
  });
  
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
        <SidebarMenu className="flex-1 p-2">
          {navItems.map((item) => (
            (!item.roles || item.roles.includes(userRole)) && (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
          <Separator className="my-2" />
          {secondaryNavItems.map((item) => (
             <SidebarMenuItem key={item.label}>
             <SidebarMenuButton
               asChild
               tooltip={{ children: item.label }}
             >
               <Link href={item.href}>
                 <item.icon />
                 <span>{item.label}</span>
               </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
