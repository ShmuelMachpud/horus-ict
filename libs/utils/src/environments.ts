import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;

// PORTES SERVICES
export const AUTH_SERVICE_PORT = process.env.AUTH_SERVICE_PORT;
export const BLACK_LIST_SERVER_PORT = process.env.BLACK_LIST_SERVER_PORT;
export const CAC_SERVER_PORT = process.env.CAC_SERVER_PORT;
export const DND_SERVER_PORT = process.env.DND_SERVER_PORT;
export const FILES_SERVER_PORT = process.env.FILES_SERVER_PORT;
export const LAYOUT_SERVER_PORT = process.env.LAYOUT_SERVER_PORT;
export const LOG_SERVER_PORT = process.env.LOG_SERVER_PORT;
export const NOTIFICATION_SERVER_PORT = process.env.NOTIFICATION_SERVER_PORT;
export const UNIT_TAG_PORT = process.env.UNIT_TAG_PORT;
export const FSS_SERVER_PORT = process.env.FSS_SERVER_PORT;
export const MAC_SERVER_PORT = process.env.MAC_SERVER_PORT;
export const SPECTRUM_SERVER_PORT = process.env.SPECTRUM_SERVER_PORT;

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
