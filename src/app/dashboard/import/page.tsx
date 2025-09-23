
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportForm } from '@/components/dashboard/import-form';
import { VCardScanForm } from '@/components/dashboard/vcard-scan-form';

export const maxDuration = 60; // Set timeout to 60 seconds for AI processing

export default function ImportPage() {
  return (
    <div className="space-y-4">
       <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Import Contacts</h1>
          <p className="text-muted-foreground">Add contacts to your database from external files or by scanning.</p>
        </div>
      <Tabs defaultValue="csv">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="csv">CSV / Excel</TabsTrigger>
          <TabsTrigger value="vcard">vCard File</TabsTrigger>
          <TabsTrigger value="scan">Scan/Upload vCard</TabsTrigger>
        </TabsList>
        <TabsContent value="csv">
          <ImportForm type="CSV / Excel" />
        </TabsContent>
        <TabsContent value="vcard">
          <ImportForm type="vCard" />
        </TabsContent>
        <TabsContent value="scan">
          <VCardScanForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
