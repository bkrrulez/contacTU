
import {genkit} from 'genkit';
import {Plugin, genkitPlugin} from 'genkit/plugin';
import {ModelAction, ModelDefinition} from 'genkit/model';
import {Request,Response,MessageData,Part} from 'genkit/content';

function toOpenAIRole(role: string): string {
  switch (role) {
    case 'user':
      return 'user';
    case 'model':
      return 'assistant';
    case 'system':
      return 'system';
    case 'tool':
       return 'tool';
    default:
      return 'user';
  }
}

function toOpenAIMessages(messages: MessageData[]): any[] {
    return messages.map((message) => {
        const content: (string | { type: string; text?: string; image_url?: { url: string; }; })[] = [];
        message.content.forEach(part => {
            if (part.text) {
                content.push({ type: 'text', text: part.text });
            }
            if (part.media) {
                 // OpenRouter expects image_url content to be a string, not an object
                 // and the content part for images to be an object with type image_url
                if (Array.isArray(content)) {
                     content.push({ type: 'image_url', image_url: { url: part.media.url } });
                }
            }
        });

        // If there's only one text part, just send the string as per some specs
        const finalContent = content.length === 1 && typeof content[0] === 'object' && content[0].type === 'text'
            ? content[0].text
            : content;


        return {
            role: toOpenAIRole(message.role),
            content: finalContent,
        };
    });
}


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
           const modelName = request.config?.version || 'openai/gpt-4o';
           const messages = toOpenAIMessages(request.messages);
           
           const openAiRequest = {
                model: modelName,
                messages: messages,
                ...(request.tools && {
                    tools: request.tools.map(t => ({type: 'function', function: t.definition}))
                }),
                ...(request.output?.format === 'json' && { response_format: { type: 'json_object' } }),
            };

          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify(openAiRequest),
          });

          if(!response.ok) {
              const errorText = await response.text();
              throw new Error(`OpenRouter request failed: ${response.status} ${response.statusText} - ${errorText}`);
          }
          
          const openAiResponse = await response.json();
          const choice = openAiResponse.choices[0];
          const responseCandidates: Response['candidates'] = [];
          
          if (choice.message.content) {
            responseCandidates.push({
              index: 0,
              finishReason: 'stop',
              message: {
                role: 'model',
                content: [{text: choice.message.content}],
              },
            });
          }
          if (choice.message.tool_calls) {
            responseCandidates.push({
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
            candidates: responseCandidates,
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
    openrouter,
  ],
});
