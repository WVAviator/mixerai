import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Module({
  providers: [GenerateService],
})
export class GenerateModule {}
