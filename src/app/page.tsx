
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { signIn } from './actions';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
      password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
        const result = await signIn(data);

        if (result.success && result.user) {
          // Store user data and timestamp in localStorage for persistence.
          const sessionData = {
            user: result.user,
            timestamp: new Date().getTime(), // Get current time in milliseconds
          };
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          router.push('/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: result.error,
          });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "An unexpected error occurred.",
        });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex-grow flex items-center justify-center w-full">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center pt-8 flex items-center justify-center">
              <Logo />
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                      <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link href="/forgot-password" prefetch={false} className="ml-auto inline-block text-sm underline">
                            Forgot your password?
                          </Link>
                        </div>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <footer className="py-4 text-center text-xs" style={{ color: 'darkblue', fontSize: '0.67rem' }}>
        Created by Bikramjit Chowdhury
      </footer>
    </div>
  );
}
