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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface UserTableProps {
  users: User[];
}

const roleVariant: { [key in User['role']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Admin': 'destructive',
  'Power User': 'default',
  'Standard User': 'secondary',
  'Read-Only': 'outline',
};

export function UserTable({ users }: UserTableProps) {
  const [userRoles, setUserRoles] = React.useState<Record<string, User['role']>>(
    users.reduce((acc, user) => ({ ...acc, [user.id]: user.role }), {})
  );

  const handleRoleChange = (userId: string, role: string) => {
    setUserRoles(prev => ({ ...prev, [userId]: role as User['role'] }));
  };
  
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
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
                  <Badge variant={roleVariant[userRoles[user.id] as User['role']]}>
                    {userRoles[user.id]}
                  </Badge>
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
                      <DropdownMenuLabel>Edit User</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={userRoles[user.id]} onValueChange={(role) => handleRoleChange(user.id, role)}>
                          <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Power User">Power User</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Standard User">Standard User</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Read-Only">Read-Only</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
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
