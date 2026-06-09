import type { Column } from '../core/Column';

export type SqlValue = string | number | boolean | null;

export interface ColumnConfig {
  readonly sqlType: string;
  readonly notNull: boolean;
  readonly primaryKey: boolean;
  readonly unique: boolean;
  readonly defaultValue?: string;
}

export type ColumnRecord = Record<string, Column<SqlValue>>;

