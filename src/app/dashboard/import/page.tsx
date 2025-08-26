
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImportForm } from '@/components/dashboard/import-form';


export default function ImportPage() {
  return (
    <div className="space-y-4">
       <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Import Contacts</h1>
          <p className="text-muted-foreground">Add contacts to your database from external files.</p>
        </div>
      <Tabs defaultValue="csv">
        <TabsList>
          <TabsTrigger value="csv">CSV / Excel</TabsTrigger>
          <TabsTrigger value="vcard">vCard</TabsTrigger>
        </TabsList>
        <TabsContent value="csv">
          <ImportForm type="CSV / Excel" />
        </TabsContent>
        <TabsContent value="vcard">
          <ImportForm type="vCard" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
