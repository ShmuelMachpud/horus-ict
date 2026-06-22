"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = void 0;
const create_table_function_1 = require("../../global/functions/create-table.function");
const handleError_1 = require("../../utils/handleError");
const createTables = async () => {
    try {
        await (0, create_table_function_1.createTableFunction)('uuid-ossp', `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public VERSION "1.1"`);
    }
    catch (error) {
        (0, handleError_1.handleError)(error, 'Failed to create tables', 'CREATE TABLES');
    }
    finally {
        global.log.info({ tag: 'CREATE TABLES' }, 'End created tables');
    }
};
exports.createTables = createTables;
