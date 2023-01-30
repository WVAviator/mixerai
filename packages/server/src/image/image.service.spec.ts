import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { OpenAIProvider } from '../openai/openai.provider';
import { ImageDataProvider } from './image-data.provider';
import { S3Provider } from './s3.provider';
import { ImageGenerationException } from './image-generation.exception';
import { ImageUploadException } from './image-upload.exception';

describe('ImageService', () => {
  let imageService: ImageService;
  let openAIProvider: OpenAIProvider;
  let imageDataProvider: ImageDataProvider;
  let s3Provider: S3Provider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: OpenAIProvider,
          useValue: {
            createImage: jest.fn(() => ({
              data: {
                data: [
                  {
                    url: 'openai url',
                  },
                ],
              },
            })),
          },
        },
        {
          provide: ImageDataProvider,
          useValue: {
            getImage: jest.fn(() => Buffer.from('test image data')),
          },
        },
        {
          provide: S3Provider,
          useValue: {
            uploadImage: jest.fn(() => 's3 url'),
          },
        },
      ],
    }).compile();

    imageService = module.get<ImageService>(ImageService);
    openAIProvider = module.get<OpenAIProvider>(OpenAIProvider);
    imageDataProvider = module.get<ImageDataProvider>(ImageDataProvider);
    s3Provider = module.get<S3Provider>(S3Provider);
  });

  it('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  describe('image generation tests', () => {
    it('should generate an image', async () => {
      const image = await imageService.generateImage({ prompt: 'test prompt' });

      expect(image).toBeDefined();
    });

    it('should call the openai provider', async () => {
      await imageService.generateImage({ prompt: 'test prompt' });
      expect(openAIProvider.createImage).toHaveBeenCalled();
    });

    it('should call the image data provider', async () => {
      await imageService.generateImage({ prompt: 'test prompt' });
      expect(imageDataProvider.getImage).toHaveBeenCalled();
    });

    it('should call the s3 provider', async () => {
      await imageService.generateImage({ prompt: 'test prompt' });
      expect(s3Provider.uploadImage).toHaveBeenCalled();
    });

    it('should throw an error if the openai provider fails', async () => {
      openAIProvider.createImage = jest.fn(() => {
        throw new Error('test error');
      });

      await expect(
        imageService.generateImage({ prompt: 'test prompt' }),
      ).rejects.toThrow(ImageGenerationException);
    });

    it('should throw an error if the image data provider fails', async () => {
      imageDataProvider.getImage = jest.fn(() => {
        throw new Error('test error');
      });

      await expect(
        imageService.generateImage({ prompt: 'test prompt' }),
      ).rejects.toThrow(ImageUploadException);
    });

    it('should throw an error if the s3 provider fails', async () => {
      s3Provider.uploadImage = jest.fn(() => {
        throw new Error('test error');
      });

      await expect(
        imageService.generateImage({ prompt: 'test prompt' }),
      ).rejects.toThrow(ImageUploadException);
    });

    it('should throw an error if provided an invalid prompt', async () => {
      await expect(imageService.generateImage({ prompt: '' })).rejects.toThrow(
        ImageGenerationException,
      );
    });
  });
});
