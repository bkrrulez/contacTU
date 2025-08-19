'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/lib/data';

const navItems = [
  { href: '/dashboard', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/import', icon: Upload, label: 'Import' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();
  const currentUser = mockUsers[0];

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
              Cardbase
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 group-data-[collapsible=icon]:hidden"
            onClick={toggleSidebar}
          >
            <ChevronLeft />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SidebarHeader>

        <SidebarMenu className="flex-1 p-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
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
            <SidebarMenuItem>
                <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    </div>
                </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
