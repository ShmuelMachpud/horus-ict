import type { ColumnRecord, SqlValue } from "../types/orm.types";
import { Column } from "./Column";
import { Schema } from "./Schema";

export class ColumnModifierBuilder<
  TName extends string,
  TCols extends ColumnRecord,
  TColName extends string,
  T extends SqlValue,
> extends Schema<TName, TCols & Record<TColName, Column<T>>> {
  constructor(
    private readonly _base: Schema<TName, TCols>,
    private readonly _colName: TColName,
    private readonly _col: Column<T>,
  ) {
    super(_base.tableName, _base.schemaName, { ..._base.columns, [_colName]: _col});
  }

  notNull() {
    return new ColumnModifierBuilder(this._base, this._colName, this._col.notNull());
  }

  primaryKey() {
    return new ColumnModifierBuilder(this._base, this._colName, this._col.primaryKey());
  }

  unique() {
    return new ColumnModifierBuilder(this._base, this._colName, this._col.unique());
  }

  default(value: string) {
    return new ColumnModifierBuilder(this._base, this._colName, this._col.default(value));
  }
}
