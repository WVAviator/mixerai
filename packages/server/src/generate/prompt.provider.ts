import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GenerationOptions } from './dtos/generation-options.dto';

/**
 * Provides the methods for prefixing prompts to OpenAI with the appropriate context for few-shot learning.
 */
@Injectable()
export class PromptProvider {
  private promptPrefix: string;

  constructor() {
    this.promptPrefix = readFileSync(
      join(process.cwd(), 'ai/prompt.txt'),
      'utf8',
    );
  }

  createPrompt(options: GenerationOptions) {
    return `${this.promptPrefix} ${options.prompt}`;
  }
}
