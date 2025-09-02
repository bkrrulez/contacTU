
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/db';
import { contactOrganizations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getOrganizations() {
    const organizations = await db.selectDistinct({ name: contactOrganizations.organization })
        .from(contactOrganizations)
        .orderBy(desc(contactOrganizations.organization));
    return organizations;
}

export default async function OrganizationSettingsPage() {
    const organizations = await getOrganizations();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight font-headline">Organizations</h1>
                    <p className="text-muted-foreground">Manage all organizations in the system.</p>
                </div>
                <Button asChild>
                    <Link href="#">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Organization
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Organization List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations.map((org, index) => (
                                <TableRow key={index}>
                                    <TableCell>{org.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
