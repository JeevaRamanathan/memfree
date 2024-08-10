import 'server-only';

import { anthropic } from '@ai-sdk/anthropic';
import { LLMChat } from './llm';
import { logError } from '../log';
import { Message, StreamHandler } from './llm';
import { streamText } from 'ai';

export class AnthropicChat implements LLMChat {
    async chat(query: string, model: string, system?: string): Promise<string> {
        return '';
    }

    async chatStream(
        system: string,
        query: string,
        model: string,
        onMessage: StreamHandler,
    ): Promise<void> {
        const anthropic_model = anthropic(model);

        try {
            let messages: Message[] = [
                {
                    role: 'user',
                    content: `${query}`,
                },
            ];
            const { textStream } = await streamText({
                model: anthropic_model,
                system: system,
                messages: messages,
                maxTokens: 1024,
                temperature: 0.3,
                // onFinish: (finish) => {
                //     console.log('anthropic finishReason ', finish.usage);
                // },
            });

            for await (const text of textStream) {
                onMessage?.(text, false);
            }
        } catch (error) {
            logError(error, 'llm-anthropic');
        }
    }
}
