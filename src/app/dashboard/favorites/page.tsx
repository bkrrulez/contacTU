
import { Star } from 'lucide-react';
import { ContactTable } from '@/components/dashboard/contact-table';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { contacts as contactsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const contacts = await db.query.contacts.findMany({
    where: eq(contactsTable.isFavorite, true),
    with: {
        organizations: true,
        emails: true,
        phones: true,
    },
    orderBy: (contacts, { asc }) => [asc(contacts.firstName), asc(contacts.lastName)],
  });

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
            {contacts.length > 0 ? (
                <ContactTable contacts={contacts} />
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
