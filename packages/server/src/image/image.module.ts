import { OpenAIModule } from './../openai/openai.module';
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageDataProvider } from './image-data.provider';
import { S3Provider } from './s3.provider';

@Module({
  imports: [OpenAIModule],
  providers: [ImageService, ImageDataProvider, S3Provider],
  exports: [ImageService],
})
export class ImageModule {}
