import './helpers/pino';
import { config } from './helpers/postgres/config-client';
import { createTables } from './helpers/postgres/create-tables';
import { syncTables } from './helpers/postgres/sync-tables';
import { ORM } from './orm/models/ORM';
import { handleError } from './utils/handleError';

ORM.connect(config);
ORM.checkConnection()
  .then(() => createTables())
  .then(() => syncTables())
  .catch((error) => handleError(error, 'Failed to run server:', 'INITIAL SERVER'));
