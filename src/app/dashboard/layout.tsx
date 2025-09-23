
'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { AppHeader } from '@/components/dashboard/header';
import { UserProfile } from '@/components/dashboard/user-profile';
import type { User } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContactProvider } from '@/contexts/ContactContext';

function DashboardSkeleton() {
    return (
        <div className="flex h-screen w-full bg-muted/40">
            <div className="hidden md:flex flex-col w-[256px] border-r p-2 gap-2">
                <div className="h-16 flex items-center px-4">
                    <Skeleton className="h-8 w-32" />
                </div>
                <div className="flex-1 space-y-2 p-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="p-2 mt-auto">
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="flex flex-col flex-1 h-screen">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
                    <div className="flex-1">
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                    <Skeleton className="h-10 w-48" />
                </header>
                <main className="flex-1 p-4 lg:p-6">
                    <Skeleton className="h-full w-full" />
                </main>
            </div>
        </div>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const userJson = sessionStorage.getItem('user');
            if (userJson) {
                setCurrentUser(JSON.parse(userJson));
            }
        } catch (error) {
            console.error("Failed to parse user from sessionStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

  return (
    <SidebarProvider>
      <ContactProvider>
          <div className="flex h-screen w-full bg-muted/40">
            <AppSidebar />
            <div className="flex flex-col flex-1 h-screen">
              <AppHeader user={currentUser}>
                <UserProfile user={currentUser} />
              </AppHeader>
              <div className="flex flex-col flex-1 overflow-auto">
                <main className="flex-1 p-4 lg:p-6">{children}</main>
                <footer className="py-4 text-center text-xs" style={{ color: 'darkblue', fontSize: '0.67rem' }}>
                  Created by Bikramjit Chowdhury
                </footer>
              </div>
            </div>
          </div>
      </ContactProvider>
    </SidebarProvider>
  );
}
