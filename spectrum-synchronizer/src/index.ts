import "./helpers/pino";
import { checkPostgresConnection } from "./helpers/postgres/connect-to-postgres";
import { createTables } from "./helpers/postgres/create-tables";
import { syncTables } from "./helpers/postgres/sync-tables";
import { handleError } from "./utils/handleError";

checkPostgresConnection()
  .then(() => createTables())
  .then(() => syncTables())
  .catch((error) =>
    handleError(error, "Failed to run server:", "INITIAL SERVER"),
  );
