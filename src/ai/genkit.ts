
'use server';

import {genkit, ModelPlugin, Part} from 'genkit';
import {Candidate, GenerationResponse} from 'genkit/coordination';

function toPart(chunk: string): Part {
  try {
    const json = JSON.parse(chunk);
    if (json.error) {
      throw new Error(json.error.message);
    }
    return {text: json.choices[0].delta.content};
  } catch (e) {
    // ignore JSON parse errors
    return {text: ''};
  }
}

const openrouter: ModelPlugin = {
  name: 'openrouter',
  models: {
    'gpt-4o-latest': {
      label: 'OpenAI - GPT-4o',
      supports: {
        media: false,
        multiturn: true,
        tools: false,
        systemRole: true,
        output: ['text'],
      },
    },
  },
  async run(request) {
    const modelName = request.model.name.startsWith('openrouter/')
      ? request.model.name.substring('openrouter/'.length)
      : request.model.name;
      
    const model = this.models?.[modelName];
    if (!model) {
      throw new Error(`Model ${modelName} not found in openrouter plugin`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:9002',
      'X-Title': 'contacTU',
    };
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const messages = request.messages.map(m => ({
      role: m.role,
      content: m.content.map(p => p.text).join('')
    }));

    const body = {
      model: 'openai/gpt-4o-latest', 
      messages: messages,
      stream: request.stream,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    if (request.stream) {
      const stream = response.body as any;
      let buffer = '';
      const reader = stream.getReader();

      const decodedStream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const {done, value} = await reader.read();
              if (done) {
                break;
              }
              buffer += new TextDecoder().decode(value);
              const lines = buffer.split('\n\n');
              for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i];
                if (line.startsWith('data: ')) {
                  const chunk = line.substring(6);
                  if (chunk === '[DONE]') {
                    controller.close();
                    return;
                  }
                  controller.enqueue(toPart(chunk));
                }
              }
              buffer = lines[lines.length - 1];
            }
          } catch (e) {
            controller.error(e);
          } finally {
            controller.close();
          }
        },
      });

      return {
        stream: decodedStream,
      };
    } else {
      const jsonResponse = await response.json();
      const candidate: Candidate = {
        finish_reason: jsonResponse.choices[0].finish_reason,
        index: jsonResponse.choices[0].index,
        message: {
          role: 'model',
          content: [{text: jsonResponse.choices[0].message.content}],
        },
      };
      const result: GenerationResponse = {
        candidates: [candidate],
        usage: {
          input_tokens: jsonResponse.usage.prompt_tokens,
          output_tokens: jsonResponse.usage.completion_tokens,
          total_tokens: jsonResponse.usage.total_tokens,
        },
      };
      return result;
    }
  },
};

export const ai = genkit({
  plugins: [openrouter],
  logLevel: 'debug',
  enableTracing: true,
});
