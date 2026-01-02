import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { pinoCoreConfig } from '../common/logger/pino-core-config';
import pino, { Logger as PinoLogger } from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  protected pino: PinoLogger;

  constructor(context = '') {
    super(context);
    this.pino = context
      ? pino(pinoCoreConfig as pino.LoggerOptions).child({ context })
      : pino(pinoCoreConfig as pino.LoggerOptions);
  }

  override log(message: string, meta?: string | Record<string, unknown>): void {
    this.writeLog('info', message, meta);
  }

  override error(
    message: string,
    stack?: string,
    meta?: string | Record<string, unknown>,
  ): void {
    const context = typeof meta === 'string' ? { context: meta } : (meta ?? {});
    this.pino.error({ ...context, trace: stack }, message);
  }

  override warn(
    message: string,
    meta?: string | Record<string, unknown>,
  ): void {
    this.writeLog('warn', message, meta);
  }

  override debug(
    message: string,
    meta?: string | Record<string, unknown>,
  ): void {
    this.writeLog('debug', message, meta);
  }

  override verbose(
    message: string,
    meta?: string | Record<string, unknown>,
  ): void {
    this.writeLog('trace', message, meta);
  }

  setContext(context: string): void {
    this.pino = this.pino.child({ context });
  }

  childContext(context: string): Logger {
    const child = new Logger();
    child.pino = this.pino.child({ context });
    return child;
  }

  private writeLog(
    level: 'info' | 'warn' | 'debug' | 'trace',
    message: string,
    meta?: string | Record<string, unknown>,
  ): void {
    if (typeof meta === 'string') {
      this.pino[level]({ context: meta }, message);
    } else if (typeof meta === 'object' && meta !== null) {
      this.pino[level](meta, message);
    } else {
      this.pino[level]({}, message);
    }
  }
}
