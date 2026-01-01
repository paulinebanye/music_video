export interface HttpRequestOptions {
  readonly url: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly headers?: Record<string, string>;
  readonly params?: Record<string, string | number | boolean | undefined>;
  readonly body?: unknown;
}

export interface HttpResponse<T = unknown> {
  readonly statusCode: number;
  readonly headers: Record<string, string | string[]>;
  readonly data: T;
}

export abstract class RequestClient {
  abstract send<T>(options: HttpRequestOptions): Promise<HttpResponse<T>>;
}
