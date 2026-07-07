import '@zayad/helpers';
import { checkPostgresConnection } from '@zayad/helpers';
import { handleServerError, helmetMiddleware, pinoMiddleware } from '@zayad/middlewares';
import { LOG_SERVER_PORT as PORT } from '@zayad/utils';
import express from 'express';

const app = express();

app.use(helmetMiddleware);
app.use(pinoMiddleware);
app.use(express.json());
// app.use(router);

checkPostgresConnection()
  .then(() => app.listen(PORT, () => global.log.info({ tag: `INITIAL SERVER` }, `server run on port ${PORT}`)))
  .catch((error) => global.log.error({ tag: `SERVER ERROR` }, `The server in not listening: error: ${error}`));

app.use(handleServerError);
