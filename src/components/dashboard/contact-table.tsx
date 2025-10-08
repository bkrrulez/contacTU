
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
import { MoreHorizontal, ArrowUpDown, Star, Trash2 } from 'lucide-react';
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
import { deleteContact, deleteMultipleContacts, toggleFavoriteStatus } from '@/app/dashboard/contacts/actions';
import { useToast } from '@/hooks/use-toast';
import { useContacts } from '@/contexts/ContactContext';


interface ContactTableProps {
  contacts: Contact[];
}

type SortKey = 'name' | 'organization' | 'email' | 'phone';

export function ContactTable({ contacts: initialContacts }: ContactTableProps) {
  const { toast } = useToast();
  const { removeContact, refreshContacts } = useContacts();
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [contacts, setContacts] = React.useState(initialContacts);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [contactsToDelete, setContactsToDelete] = React.useState<Contact[]>([]);

  React.useEffect(() => {
    setContacts(initialContacts);
  }, [initialContacts]);

  React.useEffect(() => {
    // Clear selection if contacts list changes (e.g. due to filtering)
    setSelectedRows(new Set());
  }, [contacts]);


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
          aValue = a.organizations?.[0]?.organization.name;
          bValue = b.organizations?.[0]?.organization.name;
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
    setContactsToDelete([contact]);
    setShowDeleteDialog(true);
  };
  
  const openBulkDeleteDialog = () => {
    const toDelete = contacts.filter(c => selectedRows.has(c.id));
    if (toDelete.length > 0) {
      setContactsToDelete(toDelete);
      setShowDeleteDialog(true);
    }
  }

  const handleDeleteConfirm = async () => {
    if (contactsToDelete.length > 0) {
      const idsToDelete = contactsToDelete.map(c => c.id);
      try {
        await deleteMultipleContacts(idsToDelete);
        idsToDelete.forEach(id => removeContact(id)); // Update context state
        toast({
          title: 'Contacts Deleted',
          description: `${contactsToDelete.length} contact(s) have been deleted.`,
        });
        setSelectedRows(new Set());
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete contacts.',
        });
      } finally {
        setShowDeleteDialog(false);
        setContactsToDelete([]);
      }
    }
  };

  const getDeleteDialogDescription = () => {
    if (contactsToDelete.length === 1) {
        return `This action cannot be undone. This will permanently delete the contact for ${contactsToDelete[0].firstName} ${contactsToDelete[0].lastName}.`;
    }
    if (contactsToDelete.length > 1) {
        return `This action cannot be undone. This will permanently delete ${contactsToDelete.length} selected contacts.`;
    }
    return '';
  }


  const handleToggleFavorite = async (contact: Contact) => {
    const result = await toggleFavoriteStatus(contact.id, contact.isFavorite);
    if (result.success) {
      toast({
        title: `Contact ${contact.isFavorite ? 'unmarked' : 'marked'} as favorite`,
        description: `${contact.firstName} ${contact.lastName} has been updated.`,
      });
      // This will trigger a full refresh from context provider to ensure consistency
      refreshContacts();
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
        <div className="flex items-center gap-2 mb-4">
            {selectedRows.size > 0 && (
                <Button variant="destructive" size="sm" onClick={openBulkDeleteDialog}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedRows.size})
                </Button>
            )}
        </div>
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
                      <div className="text-sm text-muted-foreground md:hidden">{contact.organizations?.[0]?.organization.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{contact.organizations?.[0]?.organization.name}</TableCell>
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
                {getDeleteDialogDescription()}
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
