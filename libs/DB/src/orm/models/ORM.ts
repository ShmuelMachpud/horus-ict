import { Pool, PoolConfig, QueryResultRow } from 'pg';
import type { ColumnRecord, ColumnRef, ColumnRefs } from '../types/orm.types';
// import type { ColumnRecord, ColumnRef, ColumnRefs, FindOptions, InferRow } from '../types/orm.types';
import { Column } from './Column';
import { CustomError } from '@zayad/helpers';

export class ORM<TName extends string, TCols extends ColumnRecord> {
  static #pool: Pool | undefined;
  static #schemas: ORM<string, ColumnRecord>[] = [];
  readonly #columns: TCols;
  readonly #tableName: TName;

  private constructor(tableName: TName, columns: TCols) {
    this.#tableName = tableName;
    this.#columns = columns;
  }

  static async connect(config: PoolConfig): Promise<void> {
    if (!ORM.#pool) ORM.#pool = new Pool(config);
    const pool = ORM.#pool;
    if (!pool) throw new CustomError('DB not connected', 'CONNECT TO PG', 500);
    const client = await pool.connect();
    global.log.success({ tag: 'CONNECT TO PG' }, 'Connected successfully to PostGres');
    client.release();
    for (const schema of ORM.#schemas) await schema.#sync();
  }

  // להעביר ל #query
  static async query<T, R extends QueryResultRow = T & QueryResultRow>(query: string, values?: Array<T[keyof T]>) {
    try {
      if (!ORM.#pool) throw new CustomError('DB not connected', 'CONNECT TO PG', 500);
      const { rows } = await ORM.#pool.query<R>(query, values);
      return rows;
    } catch (error) {
      return Promise.reject(error);
    }
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

  static createSchema<TName extends string, TCols extends ColumnRecord>(
    tableName: TName,
    columns: TCols
  ): ORM<TName, TCols> & ColumnRefs<TCols> {
    const schema = new ORM(tableName, columns);
    for (const column of Object.keys(columns)) {
      const ref: ColumnRef = { table: tableName, column };
      Object.defineProperty(schema, column, { value: ref, enumerable: false });
    }
    ORM.#schemas.push(schema);
    return schema as ORM<TName, TCols> & ColumnRefs<TCols>;
  }

  #toSQL(): string {
    const colDefs = Object.entries(this.#columns)
      .map(([name, col]) => `    ${col.toSQL(name)}`)
      .join(',\n');

    return `CREATE TABLE IF NOT EXISTS ${this.#tableName} (\n${colDefs}\n)`;
  }

  // async findAll(): Promise<InferRow<TCols>[]> {
  //   return this.#select<InferRow<TCols>>('*');
  // }

  // async find<TKeys extends keyof TCols & string>(
  //   options: FindOptions<TCols, TKeys>
  // ): Promise<Pick<InferRow<TCols>, TKeys>[]> {
  //   const cols = options.select.map((c) => `"${c}"`).join(', ');
  //   return this.#select<Pick<InferRow<TCols>, TKeys>>(cols);
  // }

  // async #select<TRow>(cols: string): Promise<TRow[]> {
  //   const result = await ORM.query<TRow>(`SELECT ${cols} FROM ${this.#tableName}`);
  //   return result ?? [];
  // }

  async #sync(): Promise<void> {
    const table = this.#tableName.split('.');
    if (table.length === 2) await ORM.query(`CREATE SCHEMA IF NOT EXISTS ${table[0]}`);
    await ORM.query(this.#toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.#tableName}"`);
  }
}
