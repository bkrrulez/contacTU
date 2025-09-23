
'use server';

import { db } from '@/lib/db';
import { contacts as contactsTable, users as usersTable, organizations as orgsTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// This action is now simplified as contacts are fetched separately by the context
export async function getDashboardData() {
    const usersPromise = db.query.users.findMany();
    const organizationsPromise = db.query.organizations.findMany();

    const [users, organizations] = await Promise.all([
        usersPromise,
        organizationsPromise,
    ]);

    return {
        users,
        organizationsCount: organizations.length,
    };
}
