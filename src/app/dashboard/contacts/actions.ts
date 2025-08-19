'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contacts, contactEmails, contactPhones, contactOrganizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  phoneType: z.enum(['Telephone', 'Mobile']).default('Mobile'),
  organization: z.string().optional(),
  designation: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function createContact(values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { firstName, lastName, email, phone, phoneType, organization, designation, address, notes } = validatedFields.data;

    const [newContact] = await db.insert(contacts).values({
        firstName,
        lastName,
        address,
        notes,
    }).returning();

    if (email) {
        await db.insert(contactEmails).values({
            contactId: newContact.id,
            email,
        });
    }

    if (phone) {
        await db.insert(contactPhones).values({
            contactId: newContact.id,
            phone,
            type: phoneType,
        });
    }

    if (organization) {
        await db.insert(contactOrganizations).values({
            contactId: newContact.id,
            organization,
            designation,
        });
    }

    revalidatePath('/dashboard/contacts');

    return { success: true, contact: newContact };
}
