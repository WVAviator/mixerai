import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  CreateImageRequest,
  CreateModerationRequest,
  CreateModerationResponse,
  ImagesResponse,
  OpenAIApi,
} from 'openai';

interface CreateChatRequest {
  model: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301';
  messages: { role: 'user' | 'system' | 'assistant'; content: string }[];
  maxTokens: number;
  temperature: number;
}

export interface CreateChatResponse {
  id: string;
  object: string;
  created: number;
  choices: Choice[];
  usage: Usage;
}

interface Choice {
  index: number;
  message: Message;
  finish_reason: string;
}

interface Message {
  role: string;
  content: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Provides the configured OpenAI instance and exposes methods for interfacing with the API.
 */
@Injectable()
export class OpenAIProvider {
  private configuration: Configuration;
  private openai: OpenAIApi;

  public createCompletion: (
    createCompletionRequest: CreateCompletionRequest,
    options?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<CreateCompletionResponse>>;

  public createModeration: (
    createModerationRequest: CreateModerationRequest,
    options?: AxiosRequestConfig<any>,
  ) => Promise<AxiosResponse<CreateModerationResponse, any>>;

  public createImage: (
    createImageRequest: CreateImageRequest,
    options?: AxiosRequestConfig<any>,
  ) => Promise<AxiosResponse<ImagesResponse, any>>;

  constructor(private configService: ConfigService) {
    this.configuration = new Configuration({
      apiKey: configService.get('OPENAI_SECRET_KEY'),
    });
    this.openai = new OpenAIApi(this.configuration);
    this.createCompletion = this.openai.createCompletion.bind(this);
    this.createModeration = this.openai.createModeration.bind(this);
    this.createImage = this.openai.createImage.bind(this);
  }

  public async createChatCompletion(chatCompletionOptions: CreateChatRequest) {
    const request = await axios.post<CreateCompletionResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: chatCompletionOptions.model,
        max_tokens: chatCompletionOptions.maxTokens,
        temperature: chatCompletionOptions.temperature,
        messages: chatCompletionOptions.messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.configService.get(
            'OPENAI_SECRET_KEY',
          )}`,
        },
      },
    );

    return request;
  }
}
