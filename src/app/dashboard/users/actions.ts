

'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users, organizations as orgsTable, teams as teamsTable, users_to_organizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { userFormSchema } from '@/lib/schemas';
import { inArray } from 'drizzle-orm';

export async function createUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        name, email, password, role, avatar, organizations
    } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role,
        avatar,
    }).returning();
    
    if (organizations.length > 0) {
        const allOrgs = await db.query.organizations.findMany();
        let orgIdsToInsert: number[];

        if (organizations.includes('All Organizations')) {
            orgIdsToInsert = allOrgs.map(org => org.id);
        } else {
            const selectedOrgs = await db.query.organizations.findMany({
                where: inArray(orgsTable.name, organizations),
            });
            orgIdsToInsert = selectedOrgs.map(org => org.id);
        }

        await db.insert(users_to_organizations).values(
            orgIdsToInsert.map(orgId => ({
                userId: newUser.id,
                organizationId: orgId,
            }))
        );
    }

    revalidatePath('/dashboard/users');

    return { success: true, user: newUser };
}


export async function getOrganizationsForUserForm() {
    const result = await db.query.organizations.findMany({
        orderBy: (orgs, { asc }) => [asc(orgs.name)],
    });
    return result.map(r => r.name);
}

export async function getTeamsForUserForm() {
     const result = await db.query.teams.findMany({
        orderBy: (teams, { asc }) => [asc(teams.name)],
    });
    return result.map(r => r.name);
}
