
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/sidebar';
import { AppHeader } from '@/components/dashboard/header';
import { UserProfile } from '@/components/dashboard/user-profile';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await db.query.users.findFirst({
    columns: {
      name: true,
      avatar: true,
      role: true,
    }
  });


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
