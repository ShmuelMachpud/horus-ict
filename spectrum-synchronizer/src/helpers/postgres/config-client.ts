// import { PoolClient } from "pg";
import { POSTGRES_CONNECTION_STRING } from "../../utils/environments";

export const client = {
  connectionString: POSTGRES_CONNECTION_STRING!,
  ssl: false,
  idle_in_transaction_session_timeout: 10000,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,   
};
