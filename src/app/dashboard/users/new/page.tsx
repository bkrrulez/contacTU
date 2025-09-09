
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createUser, getOrganizationsForUserForm } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userFormSchema } from '@/lib/schemas';
import { userRoleEnum } from '@/lib/db/schema';
import { useEffect, useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';

type UserFormValues = z.infer<typeof userFormSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<string[]>([]);

  useEffect(() => {
    getOrganizationsForUserForm().then(setOrganizations);
  }, []);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Standard User',
      organizations: [],
      avatar: '',
    },
  });

  const watchRole = form.watch('role');

  useEffect(() => {
      if(watchRole === 'Admin') {
          form.setValue('organizations', ['All Organizations']);
      }
  }, [watchRole, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data);
      toast({
        title: 'User Created',
        description: `${data.name} has been added.`,
      });
      router.push('/dashboard/users');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while creating the user.',
      });
    }
  };

  const organizationOptions = [{ value: 'All Organizations', label: 'All Organizations' }, ...organizations.map(org => ({ value: org, label: org }))];

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/users">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Users</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Add New User</h1>
            <p className="text-muted-foreground">Fill out the form to add a new user.</p>
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
                                <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Role <span className="text-destructive">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {userRoleEnum.enumValues.map((role) => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="organizations"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Organizations</FormLabel>
                                    <MultiSelect
                                        options={organizationOptions}
                                        selected={field.value}
                                        onChange={field.onChange}
                                        className="w-full"
                                        placeholder="Select organizations..."
                                        disabled={watchRole === 'Admin'}
                                    />
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Avatar URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/avatar.png" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/users')}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
