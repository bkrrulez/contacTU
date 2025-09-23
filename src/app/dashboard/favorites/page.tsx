
'use client';

import { Star } from 'lucide-react';
import { ContactTable } from '@/components/dashboard/contact-table';
import { Card, CardContent } from '@/components/ui/card';
import type { Contact } from '@/lib/types';
import { useContacts } from '@/contexts/ContactContext';
import { useMemo } from 'react';

export default function FavoritesPage() {
  const { contacts: allContacts, isLoading } = useContacts();

  const favoriteContacts = useMemo(() => {
    return allContacts.filter(contact => contact.isFavorite);
  }, [allContacts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Star className="h-6 w-6 text-amber-400" />
            Favorite Contacts
          </h1>
          <p className="text-muted-foreground">Your most important contacts, all in one place.</p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading contacts...</div>
            ) : favoriteContacts.length > 0 ? (
                <ContactTable contacts={favoriteContacts} />
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <p>You haven't marked any contacts as favorite yet.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
