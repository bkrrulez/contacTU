
'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendMail } from '@/lib/mail';

export async function sendPasswordResetLink(email: string) {
    if (!email) {
        return { error: 'Email is required' };
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!existingUser) {
        // Don't reveal that the user does not exist
        return { success: 'If an account with this email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    await db.update(users).set({
        resetToken: passwordResetToken,
        resetTokenExpiry: resetTokenExpiry,
    }).where(eq(users.id, existingUser.id));

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    const emailHtml = `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        await sendMail({
            to: email,
            subject: 'Your Password Reset Link',
            html: emailHtml,
        });
        return { success: 'If an account with this email exists, a reset link has been sent.' };
    } catch (error) {
        return { error: 'Failed to send reset email. Please try again later.' };
    }
}
