import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
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
}
