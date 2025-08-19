import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditLogsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Audit Logs</h1>
        <p className="text-muted-foreground">Review system and user activity.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>This feature is under construction. Check back later!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Audit logs will provide a detailed record of all actions taken within your contacTU account, helping you maintain security and compliance.</p>
        </CardContent>
      </Card>
    </div>
  );
}
