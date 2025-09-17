
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createUser, getOrganizationsForUserForm } from '../actions';
import Link from 'next/link';
import { ArrowLeft, User as UserIcon, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userFormSchema } from '@/lib/schemas';
import { userRoleEnum } from '@/lib/db/schema';
import { useEffect, useState, useRef } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageCropDialog } from '@/components/dashboard/image-crop-dialog';

type UserFormValues = z.infer<typeof userFormSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [organizationOptions, setOrganizationOptions] = useState<{ value: string, label: string }[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getOrganizationsForUserForm().then(orgNames => {
      const options = [{ value: 'All Organizations', label: 'All Organizations' }, ...orgNames.map(org => ({ value: org, label: org }))];
      setOrganizationOptions(options);
    });
  }, []);
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Standard User',
      organizations: [],
      profilePicture: '',
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCroppedImage = (croppedImage: string | null) => {
    if (croppedImage) {
      form.setValue('profilePicture', croppedImage);
      setAvatarPreview(croppedImage);
    }
    setIsCropDialogOpen(false);
    setImageToCrop(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  const watchRole = form.watch('role');

  useEffect(() => {
    if (watchRole === 'Admin') {
      form.setValue('organizations', ['All Organizations']);
    } else {
      if (form.getValues('organizations').includes('All Organizations')) {
        form.setValue('organizations', []);
      }
    }
  }, [watchRole, form]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (!data.password) {
          form.setError('password', { type: 'manual', message: 'Password is required for new users' });
          return;
      }
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


  return (
    <>
      <ImageCropDialog
        isOpen={isCropDialogOpen}
        onClose={() => handleCroppedImage(null)}
        imageSrc={imageToCrop}
        onSave={handleCroppedImage}
      />
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
                                      />
                                      <FormMessage />
                                      </FormItem>
                                  )}
                                  />
                          </div>
                          <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <div className="flex items-center gap-4">
                              <Avatar className="h-20 w-20">
                                  <AvatarImage src={avatarPreview ?? undefined} />
                                  <AvatarFallback className="text-2xl">
                                      <UserIcon className="h-8 w-8" />
                                  </AvatarFallback>
                              </Avatar>
                              <FormControl>
                                  <>
                                      <input 
                                          type="file" 
                                          accept="image/*" 
                                          ref={fileInputRef} 
                                          onChange={handleAvatarChange}
                                          className="hidden" 
                                      />
                                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                          <Upload className="mr-2 h-4 w-4" />
                                          Upload Picture
                                      </Button>
                                  </>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
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
    </>
  );
}
