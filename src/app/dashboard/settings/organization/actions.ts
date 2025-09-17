

'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { organizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { organizationFormSchema } from '@/lib/schemas';

export async function getOrganization(id: number) {
    if (isNaN(id)) return null;

    const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, id),
    });

    return organization || null;
}

export async function updateOrganization(id: number, values: z.infer<typeof organizationFormSchema>) {
    const validatedFields = organizationFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { name, address } = validatedFields.data;

    await db.update(organizations)
        .set({
            name: name,
            address: address,
        })
        .where(eq(organizations.id, id));


    revalidatePath('/dashboard/settings/organization');
    revalidatePath(`/dashboard/settings/organization/${id}/edit`);

    return { success: true };
}
