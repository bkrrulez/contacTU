

'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users, organizations as orgsTable, users_to_organizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { userFormSchema } from '@/lib/schemas';
import { inArray, eq } from 'drizzle-orm';
import type { User } from '@/lib/types';


export async function createUser(values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        name, email, password, role, profilePicture, organizations
    } = validatedFields.data;

    if (!password) {
        throw new Error('Password is required for new users');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insertData: Omit<typeof users.$inferInsert, 'id' | 'resetToken' | 'resetTokenExpiry'> = {
        name,
        email,
        password: hashedPassword,
        role,
    };

    if (profilePicture) {
        insertData.profilePicture = profilePicture;
    }

    const [newUser] = await db.insert(users).values(insertData).returning();
    
    let orgIdsToInsert: number[];

    if (organizations.includes('All Organizations')) {
        const allOrgs = await db.query.organizations.findMany({ columns: { id: true } });
        orgIdsToInsert = allOrgs.map(org => org.id);
    } else {
        const selectedOrgs = await db.query.organizations.findMany({
            where: inArray(orgsTable.name, organizations),
            columns: { id: true }
        });
        orgIdsToInsert = selectedOrgs.map(org => org.id);
    }

    if (orgIdsToInsert.length > 0) {
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
        columns: { name: true }
    });
    return result.map(r => r.name);
}


export async function getUser(id: number): Promise<(User & { organizationNames: string[] }) | null> {
    if (isNaN(id)) return null;

    const user = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
            usersToOrganizations: {
                with: {
                    organization: {
                        columns: { name: true }
                    }
                }
            }
        }
    });

    if (!user) return null;
    
    const allOrgs = await db.query.organizations.findMany({ columns: { id: true }});
    const userOrgs = user.usersToOrganizations;
    
    let organizationNames: string[];
    if (userOrgs.length === allOrgs.length) {
        organizationNames = ['All Organizations'];
    } else {
        organizationNames = userOrgs.map(uto => uto.organization.name);
    }


    return {
        ...user,
        organizationNames: organizationNames,
    };
}


export async function updateUser(id: number, values: z.infer<typeof userFormSchema>) {
    const validatedFields = userFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { name, email, password, role, profilePicture, organizations: orgNames } = validatedFields.data;

    const updateData: Partial<typeof users.$inferInsert> = { name, email, role };

    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }
    
    if (profilePicture && profilePicture.startsWith('data:image/')) {
        updateData.profilePicture = profilePicture;
    }


    await db.update(users).set(updateData).where(eq(users.id, id));

    // Clear existing org associations for the user
    await db.delete(users_to_organizations).where(eq(users_to_organizations.userId, id));

    let orgIdsToInsert: number[];

    if (orgNames.includes('All Organizations')) {
        const allOrgs = await db.query.organizations.findMany({ columns: { id: true } });
        orgIdsToInsert = allOrgs.map(org => org.id);
    } else {
        const selectedOrgs = await db.query.organizations.findMany({
            where: inArray(orgsTable.name, orgNames),
            columns: { id: true }
        });
        orgIdsToInsert = selectedOrgs.map(org => org.id);
    }

    if (orgIdsToInsert.length > 0) {
        await db.insert(users_to_organizations).values(
            orgIdsToInsert.map(orgId => ({
                userId: id,
                organizationId: orgId,
            }))
        );
    }

    revalidatePath('/dashboard/users');
    revalidatePath(`/dashboard/users/${id}/edit`);

    return { success: true };
}

    
