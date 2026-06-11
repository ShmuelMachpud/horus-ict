import type { ColumnConfig, ColumnRef, SqlValue } from "../types/orm.types";

export class ColumnDefinition<T extends SqlValue> {
  private readonly _config: ColumnConfig;
  constructor(sqlType: string, config?: Partial<Omit<ColumnConfig, "sqlType">>) {
    this._config = {
      sqlType,
      notNull: false,
      primaryKey: false,
      unique: false,
      ...config,
    };
  }

  notNull(): ColumnDefinition<NonNullable<T>> {
    return new ColumnDefinition<NonNullable<T>>(this._config.sqlType, {
      ...this._config,
      notNull: true,
    });
  }

  primaryKey(): ColumnDefinition<NonNullable<T>> {
    return new ColumnDefinition<NonNullable<T>>(this._config.sqlType, {
      ...this._config,
      primaryKey: true,
      notNull: true,
    });
  }

  unique(): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this._config.sqlType, { ...this._config, unique: true});
  }

  default(value: string): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this._config.sqlType, { ...this._config, defaultValue: value});
  }

  /** Adds a foreign key. The target column must hold a compatible type. */
  reference(ref: ColumnRef<T>): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this._config.sqlType, {
      ...this._config,
      reference: { table: ref.table, column: ref.column },
    });
  }

  toSQL(name: string) {
    const parts: string[] = [`"${name}"`, this._config.sqlType];

    if (this._config.defaultValue) parts.push(`DEFAULT ${this._config.defaultValue}`);
    if (this._config.primaryKey) parts.push("PRIMARY KEY");
    if (this._config.notNull && !this._config.primaryKey) parts.push("NOT NULL");
    if (this._config.unique && !this._config.primaryKey) parts.push("UNIQUE");
    if (this._config.reference) {
      const { table, column } = this._config.reference;
      parts.push(`REFERENCES ${table}("${column}")`);
    }

    return parts.join(" ");
  }
}
