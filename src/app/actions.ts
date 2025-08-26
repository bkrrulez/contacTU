
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function signIn(values: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    return { error: 'Invalid email or password.' };
  }

  // Standard password check
  if (existingUser.password) {
    const passwordsMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordsMatch) {
      return { success: 'Login successful!' };
    }
  }

  // Fallback check for admin user directly against environment variable
  // This is a temporary diagnostic measure.
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return { success: 'Login successful! (Fallback)' };
  }
  
  return { error: 'Invalid email or password.' };
}
