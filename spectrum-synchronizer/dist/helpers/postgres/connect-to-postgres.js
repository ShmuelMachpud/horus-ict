"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPostgresConnection = exports.createPgClient = void 0;
const pg_1 = require("pg");
const config_client_1 = require("./config-client");
const handleError_1 = require("../../utils/handleError");
let pgClient;
const createPgClient = () => {
    if (pgClient)
        return pgClient;
    pgClient = new pg_1.Pool(config_client_1.client);
    return pgClient;
};
exports.createPgClient = createPgClient;
const checkPostgresConnection = async () => {
    try {
        const pg = (0, exports.createPgClient)();
        const client = await pg.connect();
        global.log.success({ tag: "CONNECT TO PG" }, "Connected successfully  to PostGres DB");
        client.release();
    }
    catch (error) {
        if (error instanceof handleError_1.CustomError)
            throw error;
        throw new handleError_1.CustomError(`cloud not connect to the Postgres DB: ${error.message}`, "CONNECT_TO_POSTGRES", 500);
    }
};
exports.checkPostgresConnection = checkPostgresConnection;
