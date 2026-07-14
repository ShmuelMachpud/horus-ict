import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 13000;
export const NODE_ENV = process.env.NODE_ENV;
export const POSTGRES_CONNECTION_STRING = process.env.POSTGRES_CONNECTION_STRING;
