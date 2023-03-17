import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RecipeGenerationOptions } from '../generate/dtos/recipe-generation-options.dto';
import { ChatMessage } from './openai.provider';

/**
 * Provides the methods for prefixing prompts to OpenAI with the appropriate context for few-shot learning.
 */
@Injectable()
export class PromptProvider {
  private completionPrefix: string;
  private chatPrompt: string;

  constructor() {
    this.completionPrefix = readFileSync(
      join(process.cwd(), 'ai/completion-prompt.txt'),
      'utf8',
    );

    this.chatPrompt = readFileSync(
      join(process.cwd(), 'ai/chat-prompt.json'),
      'utf8',
    );
  }

  createCompletionPrompt(options: RecipeGenerationOptions) {
    return `${this.completionPrefix} ${options.prompt}`;
  }

  createChatPrompt(options: RecipeGenerationOptions) {
    const chatPrompt = JSON.parse(this.chatPrompt) as ChatMessage[];
    chatPrompt.push({
      role: 'user',
      content: options.prompt,
    });

    return chatPrompt;
  }
}
