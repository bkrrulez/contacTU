
import {genkit} from 'genkit';
import {openrouter} from 'genkit-plugin-openrouter';

export const ai = genkit({
  plugins: [
    openrouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    }),
  ],
  models: [
    {
      name: 'openai/gpt-4o-latest',
      path: 'openai/gpt-4o-latest'
    }
  ],
  logLevel: 'debug',
  enableTracing: true,
});
