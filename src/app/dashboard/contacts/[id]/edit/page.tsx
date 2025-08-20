
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateContact, getContact } from '../../actions';
import Link from 'next/link';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import type { Contact } from '@/lib/types';
import { contactFormSchema } from '@/lib/schemas';

type ContactFormValues = z.infer<typeof contactFormSchema>;


export default function EditContactPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const contactId = parseInt(params.id, 10);
  const [contact, setContact] = useState<Contact | null>(null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phoneType: 'Mobile',
      organization: '',
      designation: '',
      team: '',
      department: '',
      address: '',
      notes: '',
      website: '',
      associatedName: '',
      socialMedia: '',
    },
  });

  useEffect(() => {
    if (contactId) {
      getContact(contactId).then(data => {
        if (data) {
          setContact(data);
          form.reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.emails?.[0]?.email ?? '',
            phone: data.phones?.[0]?.phone ?? '',
            phoneType: data.phones?.[0]?.type as 'Mobile' | 'Telephone' ?? 'Mobile',
            organization: data.organizations?.[0]?.organization ?? '',
            designation: data.organizations?.[0]?.designation ?? '',
            team: data.organizations?.[0]?.team ?? '',
            department: data.organizations?.[0]?.department ?? '',
            address: data.address ?? '',
            notes: data.notes ?? '',
            website: data.urls?.[0]?.url ?? '',
            birthday: data.birthday ? new Date(data.birthday) : undefined,
            associatedName: data.associatedNames?.[0]?.name ?? '',
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
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid md:grid-cols-3 gap-4">
                       <div className="md:col-span-2">
                         <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="123-456-7890" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                       </div>
                        <FormField
                            control={form.control}
                            name="phoneType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select phone type" />
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
                    </div>
                     <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Organization <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input placeholder="Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="team"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Team <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Product" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                    <Input placeholder="Engineering" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            name="associatedName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Associated Name</FormLabel>
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
