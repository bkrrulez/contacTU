
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contacts, contactEmails, contactPhones, contactOrganizations, contactUrls, contactSocialLinks, contactAssociatedNames } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Please add email to save the contact').email('Invalid email address'),
  phone: z.string().min(1, 'Please add mobile to save the contact'),
  phoneType: z.enum(['Telephone', 'Mobile']).default('Mobile'),
  organization: z.string().min(1, 'Organization is required'),
  designation: z.string().optional(),
  team: z.string().min(1, 'Team is required'),
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


export async function updateContact(id: number, values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        firstName, lastName, email, phone, phoneType, organization, designation, team, department,
        address, notes, website, birthday, associatedName, socialMedia
    } = validatedFields.data;

    await db.update(contacts).set({
        firstName,
        lastName,
        address,
        notes,
        birthday: birthday ? birthday.toISOString().split('T')[0] : undefined,
    }).where(eq(contacts.id, id));

    // For simplicity, we'll clear and re-insert related data.
    // In a real app, you might want to do a more sophisticated diff and update.
    await db.delete(contactEmails).where(eq(contactEmails.contactId, id));
    if (email) {
        await db.insert(contactEmails).values({ contactId: id, email });
    }

    await db.delete(contactPhones).where(eq(contactPhones.contactId, id));
    if (phone) {
        await db.insert(contactPhones).values({ contactId: id, phone, type: phoneType });
    }
    
    await db.delete(contactOrganizations).where(eq(contactOrganizations.contactId, id));
    if (organization) {
        await db.insert(contactOrganizations).values({ contactId: id, organization, designation, team, department });
    }

    await db.delete(contactUrls).where(eq(contactUrls.contactId, id));
    if (website) {
        await db.insert(contactUrls).values({ contactId: id, url: website });
    }

    await db.delete(contactSocialLinks).where(eq(contactSocialLinks.contactId, id));
    if (socialMedia) {
        await db.insert(contactSocialLinks).values({ contactId: id, link: socialMedia });
    }

    await db.delete(contactAssociatedNames).where(eq(contactAssociatedNames.contactId, id));
    if (associatedName) {
        await db.insert(contactAssociatedNames).values({ contactId: id, name: associatedName });
    }

    revalidatePath('/dashboard/contacts');
    revalidatePath(`/dashboard/contacts/${id}/edit`);

    return { success: true };
}
