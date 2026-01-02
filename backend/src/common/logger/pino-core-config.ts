import dayjs from 'dayjs';
import type { LoggerOptions } from 'pino';

export const pinoCoreConfig: LoggerOptions = {
  redact: {
    paths: [
      'req.body.password',
      'req.headers.authorization',
      'req.headers["x-refresh-token"]',
      'req.cookies.refresh_token',
    ],
    remove: true,
  },
  base: null,
  timestamp: () => `,"timestamp":"${dayjs().toISOString()}"`,
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: true,
          },
        }
      : undefined,
};
