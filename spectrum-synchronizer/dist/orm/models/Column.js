"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
class Column {
    #config;
    constructor(sqlType, config) {
        this.#config = {
            sqlType,
            notNull: false,
            primaryKey: false,
            unique: false,
            ...config,
        };
    }
    notNull() {
        return new Column(this.#config.sqlType, {
            ...this.#config,
            notNull: true,
        });
    }
    primaryKey() {
        return new Column(this.#config.sqlType, {
            ...this.#config,
            primaryKey: true,
            notNull: true,
        });
    }
    unique() {
        return new Column(this.#config.sqlType, { ...this.#config, unique: true });
    }
    default(value) {
        return new Column(this.#config.sqlType, { ...this.#config, defaultValue: value });
    }
    reference(ref) {
        return new Column(this.#config.sqlType, {
            ...this.#config,
            reference: { table: ref.table, column: ref.column },
        });
    }
    toSQL(name) {
        const parts = [`"${name}"`, this.#config.sqlType];
        if (this.#config.defaultValue)
            parts.push(`DEFAULT ${this.#config.defaultValue}`);
        if (this.#config.primaryKey)
            parts.push('PRIMARY KEY');
        if (this.#config.notNull && !this.#config.primaryKey)
            parts.push('NOT NULL');
        if (this.#config.unique && !this.#config.primaryKey)
            parts.push('UNIQUE');
        if (this.#config.reference) {
            const { table, column } = this.#config.reference;
            parts.push(`REFERENCES ${table}("${column}")`);
        }
        return parts.join(' ');
    }
}
exports.Column = Column;
