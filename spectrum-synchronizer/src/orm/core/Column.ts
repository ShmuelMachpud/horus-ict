import type { SqlValue } from '../types/orm.types';

interface ColumnConfig {
  readonly sqlType: string;
  readonly notNull: boolean;
  readonly primaryKey: boolean;
  readonly unique: boolean;
  readonly defaultValue?: string;
}

export class Column<T extends SqlValue> {
  // Phantom type — exists only for TypeScript inference, never at runtime
  declare readonly _tsType: T;

  private readonly _config: ColumnConfig;

  constructor(sqlType: string, config?: Partial<Omit<ColumnConfig, 'sqlType'>>) {
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
    return new Column<T>(this._config.sqlType, { ...this._config, unique: true });
  }

  default(value: string): Column<T> {
    return new Column<T>(this._config.sqlType, {
      ...this._config,
      defaultValue: value,
    });
  }

  toSQL(name: string): string {
    const parts: string[] = [`"${name}"`, this._config.sqlType];

    if (this._config.defaultValue !== undefined) {
      parts.push(`DEFAULT ${this._config.defaultValue}`);
    }

    if (this._config.primaryKey) {
      parts.push('PRIMARY KEY');
    } else {
      if (this._config.notNull) parts.push('NOT NULL');
      if (this._config.unique) parts.push('UNIQUE');
    }

    return parts.join(' ');
  }
}
