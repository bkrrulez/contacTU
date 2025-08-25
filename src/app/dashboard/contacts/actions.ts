
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contacts, contactEmails, contactPhones, contactOrganizations, contactUrls, contactSocialLinks, contactAssociatedNames } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import type { Contact } from '@/lib/types';
import { contactFormSchema } from '@/lib/schemas';


export async function createContact(values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        firstName, lastName, emails, phones, organizations,
        address, notes, website, birthday, associatedName, socialMedia
    } = validatedFields.data;

    const [newContact] = await db.insert(contacts).values({
        firstName,
        lastName,
        address,
        notes,
        birthday: birthday ? birthday.toISOString().split('T')[0] : undefined,
    }).returning();

    if (emails?.length) {
        await db.insert(contactEmails).values(
            emails.map(email => ({
                contactId: newContact.id,
                email: email.email,
            }))
        );
    }

    if (phones?.length) {
        await db.insert(contactPhones).values(
            phones.map(phone => ({
                contactId: newContact.id,
                phone: phone.phone,
                type: phone.type,
            }))
        );
    }

    if (organizations?.length) {
        await db.insert(contactOrganizations).values(
            organizations.map(org => ({
                contactId: newContact.id,
                organization: org.organization,
                designation: org.designation,
                team: org.team,
                department: org.department,
            }))
        );
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
        firstName, lastName, emails, phones, organizations,
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
    if (emails?.length) {
        await db.insert(contactEmails).values(
            emails.map(email => ({ contactId: id, email: email.email }))
        );
    }

    await db.delete(contactPhones).where(eq(contactPhones.contactId, id));
    if (phones?.length) {
        await db.insert(contactPhones).values(
            phones.map(phone => ({ contactId: id, phone: phone.phone, type: phone.type }))
        );
    }
    
    await db.delete(contactOrganizations).where(eq(contactOrganizations.contactId, id));
    if (organizations?.length) {
        await db.insert(contactOrganizations).values(
            organizations.map(org => ({ 
                contactId: id, 
                organization: org.organization, 
                designation: org.designation, 
                team: org.team, 
                department: org.department 
            }))
        );
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

export async function getContact(id: number): Promise<Contact | null> {
    const contact = await db.query.contacts.findFirst({
        where: (contacts, { eq }) => eq(contacts.id, id),
        with: {
            organizations: true,
            emails: true,
            phones: true,
            urls: true,
            socialLinks: true,
            associatedNames: true,
        }
    });
    return contact || null;
}
