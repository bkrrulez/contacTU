

'use server';

import { db } from '@/lib/db';
import { organizations as orgsTable, teams as teamsTable, contactOrganizations, contacts, contactEmails, contactPhones, contactUrls, contactAssociatedNames, contactSocialLinks } from '@/lib/db/schema';
import { sql, inArray, and, eq, or } from 'drizzle-orm';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export async function getExportData() {
    const orgs = await db.query.organizations.findMany({
        with: {
            teamsToOrganizations: {
                with: {
                    team: true,
                }
            }
        }
    });

    const organizations = orgs.map(org => ({
        name: org.name,
        teams: org.teamsToOrganizations.map(tto => tto.team.name).sort(),
    })).sort((a,b) => a.name.localeCompare(b.name));

    return { organizations };
}

const exportSchema = z.object({
    fileType: z.enum(['xlsx', 'csv']),
    organizations: z.array(z.string()),
    teams: z.array(z.string()),
});


export async function exportContacts(values: z.infer<typeof exportSchema>) {
     const validatedFields = exportSchema.safeParse(values);
     if (!validatedFields.success) {
         return { error: 'Invalid input.' };
     }

     const { fileType, organizations, teams } = validatedFields.data;

     const query = db.select({
            id: contacts.id,
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            address: contacts.address,
            birthday: contacts.birthday,
            notes: contacts.notes,
            organization: orgsTable.name,
            designation: contactOrganizations.designation,
            team: teamsTable.name,
            department: contactOrganizations.department,
            email: contactEmails.email,
            phone: contactPhones.phone,
            phoneType: contactPhones.type,
            website: contactUrls.url,
            socialMedia: contactSocialLinks.link,
            subordinateName: contactAssociatedNames.name,
        })
        .from(contacts)
        .leftJoin(contactOrganizations, eq(contacts.id, contactOrganizations.contactId))
        .leftJoin(orgsTable, eq(contactOrganizations.organizationId, orgsTable.id))
        .leftJoin(teamsTable, eq(contactOrganizations.teamId, teamsTable.id))
        .leftJoin(contactEmails, eq(contacts.id, contactEmails.contactId))
        .leftJoin(contactPhones, eq(contacts.id, contactPhones.contactId))
        .leftJoin(contactUrls, eq(contacts.id, contactUrls.contactId))
        .leftJoin(contactSocialLinks, eq(contacts.id, contactSocialLinks.contactId))
        .leftJoin(contactAssociatedNames, eq(contacts.id, contactAssociatedNames.contactId))
        

     const conditions = [];
     if (organizations.length > 0) {
        conditions.push(inArray(orgsTable.name, organizations));
     }
     if (teams.length > 0) {
        conditions.push(inArray(teamsTable.name, teams));
     }

     if (conditions.length > 0) {
         query.where(and(...conditions));
     }

     const rawData = await query;
     
     if (rawData.length === 0) {
         return { error: 'No contacts found matching the criteria.' };
     }

    // Process data to group by contact
    const contactMap = new Map<number, any>();
    rawData.forEach(row => {
        if (!contactMap.has(row.id)) {
            contactMap.set(row.id, {
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
                address: row.address,
                birthday: row.birthday,
                notes: row.notes,
                organizations: new Set(),
                emails: new Set(),
                phones: new Set(),
                websites: new Set(),
                socialLinks: new Set(),
                subordinates: new Set(),
            });
        }
        const contact = contactMap.get(row.id);
        if (row.organization) contact.organizations.add(JSON.stringify({
            organization: row.organization,
            designation: row.designation,
            team: row.team,
            department: row.department,
        }));
        if (row.email) contact.emails.add(row.email);
        if (row.phone) contact.phones.add(`${row.phone} (${row.phoneType})`);
        if (row.website) contact.websites.add(row.website);
        if (row.socialMedia) contact.socialLinks.add(row.socialMedia);
        if (row.subordinateName) contact.subordinates.add(row.subordinateName);
    });

    const exportData = Array.from(contactMap.values()).map(contact => ({
        'First Name': contact.firstName,
        'Last Name': contact.lastName,
        'Emails': Array.from(contact.emails).join(', '),
        'Phones': Array.from(contact.phones).join(', '),
        'Organizations': Array.from(contact.organizations).map((org: any) => JSON.parse(org).organization).join(', '),
        'Designations': Array.from(contact.organizations).map((org: any) => JSON.parse(org).designation).join(', '),
        'Teams': Array.from(contact.organizations).map((org: any) => JSON.parse(org).team).join(', '),
        'Departments': Array.from(contact.organizations).map((org: any) => JSON.parse(org).department).join(', '),
        'Address': contact.address,
        'Website': Array.from(contact.websites).join(', '),
        'Social Media': Array.from(contact.socialLinks).join(', '),
        'Birthday': contact.birthday,
        'Subordinates': Array.from(contact.subordinates).join(', '),
        'Notes': contact.notes,
    }));
     
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
    
    worksheet['!cols'] = Object.keys(exportData[0]).map(() => ({ wch: 30 }));
    
    const buffer = XLSX.write(workbook, { bookType: fileType, type: 'buffer' });
    const base64File = Buffer.from(buffer).toString('base64');
    
    const fileName = `contact-export.${fileType}`;
    const mimeType = fileType === 'xlsx' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'text/csv';

    return {
        file: base64File,
        fileName: fileName,
        mimeType: mimeType,
    };
}
