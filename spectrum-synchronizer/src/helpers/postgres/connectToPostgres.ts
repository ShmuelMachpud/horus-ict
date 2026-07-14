import { Pool } from 'pg';
import { POSTGRES_CONNECTION_STRING } from '../../utils/environments';

export const pg = new Pool({
  connectionString: `${POSTGRES_CONNECTION_STRING}?keepAlive=true`,
  ssl: false,
  keepAlive: true,
  keepAliveInitialDelayMillis: 30_000,
  idleTimeoutMillis: 45_000,
  connectionTimeoutMillis: 10_000,
});

pg.on('error', (err) => {
  global.log.error({ tag: 'PG_POOL_ERROR' }, `Unexpected pool error - ${err.message}`);
});

export const checkPostgresConnection = async () => {
  try {
    const client = await pg.connect();
    global.log.info({ tag: 'CONNECT TO PG' }, `Connected successfully to PostGres DB`);
    client.release();
  } catch (error) {
    global.log.error({ tag: 'CONNECT TO PG' }, `Could not connect to the postgres DB: ${error}`);
  }
};
