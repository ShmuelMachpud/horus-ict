import type { ColumnConfig, ColumnRef, SqlValue } from '../types/orm.types';

export class ColumnDefinition<T extends SqlValue> {
  readonly #config: ColumnConfig;

  constructor(sqlType: string, config?: Partial<Omit<ColumnConfig, 'sqlType'>>) {
    this.#config = {
      sqlType,
      notNull: false,
      primaryKey: false,
      unique: false,
      ...config,
    };
  }

  notNull(): ColumnDefinition<NonNullable<T>> {
    return new ColumnDefinition<NonNullable<T>>(this.#config.sqlType, {
      ...this.#config,
      notNull: true,
    });
  }

  primaryKey(): ColumnDefinition<NonNullable<T>> {
    return new ColumnDefinition<NonNullable<T>>(this.#config.sqlType, {
      ...this.#config,
      primaryKey: true,
      notNull: true,
    });
  }

  unique(): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this.#config.sqlType, { ...this.#config, unique: true });
  }

  default(value: string): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this.#config.sqlType, { ...this.#config, defaultValue: value });
  }

  /** Adds a foreign key. The target column must hold a compatible type. */
  reference(ref: ColumnRef<T>): ColumnDefinition<T> {
    return new ColumnDefinition<T>(this.#config.sqlType, {
      ...this.#config,
      reference: { table: ref.table, column: ref.column },
    });
  }

  toSQL(name: string) {
    const parts: string[] = [`"${name}"`, this.#config.sqlType];

    if (this.#config.defaultValue) parts.push(`DEFAULT ${this.#config.defaultValue}`);
    if (this.#config.primaryKey) parts.push('PRIMARY KEY');
    if (this.#config.notNull && !this.#config.primaryKey) parts.push('NOT NULL');
    if (this.#config.unique && !this.#config.primaryKey) parts.push('UNIQUE');
    if (this.#config.reference) {
      const { table, column } = this.#config.reference;
      parts.push(`REFERENCES ${table}("${column}")`);
    }

    return parts.join(' ');
  }
}

