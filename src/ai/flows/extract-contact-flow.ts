
'use server';
/**
 * @fileOverview An AI flow for extracting contact information from business card images.
 *
 * - extractContactFromImage - A function that handles the contact extraction process.
 * - ContactExtractionInput - The input type for the extractContactFromImage function.
 * - ContactExtractionOutput - The return type for the extractContactFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { ExtractedContactSchema } from '@/lib/schemas';


const ContactExtractionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "An image of one or more business cards, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
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

const extractContactPrompt = ai.definePrompt({
  name: 'extractContactPrompt',
  input: {schema: ContactExtractionInputSchema},
  output: {schema: ContactExtractionOutputSchema},
  prompt: `You are an expert data extraction tool. Your task is to analyze the provided image of a business card and extract all contact information into a structured JSON format.

Pay extremely close attention to every detail on the card. You must capture all available information for each of the following fields:

- \`firstName\`: The person's first name.
- \`lastName\`: The person's last name.
- \`emails\`: Extract ALL email addresses found on the card.
- \`phones\`: Extract ALL phone numbers. Classify their \`type\` as "Mobile" or "Telephone" based on any visual cues or labels.
- \`organizations\`: Extract the company name, the person's job title/designation, team, and department.
- \`address\`: Extract the FULL and complete mailing address.
- \`website\`: Extract any website URLs.

Do not invent or assume information. If a field is not present on the card, omit it from the output. If there are multiple business cards, create a separate contact object for each one in the 'contacts' array.

Image to process: {{media url=photoDataUri}}`,
});

const extractContactFlow = ai.defineFlow(
  {
    name: 'extractContactFlow',
    inputSchema: ContactExtractionInputSchema,
    outputSchema: ContactExtractionOutputSchema,
  },
  async (input) => {
      const {output} = await extractContactPrompt(input, {
        model: 'googleai/gemini-1.5-flash-latest',
        temperature: 0.1,
      });
      return output!;
  }
);
