
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { plugin as openrouter} from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    openrouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: 'https://openrouter.ai/api/v1',
    }),
    googleAI(), // You can keep other plugins if needed
  ],
});
