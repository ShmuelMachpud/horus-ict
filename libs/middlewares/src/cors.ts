import { CustomError } from '@zayad/helpers';
import { CORS_WHITE_LIST, NODE_ENV } from '@zayad/utils';
import cors, { CorsOptionsDelegate } from 'cors';

const corsOptions: CorsOptionsDelegate = (req, cb) => {
  if (NODE_ENV === 'development') return cb(null, { origin: true, credentials: true });

  if (!CORS_WHITE_LIST)
    return cb(new CustomError('No env with CORS_WHITE_LIST', 'CORS_ERROR', 500), {
      origin: false,
      credentials: false,
    });
  const API = req.headers.origin || req.headers['x-forwarded-host'];
  const URLS = JSON.parse(CORS_WHITE_LIST);
  const isExists = !!URLS.find((api: string) => api === API);

  if (!isExists)
    return cb(new CustomError(`The api: ${API} is an unauthorized API`, 'CORS_ERROR', 403), {
      origin: false,
      credentials: false,
    });

  return cb(null, { origin: true, credentials: true });
};

export const corsMiddleware = cors(corsOptions);
