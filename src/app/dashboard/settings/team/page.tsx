
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/db';
import { contactOrganizations } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

async function getTeams() {
    const result: { team: string, organizations: string[] }[] = await db.execute(sql`
        SELECT 
            team, 
            array_agg(DISTINCT organization) as organizations
        FROM 
            contact_organizations
        WHERE
            team IS NOT NULL AND team != ''
        GROUP BY 
            team
        ORDER BY 
            team
    `);
    return result;
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
                    <Link href="/dashboard/settings/team/new">
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
                                <TableHead>Organizations</TableHead>
                                <TableHead className="w-[80px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team, index) => (
                                <TableRow key={index}>
                                    <TableCell>{team.team}</TableCell>
                                    <TableCell className="flex flex-wrap gap-1">
                                        {team.organizations.map(org => (
                                            <Badge key={org} variant="secondary">{org}</Badge>
                                        ))}
                                    </TableCell>
                                     <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
