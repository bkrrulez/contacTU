

'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contacts, contactEmails, contactPhones, contactOrganizations, contactUrls, contactSocialLinks, contactAssociatedNames, auditLogs, organizations as orgsTable, teams as teamsTable } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, and, sql } from 'drizzle-orm';
import type { Contact } from '@/lib/types';
import { contactFormSchema } from '@/lib/schemas';


async function createAuditLog(
    action: 'create' | 'update' | 'delete', 
    entityId: number, 
    details: Record<string, any>
) {
    // In a real app, you would get the current user's ID from the session.
    // For now, we'll hardcode it to the first user (Admin).
    const currentUser = await db.query.users.findFirst();
    const userId = currentUser?.id;

    await db.insert(auditLogs).values({
        userId,
        action,
        entityType: 'contact',
        entityId,
        details,
    });
}

// Helper to get or create organization and team IDs
async function getOrCreateOrgAndTeam(orgName: string, teamName?: string | null): Promise<{ organizationId: number, teamId: number | null }> {
    let organizationId: number;
    let teamId: number | null = null;

    // Handle Organization
    const existingOrg = await db.query.organizations.findFirst({ where: eq(orgsTable.name, orgName) });
    if (existingOrg) {
        organizationId = existingOrg.id;
    } else {
        const [newOrg] = await db.insert(orgsTable).values({ name: orgName }).returning();
        organizationId = newOrg.id;
    }

    // Handle Team
    if (teamName) {
        const existingTeam = await db.query.teams.findFirst({ where: eq(teamsTable.name, teamName) });
        if (existingTeam) {
            teamId = existingTeam.id;
        } else {
            const [newTeam] = await db.insert(teamsTable).values({ name: teamName }).returning();
            teamId = newTeam.id;
        }

        // Ensure team is associated with the organization
        await db.execute(sql`
            INSERT INTO teams_to_organizations ("teamId", "organizationId")
            VALUES (${teamId}, ${organizationId})
            ON CONFLICT DO NOTHING;
        `);
    }

    return { organizationId, teamId };
}


export async function createContact(values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        firstName, lastName, emails, phones, organizations,
        address, notes, website, birthday, subordinateName, socialMedia
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
        for (const org of organizations) {
            const { organizationId, teamId } = await getOrCreateOrgAndTeam(org.organization, org.team);
            await db.insert(contactOrganizations).values({
                contactId: newContact.id,
                organizationId,
                teamId,
                designation: org.designation,
                department: org.department,
            });
        }
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

    if (subordinateName) {
        await db.insert(contactAssociatedNames).values({
            contactId: newContact.id,
            name: subordinateName,
        })
    }
    
    await createAuditLog('create', newContact.id, { contactName: `${firstName} ${lastName}` });

    revalidatePath('/dashboard/contacts');
    revalidatePath('/dashboard/audit');

    return { success: true, contact: newContact };
}


export async function updateContact(id: number, values: z.infer<typeof contactFormSchema>) {
    const validatedFields = contactFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { 
        firstName, lastName, emails, phones, organizations,
        address, notes, website, birthday, subordinateName, socialMedia
    } = validatedFields.data;

    await db.update(contacts).set({
        firstName,
        lastName,
        address,
        notes,
        birthday: birthday ? birthday.toISOString().split('T')[0] : undefined,
    }).where(eq(contacts.id, id));

    // Clear and re-insert related data
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
        for (const org of organizations) {
            const { organizationId, teamId } = await getOrCreateOrgAndTeam(org.organization, org.team);
            await db.insert(contactOrganizations).values({
                contactId: id,
                organizationId,
                teamId,
                designation: org.designation,
                department: org.department,
            });
        }
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
    if (subordinateName) {
        await db.insert(contactAssociatedNames).values({ contactId: id, name: subordinateName });
    }

    await createAuditLog('update', id, { contactName: `${firstName} ${lastName}` });

    revalidatePath('/dashboard/contacts');
    revalidatePath(`/dashboard/contacts/${id}`);
    revalidatePath(`/dashboard/contacts/${id}/edit`);
    revalidatePath('/dashboard/audit');

    return { success: true };
}

export async function deleteContact(id: number) {
    const contactToDelete = await db.query.contacts.findFirst({ where: eq(contacts.id, id) });
    if (!contactToDelete) {
        throw new Error('Contact not found');
    }

    await db.delete(contacts).where(eq(contacts.id, id));

    await createAuditLog('delete', id, { contactName: `${contactToDelete.firstName} ${contactToDelete.lastName}` });
    
    revalidatePath('/dashboard/contacts');
    revalidatePath('/dashboard/audit');
    revalidatePath('/dashboard/favorites');
    revalidatePath('/dashboard');


    return { success: true };
}


export async function getContact(id: number): Promise<Contact | null> {
    if (isNaN(id)) return null;
    const contact = await db.query.contacts.findFirst({
        where: (contacts, { eq }) => eq(contacts.id, id),
        with: {
            organizations: {
                with: {
                    organization: true,
                    team: true
                }
            },
            emails: true,
            phones: true,
            urls: true,
            socialLinks: true,
            associatedNames: true,
        }
    });
    return contact || null;
}

export async function toggleFavoriteStatus(id: number, isFavorite: boolean) {
    try {
        await db.update(contacts)
            .set({ isFavorite: !isFavorite })
            .where(eq(contacts.id, id));

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/contacts');
        revalidatePath('/dashboard/favorites');
        revalidatePath(`/dashboard/contacts/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle favorite status:', error);
        return { success: false, error: 'Failed to update contact.' };
    }
}
