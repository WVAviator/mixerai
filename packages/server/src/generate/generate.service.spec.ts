import { OpenAIProvider } from '../openai/openai.provider';
import { Test, TestingModule } from '@nestjs/testing';
import { GenerateService } from './generate.service';
import { CreateCompletionResponse, CreateModerationResponse } from 'openai';
import { AxiosResponse } from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import { GeneratedRecipe } from './dtos/generated-recipe.dto';
import { PromptProvider } from '../openai/prompt.provider';
import { RecipeGenerationOptions } from './dtos/recipe-generation-options.dto';
import { AIResponseException } from './ai-response.exception';
import { ContentModerationException } from './content-moderation.exception';

describe('GenerateService', () => {
  let generateService: GenerateService;
  let openAIProvider: OpenAIProvider;
  let promptProvider: PromptProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateService,
        {
          provide: OpenAIProvider,
          useValue: {
            createCompletion: jest.fn(),
            createModeration: jest.fn(() => ({
              data: {
                results: [
                  {
                    flagged: false,
                  },
                ],
              },
            })),
          },
        },
        {
          provide: PromptProvider,
          useValue: {
            createPrompt: jest.fn(),
          },
        },
      ],
    }).compile();

    generateService = module.get<GenerateService>(GenerateService);
    openAIProvider = module.get<OpenAIProvider>(OpenAIProvider);
    promptProvider = module.get<PromptProvider>(PromptProvider);
  });

  it('should be defined', () => {
    expect(generateService).toBeDefined();
  });

  describe('recipe generation tests', () => {
    const testRecipe: GeneratedRecipe = {
      title: 'Test Recipe',
      description: 'Test description',
      ingredients: [{ name: 'Test Ingredient', amount: '1' }],
      directions: 'Test directions',
      imagePrompt: 'Test image prompt',
    } as GeneratedRecipe;

    const getTestResponse = (recipeJson: string) =>
      ({
        status: 200,
        statusText: 'OK',
        data: {
          id: 'test-id',
          object: 'test-object',
          model: 'test-model',
          created: 0,
          choices: [
            {
              text: recipeJson,
            },
          ],
        },
      } as AxiosResponse<CreateCompletionResponse, any>);

    it('should return a generated recipe', async () => {
      const openAICall = jest
        .spyOn(openAIProvider, 'createCompletion')
        .mockResolvedValue(getTestResponse(JSON.stringify(testRecipe)));

      const generatedRecipe = await generateService.generateRecipe({
        prompt: 'Test prompt',
      });

      expect(openAICall).toHaveBeenCalled();
      expect(generatedRecipe).toEqual(testRecipe);
    });

    it('should throw an error if the AI returns invalid JSON', async () => {
      jest
        .spyOn(openAIProvider, 'createCompletion')
        .mockResolvedValue(getTestResponse('error'));

      await expect(
        generateService.generateRecipe({ prompt: 'Test prompt' }),
      ).rejects.toThrow(AIResponseException);
    });

    it('should throw an error if the returned recipe is missing properties', async () => {
      const missingTitle = { ...testRecipe, title: undefined };
      jest
        .spyOn(openAIProvider, 'createCompletion')
        .mockResolvedValue(getTestResponse(JSON.stringify(missingTitle)));

      await expect(
        generateService.generateRecipe({ prompt: 'Test prompt' }),
      ).rejects.toThrow(AIResponseException);
    });

    it('should throw an error if a nested ingredient is invalid', async () => {
      const missingIngredientName = {
        ...testRecipe,
        ingredients: [{ name: undefined, amount: '1' }],
      };
      jest
        .spyOn(openAIProvider, 'createCompletion')
        .mockResolvedValue(
          getTestResponse(JSON.stringify(missingIngredientName)),
        );

      await expect(
        generateService.generateRecipe({ prompt: 'Test prompt' }),
      ).rejects.toThrow(AIResponseException);
    });

    it('calls the ai with provided prompt prefixed with training prompt', async () => {
      const openAIFunction = jest
        .spyOn(openAIProvider, 'createCompletion')
        .mockResolvedValue(getTestResponse(JSON.stringify(testRecipe)));

      const createPromptFunction = jest
        .spyOn(promptProvider, 'createPrompt')
        .mockImplementation(
          (options: RecipeGenerationOptions) =>
            `Test training prompt prefix: ${options.prompt}`,
        );

      await generateService.generateRecipe({
        prompt: 'Test prompt',
      });

      expect(createPromptFunction).toHaveBeenCalledWith({
        prompt: 'Test prompt',
      });

      expect(openAIFunction).toHaveBeenCalledWith({
        prompt: `Test training prompt prefix: Test prompt`,
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        max_tokens: 250,
      });
    });

    it('throws an error if an empty prompt is provided', async () => {
      await expect(
        generateService.generateRecipe({ prompt: '' }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('throws an error if a prompt over 100 characters is provided', async () => {
      await expect(
        generateService.generateRecipe({
          prompt: 'a'.repeat(101),
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('throws an error if the prompt fails moderation', async () => {
      const mockResponse: AxiosResponse<CreateModerationResponse, any> = {
        data: {
          results: [
            {
              categories: {
                hate: false,
                'hate/threatening': true,
                'self-harm': false,
                sexual: false,
                'sexual/minors': false,
                violence: true,
                'violence/graphic': false,
              },
              flagged: true,
            },
          ],
        },
      } as AxiosResponse<CreateModerationResponse, any>;

      jest
        .spyOn(openAIProvider, 'createModeration')
        .mockResolvedValue(mockResponse);

      await expect(
        generateService.generateRecipe({ prompt: 'Test prompt' }),
      ).rejects.toThrow(
        new ContentModerationException(
          `Prompt failed moderation. Reasons: ${JSON.stringify([
            'hate/threatening',
            'violence',
          ])}`,
        ),
      );
    });
  });
});
