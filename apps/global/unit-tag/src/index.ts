import '@zayad/helpers';
import { checkPostgresConnection } from '@zayad/helpers';
import { corsMiddleware, handleServerError, helmetMiddleware, pinoMiddleware, sqlInjection } from '@zayad/middlewares';
import { UNIT_TAG_PORT as PORT } from '@zayad/utils';
import express from 'express';

const app = express();

app.use(sqlInjection);
app.use(helmetMiddleware);
app.use(pinoMiddleware);
app.use(corsMiddleware);
// app.use(router);

checkPostgresConnection()
  .then(() => app.listen(PORT, () => global.log.info({ tag: `INITIAL SERVER` }, `server run on port ${PORT}`)))
  .catch((error) => global.log.error({ tag: `SERVER ERROR` }, `The server in not listening: error: ${error}`));

app.use(handleServerError);
