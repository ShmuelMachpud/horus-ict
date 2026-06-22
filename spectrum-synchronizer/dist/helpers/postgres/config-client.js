"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const environments_1 = require("../../utils/environments");
exports.config = {
    connectionString: environments_1.POSTGRES_CONNECTION_STRING,
    ssl: false,
    idle_in_transaction_session_timeout: 10000,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
};
