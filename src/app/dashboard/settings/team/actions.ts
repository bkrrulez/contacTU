
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contactOrganizations, contacts } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql, and, or, inArray, isNull } from 'drizzle-orm';
import { teamFormSchema } from '@/lib/schemas';

export async function getOrganizations() {
    const result = await db.selectDistinct({ name: contactOrganizations.organization })
        .from(contactOrganizations)
        .orderBy(contactOrganizations.organization);
    return result;
}

export async function createTeam(values: z.infer<typeof teamFormSchema>) {
    const validatedFields = teamFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { teamName, organizations: selectedOrgs } = validatedFields.data;

    // This is a simplified logic. In a real-world scenario with a dedicated 'teams' table,
    // this would be a more direct insert/update.
    // Here, we find the first contact associated with each selected organization
    // and create a new organization entry for them with the new team name.
    // This is not ideal, but works with the current schema. A better solution
    // would be to refactor the schema to have a separate `teams` table.

    for (const orgName of selectedOrgs) {
        // Find an existing contact associated with this organization to "anchor" our new team
        const anchorContactOrg = await db.query.contactOrganizations.findFirst({
            where: eq(contactOrganizations.organization, orgName)
        });

        if (anchorContactOrg) {
             // Check if this team already exists for this org to avoid duplicates
             const teamExists = await db.query.contactOrganizations.findFirst({
                where: and(
                    eq(contactOrganizations.organization, orgName),
                    eq(contactOrganizations.team, teamName)
                )
             });

             if (!teamExists) {
                // Create a new organization entry for the anchor contact with the new team.
                // We leave other fields blank as they are not relevant in this context.
                await db.insert(contactOrganizations).values({
                    contactId: anchorContactOrg.contactId,
                    organization: orgName,
                    team: teamName,
                    designation: '', // Not relevant here
                    department: '', // Not relevant here
                });
             }
        } else {
            // If no contact is associated with this org, we can't create the team link
            // in the current schema. We could throw an error or handle it gracefully.
            console.warn(`Could not create team "${teamName}" for organization "${orgName}" as no contacts are associated with it.`);
        }
    }


    revalidatePath('/dashboard/settings/team');

    return { success: true };
}
