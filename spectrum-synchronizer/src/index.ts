import './helpers/pino';
import { checkPostgresConnection } from './helpers/postgres/connect-to-postgres';
import { syncTables } from './helpers/postgres/sync-tables';
import { handleError } from './utils/handleError';
import queryToPostgres from './helpers/postgres/query-to-postgres';
import { ConflictsSchema } from './conflicts/queries/createTable.queries';

const initSchemas = async () => {
  await queryToPostgres(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1"`);
  await ConflictsSchema.sync();
};

checkPostgresConnection()
  .then(() => initSchemas())
  .then(() => syncTables())
  .catch((error) => handleError(error, 'Failed to run server:', 'INITIAL SERVER'));
