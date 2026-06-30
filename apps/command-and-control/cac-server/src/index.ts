import '@zayad/helpers';
import express from 'express';
import { CAC_SERVER_PORT as PORT } from '@zayad/utils';
import { pinoMiddleware } from '@zayad/middlewares';

const app = express();

app.use(pinoMiddleware);

app.listen(PORT, () => global.log.info(`CAC Server is running on port ${PORT}`));
