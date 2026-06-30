import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';
import { NODE_ENV } from '@zayad/utils';
import { loggerTime } from '@zayad/helpers';

const stream =
  NODE_ENV === 'development'
    ? pretty({
        ignore: 'pid,hostname,time,label,tag,req,res,responseTime,err',
        messageFormat(log, _messageKey, _levelLabel, extras) {
          const { responseTime, req, res } = log;
          const { method, url } = req as Request;
          const { statusCode } = res as { statusCode: number };
          const { colors } = extras;
          return `
    ${colors.yellow('[HTTP]')} ${colors.white(`${loggerTime()} -`)}
    ${colors[+statusCode! >= 400 ? 'red' : 'green'](`${method} ${url} ${statusCode} ${String(responseTime)}ms`)}`;
        },
      })
    : undefined;

export const pinoMiddleware = pinoHttp(
  {
    serializers:
      NODE_ENV != 'development'
        ? {
            req(request: Request) {
              return { method: request.method, url: request.url };
            },
            res(response) {
              return { statusCode: response.statusCode };
            },
          }
        : {},
  },
  stream
);
