import { OpenAIProvider } from './openai.provider';
import { Module } from '@nestjs/common';
import { PromptProvider } from './prompt.provider';

@Module({
  providers: [OpenAIProvider, PromptProvider],
  exports: [OpenAIProvider, PromptProvider],
})
export class OpenAIModule {}
