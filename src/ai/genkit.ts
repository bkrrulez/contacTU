
'use server';

import { genkit, type Plugin } from 'genkit';

/**
 * OpenRouter plugin for Genkit
 */
function openrouterPlugin(): Plugin<any> {
  return {
    name: 'openrouter',
    models: [
      {
        name: 'openrouter/gpt-4o-latest',
        run: async (request, streamingCallback) => {
          if (streamingCallback) {
            throw new Error('Streaming not supported');
          }

          const apiKey = process.env.OPENROUTER_API_KEY;
          if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY is required');
          }

          // Drop "openrouter/" prefix
          const modelId = request.model.name.split('/')[1];

          const openAiRequest = {
            model: modelId,
            messages: request.messages.map(m => ({
              role: m.role,
              content: m.content.map(p => {
                if (p.text) return { type: 'text', text: p.text };
                if (p.media)
                  return { type: 'image_url', image_url: { url: p.media.url } };
                throw new Error('Unsupported message part');
              }),
            })),
            max_tokens: request.config?.maxOutputTokens,
            temperature: request.config?.temperature,
            top_p: request.config?.topP,
            stop: request.config?.stopSequences,
            ...(request.output?.format === 'json' && {
              response_format: { type: 'json_object' },
            }),
          };

          const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:9002', // adjust for prod
                'X-Title': 'contacTU',
              },
              body: JSON.stringify(openAiRequest),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`
            );
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
                  content: [{ text: choice.message.content }],
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
      },
    ],
  };
}

/**
 * Async factory to get a Genkit instance
 * ✅ Safe for Next.js "use server"
 */
export async function getAi() {
  return genkit({
    plugins: [openrouterPlugin], // pass function, not object
    logLevel: 'debug',
    enableTracing: true,
  });
}
