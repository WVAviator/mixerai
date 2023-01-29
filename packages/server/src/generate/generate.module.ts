import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  providers: [GenerateService],
  imports: [OpenAIModule],
  exports: [GenerateService],
})
export class GenerateModule {}
