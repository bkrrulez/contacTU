

'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactTable } from '@/components/dashboard/contact-table';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import type { Contact } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { getContactsForPage } from './actions';
import { ContactFilters } from '@/components/dashboard/contact-filters';

export const dynamic = 'force-dynamic';

export default function ContactsPage() {
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>(['All Organizations']);

  useEffect(() => {
    async function loadContacts() {
      setIsLoading(true);
      try {
        const contacts = await getContactsForPage();
        setAllContacts(contacts);
      } catch (error) {
        console.error("Failed to load contacts", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return allContacts.filter(contact => {
      const nameMatch = selectedNames.length === 0 || selectedNames.includes(`${contact.firstName} ${contact.lastName}`);
      const orgMatch = selectedOrgs.length === 0 || selectedOrgs.includes('All Organizations') || contact.organizations?.some(org => selectedOrgs.includes(org.organization.name));
      return nameMatch && orgMatch;
    });
  }, [allContacts, selectedNames, selectedOrgs]);
  
  const contactNames = useMemo(() => allContacts.map(c => `${c.firstName} ${c.lastName}`), [allContacts]);
  const organizationNames = useMemo(() => {
    const orgs = new Set<string>();
    allContacts.forEach(c => {
        c.organizations?.forEach(o => orgs.add(o.organization.name));
    });
    return ['All Organizations', ...Array.from(orgs).sort()];
  }, [allContacts]);


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Contacts</h1>
          <p className="text-muted-foreground">Manage all contacts in the system.</p>
        </div>
        <div className="flex items-center gap-2">
           <ContactFilters
            contactNames={contactNames}
            organizationNames={organizationNames}
            selectedNames={selectedNames}
            onSelectedNamesChange={setSelectedNames}
            selectedOrgs={selectedOrgs}
            onSelectedOrgsChange={setSelectedOrgs}
          />
          <Button asChild>
              <Link href="/dashboard/contacts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Contact
              </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading contacts...</div>
            ): (
                <ContactTable contacts={filteredContacts} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
