import { QueryResultRow } from "pg";
import { createPgClient } from "./connect-to-postgres";
import { handleError } from "../../utils/handleError";

const queryToPostgres = async <
  T,
  R extends QueryResultRow = T & QueryResultRow,
>(
  query: string,
  values?: Array<T[keyof T]>,
): Promise<R[] | void> => {
  try {
    const pg = createPgClient();
    const { rows: data } = await pg.query<R>(query, values);
    return data;
  } catch (error) {
    handleError(error, "Oops... something went wrong!", "PG QUERY");
    return Promise.reject(error);
  }
};

export default queryToPostgres;
