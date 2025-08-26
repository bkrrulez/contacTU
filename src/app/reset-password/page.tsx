
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { resetPassword } from './actions';

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
        setError("Invalid or missing reset token.");
        return;
    }
    const result = await resetPassword(token, data.password);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };
  
  if (!token) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md mx-auto text-center">
                 <CardHeader>
                    <CardTitle>Invalid Token</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-destructive">The password reset token is missing or invalid.</p>
                     <Button asChild className="mt-6 w-full">
                        <Link href="/forgot-password">Request a new link</Link>
                    </Button>
                 </CardContent>
            </Card>
        </div>
     )
  }

  if(isSuccess) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md mx-auto text-center">
                 <CardHeader>
                    <CardTitle>Password Reset Successful</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p>Your password has been successfully updated.</p>
                     <Button asChild className="mt-6 w-full">
                        <Link href="/">Sign In</Link>
                    </Button>
                 </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center pt-8 flex items-center justify-center">
          <Logo />
        </CardHeader>
        <CardContent>
            <CardTitle className="text-center text-2xl font-semibold tracking-tight">Reset Your Password</CardTitle>
            <CardDescription className="text-center text-sm text-muted-foreground mt-2">
                Enter a new password for your account.
            </CardDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
