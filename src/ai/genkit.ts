
'use server';

import {genkit, genkitPlugin, ModelReference} from 'genkit';
import {z} from 'genkit';

const Gpt4oLatest = {
  name: 'openai/gpt-4o-latest',
  versions: ['openai/gpt-4o-latest'],
  supports: {
    media: true,
    output: ['text', 'json'],
    tools: false,
    systemRole: true,
  },
} as const;

const openrouter = genkitPlugin('openrouter', async (options: {apiKey?: string}) => {
  const apiKey = options.apiKey ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  return {
    models: {
      'gpt-4o-latest': Gpt4oLatest,
    },

    async run(request, streamingCallback) {
      if (streamingCallback) {
        throw new Error('Streaming not supported');
      }

      const openAiRequest = {
        model: 'openai/gpt-4o-latest',
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content.map((p) => {
            if (p.text) {
              return {type: 'text', text: p.text};
            }
            if (p.media) {
              return {type: 'image_url', image_url: {url: p.media.url}};
            }
            throw new Error('Unsupported message part');
          }),
        })),
        max_tokens: request.config?.maxOutputTokens,
        temperature: request.config?.temperature,
        top_p: request.config?.topP,
        stop: request.config?.stopSequences,
        ...(request.output?.format === 'json' && {response_format: {type: 'json_object'}}),
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:9002',
          'X-Title': 'contacTU',
        },
        body: JSON.stringify(openAiRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const openAiResponse = await response.json();
      const choice = openAiResponse.choices[0];

      return {
        candidates: [
          {
            index: 0,
            finishReason: choice.finish_reason,
            message: {
              role: 'model',
              content: [{text: choice.message.content}],
            },
          },
        ],
        usage: {
          inputTokens: openAiResponse.usage.prompt_tokens,
          outputTokens: openAiResponse.usage.completion_tokens,
          totalTokens: openAiResponse.usage.total_tokens,
        },
      };
    },
  };
});


export const ai = genkit({
  plugins: [
    openrouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
