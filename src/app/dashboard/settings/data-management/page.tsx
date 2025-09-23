
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export default function DataManagementPage() {
  return (
    <div className="space-y-4">
       <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">Data Management</h1>
          <p className="text-muted-foreground">Manage your contact data, including deduplication and privacy settings.</p>
        </div>
      <Tabs defaultValue="deduplication">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deduplication">Deduplication</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="deduplication">
          <Card>
            <CardHeader>
              <CardTitle>Contact Deduplication</CardTitle>
              <CardDescription>Use our AI-powered tool to find and merge duplicate contacts, keeping your database clean and accurate.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The scan will run in the background and notify you when it's complete. You'll be able to review and approve all merges.</p>
            </CardContent>
            <CardFooter>
              <Button>
                <Bot className="mr-2 h-4 w-4" /> Start Scan for Duplicates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Data Privacy & Security</CardTitle>
              <CardDescription>Manage your data in compliance with GDPR and other privacy regulations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Data Export</h3>
                <p className="text-sm text-muted-foreground">Request a full export of your personal data stored in contacTU.</p>
                <Button variant="secondary" className="mt-2">Request Data Export</Button>
              </div>
              <div>
                <h3 className="font-semibold">Account Deletion</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                 <Button variant="destructive" className="mt-2">Request Account Deletion</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
