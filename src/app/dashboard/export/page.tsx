
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExportForm } from '@/components/dashboard/export-form';


export default function ExportPage() {
  return (
    <div className="space-y-4">
       <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Export Contacts</h1>
          <p className="text-muted-foreground">Export contacts from your database to an external file.</p>
        </div>
      <Tabs defaultValue="csv_excel">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="csv_excel">Export CSV/Excel</TabsTrigger>
          <TabsTrigger value="vcf">Export VCF</TabsTrigger>
        </TabsList>
        <TabsContent value="csv_excel">
          <ExportForm />
        </TabsContent>
        <TabsContent value="vcf">
            <Card>
                <CardHeader>
                    <CardTitle>Export VCF</CardTitle>
                    <CardDescription>This feature is coming soon.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>The ability to export contacts in the vCard (.vcf) format will be available in a future update.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
