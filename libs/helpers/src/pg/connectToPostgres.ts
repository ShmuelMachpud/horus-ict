import { Pool } from 'pg';
import { PG_SSL_CRT, PG_SSL_KEY, PG_SSL_ENABLED, POSTGRES_CONNECTION_STRING } from '@zayad/utils';

export const pg = new Pool({
  connectionString: `${POSTGRES_CONNECTION_STRING}?keepAlive=true`,
  ssl:
    PG_SSL_ENABLED === 'false'
      ? false
      : true
        ? {
            rejectUnauthorized: false,
            key: PG_SSL_KEY,
            cert: PG_SSL_CRT,
          }
        : false,
  //   idle_in_transaction_session_timeout: 10000,
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
    global.log.info({ tag: 'CONNECT TO PG' }, 'Connected successfully to Postgres DB');
    client.release();
  } catch (error) {
    global.log.error({ tag: 'CONNECT TO PG' }, 'Failed to connect to Postgres DB');
  }
};
