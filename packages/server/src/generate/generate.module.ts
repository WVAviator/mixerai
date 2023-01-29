import { OpenAIProvider } from './openai.provider';
import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Module({
  providers: [GenerateService, OpenAIProvider],
  exports: [GenerateService],
})
export class GenerateModule {}
