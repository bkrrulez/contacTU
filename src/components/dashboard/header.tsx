'use client';

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
import React from 'react';
import type { User } from '@/lib/types';


export function AppHeader({ children, user }: { children: React.ReactNode, user: Partial<User> | null }) {

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] sm:w-[300px]">
              <AppSidebar />
            </SheetContent>
        </Sheet>
      </div>

      <div className="w-full flex-1">
        <form>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search contacts..."
                className="w-full appearance-none bg-secondary pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
            </div>
        </form>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-2"
          >
              {children}
              <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{user?.name ?? 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.role ?? 'Role'}</p>
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
    </header>
  );
}
