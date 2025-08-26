
import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  
  emails: z.array(z.object({
    email: z.string().email('Invalid email address'),
  })).min(1, 'At least one email is required'),

  phones: z.array(z.object({
    phone: z.string().min(1, 'Phone number is required'),
    type: z.enum(['Telephone', 'Mobile']).default('Mobile'),
  })).min(1, 'At least one phone number is required'),

  organizations: z.array(z.object({
    organization: z.string().min(1, 'Organization is required'),
    designation: z.string().optional(),
    team: z.string().min(1, 'Team is required'),
    department: z.string().optional(),
  })).min(1, 'At least one organization is required'),

  address: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  birthday: z.date().optional(),
  subordinateName: z.string().optional(),
  socialMedia: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const userFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['Admin', 'Power User', 'Standard User', 'Read-Only']),
    avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
});
