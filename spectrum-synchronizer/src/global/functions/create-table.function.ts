import queryToPostgres from "../../helpers/postgres/query-to-postgres";
import { handleError } from "../../utils/handleError";

export const createTableFunction = async (
  table_name: string,
  query: string,
) => {
  try {
    await queryToPostgres(query);
    global.log.success(
      { tag: "CREATE TABLE" },
      `Successfully create "${table_name}" table`,
    );
  } catch (error) {
    handleError(error, `failed to create table ${table_name}`, "CREATE TABLES");
  }
};
