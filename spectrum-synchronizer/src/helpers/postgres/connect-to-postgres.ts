import { Pool } from "pg";
import { client } from "./config-client";
import { CustomError } from "../../utils/handleError";

let pgClient: Pool | undefined;

export const createPgClient = () => {
  if (pgClient) return pgClient;
  pgClient = new Pool(client);

  return pgClient;
};

export const checkPostgresConnection = async () => {
  try {
    const pg = createPgClient();
    const client = await pg.connect();
    global.log.success(
      { tag: "CONNECT TO PG" },
      "Connected successfully  to PostGres DB",
    );
    client.release()
  } catch (error: any) {
    if(error instanceof CustomError) throw error
    throw new CustomError(`cloud not connect to the Postgres DB: ${error.message}`, "CONNECT_TO_POSTGRES", 500);
  }
};
