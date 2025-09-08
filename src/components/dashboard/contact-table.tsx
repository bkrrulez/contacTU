
'use client';

import * as React from 'react';
import type { Contact } from '@/lib/types';
import Link from 'next/link';
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
import { MoreHorizontal, ArrowUpDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteContact, toggleFavoriteStatus } from '@/app/dashboard/contacts/actions';
import { useToast } from '@/hooks/use-toast';


interface ContactTableProps {
  contacts: Contact[];
}

type SortKey = 'name' | 'organization' | 'email' | 'phone';

export function ContactTable({ contacts: initialContacts }: ContactTableProps) {
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [contacts, setContacts] = React.useState(initialContacts);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [contactToDelete, setContactToDelete] = React.useState<Contact | null>(null);

  React.useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedContacts = [...contacts].sort((a, b) => {
      let aValue: string | undefined = '';
      let bValue: string | undefined = '';

      switch (key) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'organization':
          aValue = a.organizations?.[0]?.organization;
          bValue = b.organizations?.[0]?.organization;
          break;
        case 'email':
          aValue = a.emails?.[0]?.email;
          bValue = b.emails?.[0]?.email;
          break;
        case 'phone':
          aValue = a.phones?.[0]?.phone;
          bValue = b.phones?.[0]?.phone;
          break;
      }
      
      aValue = aValue || '';
      bValue = bValue || '';

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setContacts(sortedContacts);
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

  const openDeleteDialog = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (contactToDelete) {
      try {
        await deleteContact(contactToDelete.id);
        toast({
          title: 'Contact Deleted',
          description: `${contactToDelete.firstName} ${contactToDelete.lastName} has been deleted.`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete contact.',
        });
      } finally {
        setShowDeleteDialog(false);
        setContactToDelete(null);
      }
    }
  };

  const handleToggleFavorite = async (contact: Contact) => {
    const result = await toggleFavoriteStatus(contact.id, contact.isFavorite);
    if (result.success) {
      toast({
        title: `Contact ${contact.isFavorite ? 'unmarked' : 'marked'} as favorite`,
        description: `${contact.firstName} ${contact.lastName} has been updated.`,
      });
      // Optionally update local state to reflect change immediately
      setContacts(contacts.map(c => c.id === contact.id ? {...c, isFavorite: !c.isFavorite} : c));
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  const isAllSelected = selectedRows.size > 0 && selectedRows.size === contacts.length;
  const isSomeSelected = selectedRows.size > 0 && !isAllSelected;

  if (contacts.length === 0) {
    return null;
  }
  
  return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {renderHeader('name', 'Name')}
              {renderHeader('organization', 'Organization', 'hidden md:table-cell')}
              {renderHeader('email', 'Email', 'hidden lg:table-cell')}
              {renderHeader('phone', 'Phone')}
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
                      <div className="font-medium flex items-center gap-2">
                        {contact.firstName} {contact.lastName}
                        {contact.isFavorite && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                      </div>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/contacts/${contact.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/contacts/${contact.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(contact)}>
                        {contact.isFavorite ? 'Remove from Favorite' : 'Mark as Favorite'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => openDeleteDialog(contact)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the contact
                for {contactToDelete?.firstName} {contactToDelete?.lastName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
