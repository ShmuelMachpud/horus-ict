import createConflictsTable from "../../conflicts/queries/createTable.queries";
import { createTableFunction } from "../../global/functions/create-table.function";
import { SCHEMAS } from "../../models/schemas.models";
import { handleError } from "../../utils/handleError";

const createExtentionsUuidQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1"`;

const createSchemaSpectrumQuery = `CREATE SCHEMA IF NOT EXISTS ${SCHEMAS.SPECTRUM}`;

export const createTables = async () => {
  try {
    await createTableFunction("extentions_uuid", createExtentionsUuidQuery);
    await createTableFunction("schema_spectrum", createSchemaSpectrumQuery);
    await createConflictsTable();
  } catch (error) {
    handleError(error, "Failed to create tables", "CREATE TABLES");
  } finally {
    global.log.info({ tag: "CREATE TABLES" }, "End created tables");
  }
};
