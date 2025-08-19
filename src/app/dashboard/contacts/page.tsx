import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactTable } from '@/components/dashboard/contact-table';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default async function ContactsPage() {
  const contacts = await db.query.contacts.findMany({
    with: {
        organizations: true,
        emails: true,
        phones: true,
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Contacts</h1>
          <p className="text-muted-foreground">Manage all contacts in the system.</p>
        </div>
        <Button asChild>
            <Link href="/dashboard/contacts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
            <ContactTable contacts={contacts} />
        </CardContent>
      </Card>
    </div>
  );
}
