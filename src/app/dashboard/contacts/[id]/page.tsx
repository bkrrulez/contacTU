

import { getContact } from '../actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, Building, Globe, Gift, User, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ContactDetailsPage({ params }: { params: { id: string } }) {
  const contactId = parseInt(params.id, 10);
  const contact = await getContact(contactId);

  if (!contact) {
    notFound();
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="font-medium">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/contacts">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Contacts</span>
            </Link>
        </Button>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold tracking-tight font-headline">{contact.firstName} {contact.lastName}</h1>
          <p className="text-muted-foreground">{contact.organizations?.[0]?.designation} at {contact.organizations?.[0]?.organization.name}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/contacts/${contact.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Contact
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
           <Card>
             <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-3xl">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{contact.firstName} {contact.lastName}</h2>
             </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={Mail} label="Primary Email" value={contact.emails?.[0]?.email} />
                    <DetailItem icon={Phone} label="Primary Phone" value={contact.phones?.[0]?.phone} />
                    <DetailItem icon={Globe} label="Website" value={contact.urls?.[0]?.url ? <a href={contact.urls[0].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{contact.urls[0].url}</a> : null} />
                    <DetailItem icon={LinkIcon} label="Social Media" value={contact.socialLinks?.[0]?.link ? <a href={contact.socialLinks[0].link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{contact.socialLinks[0].link}</a> : null} />
                    <DetailItem icon={Gift} label="Birthday" value={contact.birthday ? format(new Date(contact.birthday), 'PPP') : null} />
                    <DetailItem icon={User} label="Subordinate Names" value={contact.associatedNames?.[0]?.name} />
                </CardContent>
           </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contact.organizations?.map(org => (
                                <TableRow key={org.id}>
                                    <TableCell>{org.organization.name}</TableCell>
                                    <TableCell>{org.designation}</TableCell>
                                    <TableCell>{org.team?.name}</TableCell>
                                    <TableCell>{org.department}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Contact Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Email Addresses</h3>
                            <Table>
                               <TableHeader>
                                   <TableRow><TableHead>Email</TableHead></TableRow>
                               </TableHeader>
                               <TableBody>
                                   {contact.emails?.map(e => <TableRow key={e.id}><TableCell>{e.email}</TableCell></TableRow>)}
                               </TableBody>
                            </Table>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Phone Numbers</h3>
                             <Table>
                               <TableHeader>
                                   <TableRow><TableHead>Number</TableHead><TableHead>Type</TableHead></TableRow>
                               </TableHeader>
                               <TableBody>
                                   {contact.phones?.map(p => <TableRow key={p.id}><TableCell>{p.phone}</TableCell><TableCell>{p.type}</TableCell></TableRow>)}
                               </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Address & Notes</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem icon={Building} label="Address" value={contact.address} />
                    <DetailItem icon={FileText} label="Notes" value={<div className="whitespace-pre-wrap">{contact.notes}</div>} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
