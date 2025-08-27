
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
  prompt: `You are an expert data extraction tool. Extract contact information from the business card image into the specified JSON format.

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
