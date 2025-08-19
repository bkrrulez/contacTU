import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

function ImportTabContent({ type }: { type: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import {type} File</CardTitle>
        <CardDescription>Upload a {type} file to import your contacts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Drag and drop your file here, or click to browse.</p>
            <Button variant="outline" className="mt-4">
                Select File
            </Button>
        </div>
        <div className="flex justify-end">
            <Button>Import Contacts</Button>
        </div>
      </CardContent>
    </Card>
  )
}

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
          <ImportTabContent type="CSV" />
        </TabsContent>
        <TabsContent value="vcard">
          <ImportTabContent type="vCard" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
