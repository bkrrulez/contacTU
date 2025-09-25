
import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';

const smtpHost = process.env.SMTP_HOST!;
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';

const isSecure = smtpPort === 465;

const transportOptions: TransportOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: isSecure,
    ...(isSecure ? {} : { requireTLS: true }), // Only force TLS on non-secure ports
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    },
};

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
