import queryToPostgres from '../../helpers/postgres/query-to-postgres';
import type { ColumnRecord } from '../types/orm.types';
import type { FindOptions, InferRow } from '../types/query.types';

export class Schema<TName extends string, TCols extends ColumnRecord> {
  readonly columns: TCols;

  private readonly _tableName: TName;
  private readonly _schemaName: string;

  private constructor(tableName: TName, schemaName: string, columns: TCols) {
    this._tableName = tableName;
    this._schemaName = schemaName;
    this.columns = columns;
  }

  static create<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    schemaName: string,
    columns: TCols
  ): Schema<TName, TCols> {
    return new Schema(tableName, schemaName, columns);
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

  async findAll(): Promise<InferRow<TCols>[]> {
    return this._select<InferRow<TCols>>('*');
  }

  async find<TKeys extends keyof TCols & string>(
    options: FindOptions<TCols, TKeys>
  ): Promise<Pick<InferRow<TCols>, TKeys>[]> {
    const cols = options.select.map((c) => `"${c}"`).join(', ');
    return this._select<Pick<InferRow<TCols>, TKeys>>(cols);
  }

  private async _select<TRow>(cols: string): Promise<TRow[]> {
    const result = await queryToPostgres<TRow>(`SELECT ${cols} FROM ${this.schemaName}.${this.tableName}`);
    return result ?? [];
  }

  async sync(): Promise<void> {
    await queryToPostgres(`CREATE SCHEMA IF NOT EXISTS ${this._schemaName}`);
    await queryToPostgres(this.toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.schemaName}.${this.tableName}"`);
  }
}
