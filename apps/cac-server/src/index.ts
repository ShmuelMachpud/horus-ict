import '@horus/shared';
import express from 'express';
import { CAC_SERVER_PORT as PORT } from '@horus/shared';

// console.log(test);

const app = express();

app.listen(PORT, () => global.log.info(`CAC Server is running on port ${PORT}`));
