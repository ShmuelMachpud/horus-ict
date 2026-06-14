import queryToPostgres from '../../helpers/postgres/query-to-postgres';
import type { ColumnRecord, ColumnRef, ColumnRefs } from '../types/orm.types';
import type { FindOptions, InferRow } from '../types/query.types';

export class Schema<TName extends string, TCols extends ColumnRecord> {
  readonly #columns: TCols;
  readonly #tableName: TName;
  readonly #schemaName: string;

  private constructor(tableName: TName, schemaName: string, columns: TCols) {
    this.#tableName = tableName;
    this.#schemaName = schemaName;
    this.#columns = columns;
  }

  static create<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    schemaName: string,
    columns: TCols
  ): Schema<TName, TCols> & ColumnRefs<TCols> {
    const schema = new Schema(tableName, schemaName, columns);
    const table = `${schemaName}.${tableName}`;
    for (const column of Object.keys(columns)) {
      const ref: ColumnRef = { table, column };
      Object.defineProperty(schema, column, { value: ref, enumerable: false });
    }
    return schema as Schema<TName, TCols> & ColumnRefs<TCols>;
  }

  #toSQL(): string {
    const colDefs = Object.entries(this.#columns)
      .map(([name, col]) => `    ${col.toSQL(name)}`)
      .join(',\n');

    return `CREATE TABLE IF NOT EXISTS ${this.#schemaName}.${this.#tableName} (\n${colDefs}\n)`;
  }

  async findAll(): Promise<InferRow<TCols>[]> {
    return this.#select<InferRow<TCols>>('*');
  }

  async find<TKeys extends keyof TCols & string>(
    options: FindOptions<TCols, TKeys>
  ): Promise<Pick<InferRow<TCols>, TKeys>[]> {
    const cols = options.select.map((c) => `"${c}"`).join(', ');
    return this.#select<Pick<InferRow<TCols>, TKeys>>(cols);
  }

  async #select<TRow>(cols: string): Promise<TRow[]> {
    const result = await queryToPostgres<TRow>(`SELECT ${cols} FROM ${this.#schemaName}.${this.#tableName}`);
    return result ?? [];
  }

  async sync(): Promise<void> {
    await queryToPostgres(`CREATE SCHEMA IF NOT EXISTS ${this.#schemaName}`);
    await queryToPostgres(this.#toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.#schemaName}.${this.#tableName}"`);
  }
}
