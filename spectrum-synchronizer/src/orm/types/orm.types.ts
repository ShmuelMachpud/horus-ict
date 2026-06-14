import type { ColumnDefinition } from '../core/ColumnDefinition';

export type SqlValue = string | number | boolean | null;

export interface ColumnConfig {
  readonly sqlType: string;
  readonly notNull: boolean;
  readonly primaryKey: boolean;
  readonly unique: boolean;
  readonly defaultValue?: string;
  readonly reference?: { readonly table: string; readonly column: string };
}

export type ColumnRecord = Record<string, ColumnDefinition<SqlValue>>;

/** A typed pointer to a specific column of a specific table — used for foreign keys. */
export interface ColumnRef<T extends SqlValue = SqlValue> {
  readonly table: string;
  readonly column: string;
  /** phantom — carries the referenced column's type for compile-time matching */
  readonly __type?: T;
}

/** Extracts the TS type a column definition holds. */
export type ColType<C> = C extends ColumnDefinition<infer T> ? T : never;

/** Maps a schema's columns to typed refs: { id: ColumnRef<string>, ... } */
export type ColumnRefs<TCols extends ColumnRecord> = {
  readonly [K in keyof TCols & string]: ColumnRef<ColType<TCols[K]>>;
};

