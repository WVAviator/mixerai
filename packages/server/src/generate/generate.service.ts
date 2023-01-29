import { OpenAIProvider } from './openai.provider';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GeneratedRecipe, GenerationOptions } from './types';
import { CreateCompletionResponse } from 'openai';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class GenerateService {
  private logger = new Logger(GenerateService.name);
  private aiPrompt: string;
  constructor(@Inject(OpenAIProvider) private openai: OpenAIProvider) {
    this.aiPrompt = readFileSync(join(process.cwd(), 'ai/prompt.txt'), 'utf8');
  }

  /**
   * Generates a recipe using the OpenAI API and provided options.
   * @param options AI Generation options, including the required prompt.
   * @returns A generated recipe
   */
  async generateRecipe(options: GenerationOptions) {
    this.logger.log(
      `Generating recipe with options: ${JSON.stringify(options)}`,
    );
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${this.aiPrompt} ${options.prompt}`,
      temperature: 0.8,
      max_tokens: 250,
    });

    this.logger.log(`Response received. Parsing recipe...`);
    const recipe = await this.parseRecipe(response.data);

    return recipe;
  }

  private async parseRecipe(data: CreateCompletionResponse) {
    const responseJson = data.choices[0].text;
    this.logger.log(`Attempting to parse JSON from AI response.`);
    try {
      const recipe = await JSON.parse(responseJson);
      this.logger.log(`Successfully parsed recipe.`);
      return recipe as GeneratedRecipe;
    } catch (error) {
      this.logger.error(`Error parsing recipe: ${error}`);
      this.logger.error(`AI response: ${responseJson}`);
      throw new InternalServerErrorException(`AI produced invalid JSON.`);
    }
  }
}
