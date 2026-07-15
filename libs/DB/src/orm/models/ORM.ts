import { Pool, PoolConfig, QueryResultRow } from 'pg';
import {
  ColumnRecord,
  ColumnRef,
  ColumnRefs,
  FindOptions,
  InferRow,
  Prettify,
  SqlValue,
  WhereOptions,
} from '../types/orm.types';
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
    if (!ORM.#pool) {
      ORM.#pool = new Pool(config);
      ORM.#pool.on('error', (err) => global.log.error({ tag: 'PG POOL' }, `Idle client error: ${err.message}`));
    }

    const pool = ORM.#pool;
    if (!pool) throw new CustomError('DB not connected', 'CONNECT TO PG', 500);
    const client = await pool.connect();
    global.log.success({ tag: 'CONNECT TO PG' }, 'Connected successfully to PostGres');
    client.release();
    for (const schema of ORM.#schemas) await schema.#sync();
  }

  static async #query<T extends QueryResultRow>(query: string, values?: SqlValue[]) {
    if (!ORM.#pool) throw new CustomError('DB not connected', 'CONNECT TO PG', 500);
    const { rows } = await ORM.#pool.query<T>(query, values);
    return rows;
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

  async findAll() {
    return this.#select<InferRow<TCols>>('*');
  }

  async find<TKeys extends keyof TCols & string>(options: FindOptions<TCols, TKeys>) {
    const { select, where } = options;
    const cols = select ? select.map((c) => `"${c}"`).join(', ') : '*';
    if (!where) return this.#select<Prettify<InferRow<Pick<TCols, TKeys>>>>(cols);
    const { sql, values } = this.#buildWhere(where);
    return this.#select<Prettify<InferRow<Pick<TCols, TKeys>>>>(cols, sql, values);
  }

  #buildWhere(where: WhereOptions<TCols>) {
    const values: SqlValue[] = [];
    const conditions: string[] = [];

    Object.entries(where).forEach(([columnName, value]) => {
      if (value === undefined) return;
      if (value === null) return conditions.push(`"${columnName}" IS NULL`);
      values.push(value);
      return conditions.push(`"${columnName}" = $${values.length}`);
    });

    return {
      sql: conditions.length ? ` WHERE ${conditions.join(' AND ')}` : undefined,
      values: conditions.length && values.length ? values : undefined,
    };
  }

  async #select<TRow extends QueryResultRow>(cols: string, whereSql = '', values?: SqlValue[]): Promise<TRow[]> {
    const sql = `SELECT ${cols} FROM ${this.#tableName}${whereSql}`;
    if (!values) return ORM.#query<TRow>(sql);
    return ORM.#query<TRow>(sql, values);
  }

  async #sync(): Promise<void> {
    const table = this.#tableName.split('.');
    if (table.length === 2) await ORM.#query(`CREATE SCHEMA IF NOT EXISTS ${table[0]}`);
    await ORM.#query(this.#toSQL());
    global.log.success({ tag: 'ORM' }, `Synced table "${this.#tableName}"`);
  }
}
