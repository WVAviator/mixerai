import { Inject, Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { OpenAIProvider } from '../openai/openai.provider';
import { ImageGenerationOptions } from './dtos/image-generation-options.dto';
import { ImageGenerationException } from './image-generation.exception';

@Injectable()
export class ImageService {
  private logger = new Logger(ImageService.name);
  constructor(@Inject(OpenAIProvider) private openAIProvider: OpenAIProvider) {}

  public async generateImage(options: ImageGenerationOptions) {
    this.logger.log('Validating image generation options');
    const validatedOptions = new ImageGenerationOptions(options);
    const optionsValidationErrors = await validate(validatedOptions);
    if (optionsValidationErrors.length > 0) {
      throw new ImageGenerationException(
        `Validation error: ${optionsValidationErrors}`,
      );
    }

    let imageUrl: string;
    try {
      this.logger.log(
        'Generating image with options: ' + JSON.stringify(options),
      );
      const imageGenerationResponse = await this.openAIProvider.createImage({
        prompt: options.prompt,
        n: 1,
        size: '512x512',
      });

      this.logger.log(
        'Image generation response: ' +
          JSON.stringify(imageGenerationResponse.data),
      );

      imageUrl = imageGenerationResponse.data.data[0].url;
    } catch (error) {
      throw new ImageGenerationException(`OpenAI API request error: ${error}`);
    }

    return imageUrl;
  }
}
