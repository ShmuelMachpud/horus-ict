"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = void 0;
const pg_1 = require("pg");
const Column_1 = require("./Column");
const handleError_1 = require("../../utils/handleError");
class ORM {
    static #pool;
    static #schemas = [];
    #columns;
    #tableName;
    constructor(tableName, columns) {
        this.#tableName = tableName;
        this.#columns = columns;
    }
    static async connect(config) {
        if (!ORM.#pool)
            ORM.#pool = new pg_1.Pool(config);
        const pool = ORM.#pool;
        if (!pool)
            throw new handleError_1.CustomError('DB not connected', 'CONNECT_TO_POSTGRES', 500);
        const client = await pool.connect();
        global.log.success({ tag: 'CONNECT TO PG' }, 'Connected successfully to PostGres');
        client.release();
        for (const schema of ORM.#schemas)
            await schema.#sync();
    }
    static async query(query, values) {
        try {
            if (!ORM.#pool)
                throw new handleError_1.CustomError('DB not connected', 'CONNECT_TO_POSTGRES', 500);
            const { rows } = await ORM.#pool.query(query, values);
            return rows;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    static uuid() {
        return new Column_1.Column('UUID');
    }
    static varchar(length) {
        return new Column_1.Column(`VARCHAR(${length})`);
    }
    static integer() {
        return new Column_1.Column('INTEGER');
    }
    static bigint() {
        return new Column_1.Column('BIGINT');
    }
    static boolean() {
        return new Column_1.Column('BOOLEAN');
    }
    static createSchema(tableName, columns) {
        const schema = new ORM(tableName, columns);
        for (const column of Object.keys(columns)) {
            const ref = { table: tableName, column };
            Object.defineProperty(schema, column, { value: ref, enumerable: false });
        }
        ORM.#schemas.push(schema);
        return schema;
    }
    #toSQL() {
        const colDefs = Object.entries(this.#columns)
            .map(([name, col]) => `    ${col.toSQL(name)}`)
            .join(',\n');
        return `CREATE TABLE IF NOT EXISTS ${this.#tableName} (\n${colDefs}\n)`;
    }
    async #sync() {
        const table = this.#tableName.split('.');
        if (table.length === 2)
            await ORM.query(`CREATE SCHEMA IF NOT EXISTS ${table[0]}`);
        await ORM.query(this.#toSQL());
        global.log.success({ tag: 'ORM' }, `Synced table "${this.#tableName}"`);
    }
}
exports.ORM = ORM;
