
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users, contactOrganizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { userFormSchema } from '@/lib/schemas';
import { and, isNotNull, ne } from 'drizzle-orm';


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
        organizations
    }).returning();


    revalidatePath('/dashboard/users');

    return { success: true, user: newUser };
}


export async function getOrganizationsForUserForm() {
    const result = await db.selectDistinct({ organization: contactOrganizations.organization })
        .from(contactOrganizations)
        .where(and(isNotNull(contactOrganizations.organization), ne(contactOrganizations.organization, '')));

    return result.map(r => r.organization);
}
