import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  HttpRequestOptions,
  HttpResponse,
  RequestClient,
} from './request-client';

@Injectable()
export class AxiosRequestClient extends RequestClient {
  private readonly client: AxiosInstance;

  constructor() {
    super();
    this.client = axios.create();
  }

  async send<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const response = await this.client.request<T>({
      url: options.url,
      method: options.method,
      headers: options.headers,
      params: options.params,
      data: options.body,
      validateStatus: () => true,
    });

    return {
      statusCode: response.status,
      headers: response.headers as Record<string, string | string[]>,
      data: response.data,
    };
  }
}
