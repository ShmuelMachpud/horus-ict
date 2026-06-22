"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_to_postgres_1 = require("./connect-to-postgres");
const handleError_1 = require("../../utils/handleError");
const queryToPostgres = async (query, values) => {
    try {
        const pg = (0, connect_to_postgres_1.createPgClient)();
        const { rows: data } = await pg.query(query, values);
        return data;
    }
    catch (error) {
        (0, handleError_1.handleError)(error, "Oops... something went wrong!", "PG QUERY");
        return Promise.reject(error);
    }
};
exports.default = queryToPostgres;
