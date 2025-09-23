
'use client';

import type { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';
import type { OrganizationSchema } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: (User & { organizations: OrganizationSchema[] })[];
}

const roleVariant: { [key in User['role']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Admin': 'destructive',
  'Power User': 'default',
  'Standard User': 'secondary',
  'Read-Only': 'outline',
};

type SortKey = 'name' | 'email' | 'role' | 'organizations';
type UserWithOrgs = User & { organizations: OrganizationSchema[] };

export function UserTable({ users: initialUsers }: UserTableProps) {
  const [users, setUsers] = React.useState(initialUsers);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);
  
  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'organizations':
          aValue = a.organizations?.map(o => o.name).join(', ') || '';
          bValue = b.organizations?.map(o => o.name).join(', ') || '';
          break;
      }

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setUsers(sortedUsers);
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    );
  };
  
   const renderHeader = (key: SortKey, label: string, className?: string) => (
    <TableHead className={cn('cursor-pointer', className)} onClick={() => handleSort(key)}>
      <div className="flex items-center">
        {label}
        {getSortIndicator(key)}
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              {renderHeader('name', 'Name')}
              {renderHeader('email', 'Email', 'hidden md:table-cell')}
              {renderHeader('role', 'Role')}
              {renderHeader('organizations', 'Organizations', 'hidden lg:table-cell')}
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {user.profilePicture && <AvatarImage src={user.profilePicture} alt={user.name} data-ai-hint="person portrait" />}
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleVariant[user.role]}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                   <div className="flex flex-wrap gap-1">
                        {user.organizations?.map(org => (
                            <Badge key={org.id} variant={org.name === 'All Organizations' ? 'default' : 'secondary'} className="font-normal">{org.name}</Badge>
                        ))}
                   </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
