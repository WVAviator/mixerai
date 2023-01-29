import { OpenAIModule } from './../openai/openai.module';
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';

@Module({
  imports: [OpenAIModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
