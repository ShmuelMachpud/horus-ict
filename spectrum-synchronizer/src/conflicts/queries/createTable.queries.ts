import { createTableFunction } from "../../global/functions/create-table.function";
import { SCHEMAS } from "../../models/schemas.models";
import { TABLES_SPECTRUM } from "../../models/tables.models";

const createConflictsTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS ${SCHEMAS.SPECTRUM}.${TABLES_SPECTRUM.CONFLICTS} (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        created_by VARCHAR(255),
        updated_by VARCHAR(255),
        is_deleted BOOLEAN DEFAULT FALSE,
        conflict VARCHAR(255) NOT NULL,
        effect VARCHAR(255) NOT NULL
    )`;
  await createTableFunction(TABLES_SPECTRUM.CONFLICTS, query);
  return query;
};

export default createConflictsTable;
