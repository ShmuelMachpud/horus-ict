"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const query_to_postgres_1 = __importDefault(require("../../helpers/postgres/query-to-postgres"));
class Schema {
    #columns;
    #tableName;
    #schemaName;
    constructor(tableName, schemaName, columns) {
        this.#tableName = tableName;
        this.#schemaName = schemaName;
        this.#columns = columns;
    }
    static create(tableName, schemaName, columns) {
        const schema = new Schema(tableName, schemaName, columns);
        const table = `${schemaName}.${tableName}`;
        for (const column of Object.keys(columns)) {
            const ref = { table, column };
            Object.defineProperty(schema, column, { value: ref, enumerable: false });
        }
        return schema;
    }
    #toSQL() {
        const colDefs = Object.entries(this.#columns)
            .map(([name, col]) => `    ${col.toSQL(name)}`)
            .join(',\n');
        return `CREATE TABLE IF NOT EXISTS ${this.#schemaName}.${this.#tableName} (\n${colDefs}\n)`;
    }
    async findAll() {
        return this.#select('*');
    }
    async find(options) {
        const cols = options.select.map((c) => `"${c}"`).join(', ');
        return this.#select(cols);
    }
    async #select(cols) {
        const result = await (0, query_to_postgres_1.default)(`SELECT ${cols} FROM ${this.#schemaName}.${this.#tableName}`);
        return result ?? [];
    }
    async sync() {
        await (0, query_to_postgres_1.default)(`CREATE SCHEMA IF NOT EXISTS ${this.#schemaName}`);
        await (0, query_to_postgres_1.default)(this.#toSQL());
        global.log.success({ tag: 'ORM' }, `Synced table "${this.#schemaName}.${this.#tableName}"`);
    }
}
exports.Schema = Schema;
