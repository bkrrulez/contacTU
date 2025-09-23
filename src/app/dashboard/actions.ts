
'use server';

import { db } from '@/lib/db';
import { contacts as contactsTable, users as usersTable, organizations as orgsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getDashboardData() {
    const contactsPromise = db.query.contacts.findMany({
        with: {
            organizations: { with: { organization: true, team: true } },
            emails: true,
            phones: true,
        },
        orderBy: (contacts, { desc }) => [desc(contacts.id)], // Get most recent
    });

    const usersPromise = db.query.users.findMany();
    const organizationsPromise = db.query.organizations.findMany();
    const favoritesPromise = db.select().from(contactsTable).where(eq(contactsTable.isFavorite, true));

    const [contacts, users, organizations, favorites] = await Promise.all([
        contactsPromise,
        usersPromise,
        organizationsPromise,
        favoritesPromise,
    ]);

    return {
        contacts,
        users,
        organizationsCount: organizations.length,
        favoritesCount: favorites.length,
    };
}
