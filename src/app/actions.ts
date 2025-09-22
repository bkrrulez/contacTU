
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

  // Special check for the admin user defined in environment variables
  if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        return { success: 'Login successful!' };
    } else {
        return { error: 'Invalid email or password.' };
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser || !existingUser.password) {
    return { error: 'Invalid email or password.' };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: 'Invalid email or password.' };
  }

  return { success: 'Login successful!' };
}
