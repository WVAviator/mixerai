import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponse,
  CreateModerationRequest,
  CreateModerationResponse,
  OpenAIApi,
} from 'openai';

/**
 * Represents the server's instance of the configured OpenAI API.
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

  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_SECRET_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.createCompletion = this.openai.createCompletion.bind(this);
    this.createModeration = this.openai.createModeration.bind(this);
  }
}
