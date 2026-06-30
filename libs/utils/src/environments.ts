import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

// PORTES SERVICES
export const CAC_SERVER_PORT = process.env.CAC_SERVER_PORT;

// API'S SERVICES

// CORS
export const CORS_WHITE_LIST = process.env.CORS_WHITE_LIST;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;

// PG
export const POSTGRES_CONNECTION_STRING = process.env.POSTGRES_CONNECTION_STRING;
export const PG_SSL_ENABLED = process.env.PG_SSL_ENABLED;
export const PG_SSL_CRT = process.env.PG_SSL_CRT;
export const PG_SSL_KEY = process.env.PG_SSL_KEY;
