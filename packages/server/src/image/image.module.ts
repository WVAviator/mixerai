import { Module } from '@nestjs/common';
import { ImageService } from './image.service';

@Module({
  providers: [ImageService],
})
export class ImageModule {}
