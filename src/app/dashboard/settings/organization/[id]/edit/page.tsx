

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { organizationFormSchema } from '@/lib/schemas';
import type { OrganizationSchema } from '@/lib/db/schema';
import { getOrganization, updateOrganization } from '../../actions';

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;


export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const organizationId = parseInt(params.id as string, 10);
  const [organization, setOrganization] = useState<OrganizationSchema | null>(null);
  
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
        name: '',
        address: '',
      },
  });

  useEffect(() => {
    if (organizationId) {
      getOrganization(organizationId).then(data => {
        if (data) {
          setOrganization(data);
          form.reset({
            name: data.name,
            address: data.address ?? '',
          });
        }
      });
    }
  }, [organizationId, form]);


  const onSubmit = async (data: OrganizationFormValues) => {
    try {
      await updateOrganization(organizationId, data);
      toast({
        title: 'Organization Updated',
        description: `The organization has been updated.`,
      });
      router.push('/dashboard/settings/organization');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while updating the organization.',
      });
    }
  };

  if (!organization) {
      return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/settings/organization">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Organizations</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Edit Organization</h1>
            <p className="text-muted-foreground">Modify the details for {organization.name}.</p>
          </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardContent className="pt-6 grid gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Organization Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Acme Inc." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/settings/organization')}>Cancel</Button>
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
