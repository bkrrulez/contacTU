

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
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';
import type { OrganizationSchema } from '@/lib/db/schema';

interface UserTableProps {
  users: (User & { organizations: OrganizationSchema[] })[];
}

const roleVariant: { [key in User['role']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'Admin': 'destructive',
  'Power User': 'default',
  'Standard User': 'secondary',
  'Read-Only': 'outline',
};

export function UserTable({ users }: UserTableProps) {
  
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden lg:table-cell">Organizations</TableHead>
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
