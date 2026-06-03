import type { Column } from "../core/Column";

export type SqlValue = string | number | boolean | Date | object | null;

export type ColumnRecord = Record<string, Column<SqlValue>>;

export type OnDeleteAction = "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";
export type OnUpdateAction = "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION";

export type ReferenceDefinition = {
  readonly fromColumn: string;
  readonly toFullTable: string;
  readonly toColumn: string;
  readonly onDelete?: OnDeleteAction;
  readonly onUpdate?: OnUpdateAction;
};

export type InferRow<TCols extends ColumnRecord> = {
  [K in keyof TCols]: TCols[K] extends Column<infer T> ? T : never;
};
