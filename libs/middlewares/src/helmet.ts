import helmet from 'helmet';

export const helmetMiddleware = helmet({
  frameguard: false,
  contentSecurityPolicy: {
    directives: {
      'frema-ancestors': ['*'],
    },
  },
});
