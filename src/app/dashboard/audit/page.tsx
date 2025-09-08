
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { db } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { AuditLogSchema } from '@/lib/db/schema';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type AuditLogWithUser = AuditLogSchema & {
    user: {
        name: string | null;
    } | null;
};

async function getAuditLogs(): Promise<AuditLogWithUser[]> {
    const logs = await db.query.auditLogs.findMany({
        with: {
            user: {
                columns: {
                    name: true,
                },
            },
        },
        orderBy: (logs, { desc }) => [desc(logs.timestamp)],
        limit: 100, // Limit to the last 100 entries for performance
    });
    return logs;
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'create':
        return 'default';
      case 'update':
        return 'secondary';
      case 'delete':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Audit Logs</h1>
        <p className="text-muted-foreground">Review system and user activity.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Showing the last {logs.length} recorded actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user?.name ?? 'System'}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(log.action)} className="capitalize">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.entityType === 'contact' ? (
                          <>
                            Contact: <Link href={`/dashboard/contacts/${log.entityId}`} className="font-medium text-primary hover:underline">
                                {(log.details as any)?.contactName || `ID: ${log.entityId}`}
                            </Link>
                          </>
                      ) : (
                          `${log.entityType} ID: ${log.entityId}`
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(log.timestamp), "PPP p")}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
