
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contactOrganizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { organizationFormSchema } from '@/lib/schemas';

export async function getOrganization(id: number) {
    if (isNaN(id)) return null;

    const organization = await db.query.contactOrganizations.findFirst({
        where: eq(contactOrganizations.id, id),
    });

    return organization || null;
}

export async function updateOrganization(id: number, values: z.infer<typeof organizationFormSchema>) {
    const validatedFields = organizationFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { name, address } = validatedFields.data;

    const originalOrganization = await db.query.contactOrganizations.findFirst({
        where: eq(contactOrganizations.id, id),
    });

    if (!originalOrganization) {
        throw new Error('Organization not found');
    }

    // Update all records with the same organization name
    await db.update(contactOrganizations)
        .set({
            organization: name,
            address: address,
        })
        .where(eq(contactOrganizations.organization, originalOrganization.organization));


    revalidatePath('/dashboard/settings/organization');
    revalidatePath(`/dashboard/settings/organization/${id}/edit`);

    return { success: true };
}
