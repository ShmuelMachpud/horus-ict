import dotenv from "dotenv";

dotenv.config();

//postgres
export const POSTGRES_CONNECTION_STRING =
  process.env.POSTGRES_CONNECTION_STRING;

export const NODE_ENV = process.env.NODE_ENV;
