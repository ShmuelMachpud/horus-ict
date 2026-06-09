import queryToPostgres from '../../helpers/postgres/query-to-postgres';
import type { ColumnRecord } from '../types/orm.types';
import { ColumnTypeSelector } from './ColumnTypeSelector';

export class Schema<TName extends string, TCols extends ColumnRecord> {
  readonly columns: TCols;

  private readonly _tableName: TName;
  private readonly _schemaName: string;

  protected constructor(tableName: TName, schemaName: string, columns: TCols) {
    this._tableName = tableName;
    this._schemaName = schemaName;
    this.columns = columns;
  }

  static create<TName extends string>(tableName: TName, schemaName = 'public') {
    return new Schema(tableName, schemaName, {});
  }

  column<TColName extends string>(name: TColName): ColumnTypeSelector<TName, TCols, TColName> {
    return new ColumnTypeSelector(this, name);
  }

  get tableName(): TName {
    return this._tableName;
  }

  get schemaName(): string {
    return this._schemaName;
  }

  toSQL(): string {
    const colDefs = Object.entries(this.columns)
      .map(([name, col]) => `    ${col.toSQL(name)}`)
      .join(',\n');

    return `CREATE TABLE IF NOT EXISTS ${this.schemaName}.${this.tableName} (\n${colDefs}\n)`;
  }

  async sync(): Promise<void> {
    await queryToPostgres(`CREATE SCHEMA IF NOT EXISTS ${this._schemaName}`);
    await queryToPostgres(this.toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.schemaName}.${this.tableName}"`);
  }
}
