
'use server';
/**
 * @fileOverview An AI flow for extracting contact information from business card images.
 *
 * - extractContactFromImage - A function that handles the contact extraction process.
 * - ContactExtractionInput - The input type for the extractContactFromImage function.
 * - ContactExtractionOutput - The return type for the extractContactFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { contactFormSchema } from '@/lib/schemas';


export const ExtractedContactSchema = contactFormSchema.pick({
    firstName: true,
    lastName: true,
    emails: true,
    phones: true,
    organizations: true,
    address: true,
    website: true,
}).partial().extend({
    // All fields from pick are optional due to .partial()
    // We can add descriptions here for the AI model
    firstName: z.string().optional().describe('The first name of the contact.'),
    lastName: z.string().optional().describe('The last name of the contact.'),
    emails: z.array(z.object({ email: z.string().email() })).optional().describe('Email addresses of the contact.'),
    phones: z.array(z.object({ phone: z.string(), type: z.enum(['Telephone', 'Mobile']) })).optional().describe('Phone numbers of the contact. Infer the type (Mobile or Telephone) based on context.'),
    organizations: z.array(z.object({ 
        organization: z.string(), 
        designation: z.string().optional(),
        team: z.string().optional(),
        department: z.string().optional() 
    })).optional().describe("The contact's organization, including their title/designation, team, and department if available."),
    address: z.string().optional().describe('The full mailing address of the contact or their organization.'),
    website: z.string().url().optional().describe("The contact's personal or company website URL."),
});


const ContactExtractionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image of one or more business cards, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ContactExtractionInput = z.infer<typeof ContactExtractionInputSchema>;

const ContactExtractionOutputSchema = z.object({
  contacts: z.array(ExtractedContactSchema).describe('An array of contacts extracted from the image.'),
});
export type ContactExtractionOutput = z.infer<typeof ContactExtractionOutputSchema>;

export async function extractContactFromImage(input: ContactExtractionInput): Promise<ContactExtractionOutput> {
  return extractContactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractContactPrompt',
  input: {schema: ContactExtractionInputSchema},
  output: {schema: ContactExtractionOutputSchema},
  model: 'openrouter/gpt-4o',
  prompt: `You are an expert at accurately reading business cards and extracting contact information.
  
Given the image, identify all the business cards present. For each business card, extract all possible contact details.
If there are multiple business cards in the image, return an entry for each one in the 'contacts' array.

Pay close attention to details:
- Correctly separate first and last names.
- Identify all email addresses and phone numbers. For phones, classify them as 'Mobile' or 'Telephone' if possible.
- Capture the full organization name, the person's title/designation, and their department or team if mentioned.
- Extract the full address and any website URLs.
- Do not invent information. If a field is not present on the card, omit it.

Image to process: {{media url=photoDataUri}}`,
});

const extractContactFlow = ai.defineFlow(
  {
    name: 'extractContactFlow',
    inputSchema: ContactExtractionInputSchema,
    outputSchema: ContactExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
