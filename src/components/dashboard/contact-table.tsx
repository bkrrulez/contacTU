'use client';

import * as React from 'react';
import type { Contact } from '@/lib/types';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ContactTableProps {
  contacts: Contact[];
}

export function ContactTable({ contacts }: ContactTableProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(new Set(contacts.map((c) => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(id);
    } else {
      newSelectedRows.delete(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const isAllSelected = selectedRows.size > 0 && selectedRows.size === contacts.length;
  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  if (contacts.length === 0) {
    return null;
  }
  
  return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Organization</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} data-state={selectedRows.has(contact.id) ? 'selected' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(contact.id)}
                    onCheckedChange={(checked) => handleSelectRow(contact.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {contact.avatar && <AvatarImage src={contact.avatar} alt={contact.firstName} data-ai-hint="person portrait" />}
                      <AvatarFallback>
                        {contact.firstName.charAt(0)}
                        {contact.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{contact.organizations?.[0]?.organization}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{contact.organizations?.[0]?.organization}</TableCell>
                <TableCell className="hidden lg:table-cell">{contact.emails?.[0]?.email}</TableCell>
                <TableCell>{contact.phones?.[0]?.phone}</TableCell>
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
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  );
}
