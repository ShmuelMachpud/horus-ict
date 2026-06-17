import queryToPostgres from '../../helpers/postgres/query-to-postgres';
import { Column } from './Column';
import type { ColumnRecord, ColumnRef, ColumnRefs, FindOptions, InferRow } from '../types/orm.types';

export class ORM<TName extends string, TCols extends ColumnRecord> {
  readonly #columns: TCols;
  readonly #tableName: TName;

  private constructor(tableName: TName, columns: TCols) {
    this.#tableName = tableName;
    this.#columns = columns;
  }

  static uuid() {
    return new Column<string | null>('UUID');
  }
  static varchar(length: number) {
    return new Column<string | null>(`VARCHAR(${length})`);
  }
  static integer() {
    return new Column<number | null>('INTEGER');
  }
  static bigint() {
    return new Column<number | null>('BIGINT');
  }
  static boolean() {
    return new Column<boolean | null>('BOOLEAN');
  }

  static async createTable<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    columns: TCols
  ): Promise<ORM<TName, TCols> & ColumnRefs<TCols>> {
    const orm = new ORM(tableName, columns);
    for (const column of Object.keys(columns)) {
      const ref: ColumnRef = { table: tableName, column };
      Object.defineProperty(orm, column, { value: ref, enumerable: false });
    }
    await orm.sync();
    return orm as ORM<TName, TCols> & ColumnRefs<TCols>;
  }

  #toSQL(): string {
    const colDefs = Object.entries(this.#columns)
      .map(([name, col]) => `    ${col.toSQL(name)}`)
      .join(',\n');

    return `CREATE TABLE IF NOT EXISTS ${this.#tableName} (\n${colDefs}\n)`;
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
    const result = await queryToPostgres<TRow>(`SELECT ${cols} FROM ${this.#tableName}`);
    return result ?? [];
  }

  async sync(): Promise<void> {
    const [schema] = this.#tableName.split('.');
    if (schema !== this.#tableName) {
      await queryToPostgres(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    }
    await queryToPostgres(this.#toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.#tableName}"`);
  }
}
