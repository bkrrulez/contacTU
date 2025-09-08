
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
import { createTeam, getOrganizations } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { teamFormSchema } from '@/lib/schemas';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function NewTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<{name: string}[]>([]);

  useEffect(() => {
      getOrganizations().then(setOrganizations);
  }, []);
  
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: '',
      organizations: [],
    },
  });

  const onSubmit = async (data: TeamFormValues) => {
    try {
      await createTeam(data);
      toast({
        title: 'Team Created',
        description: `The team "${data.teamName}" has been created.`,
      });
      router.push('/dashboard/settings/team');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while creating the team.',
      });
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/settings/team">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Teams</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Add New Team</h1>
            <p className="text-muted-foreground">Fill out the form to add a new team.</p>
          </div>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Team Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="teamName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Team Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Platform Engineering" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organizations"
                            render={() => (
                                <FormItem>
                                <div className="mb-4">
                                    <FormLabel>Organizations <span className="text-destructive">*</span></FormLabel>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {organizations.map((org) => (
                                    <FormField
                                    key={org.name}
                                    control={form.control}
                                    name="organizations"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={org.name}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(org.name)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), org.name])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== org.name
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {org.name}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/settings/team')}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Team'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
