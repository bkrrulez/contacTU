

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/dashboard/user-table';
import { db } from '@/lib/db';
import Link from 'next/link';
import type { User } from '@/lib/types';
import { organizations as orgsTable } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const allOrganizations = await db.query.organizations.findMany({ columns: { id: true } });
  const totalOrgs = allOrganizations.length;

  const users: User[] = await db.query.users.findMany({
    with: {
        usersToOrganizations: {
            with: {
                organization: true
            }
        }
    },
    orderBy: (users, { asc }) => [asc(users.name), asc(users.email)],
  });

  // Map organizations to the top-level user object for easier access in the client component
  const usersWithOrgs = users.map(user => {
      const userOrgCount = user.usersToOrganizations.length;
      let organizations = user.usersToOrganizations.map(uto => uto.organization);

      if (userOrgCount > 0 && userOrgCount === totalOrgs) {
        organizations = [{ id: -1, name: 'All Organizations', address: null }]; // Special placeholder
      }
      
      return {
          ...user,
          organizations: organizations,
      };
  });

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
      <UserTable users={usersWithOrgs} />
    </div>
  );
}
