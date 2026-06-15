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

export interface ColumnRef<T extends SqlValue = SqlValue> {
  table: string;
  column: string;
  // phantom type
  __type?: T;
}

export type ColType<C> = C extends Column<infer T> ? T : never;

export type ColumnRefs<TCols extends ColumnRecord> = {
  [K in keyof TCols & string]: ColumnRef<ColType<TCols[K]>>;
};

// queries types
export type InferRow<TCols extends ColumnRecord> = {
  [K in keyof TCols]: TCols[K] extends Column<infer T> ? T : never;
};

export type FindOptions<TCols extends ColumnRecord, TKeys extends keyof TCols & string = keyof TCols & string> = {
  select: TKeys[];
};
