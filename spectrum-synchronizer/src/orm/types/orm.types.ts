import type { Column } from '../models/Column';

export type SqlValue = string | number | boolean | null;

export interface ColumnConfig {
  sqlType: string;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  reference?: { table: string; column: string };
}

export type ColumnRecord = Record<string, Column<SqlValue>>;

/** A typed pointer to a specific column of a specific table — used for foreign keys. */
export interface ColumnRef<T extends SqlValue = SqlValue> {
  table: string;
  column: string;
  /** phantom — carries the referenced column's type for compile-time matching */
  __type?: T;
}

/** Extracts the TS type a column definition holds. */
export type ColType<C> = C extends Column<infer T> ? T : never;

/** Maps a schema's columns to typed refs: { id: ColumnRef<string>, ... } */
export type ColumnRefs<TCols extends ColumnRecord> = {
  [K in keyof TCols & string]: ColumnRef<ColType<TCols[K]>>;
};
