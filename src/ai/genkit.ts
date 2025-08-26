
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {Plugin, genkitPlugin} from 'genkit';
import {ModelAction, ModelDefinition, renderModel} from 'genkit/model';
import {Request,Response} from 'genkit/content';

const openrouter: Plugin<any> = genkitPlugin(
  'openrouter',
  async (options: any) => ({
    models: {
      'gpt-4o': {
        name: 'OpenRouter - GPT 4o',
        versions: ['openai/gpt-4o'],
        supports: {
          multiturn: true,
          systemRole: true,
          media: true,
          tools: true,
          output: ['text', 'json'],
        },
        run: async (request) => {
          const openAiRequest = renderModel(
            {
              model: 'openai/gpt-4o',
              messages: request.messages,
              tools: request.tools,
              toolConfig: request.toolConfig,
              output: request.output,
            },
            {provider: 'openai'}
          );
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify(openAiRequest),
          });
          const openAiResponse = await response.json();
          const choice = openAiResponse.choices[0];
          const messages: Response['candidates'] = [];
          if (choice.message.content) {
            messages.push({
              index: 0,
              finishReason: 'stop',
              message: {
                role: 'model',
                content: [{text: choice.message.content}],
              },
            });
          }
          if (choice.message.tool_calls) {
            messages.push({
              index: 0,
              finishReason: 'stop',
              message: {
                role: 'model',
                content: choice.message.tool_calls.map((tool: any) => ({
                  toolRequest: {
                    name: tool.function.name,
                    input: JSON.parse(tool.function.arguments),
                  },
                })),
              },
            });
          }

          return {
            candidates: messages,
            usage: {
              inputTokens: openAiResponse.usage.prompt_tokens,
              outputTokens: openAiResponse.usage.completion_tokens,
              totalTokens: openAiResponse.usage.total_tokens,
            },
          };
        },
      },
    },
  })
);


export const ai = genkit({
  plugins: [
    openrouter(),
    googleAI(),
  ],
});
