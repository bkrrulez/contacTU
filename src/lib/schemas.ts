
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
    team: z.string().optional(),
    department: z.string().optional(),
  })).min(1, 'At least one organization is required'),

  address: z.string().optional(),
  notes: z.string().optional(),
  website: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
        if (!val) return val;
        if (!val.startsWith('http://') && !val.startsWith('https://')) {
            return `https://${val}`;
        }
        return val;
    })
    .pipe(z.string().url({ message: 'Invalid URL' }).optional().or(z.literal(''))),
  birthday: z.date().optional(),
  subordinateName: z.string().optional(),
  socialMedia: z.string()
    .optional()
    .or(z.literal(''))
    .transform((val) => {
        if (!val) return val;
        if (!val.startsWith('http://') && !val.startsWith('https://')) {
            return `https://${val}`;
        }
        return val;
    })
    .pipe(z.string().url({ message: 'Invalid URL' }).optional().or(z.literal(''))),
});

export const userFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    role: z.enum(['Admin', 'Power User', 'Standard User', 'Read-Only']),
    organizations: z.array(z.string()).min(1, 'At least one organization must be selected'),
    avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const organizationFormSchema = z.object({
    name: z.string().min(1, 'Organization name is required'),
    address: z.string().optional(),
});

export const teamFormSchema = z.object({
    teamName: z.string().min(1, 'Team name is required'),
    organizations: z.array(z.string()).min(1, 'At least one organization must be selected'),
});


export const ExtractedContactSchema = z.object({
    firstName: z.string().optional().describe('The first name of the contact.'),
    lastName: z.string().optional().describe('The last name of the contact.'),
    emails: z.array(z.object({ email: z.string().email() })).optional().describe('Email addresses of the contact.'),
    phones: z.array(z.object({ phone: z.string(), type: z.enum(['Telephone', 'Mobile']) })).optional().describe('Phone numbers of the contact. Infer the type (Mobile or Telephone) based on context.'),
    organizations: z.array(z.object({ 
        organization: z.string(), 
        designation: z.string().optional(),
        team: z.string().optional(),
        department: z.string().optional(),
    })).optional().describe("The contact's organization, including their title/designation, team, and department if available."),
    address: z.string().optional().describe('The full mailing address of the contact or their organization.'),
    website: z.string().optional().describe("The contact's personal or company website URL."),
});
