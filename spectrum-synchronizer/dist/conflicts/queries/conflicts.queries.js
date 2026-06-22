"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertConflictQuery = void 0;
const schemas_models_1 = require("../../models/schemas.models");
const tables_models_1 = require("../../models/tables.models");
const insertConflictQuery = (data) => {
    const columns = Object.keys(data[0]);
    const values = data.flatMap((item) => columns.map((col) => item[col]));
    const setValues = data
        .map((_, index) => `(${columns.map((_, i) => `$${index * columns.length + i + 1}`).join(', ')})`)
        .join(', ');
    const query = `INSERT INTO ${schemas_models_1.SCHEMAS.SPECTRUM}.${tables_models_1.SPECTRUM_TABLES.CONFLICTS} (
  ${columns.join(', ')}
) VALUES ${setValues} RETURNING *;`;
    return { query, values };
};
exports.insertConflictQuery = insertConflictQuery;
