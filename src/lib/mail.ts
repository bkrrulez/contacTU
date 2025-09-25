
'use server';

import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';

const smtpHost = process.env.SMTP_HOST!;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

// Base transport options
const transportOptions: TransportOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // Use true for 465, false for other ports
};

// Conditionally add auth object only if user and pass are provided
if (smtpUser && smtpPassword) {
    transportOptions.auth = {
        user: smtpUser,
        pass: smtpPassword,
    };
} else {
    // For servers that don't require auth but might enforce TLS on port 587
    if (smtpPort === 587) {
        transportOptions.tls = {
            rejectUnauthorized: false // Use with caution, allows self-signed certs
        };
    }
}


const transport = nodemailer.createTransport(transportOptions as any);


interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    };

    try {
        await transport.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email.');
    }
}
