
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { contactOrganizations, contacts } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, sql, and, or, inArray, isNull, ne } from 'drizzle-orm';
import { teamFormSchema } from '@/lib/schemas';

export async function getOrganizations() {
    const result = await db.selectDistinct({ name: contactOrganizations.organization })
        .from(contactOrganizations)
        .where(ne(contactOrganizations.organization, ''))
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
                // This is a crude way to link a team to an organization
                // by finding all contacts in that organization and updating their team.
                // A proper implementation would have a separate teams table.
                await db.update(contactOrganizations).set({ team: teamName })
                    .where(eq(contactOrganizations.organization, orgName));
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


export async function getTeamByName(teamName: string) {
    if (!teamName) return null;
    
    const result: { team: string, organizations: string[] }[] = await db.execute(sql`
        SELECT 
            team, 
            array_agg(DISTINCT organization) as organizations
        FROM 
            contact_organizations
        WHERE
            team = ${teamName}
        GROUP BY 
            team
    `);
    
    return result[0] || null;
}

export async function updateTeam(teamName: string, values: z.infer<typeof teamFormSchema>) {
    const validatedFields = teamFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { teamName: newTeamName, organizations: newOrgs } = validatedFields.data;

    // In our current schema, teams are just strings in the contact_organizations table.
    // This logic is complex because of that. A separate `teams` table would be much better.

    // 1. Get all current organizations for this team
    const currentOrgsResult = await db.selectDistinct({ org: contactOrganizations.organization })
        .from(contactOrganizations)
        .where(eq(contactOrganizations.team, teamName));
    const currentOrgs = currentOrgsResult.map(r => r.org);

    // 2. Determine which orgs to add the team to and which to remove from.
    const orgsToAdd = newOrgs.filter(org => !currentOrgs.includes(org));
    const orgsToRemove = currentOrgs.filter(org => !newOrgs.includes(org));

    // 3. Add team to new organizations
    if (orgsToAdd.length > 0) {
        await db.update(contactOrganizations)
            .set({ team: newTeamName })
            .where(inArray(contactOrganizations.organization, orgsToAdd));
    }
    
    // 4. Remove team from organizations
    if (orgsToRemove.length > 0) {
        await db.update(contactOrganizations)
            .set({ team: '' }) // Set team to empty string to "remove" it
            .where(and(
                eq(contactOrganizations.team, teamName),
                inArray(contactOrganizations.organization, orgsToRemove)
            ));
    }

    // 5. Handle team rename
    if (teamName !== newTeamName) {
        // Update all remaining associations to the new team name
         await db.update(contactOrganizations)
            .set({ team: newTeamName })
            .where(and(
                eq(contactOrganizations.team, teamName),
                inArray(contactOrganizations.organization, newOrgs)
            ));
    }
    
    revalidatePath('/dashboard/settings/team');

    return { success: true };
}
