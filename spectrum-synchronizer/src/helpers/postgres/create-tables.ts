import { createTableFunction } from '../../global/functions/create-table.function';
import { handleError } from '../../utils/handleError';

export const createTables = async () => {
  try {
    await createTableFunction('uuid-ossp', `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1"`);
  } catch (error) {
    handleError(error, 'Failed to create tables', 'CREATE TABLES');
  } finally {
    global.log.info({ tag: 'CREATE TABLES' }, 'End created tables');
  }
};
