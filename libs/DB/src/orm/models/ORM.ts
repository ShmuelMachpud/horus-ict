import { Pool, PoolConfig, QueryResultRow } from 'pg';
import {
  SafeAction,
  ColumnRecord,
  ColumnRef,
  ColumnRefs,
  ColumnRow,
  ConstraintRow,
  DbTable,
  FindOptions,
  InferRow,
  UnsafeAction,
  Prettify,
  SqlValue,
  CompareResult,
  WhereOptions,
  MigrationMode,
  MigrationOptions,
} from '../types/orm.types';
import { Column } from './Column';
import { CustomError } from '@zayad/helpers';
import {
  checkNewColumn,
  COLUMN_CHECKS,
  normalizeDefault,
  normalizeType,
  parseTableName,
} from '../helpers/migration.functions';
import { COLUMNS_SQL, CONSTRAINTS_SQL } from '../helpers/migration.sql';

export class ORM<TName extends string, TCols extends ColumnRecord> {
  static #pool: Pool | undefined;
  static #schemas: ORM<string, ColumnRecord>[] = [];
  static #migrationMode: MigrationMode = 'safe';
  readonly #columns: TCols;
  readonly #tableName: TName;

  private constructor(tableName: TName, columns: TCols) {
    this.#tableName = tableName;
    this.#columns = columns;
  }

  static async connect(config: PoolConfig, options?: MigrationOptions): Promise<void> {
    ORM.#migrationMode = options?.migrationMode ?? 'safe';
    if (!ORM.#pool) {
      ORM.#pool = new Pool(config);
      ORM.#pool.on('error', (err) => global.log.error({ tag: 'PG POOL' }, `Idle client error: ${err.message}`));
    }

    const client = await ORM.#pool.connect();
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
    return ORM.#query<TRow>(`SELECT ${cols} FROM ${this.#tableName}${whereSql}`, values);
  }

  async #sync(): Promise<void> {
    const { schema } = parseTableName(this.#tableName);
    if (schema !== 'public') await ORM.#query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);

    const dbTable = await this.#readDbTable();

    if (!Object.keys(dbTable).length) {
      await ORM.#query(this.#toSQL());
      global.log.success({ tag: 'ORM' }, `Created table "${this.#tableName}"`);
      return;
    }

    const { safe, unsafe } = this.#compare(dbTable);

    for (const action of safe) {
      await ORM.#query(action.sql);
      global.log.success({ tag: 'ORM' }, `${this.#tableName}: ${action.description}`);
    }

    for (const action of unsafe) {
      const { description, manualSql } = action;
      if (ORM.#migrationMode !== 'force' || !manualSql) {
        const manual = manualSql ? `\n  manual: ${manualSql}` : '';
        global.log.warn({ tag: 'ORM' }, `${this.#tableName}: ${description}${manual}`);
      } else {
        await ORM.#query(manualSql);
        global.log.warn({ tag: 'ORM' }, `${this.#tableName}: ${description}: [FORCED]`);
      }
    }
    if (!safe.length && !unsafe.length) global.log.success({ tag: 'ORM' }, `Table "${this.#tableName}" up to date`);
  }

  async #readDbTable(): Promise<DbTable> {
    const { schema, table } = parseTableName(this.#tableName);
    const columns = await ORM.#query<ColumnRow>(COLUMNS_SQL, [schema, table]);
    const constraints = await ORM.#query<ConstraintRow>(CONSTRAINTS_SQL, [schema, table]);

    const dbTable: DbTable = {};

    for (const col of columns) {
      dbTable[col.column_name] = {
        sqlType: normalizeType(col.data_type, col.character_maximum_length),
        notNull: col.is_nullable === 'NO',
        primaryKey: false,
        unique: false,
        defaultValue: col.column_default ? normalizeDefault(col.column_default) : undefined,
      };
    }

    for (const constraint of constraints) {
      const dbCol = dbTable[constraint.column_name];
      if (!dbCol) continue;
      if (constraint.constraint_type === 'PRIMARY KEY') dbCol.primaryKey = true;
      if (constraint.constraint_type === 'UNIQUE') dbCol.unique = true;
      if (constraint.constraint_type === 'FOREIGN KEY' && constraint.foreign_table && constraint.foreign_column)
        dbCol.reference = {
          table: `${constraint.foreign_schema}.${constraint.foreign_table}`,
          column: constraint.foreign_column,
        };
    }

    return dbTable;
  }

  #compare(dbTable: DbTable): CompareResult {
    const safe: SafeAction[] = [];
    const unsafe: UnsafeAction[] = [];
    const tableName = this.#tableName;
    const { table } = parseTableName(this.#tableName);

    for (const [columnName, column] of Object.entries(this.#columns)) {
      const dbColumn = dbTable[columnName];

      //  עמודה חדשה בקוד
      if (!dbColumn) {
        const newColumnCompare = checkNewColumn(column, tableName, columnName);
        safe.push(...newColumnCompare.safe);
        unsafe.push(...newColumnCompare.unsafe);
        continue;
      }

      COLUMN_CHECKS.forEach((check) => {
        const result = check({ tableName, table, columnName, column: column.config, dbColumn });
        safe.push(...result.safe);
        unsafe.push(...result.unsafe);
      });
    }

    //  עמודות שקיימות ב-DB אבל לא בקוד
    for (const name of Object.keys(dbTable))
      if (!(name in this.#columns))
        unsafe.push({
          description: `column "${name}" exists in DB but not in schema (data loss if dropped)`,
          manualSql: `ALTER TABLE ${tableName} DROP COLUMN "${name}";`,
        });

    return { safe, unsafe };
  }
}
