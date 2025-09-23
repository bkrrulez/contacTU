
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { AppHeader } from '@/components/dashboard/header';
import { UserProfile } from '@/components/dashboard/user-profile';
import { db } from '@/lib/db';
import { headers } from 'next/headers';
import type { User } from '@/lib/types';


// This is a server component, but we're creating a mock user for the admin
// to avoid fetching from the DB unnecessarily when the admin logs in.
function getFakeAdminUser(): User {
    return {
        id: 0, // A non-existent ID
        name: 'Admin User',
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com',
        role: 'Admin',
        profilePicture: 'https://picsum.photos/seed/admin/100/100',
        usersToOrganizations: [{ organization: { id: -1, name: 'All Organizations', address: null } }],
    }
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // A simplified way to check if we are the admin user.
    // In a real app, this would be handled by a proper session management system.
    const referer = headers().get('referer');
    const isProbablyAdmin = referer?.endsWith('/') || false;

    let currentUser: Partial<User> | null = null;
    if (isProbablyAdmin) {
        currentUser = getFakeAdminUser();
    } else {
        // For any other user, we try to fetch from the DB
        // In a real app, we'd get the user ID from the session.
        // For this demo, we'll just grab the first non-admin user.
         currentUser = await db.query.users.findFirst();
    }


  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}
