import { pinoCoreConfig } from './pino-core-config';
import type { Options } from 'pino-http';

export const pinoHttpOptions: Options = {
  ...pinoCoreConfig,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        body: req.body,
        ip:
          req.headers['x-forwarded-for'] ||
          req.socket?.remoteAddress ||
          req.connection?.remoteAddress ||
          'unknown',
        timestamp: new Date().toISOString(),
      };
    },
    res(res) {
      return {
        status_code: res.statusCode,
      };
    },
  },
};
