
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/db';
import { contactOrganizations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getTeams() {
    const teams = await db.selectDistinct({ name: contactOrganizations.team })
        .from(contactOrganizations)
        .orderBy(desc(contactOrganizations.team));
    return teams;
}

export default async function TeamSettingsPage() {
    const teams = await getTeams();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Teams</h1>
                    <p className="text-muted-foreground">Manage all teams in the system.</p>
                </div>
                <Button asChild>
                    <Link href="#">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Team
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Team List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team, index) => (
                                <TableRow key={index}>
                                    <TableCell>{team.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
