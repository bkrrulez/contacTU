import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserTable } from '@/components/dashboard/user-table';
import { mockUsers } from '@/lib/data';

export default function UsersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">User Management</h1>
          <p className="text-muted-foreground">Manage users and their permissions.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserTable users={mockUsers} />
    </div>
  );
}
