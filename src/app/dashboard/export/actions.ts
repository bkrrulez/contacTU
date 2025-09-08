
'use server';

import { db } from '@/lib/db';
import { contactOrganizations, contacts, contactEmails, contactPhones, contactUrls, contactAssociatedNames, contactSocialLinks } from '@/lib/db/schema';
import { sql, inArray, and, eq, or } from 'drizzle-orm';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export async function getExportData() {
    const orgData = await db.query.contactOrganizations.findMany({
        columns: {
            organization: true,
            team: true,
        },
        where: (org, { isNotNull, ne }) => and(isNotNull(org.organization), ne(org.organization, '')),
    });

    const orgMap = new Map<string, Set<string>>();
    orgData.forEach(item => {
        if (!orgMap.has(item.organization)) {
            orgMap.set(item.organization, new Set());
        }
        if (item.team) {
            orgMap.get(item.organization)!.add(item.team);
        }
    });

    const organizations = Array.from(orgMap.entries()).map(([name, teams]) => ({
        name,
        teams: Array.from(teams),
    })).sort((a, b) => a.name.localeCompare(b.name));

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
            organization: contactOrganizations.organization,
            designation: contactOrganizations.designation,
            team: contactOrganizations.team,
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
        .leftJoin(contactEmails, eq(contacts.id, contactEmails.contactId))
        .leftJoin(contactPhones, eq(contacts.id, contactPhones.contactId))
        .leftJoin(contactUrls, eq(contacts.id, contactUrls.contactId))
        .leftJoin(contactSocialLinks, eq(contacts.id, contactSocialLinks.contactId))
        .leftJoin(contactAssociatedNames, eq(contacts.id, contactAssociatedNames.contactId))
        

     const conditions = [];
     if (!organizations.includes('all') && organizations.length > 0) {
        conditions.push(inArray(contactOrganizations.organization, organizations));
     }
     if (!teams.includes('all') && teams.length > 0) {
        conditions.push(inArray(contactOrganizations.team, teams));
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
