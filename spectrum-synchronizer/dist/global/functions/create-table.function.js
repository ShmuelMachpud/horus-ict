"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableFunction = void 0;
const ORM_1 = require("../../orm/models/ORM");
const handleError_1 = require("../../utils/handleError");
const createTableFunction = async (table_name, query) => {
    try {
        await ORM_1.ORM.query(query);
        global.log.success({ tag: 'CREATE TABLE' }, `Successfully create "${table_name}" table`);
    }
    catch (error) {
        (0, handleError_1.handleError)(error, `failed to create table ${table_name}`, 'CREATE TABLES');
    }
};
exports.createTableFunction = createTableFunction;
