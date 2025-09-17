

'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { organizations, teams, teams_to_organizations } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, and, inArray } from 'drizzle-orm';
import { teamFormSchema } from '@/lib/schemas';

export async function getOrganizations() {
    const result = await db.query.organizations.findMany({
        orderBy: (orgs, { asc }) => asc(orgs.name)
    });
    return result.map(o => ({name: o.name}));
}

export async function createTeam(values: z.infer<typeof teamFormSchema>) {
    const validatedFields = teamFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { teamName, organizations: selectedOrgs } = validatedFields.data;

    const [newTeam] = await db.insert(teams).values({ name: teamName }).returning();

    const orgs = await db.query.organizations.findMany({
        where: inArray(organizations.name, selectedOrgs)
    });

    if (orgs.length > 0) {
        await db.insert(teams_to_organizations).values(
            orgs.map(org => ({
                teamId: newTeam.id,
                organizationId: org.id
            }))
        );
    }
    
    revalidatePath('/dashboard/settings/team');

    return { success: true };
}


export async function getTeamByName(teamName: string) {
    if (!teamName) return null;
    
    const team = await db.query.teams.findFirst({
        where: eq(teams.name, teamName),
        with: {
            teamsToOrganizations: {
                with: {
                    organization: {
                        columns: { name: true }
                    }
                }
            }
        }
    });

    if (!team) return null;
    
    return {
        team: team.name,
        organizations: team.teamsToOrganizations.map(tto => tto.organization.name)
    };
}

export async function updateTeam(teamName: string, values: z.infer<typeof teamFormSchema>) {
    const validatedFields = teamFormSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Invalid fields');
    }

    const { teamName: newTeamName, organizations: newOrgs } = validatedFields.data;

    const team = await db.query.teams.findFirst({
        where: eq(teams.name, teamName)
    });

    if (!team) {
        throw new Error('Team not found');
    }

    // Update team name if changed
    if (teamName !== newTeamName) {
        await db.update(teams).set({ name: newTeamName }).where(eq(teams.id, team.id));
    }

    // Get IDs of newly selected organizations
    const newOrgRecords = await db.query.organizations.findMany({
        where: inArray(organizations.name, newOrgs)
    });
    const newOrgIds = newOrgRecords.map(o => o.id);
    
    // Clear existing associations
    await db.delete(teams_to_organizations).where(eq(teams_to_organizations.teamId, team.id));

    // Insert new associations
    if (newOrgIds.length > 0) {
        await db.insert(teams_to_organizations).values(
            newOrgIds.map(orgId => ({
                teamId: team.id,
                organizationId: orgId
            }))
        );
    }
    
    revalidatePath('/dashboard/settings/team');
    revalidatePath(`/dashboard/settings/team/${encodeURIComponent(newTeamName)}/edit`);


    return { success: true };
}
