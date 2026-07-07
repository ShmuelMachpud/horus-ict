import '@zayad/helpers';
import { checkPostgresConnection } from '@zayad/helpers';
import { corsMiddleware, handleServerError, helmetMiddleware, pinoMiddleware, sqlInjection } from '@zayad/middlewares';
import { AUTH_SERVICE_PORT as PORT } from '@zayad/utils';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(pinoMiddleware);
app.use(sqlInjection);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// app.use(metrics);
// app.use(router);

checkPostgresConnection()
  .then(() => app.listen(PORT, () => global.log.info({ tag: `INITIAL SERVER` }, `server run on port ${PORT}`)))
  .catch((error) => global.log.error({ tag: `SERVER ERROR` }, `The server in not listening: error: ${error}`));

app.use(handleServerError);
