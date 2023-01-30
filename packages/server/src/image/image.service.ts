import { S3Provider } from './s3.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { OpenAIProvider } from '../openai/openai.provider';
import { ImageGenerationOptions } from './dtos/image-generation-options.dto';
import { ImageDataProvider } from './image-data.provider';
import { ImageGenerationException } from './image-generation.exception';
import { ImageUploadException } from './image-upload.exception';

@Injectable()
export class ImageService {
  private logger = new Logger(ImageService.name);
  constructor(
    @Inject(OpenAIProvider) private openAIProvider: OpenAIProvider,
    @Inject(ImageDataProvider) private imageDataProvider: ImageDataProvider,
    @Inject(S3Provider) private s3Provider: S3Provider,
  ) {}

  public async generateImage(options: ImageGenerationOptions) {
    this.logger.log('Validating image generation options');
    const validatedOptions = new ImageGenerationOptions(options);
    const optionsValidationErrors = await validate(validatedOptions);
    if (optionsValidationErrors.length > 0) {
      throw new ImageGenerationException(
        `Validation error: ${optionsValidationErrors}`,
      );
    }

    let tempImageUrl: string;
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

      tempImageUrl = imageGenerationResponse.data.data[0].url;
    } catch (error) {
      throw new ImageGenerationException(`OpenAI API request error: ${error}`);
    }

    this.logger.log(`Downloading image from ${tempImageUrl}`);
    let imageBuffer: Buffer;
    try {
      imageBuffer = await this.imageDataProvider.getImage(tempImageUrl);
    } catch (error) {
      throw new ImageUploadException(`Error downloading image from OpenAI`, {
        cause: error,
      });
    }

    this.logger.log('Uploading image to S3');
    let imageUrl: string;
    try {
      imageUrl = await this.s3Provider.uploadImage(imageBuffer);
    } catch (error) {
      throw new ImageUploadException(`Error uploading image to S3`, {
        cause: error,
      });
    }

    return imageUrl;
  }
}
