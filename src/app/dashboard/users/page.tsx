
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/dashboard/user-table';
import { db } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await db.query.users.findMany();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">User Management</h1>
          <p className="text-muted-foreground">Manage users and their permissions.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      <UserTable users={users} />
    </div>
  );
}
