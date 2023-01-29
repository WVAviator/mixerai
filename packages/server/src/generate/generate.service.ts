import { OpenAIProvider } from './openai.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GenerationOptions } from './types';

@Injectable()
export class GenerateService {
  private logger = new Logger(GenerateService.name);
  constructor(@Inject(OpenAIProvider) private openai: OpenAIProvider) {}

  async generateRecipe(options: GenerationOptions) {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: 'Generate a simple greeting formatted in JSON.',
      temperature: 0.5,
      max_tokens: 100,
    });

    return response.data;
  }
}
