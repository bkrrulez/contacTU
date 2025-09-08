
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getOrganizations, getTeamByName, updateTeam } from '../../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { teamFormSchema } from '@/lib/schemas';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function EditTeamPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const teamName = decodeURIComponent(params.name as string);
  const [organizations, setOrganizations] = useState<{name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (teamName) {
      getTeamByName(teamName).then(data => {
        if (data) {
          form.reset({
            teamName: data.team,
            organizations: data.organizations,
          });
        }
        setIsLoading(false);
      });
    }
  }, [teamName, form]);

  const onSubmit = async (data: TeamFormValues) => {
    try {
      await updateTeam(teamName, data);
      toast({
        title: 'Team Updated',
        description: `The team "${data.teamName}" has been updated.`,
      });
      router.push('/dashboard/settings/team');
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while updating the team.',
      });
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <h1 className="text-2xl font-bold tracking-tight font-headline">Edit Team</h1>
            <p className="text-muted-foreground">Modify the details for team "{teamName}".</p>
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
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
