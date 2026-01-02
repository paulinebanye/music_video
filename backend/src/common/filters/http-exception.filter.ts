import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../../utils/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const normalized = this.normalizeException(exception);

    this.logger.error('Unhandled exception', (exception as Error)?.stack, {
      status_code: status,
      method: request.method,
      path: request.url,
      error: normalized,
    });

    response.status(status).json({
      status: 'error',
      error: normalized,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private normalizeException(exception: unknown): Record<string, unknown> {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return { message: response };
      }

      if (Array.isArray(response)) {
        return {
          message: 'Validation failed',
          details: response,
        };
      }

      if (typeof response === 'object' && response !== null) {
        const { message, ...rest } = response as Record<string, unknown>;

        if (Array.isArray(message)) {
          return {
            message: 'Validation failed',
            details: message,
            ...rest,
          };
        }

        return {
          message: typeof message === 'string' ? message : 'Unexpected error',
          ...rest,
        };
      }
    }

    if (exception instanceof Error) {
      return { message: exception.message };
    }

    return { message: 'Internal server error' };
  }
}
