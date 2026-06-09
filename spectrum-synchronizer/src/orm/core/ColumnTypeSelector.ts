import type { Schema } from './Schema';
import type { ColumnRecord } from '../types/orm.types';
import { Column } from './Column';
import { ColumnModifierBuilder } from './ColumnModifierBuilder';

export class ColumnTypeSelector<TName extends string, TCols extends ColumnRecord, TColName extends string> {
  constructor(
    private readonly _schema: Schema<TName, TCols>,
    private readonly _colName: TColName
  ) {}

  uuid() {
    return new ColumnModifierBuilder(this._schema, this._colName, new Column<string | null>('UUID'));
  }
  varchar(length: number) {
    return new ColumnModifierBuilder(this._schema, this._colName, new Column<string | null>(`VARCHAR(${length})`));
  }
  integer() {
    return new ColumnModifierBuilder(this._schema, this._colName, new Column<number | null>('INTEGER'));
  }
  bigint() {
    return new ColumnModifierBuilder(this._schema, this._colName, new Column<number | null>('BIGINT'));
  }
  boolean() {
    return new ColumnModifierBuilder(this._schema, this._colName, new Column<boolean | null>('BOOLEAN'));
  }
  // בהמשך להוסיף עוד סוגים לפי הצורך
}
