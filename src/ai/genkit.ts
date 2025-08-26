
'use server';

import {genkit} from 'genkit';
import {openAICompatible} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
