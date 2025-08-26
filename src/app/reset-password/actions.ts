
'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function resetPassword(token: string, newPassword: string) {
    if (!token) {
        return { error: 'Reset token is missing.' };
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const existingUser = await db.query.users.findFirst({
        where: eq(users.resetToken, hashedToken),
    });

    if (!existingUser) {
        return { error: 'Invalid token.' };
    }

    if (!existingUser.resetTokenExpiry || existingUser.resetTokenExpiry < new Date()) {
        return { error: 'Token has expired.' };
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users).set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
    }).where(eq(users.id, existingUser.id));

    return { success: 'Password has been reset successfully.' };
}
