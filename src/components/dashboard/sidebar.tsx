import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  Users,
  Contact,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard', icon: Contact, label: 'Contacts' },
  { href: '/dashboard/users', icon: Users, label: 'User Management' },
  { href: '/dashboard/audit', icon: FileText, label: 'Audit Logs' },
];

export function AppSidebar() {
  return (
    <Sidebar
      className="border-r"
    >
      <SidebarContent className="flex flex-col">
        <SidebarHeader className="h-16 flex items-center justify-start px-4">
            <div className="flex items-center gap-2">
                 <Logo className="w-8 h-8 text-primary" />
                 <span className="font-bold text-xl font-headline">
                    contacTU
                 </span>
            </div>
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
      </SidebarContent>
    </Sidebar>
  );
}
