import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { LOGGER_EXCLUDED_PATHS } from '../constants/logger.constants';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(LoggerInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl } = request;
    const ip = request.ip || (request.headers['x-forwarded-for'] as string) || 'unknown';
    const userId =
      (request as any).user?.id || (request.headers['x-user-id'] as string) || 'anonymous';

    if (this.shouldSkipLogging(originalUrl)) {
      return next.handle();
    }

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const duration = Date.now() - start;

          this.logger.info(
            {
              status_code: statusCode,
              duration: `${duration}ms`,
              ip,
              user_id: userId,
            },
            `${method} ${originalUrl}`,
          );
        },
        error: (error: unknown) => {
          const statusCode = response.statusCode;
          const duration = Date.now() - start;

          this.logger.error(
            {
              status_code: statusCode,
              duration: `${duration}ms`,
              ip,
              user_id: userId,
              error,
            },
            `${method} ${originalUrl}`,
          );
        },
      }),
    );
  }

  private shouldSkipLogging(url: string): boolean {
    const normalizedUrl = url === '' ? '/' : url;
    return LOGGER_EXCLUDED_PATHS.some((path) =>
      path === '/' ? normalizedUrl === '/' : normalizedUrl.startsWith(path),
    );
  }
}
