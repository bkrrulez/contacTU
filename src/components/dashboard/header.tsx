
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Search, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { AppSidebar } from './sidebar';
import { SidebarTrigger } from '../ui/sidebar';
import { db } from '@/lib/db';
import { UserProfile } from './user-profile';

async function getCurrentUser() {
    // In a real app, you'd get the current user from the session.
    // For now, we'll fetch the first user from the database.
    return await db.query.users.findFirst();
}


export async function AppHeader({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hidden md:flex" />
        <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] sm:w-[300px]">
              <AppSidebar />
            </SheetContent>
        </Sheet>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            type="search"
            placeholder="Search contacts..."
            className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[336px]"
            />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-2"
            >
               <UserProfile />
               <div className="text-left">
                    <p className="text-sm font-medium">{currentUser?.name ?? 'User'}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.role ?? 'Role'}</p>
               </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/">Logout</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
