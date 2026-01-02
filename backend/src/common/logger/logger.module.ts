import { Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import { pinoHttpOptions } from './pino-http-options';

@Module({
  imports: [
    PinoModule.forRoot({
      pinoHttp: pinoHttpOptions,
    }),
  ],
  exports: [PinoModule],
})
export class LoggerModule {}
