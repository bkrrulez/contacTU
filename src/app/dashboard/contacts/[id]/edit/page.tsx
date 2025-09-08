
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateContact, getContact } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { Contact } from '@/lib/types';
import { contactFormSchema } from '@/lib/schemas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type ContactFormValues = z.infer<typeof contactFormSchema>;


export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const contactId = parseInt(params.id as string, 10);
  const [contact, setContact] = useState<Contact | null>(null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        firstName: '',
        lastName: '',
        emails: [],
        phones: [],
        organizations: [],
        address: '',
        notes: '',
        website: '',
        subordinateName: '',
        socialMedia: '',
      },
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control: form.control, name: "emails",
  });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control: form.control, name: "phones",
  });
  const { fields: orgFields, append: appendOrg, remove: removeOrg } = useFieldArray({
    control: form.control, name: "organizations",
  });


  useEffect(() => {
    if (contactId) {
      getContact(contactId).then(data => {
        if (data) {
          setContact(data);
          form.reset({
            firstName: data.firstName,
            lastName: data.lastName,
            emails: data.emails?.length ? data.emails.map(e => ({ email: e.email })) : [{email: ''}],
            phones: data.phones?.length ? data.phones.map(p => ({ phone: p.phone, type: p.type as 'Mobile' | 'Telephone' })) : [{phone: '', type: 'Mobile'}],
            organizations: data.organizations?.length ? data.organizations.map(o => ({ organization: o.organization, designation: o.designation || '', team: o.team, department: o.department || '', address: o.address || '' })) : [{organization: '', designation: '', team: '', department: '', address: ''}],
            address: data.address ?? '',
            notes: data.notes ?? '',
            website: data.urls?.[0]?.url ?? '',
            birthday: data.birthday ? new Date(data.birthday) : undefined,
            subordinateName: data.associatedNames?.[0]?.name ?? '',
            socialMedia: data.socialLinks?.[0]?.link ?? '',
          });
        }
      });
    }
  }, [contactId, form]);


  const onSubmit = async (data: ContactFormValues) => {
    try {
      await updateContact(contactId, data);
      toast({
        title: 'Contact Updated',
        description: `${data.firstName} ${data.lastName} has been updated.`,
      });
      router.push('/dashboard/contacts');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while updating the contact.',
      });
    }
  };

  if (!contact) {
      return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/contacts">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Contacts</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Edit Contact</h1>
            <p className="text-muted-foreground">Modify the details for {contact.firstName} {contact.lastName}.</p>
          </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardContent className="pt-6 grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                   
                    {/* Emails */}
                    <div className="space-y-2">
                        <FormLabel>Emails <span className="text-destructive">*</span></FormLabel>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {emailFields.map((field, index) => (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`emails.${index}.email`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  {emailFields.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <Button type="button" variant="outline" size="sm" onClick={() => appendEmail({ email: '' })}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Email
                        </Button>
                    </div>

                    {/* Phones */}
                    <div className="space-y-2">
                        <FormLabel>Phone Numbers <span className="text-destructive">*</span></FormLabel>
                        <Table>
                          <TableHeader>
                              <TableRow>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                          </TableHeader>
                           <TableBody>
                            {phoneFields.map((field, index) => (
                              <TableRow key={field.id}>
                                <TableCell>
                                  <FormField
                                    control={form.control}
                                    name={`phones.${index}.phone`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input placeholder="123-456-7890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                   <FormField
                                      control={form.control}
                                      name={`phones.${index}.type`}
                                      render={({ field }) => (
                                          <FormItem>
                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                  <SelectTrigger>
                                                  <SelectValue placeholder="Select type" />
                                                  </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                  <SelectItem value="Mobile">Mobile</SelectItem>
                                                  <SelectItem value="Telephone">Telephone</SelectItem>
                                              </SelectContent>
                                              </Select>
                                              <FormMessage />
                                          </FormItem>
                                      )}
                                  />
                                </TableCell>
                                <TableCell>
                                  {phoneFields.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removePhone(index)}>
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                         <Button type="button" variant="outline" size="sm" onClick={() => appendPhone({ phone: '', type: 'Mobile' })}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Phone
                        </Button>
                    </div>

                    {/* Organizations */}
                     <div className="space-y-2">
                        <FormLabel>Organizations <span className="text-destructive">*</span></FormLabel>
                         <Table>
                           <TableHeader>
                               <TableRow>
                                 <TableHead>Organization</TableHead>
                                 <TableHead>Designation</TableHead>
                                 <TableHead>Team</TableHead>
                                 <TableHead>Department</TableHead>
                                 <TableHead>Address</TableHead>
                                 <TableHead className="w-[50px]"></TableHead>
                               </TableRow>
                           </TableHeader>
                            <TableBody>
                              {orgFields.map((field, index) => (
                                <TableRow key={field.id}>
                                  <TableCell>
                                     <FormField
                                        control={form.control}
                                        name={`organizations.${index}.organization`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Acme Inc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                  </TableCell>
                                  <TableCell>
                                       <FormField
                                        control={form.control}
                                        name={`organizations.${index}.designation`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Engineer" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                  </TableCell>
                                   <TableCell>
                                       <FormField
                                        control={form.control}
                                        name={`organizations.${index}.team`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Product" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                  </TableCell>
                                   <TableCell>
                                       <FormField
                                        control={form.control}
                                        name={`organizations.${index}.department`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Engineering" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                  </TableCell>
                                   <TableCell>
                                       <FormField
                                        control={form.control}
                                        name={`organizations.${index}.address`}
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormControl>
                                                <Input placeholder="Org Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                  </TableCell>
                                  <TableCell>
                                    {orgFields.length > 1 && (
                                      <Button variant="ghost" size="icon" onClick={() => removeOrg(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                        </Table>
                         <Button type="button" variant="outline" size="sm" onClick={() => appendOrg({ organization: '', designation: '', team: '', department: '', address: '' })}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Organization
                        </Button>
                    </div>

                     <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea placeholder="123 Main St, Anytown USA" className="min-h-[60px]" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="socialMedia"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Social Media</FormLabel>
                            <FormControl>
                                <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <div className="grid md:grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Birthday</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        <FormField
                            control={form.control}
                            name="subordinateName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subordinate Names</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Assistant's Name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                     </div>
                     <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Additional notes about the contact." className="min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/contacts')}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
