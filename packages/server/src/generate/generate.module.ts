import { OpenAIProvider } from './openai.provider';
import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { PromptProvider } from './prompt.provider';

@Module({
  providers: [GenerateService, OpenAIProvider, PromptProvider],
  exports: [GenerateService],
})
export class GenerateModule {}
