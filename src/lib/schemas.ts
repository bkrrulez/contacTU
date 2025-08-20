
import { z } from 'zod';

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Please add email to save the contact').email('Invalid email address'),
  phone: z.string().min(1, 'Please add mobile to save the contact'),
  phoneType: z.enum(['Telephone', 'Mobile']).default('Mobile'),
  organization: z.string().min(1, 'Organization is required'),
  designation: z.string().optional(),
  team: z.string().min(1, 'Team is required'),
  department: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  birthday: z.date().optional(),
  associatedName: z.string().optional(),
  socialMedia: z.string().url('Invalid URL').optional().or(z.literal('')),
});
