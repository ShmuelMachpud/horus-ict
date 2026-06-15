import queryToPostgres from './query-to-postgres';
import { ConflictsSchema, UnitsSchema } from '../../conflicts/queries/createTable.queries';
import { handleError } from '../../utils/handleError';

export const createTables = async () => {
  try {
    await queryToPostgres(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1"`);
    await UnitsSchema.sync();
    await ConflictsSchema.sync();
  } catch (error) {
    handleError(error, 'Failed to create tables', 'CREATE TABLES');
  } finally {
    global.log.info({ tag: 'CREATE TABLES' }, 'End created tables');
  }
};
