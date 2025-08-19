'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contacts, contactEmails, contactPhones, contactOrganizations, contactUrls, contactSocialLinks, contactAssociatedNames } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  phoneType: z.enum(['Telephone', 'Mobile']).default('Mobile'),
  organization: z.string().optional(),
  designation: z.string().optional(),
  team: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  birthday: z.date().optional(),
  associatedName: z.string().optional(),
  socialMedia: z.string().url().optional().or(z.literal('')),
});

export async function createContact(values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        firstName, lastName, email, phone, phoneType, organization, designation, team, department,
        address, notes, website, birthday, associatedName, socialMedia
    } = validatedFields.data;

    const [newContact] = await db.insert(contacts).values({
        firstName,
        lastName,
        address,
        notes,
        birthday: birthday ? birthday.toISOString().split('T')[0] : undefined,
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
            team,
            department
        });
    }

    if (website) {
        await db.insert(contactUrls).values({
            contactId: newContact.id,
            url: website,
        });
    }

    if(socialMedia) {
        await db.insert(contactSocialLinks).values({
            contactId: newContact.id,
            link: socialMedia,
        });
    }

    if (associatedName) {
        await db.insert(contactAssociatedNames).values({
            contactId: newContact.id,
            name: associatedName,
        })
    }

    revalidatePath('/dashboard/contacts');

    return { success: true, contact: newContact };
}
