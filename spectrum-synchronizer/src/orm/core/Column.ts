import type { ColumnConfig, SqlValue } from "../types/orm.types";

export class Column<T extends SqlValue> {
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

  notNull(): Column<NonNullable<T>> {
    return new Column<NonNullable<T>>(this._config.sqlType, {
      ...this._config,
      notNull: true,
    });
  }

  primaryKey(): Column<NonNullable<T>> {
    return new Column<NonNullable<T>>(this._config.sqlType, {
      ...this._config,
      primaryKey: true,
      notNull: true,
    });
  }

  unique(): Column<T> {
    return new Column<T>(this._config.sqlType, { ...this._config, unique: true});
  }

  default(value: string): Column<T> {
    return new Column<T>(this._config.sqlType, { ...this._config, defaultValue: value});
  }

  toSQL(name: string) {
    const parts: string[] = [`"${name}"`, this._config.sqlType];

    if (this._config.defaultValue) parts.push(`DEFAULT ${this._config.defaultValue}`);
    if (this._config.primaryKey) parts.push("PRIMARY KEY");
    if (this._config.notNull && !this._config.primaryKey) parts.push("NOT NULL");
    if (this._config.unique && !this._config.primaryKey) parts.push("UNIQUE");

    return parts.join(" ");
  }
}
