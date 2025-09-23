
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
        // Fetch the full admin user object from DB to include profile pic
        const adminUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (adminUser) {
            const { password: _, ...userWithoutPassword } = adminUser;
            return { success: 'Login successful!', user: userWithoutPassword };
        }
        // Fallback if admin is not in DB for some reason
        return { success: 'Login successful!', user: { name: 'Admin User', role: 'Admin', email: email } };
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

  // Omit password from the returned user object
  const { password: _, ...userWithoutPassword } = existingUser;

  return { success: 'Login successful!', user: userWithoutPassword };
}
