import type { Column } from '../models/Column';
import { ORM } from '../models/ORM';

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
  __type?: T; // phantom type
}

export type ColType<C> = C extends Column<infer T> ? T : never;

export type ColumnRefs<TCols extends ColumnRecord> = {
  [K in keyof TCols & string]: ColumnRef<ColType<TCols[K]>>;
};

// orm.types.ts
export type InferTable<T> = T extends ORM<any, infer TCols> ? InferRow<TCols> : never;

// queries types
export type InferRow<TCols extends ColumnRecord> = {
  [K in keyof TCols]: TCols[K] extends Column<infer T> ? T : never;
};

export type WhereOptions<TCols extends ColumnRecord> = Partial<InferRow<TCols>>;

export type FindOptions<TCols extends ColumnRecord, TKeys extends keyof TCols> = {
  select?: TKeys[];
  where?: WhereOptions<TCols>;
};

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

// migration types
export type MigrationMode = 'safe' | 'force';

export interface MigrationOptions {
  migrationMode?: MigrationMode;
}

export interface DbColumn {
  name: string;
  sqlType: string;
  notNull: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  reference?: { table: string; column: string };
}

export type DbTable = Record<string, DbColumn>;

export interface AlterAction {
  description: string;
  sql: string;
}

export interface MigrationWarning {
  description: string;
  manualSql: string;
}

export interface TableDiff {
  safe: AlterAction[];
  unSafe: MigrationWarning[];
}

export interface ColumnRow {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  is_nullable: 'YES' | 'NO';
  column_default: string | null;
}

export interface ConstraintRow {
  constraint_type: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY';
  column_name: string;
  foreign_schema: string | null;
  foreign_table: string | null;
  foreign_column: string | null;
}

interface DiffContext {
  tableName: string;
  table: string;
  columnName: string;
  column: ColumnConfig;
  dbColumn: DbColumn;
}

export type ColumnCheck = (ctx: DiffContext) => TableDiff;
