import { CreateChatResponse, OpenAIProvider } from '../openai/openai.provider';
import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCompletionResponse } from 'openai';
import { GeneratedRecipe } from './dtos/generated-recipe.dto';
import { validate } from 'class-validator';
import { PromptProvider } from '../openai/prompt.provider';
import { RecipeGenerationOptions } from './dtos/recipe-generation-options.dto';
import { AIResponseException } from './ai-response.exception';
import { AxiosResponse } from 'axios';
import { ContentModerationException } from './content-moderation.exception';

@Injectable()
export class GenerateService {
  private logger = new Logger(GenerateService.name);
  constructor(
    @Inject(OpenAIProvider) private openai: OpenAIProvider,
    @Inject(PromptProvider) private promptProvider: PromptProvider,
  ) {}

  /**
   * Generates a recipe using the OpenAI API and provided options.
   * @param options AI Generation options, including the required prompt.
   * @returns A generated recipe
   */
  async generateRecipe(
    options: RecipeGenerationOptions,
  ): Promise<GeneratedRecipe> {
    this.logger.log(`Validating prompt: ${options.prompt}`);
    const validatedOptions = new RecipeGenerationOptions(options);
    const errors = await validate(validatedOptions);
    if (errors.length > 0) {
      this.logger.error(`Validation error: ${errors}`);
      throw new InternalServerErrorException(
        'Generation options failed validation.',
      );
    }

    this.logger.log(
      `Generating recipe with options: ${JSON.stringify(options)}`,
    );

    let moderationResponse;
    try {
      moderationResponse = await this.openai.createModeration({
        input: options.prompt,
      });
    } catch (error: any) {
      throw new BadGatewayException('Error communicating with OpenAI', {
        cause: error,
      });
    }

    const moderationResult = moderationResponse.data.results[0];

    if (moderationResult.flagged) {
      const flaggedReasons = Object.keys(moderationResult.categories).filter(
        (category) => moderationResult.categories[category] === true,
      );
      throw new ContentModerationException(
        `Prompt failed moderation. Reasons: ${JSON.stringify(flaggedReasons)}`,
      );
    }

    const recipe =
      options.model === 'text-davinci-003'
        ? await this.getCompletionResponse(options)
        : await this.getChatResponse(options);

    return recipe;
  }

  private async getCompletionResponse(options: RecipeGenerationOptions) {
    let recipeResponse: AxiosResponse<CreateCompletionResponse, any>;

    try {
      recipeResponse = await this.openai.createCompletion(
        {
          model: options.model,
          prompt: this.promptProvider.createCompletionPrompt(options),
          temperature: 0.8,
          max_tokens: 250,
        },
        {
          timeout: 10000,
        },
      );
    } catch (error: any) {
      throw new BadGatewayException('Error communicating with OpenAI', {
        cause: error,
      });
    }
    const recipe = await this.parseCompletionResponse(recipeResponse.data);
    this.logger.log(`Generated recipe ${recipe.title} successfully.`);

    return recipe;
  }

  private async getChatResponse(options: RecipeGenerationOptions) {
    let recipeResponse: AxiosResponse<CreateChatResponse, any>;

    try {
      recipeResponse = await this.openai.createChatCompletion({
        model: options.model as 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301',
        messages: this.promptProvider.createChatPrompt(options),
        temperature: 0.8,
        max_tokens: 250,
      });
    } catch (error: any) {
      throw new BadGatewayException('Error communicating with OpenAI', {
        cause: error,
      });
    }
    const recipe = await this.parseChatResponse(recipeResponse.data);
    this.logger.log(`Generated recipe ${recipe.title} successfully.`);

    return recipe;
  }

  private async parseCompletionResponse(data: CreateCompletionResponse) {
    const responseJson = data.choices[0].text;

    let generatedRecipe: GeneratedRecipe;
    try {
      generatedRecipe = await JSON.parse(responseJson);
    } catch (error: any) {
      throw new AIResponseException('AI produced invalid JSON.', {
        cause: error,
      });
    }

    const validatedRecipe = new GeneratedRecipe(generatedRecipe);
    const errors = await validate(validatedRecipe);
    if (errors.length > 0) {
      throw new AIResponseException('AI response failed validation', {
        cause: new Error(errors[0].toString()),
      });
    }

    return generatedRecipe;
  }

  private async parseChatResponse(data: CreateChatResponse) {
    const responseJson = data.choices[0].message.content;

    let generatedRecipe: GeneratedRecipe;

    try {
      generatedRecipe = await JSON.parse(responseJson);
    } catch (error: any) {
      throw new AIResponseException('AI produced invalid JSON.', {
        cause: error,
      });
    }

    const validatedRecipe = new GeneratedRecipe(generatedRecipe);
    const errors = await validate(validatedRecipe);
    if (errors.length > 0) {
      throw new AIResponseException('AI response failed validation', {
        cause: new Error(errors[0].toString()),
      });
    }

    return generatedRecipe;
  }
}
