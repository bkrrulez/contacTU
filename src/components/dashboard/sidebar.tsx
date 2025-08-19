import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Users,
  Upload,
  Settings,
  Contact,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/import', icon: Upload, label: 'Import' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="group-data-[collapsible=icon]:border-r"
      variant="sidebar"
    >
      <SidebarContent className="flex flex-col">
        <SidebarHeader className="h-14 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                 <Logo className="w-7 h-7 text-primary" />
                 <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">
                    contacTU
                 </span>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 group-data-[collapsible=icon]:hidden"
                asChild
            >
                <SidebarMenuButton>
                    <ChevronLeft />
                    <span className="sr-only">Toggle Sidebar</span>
                </SidebarMenuButton>
            </Button>
        </SidebarHeader>

        <SidebarMenu className="flex-1 p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                // This is a client-side only solution for active path.
                // A server-side solution would be better.
                // isActive={pathname === item.href}
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

        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LogOut />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
